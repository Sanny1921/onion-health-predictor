import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface Props {
  onNavigate: () => void;
}

export function SplashScreen({ onNavigate }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate();
    }, 1600);
    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-end p-8 text-white">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?auto=format&fit=crop&q=80&w=1000")' }}
      >
        <div className="absolute inset-0 bg-primary-dark/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/60 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center text-center space-y-8 mb-12">
        <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 animate-pulse">
          {/* Onion line art placeholder using SVG */}
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-soft">
            <path d="M12 2C8 2 4 6 4 11c0 5 8 11 8 11s8-6 8-11c0-5-4-9-8-9z" />
            <path d="M12 2c0 0-2 4-2 9 0 5 2 11 2 11" />
            <path d="M12 2c0 0 2 4 2 9 0 5-2 11-2 11" />
            <path d="M12 2v-4" />
            <path d="M10 0s1 1 2 2" />
          </svg>
        </div>
        
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            ONION<br/>
            QUALITY<br/>
            <span className="text-primary-soft">ASSESSMENT</span>
          </h1>
          <p className="text-primary-soft/80 font-medium tracking-wide text-sm">
            AI-Powered • Accurate • Transparent
          </p>
        </div>
        
        <div className="mt-8 flex items-center gap-2 text-primary-soft text-sm font-medium">
          <Loader2 size={18} className="animate-spin" />
          <span>Starting application...</span>
        </div>
      </div>
    </div>
  );
}
