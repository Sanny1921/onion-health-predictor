import { ScreenState } from '../App';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { CheckCircle2, AlertTriangle, HelpCircle, Info, ShieldCheck, ListChecks } from 'lucide-react';
import { PredictionResult } from '../services/api';

interface Props {
  onNavigate: (screen: ScreenState) => void;
  result: PredictionResult | null;
}

export function ResultsScreen({ onNavigate, result }: Props) {
  // Default fallback if viewed without active inspection
  const activeResult: PredictionResult = result || {
    success: true,
    prediction: 'healthy',
    confidence: 96.5,
    condition: 'Healthy onion batch',
    observations: ['Firm outer skin', 'No rot or discoloration visible'],
    recommendation: 'Suitable for immediate procurement and consumption',
  };

  const { prediction, confidence, condition, observations, recommendation } = activeResult;

  // Grade & Status Color mapping based on backend prediction enum
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
          grade: '?',
          statusText: 'Unable to Assess',
          gradient: 'from-amber-500 to-orange-600',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: HelpCircle,
        };
    }
  };

  const theme = getGradeTheme();
  const IconComponent = theme.icon;

  return (
    <div className="w-full h-full flex flex-col bg-bg-light">
      <Header title="Quality Results" showBack onBack={() => onNavigate('dashboard')} />
      
      <div className="flex-1 overflow-y-auto px-6 py-4 pb-36 space-y-6">
        {/* Overall Grade / Status Card */}
        <div className={`bg-gradient-to-br ${theme.gradient} rounded-3xl p-7 text-center text-white shadow-xl relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          
          <h3 className="text-xs font-medium text-white/80 tracking-widest uppercase mb-1">Assessment Status</h3>
          <div className="text-6xl font-bold mb-3">{theme.grade}</div>
          
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold">
            <IconComponent size={18} />
            <span>{theme.statusText}</span>
          </div>
        </div>

        {/* Condition & Confidence Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-border-main/50 space-y-4">
          <div className="flex items-center justify-between border-b border-border-main/40 pb-3">
            <div>
              <span className="text-xs text-text-secondary font-medium uppercase tracking-wider block mb-0.5">Condition</span>
              <h4 className="text-base font-bold text-text-main">{condition}</h4>
            </div>
            <div className="text-right">
              <span className="text-xs text-text-secondary font-medium uppercase tracking-wider block mb-0.5">Confidence</span>
              <div className="inline-flex items-center gap-1 font-bold text-primary-deep text-base">
                <ShieldCheck size={18} />
                <span>{confidence}%</span>
              </div>
            </div>
          </div>

          {/* Observations List */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm font-bold text-text-main">
              <ListChecks size={16} className="text-primary-deep" />
              <span>AI Visual Observations</span>
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
              <p className="text-xs text-text-secondary italic">No specific observations provided.</p>
            )}
          </div>
        </div>

        {/* Recommendation Info Box */}
        <div className="flex gap-3 bg-primary-soft/30 p-4 rounded-2xl border border-primary-soft/50">
          <Info size={20} className="text-primary-deep shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-text-main block mb-1">Recommendation</span>
            <p className="text-xs text-text-main font-medium leading-relaxed">
              {recommendation}
            </p>
          </div>
        </div>
      </div>
      
      {/* Bottom Actions */}
      <div className="absolute bottom-0 w-full p-6 bg-white border-t border-border-main shadow-[0_-10px_20px_rgba(0,0,0,0.02)] space-y-3">
        <Button onClick={() => onNavigate('detailed_analysis')} fullWidth variant="secondary">
          View Detailed Analysis
        </Button>
        <Button onClick={() => onNavigate('dashboard')} fullWidth>
          Done & Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
