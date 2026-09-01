import { ScreenState } from '../App';
import { Header } from '../components/Header';
import { ShieldCheck, Target, ListChecks, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { PredictionResult } from '../services/api';

interface Props {
  onNavigate: (screen: ScreenState) => void;
  result: PredictionResult | null;
  previewUrl: string | null;
}

export function DetailedAnalysisScreen({ onNavigate, result, previewUrl }: Props) {
  const [activeTab, setActiveTab] = useState('overview');

  const activeResult: PredictionResult = result || {
    success: true,
    prediction: 'healthy',
    confidence: 96.5,
    condition: 'Healthy onion batch',
    observations: ['Firm outer skin', 'No rot or discoloration visible'],
    recommendation: 'Suitable for immediate procurement and consumption',
  };

  const imageBg = previewUrl || 'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?auto=format&fit=crop&q=80&w=1000';

  return (
    <div className="w-full h-full flex flex-col bg-bg-light">
      <Header title="Detailed Analysis" showBack onBack={() => onNavigate('results')} />
      
      {/* Custom Tabs */}
      <div className="px-6 py-2">
        <div className="flex bg-border-main/40 p-1 rounded-xl">
          {['Overview', 'Observations', 'Confidence'].map((tab) => {
            const id = tab.toLowerCase();
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  isActive ? 'bg-white text-primary-deep shadow-sm' : 'text-text-secondary hover:text-text-main'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 pb-28">
        {/* Image Preview Card */}
        <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden relative shadow-md">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${imageBg}")` }}
          ></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-[10px] text-white font-medium">
            AI Scanned Sample
          </div>
        </div>

        {/* Basic Assessment Summary */}
        <div className="flex gap-3">
          <div className="flex-1 bg-white rounded-2xl p-4 border border-border-main/50 text-center">
            <div className="text-sm font-medium text-text-secondary uppercase mb-1">Prediction</div>
            <div className="text-base font-bold capitalize text-primary-deep">{activeResult.prediction}</div>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-4 border border-border-main/50 text-center">
            <div className="text-sm font-medium text-text-secondary uppercase mb-1">Confidence</div>
            <div className="text-base font-bold text-green-600">{activeResult.confidence}%</div>
          </div>
        </div>

        {/* Observations Breakdown */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-border-main/50">
          <h3 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
            <ListChecks size={16} className="text-primary-deep" />
            <span>Key Visual Findings</span>
          </h3>
          
          {activeResult.observations.length > 0 ? (
            <ul className="space-y-2.5">
              {activeResult.observations.map((obs, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 bg-bg-light rounded-xl border border-border-main/40 text-xs font-medium text-text-main">
                  <span className="w-5 h-5 rounded-full bg-primary-soft text-primary-deep font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{obs}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-text-secondary italic">No visual defects noted.</p>
          )}
        </div>

        {/* Confidence Scores */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-border-main/50 space-y-4">
          <h3 className="text-sm font-bold text-text-main mb-2">AI Model Confidence</h3>
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-primary-deep" />
                <span className="font-medium">Vision Analysis</span>
              </div>
              <span className="font-bold text-primary-deep">{activeResult.confidence}%</span>
            </div>
            <div className="w-full h-2 bg-bg-light rounded-full overflow-hidden">
              <div className="h-full bg-primary-deep rounded-full transition-all duration-500" style={{ width: `${activeResult.confidence}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
