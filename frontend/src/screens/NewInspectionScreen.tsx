import { ScreenState } from '../App';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Camera, Package, User, Hash, Scale } from 'lucide-react';

interface Props {
  onNavigate: (screen: ScreenState) => void;
}

export function NewInspectionScreen({ onNavigate }: Props) {
  return (
    <div className="w-full h-full flex flex-col bg-bg-light">
      <Header title="New Inspection" showBack onBack={() => onNavigate('dashboard')} />
      
      <div className="flex-1 overflow-y-auto px-6 py-4 pb-32">
        <div className="space-y-4 mb-8">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary ml-1">Batch ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-secondary">
                <Hash size={18} />
              </div>
              <input 
                type="text" 
                defaultValue="ON-2026-00025"
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-border-main rounded-2xl outline-none focus:border-primary-deep text-text-main font-medium"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary ml-1">Farmer / Vendor ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-secondary">
                <User size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Enter ID or Name"
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-border-main rounded-2xl outline-none focus:border-primary-deep text-text-main"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="space-y-1.5 flex-1">
              <label className="text-sm font-medium text-text-secondary ml-1">Onion Variety</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-secondary">
                  <Package size={18} />
                </div>
                <select className="w-full pl-11 pr-4 py-3.5 bg-white border border-border-main rounded-2xl outline-none focus:border-primary-deep text-text-main appearance-none">
                  <option>Red Onion</option>
                  <option>White Onion</option>
                  <option>Yellow Onion</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-1.5 flex-1">
              <label className="text-sm font-medium text-text-secondary ml-1">Quantity (kg)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-secondary">
                  <Scale size={18} />
                </div>
                <input 
                  type="number" 
                  placeholder="0.00"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-border-main rounded-2xl outline-none focus:border-primary-deep text-text-main"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-text-main mb-2">Capture Onion Sample</h3>
          <p className="text-sm text-text-secondary mb-4">Place onions on a clean surface and ensure good lighting.</p>
          
          <div 
            onClick={() => onNavigate('camera')}
            className="w-full aspect-[4/3] rounded-3xl border-2 border-dashed border-primary-bright/40 bg-primary-soft/10 flex flex-col items-center justify-center gap-3 active:bg-primary-soft/20 transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-primary-soft/50 flex items-center justify-center text-primary-deep">
              <Camera size={28} />
            </div>
            <span className="font-semibold text-primary-deep">Tap to open camera</span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 w-full p-6 bg-white border-t border-border-main shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <Button onClick={() => onNavigate('camera')} fullWidth>
          Continue
        </Button>
      </div>
    </div>
  );
}
