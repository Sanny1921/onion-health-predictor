import { ScreenState } from '../App';
import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { predictImage, PredictionResult } from '../services/api';
import { Button } from '../components/Button';

interface Props {
  onNavigate: (screen: ScreenState) => void;
  selectedImage: File | Blob | null;
  onPredictionComplete: (result: PredictionResult, previewUrl: string) => void;
}

export function AnalysisScreen({ onNavigate, selectedImage, onPredictionComplete }: Props) {
  const [progress, setProgress] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?auto=format&fit=crop&q=80&w=1000');

  useEffect(() => {
    let url = previewUrl;
    if (selectedImage) {
      url = URL.createObjectURL(selectedImage);
      setPreviewUrl(url);
    }
    return () => {
      if (selectedImage && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    };
  }, [selectedImage]);

  useEffect(() => {
    let isMounted = true;

    // Smooth visual progress ticker while waiting for backend
    const progressTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 85) return 85; // Pause at 85% until backend returns
        return p + Math.floor(Math.random() * 8) + 3;
      });
    }, 250);

    async function runAnalysis() {
      try {
        setError(null);

        // Fallback sample image blob if no image was selected
        let imageToAnalyze = selectedImage;
        if (!imageToAnalyze) {
          const res = await fetch(previewUrl);
          imageToAnalyze = await res.blob();
        }

        const result = await predictImage(imageToAnalyze);

        if (!isMounted) return;

        clearInterval(progressTimer);
        setProgress(100);

        setTimeout(() => {
          if (isMounted) {
            onPredictionComplete(result, previewUrl);
            onNavigate('results');
          }
        }, 400);

      } catch (err: any) {
        if (!isMounted) return;
        clearInterval(progressTimer);
        setError(err.message || 'Unable to complete AI analysis.');
      }
    }

    runAnalysis();

    return () => {
      isMounted = false;
      clearInterval(progressTimer);
    };
  }, [selectedImage, onNavigate, onPredictionComplete, previewUrl]);

  return (
    <div className="w-full h-full flex flex-col bg-bg-light relative">
      <div className="flex-1 flex flex-col pt-8">
        <h2 className="text-xl font-bold text-center text-text-main mb-6">
          {error ? 'Analysis Failed' : 'Analyzing onions...'}
        </h2>
        
        <div className="px-6 flex-1 flex flex-col items-center">
          {/* Image Container */}
          <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden relative shadow-lg">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-700"
              style={{ backgroundImage: `url("${previewUrl}")` }}
            ></div>
            
            {/* Overlay tint */}
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Scanning line animation */}
            {!error && (
              <div 
                className="absolute left-0 w-full h-[3px] bg-primary-bright shadow-[0_0_20px_rgba(217,44,139,1)] transition-all duration-300"
                style={{ top: `${progress}%` }}
              ></div>
            )}
          </div>
          
          {/* Progress Bar & Status */}
          {!error ? (
            <div className="w-full mt-8 space-y-3">
              <div className="flex justify-between text-sm font-semibold text-text-main">
                <span className="text-text-secondary">Sending to Gemini AI...</span>
                <span className="text-primary-deep">{Math.min(progress, 100)}%</span>
              </div>
              <div className="w-full h-3 bg-border-main rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-deep rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <div className="pt-4 flex items-center justify-center gap-2 text-text-secondary text-sm font-medium">
                <Loader2 size={18} className="animate-spin text-primary-deep" />
                Processing vision inference...
              </div>
            </div>
          ) : (
            /* User-Friendly Error Display */
            <div className="w-full mt-6 bg-red-50 border border-red-200 rounded-2xl p-5 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-red-800 mb-1">Analysis Error</h3>
                <p className="text-xs text-red-600 font-medium leading-relaxed">{error}</p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  fullWidth 
                  onClick={() => onNavigate('camera')}
                  className="border-red-200 text-red-700"
                >
                  <ArrowLeft size={16} /> Back to Camera
                </Button>
                <Button 
                  fullWidth 
                  onClick={() => {
                    setError(null);
                    setProgress(10);
                  }}
                >
                  <RefreshCw size={16} /> Retry
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
