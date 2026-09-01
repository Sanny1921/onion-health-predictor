import { ScreenState } from '../App';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { CheckCircle2, AlertTriangle, HelpCircle, Info, ShieldCheck, ListChecks, RotateCcw } from 'lucide-react';
import { PredictionResult } from '../services/api';

interface Props {
  onNavigate: (screen: ScreenState) => void;
  result: PredictionResult | null;
  previewUrl?: string | null;
}

export function ResultsScreen({ onNavigate, result, previewUrl }: Props) {
  // Default fallback if viewed directly
  const activeResult: PredictionResult = result || {
    success: true,
    prediction: 'healthy',
    confidence: 96.5,
    condition: 'Healthy onion batch',
    observations: ['Firm outer skin', 'No rot or discoloration visible'],
    recommendation: 'Suitable for immediate procurement and consumption',
  };

  const { prediction, confidence, condition, observations, recommendation } = activeResult;

  // Grade & Status Theme mapping based on AI prediction response enum
  const getGradeTheme = () => {
    switch (prediction) {
      case 'healthy':
        return {
          grade: 'A',
          statusText: 'Good Quality (Healthy)',
          gradient: 'from-emerald-600 to-green-700',
          badgeBg: 'bg-green-100 text-green-700 border-green-200',
          icon: CheckCircle2,
        };
      case 'unhealthy':
        return {
          grade: 'C',
          statusText: 'Defective / Spoiled',
          gradient: 'from-rose-600 to-red-700',
          badgeBg: 'bg-red-100 text-red-700 border-red-200',
          icon: AlertTriangle,
        };
      case 'unassessable':
      default:
        return {
          grade: 'N/A',
          statusText: 'Unassessable Image',
          gradient: 'from-amber-500 to-orange-600',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: HelpCircle,
        };
    }
  };

  const theme = getGradeTheme();
  const IconComponent = theme.icon;

  return (
    <div className="w-full h-full flex flex-col bg-bg-light relative">
      <Header title="Quality Assessment Results" showBack onBack={() => onNavigate('dashboard')} />
      
      <div className="flex-1 overflow-y-auto px-6 py-4 pb-36 space-y-6">
        {/* Overall Grade / Status Card */}
        <div className={`bg-gradient-to-br ${theme.gradient} rounded-3xl p-6 text-center text-white shadow-xl relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          
          <h3 className="text-xs font-semibold uppercase tracking-widest text-white/80 mb-1">AI Classification</h3>
          <div className="text-5xl font-extrabold mb-3">{theme.grade}</div>
          
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold">
            <IconComponent size={18} />
            <span>{theme.statusText}</span>
          </div>
        </div>

        {/* Captured Image Preview & Condition Breakdown */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-border-main/50 space-y-4">
          {previewUrl && (
            <div className="flex items-center gap-4 bg-bg-light p-3 rounded-2xl border border-border-main/40">
              <img 
                src={previewUrl} 
                alt="Analyzed Onion Sample" 
                className="w-16 h-16 rounded-xl object-cover shadow-sm shrink-0 border border-border-main/40" 
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Inspected Sample</span>
                <p className="text-xs font-semibold text-text-main truncate">{condition}</p>
                <span className="text-[11px] text-primary-deep font-bold mt-1 block">AI Score: {confidence}%</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-border-main/40 pb-3">
            <div>
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block mb-0.5">Condition Summary</span>
              <h4 className="text-sm font-bold text-text-main leading-snug">{condition}</h4>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block mb-0.5">Confidence</span>
              <div className="inline-flex items-center gap-1 font-bold text-primary-deep text-sm">
                <ShieldCheck size={16} />
                <span>{confidence}%</span>
              </div>
            </div>
          </div>

          {/* Observations List */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-text-main uppercase tracking-wider">
              <ListChecks size={16} className="text-primary-deep" />
              <span>AI Visual Findings</span>
            </div>
            {observations.length > 0 ? (
              <ul className="space-y-2">
                {observations.map((obs, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-text-main font-medium bg-bg-light p-2.5 rounded-xl border border-border-main/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-deep mt-1.5 shrink-0"></span>
                    <span className="leading-relaxed">{obs}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-text-secondary italic">No specific observations reported.</p>
            )}
          </div>
        </div>

        {/* Actionable Guidance Box */}
        <div className={`flex gap-3 p-4 rounded-2xl border ${prediction === 'unassessable' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-primary-soft/30 border-primary-soft/50 text-text-main'}`}>
          {prediction === 'unassessable' ? (
            <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <Info size={20} className="text-primary-deep shrink-0 mt-0.5" />
          )}
          <div>
            <span className="text-xs font-bold block mb-1">
              {prediction === 'unassessable' ? 'Assessment Advice' : 'Recommendation'}
            </span>
            <p className="text-xs font-medium leading-relaxed">
              {recommendation}
            </p>
          </div>
        </div>
      </div>
      
      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 w-full p-5 bg-white border-t border-border-main shadow-[0_-10px_20px_rgba(0,0,0,0.02)] space-y-2.5">
        {prediction === 'unassessable' ? (
          <Button onClick={() => onNavigate('camera')} fullWidth className="gap-2">
            <RotateCcw size={18} />
            <span>Retake Photo</span>
          </Button>
        ) : (
          <Button onClick={() => onNavigate('detailed_analysis')} fullWidth variant="secondary">
            View Full Analysis Report
          </Button>
        )}
        <Button onClick={() => onNavigate('dashboard')} fullWidth variant={prediction === 'unassessable' ? 'secondary' : 'primary'}>
          Done & Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
