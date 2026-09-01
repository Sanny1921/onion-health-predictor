import { ScreenState } from '../App';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Camera, ArrowRight, Activity, Percent } from 'lucide-react';
import { Button } from '../components/Button';

interface Props {
  onNavigate: (screen: ScreenState) => void;
  activeTab: 'home' | 'camera' | 'reports' | 'profile';
  onTabChange: (tab: 'home' | 'camera' | 'reports' | 'profile') => void;
}

export function DashboardScreen({ onNavigate, activeTab, onTabChange }: Props) {
  const recentInspections = [
    { id: 'ON-2026-00024', vendor: 'Ramesh Yadav', gradeA: 78, urs: 7, time: '10:30 AM', status: 'PASS', statusColor: 'bg-green-100 text-green-700' },
    { id: 'ON-2026-00023', vendor: 'Suresh Kumar', gradeA: 82, urs: 4, time: '09:15 AM', status: 'PASS', statusColor: 'bg-green-100 text-green-700' },
    { id: 'ON-2026-00022', vendor: 'Amit Singh', gradeA: 45, urs: 22, time: '08:45 AM', status: 'REVIEW', statusColor: 'bg-orange-100 text-orange-700' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-bg-light">
      <Header title="Dashboard" showMenu showNotifications />
      
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 pb-[100px]">
        <div>
          <h2 className="text-2xl font-bold text-text-main mb-1">Good Morning, Officer</h2>
          <p className="text-text-secondary">Ready for today's inspections?</p>
        </div>
        
        {/* Primary Action */}
        <button 
          onClick={() => onNavigate('new_inspection')}
          className="w-full bg-primary-deep text-white rounded-[24px] p-6 flex flex-col items-center justify-center gap-3 shadow-[0_8px_24px_-6px_rgba(142,30,99,0.5)] active:scale-[0.98] transition-transform relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-1">
            <Camera size={32} className="text-white" />
          </div>
          <span className="text-lg font-bold">New Inspection</span>
        </button>
        
        {/* Overview Stats */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-border-main/50 flex justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-text-secondary mb-1">
              <Activity size={14} />
              <span className="text-xs font-medium">Total Inspections</span>
            </div>
            <span className="text-2xl font-bold text-text-main">24</span>
          </div>
          <div className="w-px bg-border-main/50"></div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-text-secondary mb-1">
              <Percent size={14} />
              <span className="text-xs font-medium">Avg. Grade A</span>
            </div>
            <span className="text-2xl font-bold text-text-main">78.4%</span>
          </div>
          <div className="w-px bg-border-main/50"></div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-text-secondary mb-1">
              <Percent size={14} />
              <span className="text-xs font-medium">Avg. URS</span>
            </div>
            <span className="text-2xl font-bold text-text-main">7.2%</span>
          </div>
        </div>
        
        {/* Recent Inspections */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-main">Recent Inspections</h3>
            <button 
              onClick={() => onNavigate('history')}
              className="text-sm font-medium text-primary-deep flex items-center gap-1"
            >
              See All <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="space-y-3">
            {recentInspections.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => onNavigate('results')}
                className="bg-white p-4 rounded-2xl border border-border-main/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-text-main text-sm">{item.id}</h4>
                    <span className="text-xs text-text-secondary">{item.vendor} • {item.time}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-[10px] font-bold ${item.statusColor}`}>
                    {item.status}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1 bg-bg-light rounded-lg p-2">
                    <div className="text-[10px] text-text-secondary mb-0.5 font-medium">Grade A</div>
                    <div className="font-bold text-primary-deep text-sm">{item.gradeA}%</div>
                  </div>
                  <div className="flex-1 bg-bg-light rounded-lg p-2">
                    <div className="text-[10px] text-text-secondary mb-0.5 font-medium">URS</div>
                    <div className="font-bold text-primary-deep text-sm">{item.urs}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom gradient mask for smooth fade behind floating nav */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-light via-bg-light/90 to-transparent pointer-events-none z-40"></div>
      
      <BottomNav activeTab={activeTab} onChange={onTabChange} />
    </div>
  );
}
