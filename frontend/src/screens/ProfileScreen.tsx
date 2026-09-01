import { ScreenState } from '../App';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Button } from '../components/Button';
import { Bell, Globe, Moon, RefreshCw, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

interface Props {
  onNavigate: (screen: ScreenState) => void;
  activeTab: 'home' | 'camera' | 'reports' | 'profile';
  onTabChange: (tab: 'home' | 'camera' | 'reports' | 'profile') => void;
}

export function ProfileScreen({ onNavigate, activeTab, onTabChange }: Props) {
  const settingsItems = [
    { icon: Bell, label: 'Notifications', color: 'text-primary-bright', bg: 'bg-primary-soft' },
    { icon: Globe, label: 'Language', color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: Moon, label: 'Dark Mode', color: 'text-slate-700', bg: 'bg-slate-200' },
    { icon: RefreshCw, label: 'Data Sync', color: 'text-green-600', bg: 'bg-green-100' },
    { icon: Shield, label: 'Privacy', color: 'text-purple-600', bg: 'bg-purple-100' },
    { icon: HelpCircle, label: 'Help & Support', color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-bg-light">
      <Header title="Profile" showMenu />
      
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 pb-[100px]">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-border-main/50 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary-soft border-4 border-white shadow-md flex items-center justify-center mb-4 text-primary-deep text-3xl font-bold">
            VK
          </div>
          <h2 className="text-xl font-bold text-text-main mb-1">Vikram Kumar</h2>
          <div className="px-3 py-1 bg-bg-light rounded-full text-xs font-semibold text-text-secondary border border-border-main mb-3">
            Officer ID: OK-8832-X
          </div>
          <p className="text-sm font-medium text-text-secondary">Nashik APMC Procurement Center</p>
        </div>
        
        {/* Settings List */}
        <div>
          <h3 className="text-sm font-bold text-text-main mb-3 ml-2 uppercase tracking-wide">Settings</h3>
          <div className="bg-white rounded-3xl overflow-hidden border border-border-main/50 shadow-sm">
            {settingsItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-4 active:bg-gray-50 transition-colors ${
                    idx !== settingsItems.length - 1 ? 'border-b border-border-main/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
                      <Icon size={20} />
                    </div>
                    <span className="font-semibold text-text-main text-sm">{item.label}</span>
                  </div>
                  <ChevronRight size={20} className="text-border-main" />
                </div>
              );
            })}
          </div>
        </div>
        
        <Button 
          variant="outline" 
          fullWidth 
          onClick={() => onNavigate('dashboard')}
          className="text-primary-deep border-primary-bright/40 hover:bg-primary-soft/10"
        >
          Return to Dashboard
        </Button>
        
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-light via-bg-light/90 to-transparent pointer-events-none z-40"></div>
      
      <BottomNav activeTab={activeTab} onChange={onTabChange} />
    </div>
  );
}
