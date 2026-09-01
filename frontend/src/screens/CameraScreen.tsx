import { ScreenState } from '../App';
import { Camera, X, Zap, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState, ChangeEvent } from 'react';

interface Props {
  onNavigate: (screen: ScreenState) => void;
  onImageSelected: (image: File | Blob) => void;
}

export function CameraScreen({ onNavigate, onImageSelected }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [streamActive, setStreamActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [flashOn, setFlashOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Initialize browser camera stream if available
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function startCamera() {
      setCameraError(null);
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { 
              facingMode: facingMode, 
              width: { ideal: 1280 }, 
              height: { ideal: 720 } 
            }
          });
          currentStream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            await videoRef.current.play().catch(() => {});
            setStreamActive(true);
          }
        } else {
          setCameraError('Camera access not supported by browser');
          setStreamActive(false);
        }
      } catch (err: any) {
        console.log('Live camera stream not available, falling back to file picker:', err);
        setCameraError(err?.message || 'Camera permission denied or camera unavailable');
        setStreamActive(false);
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  // Handle Shutter click
  const handleCapture = () => {
    if (streamActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            onImageSelected(blob);
            onNavigate('analysis');
          }
        }, 'image/jpeg', 0.92);
        return;
      }
    }

    // Fallback: trigger file input if live camera is inactive
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file select from gallery/file picker
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected(file);
      onNavigate('analysis');
    }
  };

  const toggleCameraFacing = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  return (
    <div className="w-full h-full flex flex-col bg-black relative">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/jpeg,image/png,image/webp" 
        className="hidden" 
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Live Camera Viewfinder (Always in DOM to preserve ref binding) */}
      <video 
        ref={videoRef} 
        autoPlay
        playsInline 
        muted 
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${streamActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
      />

      {/* Fallback Viewfinder when camera stream is unavailable */}
      {!streamActive && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?auto=format&fit=crop&q=80&w=1000")' }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-black/60 backdrop-blur-sm">
            <Camera size={48} className="mb-4 text-primary-soft animate-pulse" />
            <p className="font-semibold text-base mb-2">Live Camera Preview</p>
            <p className="text-xs text-white/70 max-w-xs mb-6">
              {cameraError || 'Allow camera permissions in your browser or tap below to upload an onion photo from your device.'}
            </p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-primary-deep text-white font-semibold rounded-2xl shadow-lg active:scale-95 transition-all text-sm flex items-center gap-2"
            >
              <ImageIcon size={18} />
              <span>Choose Photo from Gallery</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Controls */}
      <div className="relative z-10 flex justify-between items-center p-6 pt-12 text-white">
        <button 
          onClick={() => onNavigate('dashboard')} 
          className="p-3 bg-black/40 backdrop-blur-md rounded-full active:scale-95 transition-transform"
          title="Cancel Inspection"
        >
          <X size={24} />
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleCameraFacing} 
            className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white active:scale-95 transition-transform"
            title="Switch Front/Back Camera"
          >
            <RefreshCw size={22} />
          </button>
          <button 
            onClick={() => setFlashOn(!flashOn)} 
            className={`p-3 backdrop-blur-md rounded-full active:scale-95 transition-transform ${flashOn ? 'bg-yellow-500 text-black' : 'bg-black/40 text-white'}`}
            title="Toggle Flash"
          >
            <Zap size={22} />
          </button>
        </div>
      </div>
      
      {/* Focus Frame */}
      <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none p-12">
        <div className="w-full aspect-square border-2 border-white/50 rounded-3xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.3)]">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-3xl"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-3xl"></div>
        </div>
      </div>
      
      {/* Bottom Controls */}
      <div className="relative z-10 p-8 pb-12 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center gap-6">
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-medium border border-white/10">
          {streamActive ? 'Position onion inside frame & tap shutter' : 'Tap shutter or icon to pick photo'}
        </div>
        
        <div className="flex items-center justify-center gap-10 w-full">
          {/* Gallery Pick Button */}
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-95 transition-transform border border-white/20"
            title="Upload from Device Storage"
          >
            <ImageIcon size={24} />
          </button>
          
          {/* Main Shutter Button */}
          <button 
            onClick={handleCapture}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-95 transition-transform shadow-xl"
            title="Capture Photo"
          >
            <div className="w-full h-full bg-white rounded-full"></div>
          </button>
          
          {/* Camera Flip Button */}
          <button 
            onClick={toggleCameraFacing} 
            className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-95 transition-transform border border-white/20"
            title="Flip Camera"
          >
            <RefreshCw size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
