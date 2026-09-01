/**
 * Backend API Service Layer
 * Coordinates HTTP & WebSocket communications with Node.js Gemini backend.
 */

export type PredictionType = 'healthy' | 'unhealthy' | 'unassessable';

export interface PredictionResult {
  success: boolean;
  prediction: PredictionType;
  confidence: number;
  condition: string;
  observations: string[];
  recommendation: string;
}

export interface HealthResponse {
  status: string;
  aiProvider: string;
}

/**
 * Resolves the backend base HTTP URL from environment or fallback default.
 */
export function getBackendUrl(): string {
  const envUrl = (import.meta as any).env?.VITE_BACKEND_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return 'http://localhost:8000';
}

/**
 * Resolves the backend WebSocket URL derived from the backend HTTP URL.
 */
export function getWebSocketUrl(): string {
  const httpUrl = getBackendUrl();
  return httpUrl.replace(/^http:/i, 'ws:').replace(/^https:/i, 'wss:') + '/ws/predict';
}

/**
 * Checks backend API health status via GET /health
 */
export async function checkBackendHealth(): Promise<HealthResponse> {
  const baseUrl = getBackendUrl();
  try {
    const res = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Health check failed with HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    throw new Error(err.message || 'Unable to connect to the analysis server.');
  }
}

/**
 * Sends binary image payload to POST /api/predict
 * @param imageFile - Image File or Blob to analyze
 */
export async function predictImage(imageFile: File | Blob): Promise<PredictionResult> {
  const baseUrl = getBackendUrl();
  const formData = new FormData();
  
  // Ensure field name is 'file' matching backend contract
  const filename = imageFile instanceof File ? imageFile.name : 'onion_capture.jpg';
  formData.append('file', imageFile, filename);

  try {
    const res = await fetch(`${baseUrl}/api/predict`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      if (res.status === 504) {
        throw new Error('Analysis timed out. Please try again.');
      }
      if (res.status === 502) {
        throw new Error(data?.detail || 'Unable to analyze this image. AI service error.');
      }
      if (res.status === 400) {
        throw new Error(data?.detail || 'Invalid image payload or unsupported image format.');
      }
      throw new Error(data?.detail || `Backend error (HTTP ${res.status}).`);
    }

    if (!data || data.success === false) {
      throw new Error(data?.detail || 'AI analysis did not return a valid result.');
    }

    return {
      success: true,
      prediction: (data.prediction || 'unassessable').toLowerCase() as PredictionType,
      confidence: typeof data.confidence === 'number' ? data.confidence : 0,
      condition: data.condition || 'Assessment completed',
      observations: Array.isArray(data.observations) ? data.observations : [],
      recommendation: data.recommendation || 'No recommendation available',
    };
  } catch (err: any) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to the analysis server. Check your network or backend URL.');
    }
    throw err;
  }
}
