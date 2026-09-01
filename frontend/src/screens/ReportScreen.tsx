import { ScreenState } from '../App';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Download, Share2, QrCode } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';

interface Props {
  onNavigate: (screen: ScreenState) => void;
  activeTab?: 'home' | 'camera' | 'reports' | 'profile';
  onTabChange?: (tab: 'home' | 'camera' | 'reports' | 'profile') => void;
}

export function ReportScreen({ onNavigate, activeTab, onTabChange }: Props) {
  return (
    <div className="w-full h-full flex flex-col bg-bg-light">
      <Header title="Quality Report" showBack onBack={() => onNavigate('dashboard')} />
      
      <div className="flex-1 overflow-y-auto px-6 py-4 pb-[160px]">
        
        {/* Official Report Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-md border border-border-main relative overflow-hidden">
          {/* Watermark / seal placeholder */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-[8px] border-primary-soft/20 rounded-full opacity-20 pointer-events-none flex items-center justify-center">
            <div className="w-40 h-40 border-4 border-primary-soft/20 rounded-full"></div>
          </div>
          
          <div className="text-center border-b border-border-main pb-4 mb-4 relative z-10">
            <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Government of India</h3>
            <p className="text-[10px] text-text-secondary mb-3">Ministry of Consumer Affairs,<br/>Food & Public Distribution</p>
            <h2 className="text-sm font-bold text-primary-deep uppercase tracking-wider">Onion Quality Assessment Report</h2>
          </div>
          
          <div className="space-y-3 border-b border-border-main pb-4 mb-4 text-xs relative z-10">
            <div className="flex justify-between">
              <span className="text-text-secondary">Batch ID</span>
              <span className="font-semibold text-text-main">ON-2026-00024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Date & Time</span>
              <span className="font-semibold text-text-main">31 Aug 2026, 10:30 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Procurement Center</span>
              <span className="font-semibold text-text-main">Nashik APMC, MH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Farmer / Vendor ID</span>
              <span className="font-semibold text-text-main">Ramesh Yadav (V-409)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Sample Quantity</span>
              <span className="font-semibold text-text-main">2.5 kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Onion Variety</span>
              <span className="font-semibold text-text-main">Red Onion</span>
            </div>
          </div>
          
          <div className="border-b border-border-main pb-4 mb-4 relative z-10">
            <h4 className="text-xs font-bold text-text-main mb-3 uppercase tracking-wide">Quality Summary</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between bg-bg-light p-2 rounded border border-border-main/50">
                <span className="text-text-secondary">Grade A</span>
                <span className="font-bold text-green-600">78%</span>
              </div>
              <div className="flex justify-between bg-bg-light p-2 rounded border border-border-main/50">
                <span className="text-text-secondary">URS</span>
                <span className="font-bold text-yellow-600">7%</span>
              </div>
              <div className="flex justify-between bg-bg-light p-2 rounded border border-border-main/50">
                <span className="text-text-secondary">Sprouted</span>
                <span className="font-bold text-purple-600">5%</span>
              </div>
              <div className="flex justify-between bg-bg-light p-2 rounded border border-border-main/50">
                <span className="text-text-secondary">Damaged</span>
                <span className="font-bold text-orange-600">6%</span>
              </div>
              <div className="flex justify-between bg-bg-light p-2 rounded border border-border-main/50">
                <span className="text-text-secondary">Rotten</span>
                <span className="font-bold text-red-600">4%</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <span className="text-xs text-text-secondary block mb-1 uppercase tracking-wider font-semibold">Final Assessment</span>
              <div className="inline-block px-3 py-1 bg-green-100 text-green-700 font-bold rounded-lg border border-green-200">
                PASS
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-text-secondary block mb-1 uppercase">AI Detection Confidence</span>
              <span className="text-sm font-bold text-primary-deep block">96%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between border-t border-border-main pt-4 relative z-10">
            <div className="text-[10px] text-text-secondary">
              Report ID: <br/><span className="font-mono text-text-main font-semibold">REP-9982-A</span>
            </div>
            <div className="w-12 h-12 bg-white border border-border-main rounded flex items-center justify-center shadow-sm">
              <QrCode size={32} className="text-text-main" />
            </div>
          </div>
        </div>
        
        <div className="space-y-3 mt-6">
          <Button fullWidth>
            <Download size={18} /> Download PDF
          </Button>
          <Button variant="outline" fullWidth>
            <Share2 size={18} /> Share Report
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-light via-bg-light/90 to-transparent pointer-events-none z-40"></div>
      
      {activeTab && onTabChange && (
        <BottomNav activeTab={activeTab} onChange={onTabChange} />
      )}
    </div>
  );
}
