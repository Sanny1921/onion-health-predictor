import { ScreenState } from '../App';
import { Camera, X, Zap, Image as ImageIcon } from 'lucide-react';
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
  const [flashOn, setFlashOn] = useState(false);

  // Initialize browser camera stream if available
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setStreamActive(true);
          }
        }
      } catch (err) {
        console.log('Live camera stream not available, falling back to file picker:', err);
        setStreamActive(false);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle Shutter click
  const handleCapture = () => {
    if (streamActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            onImageSelected(blob);
            onNavigate('analysis');
          }
        }, 'image/jpeg', 0.9);
        return;
      }
    }

    // Fallback: trigger file input
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

      {/* Camera Viewfinder (Live Stream or Fallback Image) */}
      {streamActive ? (
        <video 
          ref={videoRef} 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover" 
        />
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?auto=format&fit=crop&q=80&w=1000")' }}
        ></div>
      )}

      {/* Top Controls */}
      <div className="relative z-10 flex justify-between items-center p-6 pt-12 text-white">
        <button onClick={() => onNavigate('dashboard')} className="p-3 bg-black/40 backdrop-blur-md rounded-full active:scale-95 transition-transform">
          <X size={24} />
        </button>
        <button 
          onClick={() => setFlashOn(!flashOn)} 
          className={`p-3 backdrop-blur-md rounded-full active:scale-95 transition-transform ${flashOn ? 'bg-yellow-500 text-black' : 'bg-black/40 text-white'}`}
        >
          <Zap size={24} />
        </button>
      </div>
      
      {/* Focus Frame */}
      <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none p-12">
        <div className="w-full aspect-square border-2 border-white/50 rounded-3xl relative">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-3xl"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-3xl"></div>
        </div>
      </div>
      
      {/* Bottom Controls */}
      <div className="relative z-10 p-8 pb-12 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center gap-6">
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium">
          {streamActive ? 'Position onions inside the frame' : 'Tap shutter to take photo or choose image'}
        </div>
        
        <div className="flex items-center justify-center gap-12 w-full">
          {/* Gallery Pick Button */}
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"
            title="Upload from Gallery"
          >
            <ImageIcon size={20} />
          </button>
          
          {/* Shutter Button */}
          <button 
            onClick={handleCapture}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-95 transition-transform"
            title="Capture Photo"
          >
            <div className="w-full h-full bg-white rounded-full"></div>
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <Camera size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
