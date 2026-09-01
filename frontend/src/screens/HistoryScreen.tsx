import { ScreenState } from '../App';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface Props {
  onNavigate: (screen: ScreenState) => void;
  activeTab: 'home' | 'camera' | 'reports' | 'profile';
  onTabChange: (tab: 'home' | 'camera' | 'reports' | 'profile') => void;
}

export function HistoryScreen({ onNavigate, activeTab, onTabChange }: Props) {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const filters = ['All', 'Passed', 'Review', 'Rejected'];

  const allInspections = [
    { id: 'ON-2026-00024', date: '31 Aug 2026', grade: 'A', gradeA: 78, urs: 7, status: 'PASS', color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'ON-2026-00023', date: '31 Aug 2026', grade: 'A', gradeA: 82, urs: 4, status: 'PASS', color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'ON-2026-00022', date: '30 Aug 2026', grade: 'C', gradeA: 45, urs: 22, status: 'REVIEW', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { id: 'ON-2026-00021', date: '30 Aug 2026', grade: 'F', gradeA: 15, urs: 45, status: 'REJECTED', color: 'bg-red-100 text-red-700 border-red-200' },
    { id: 'ON-2026-00020', date: '29 Aug 2026', grade: 'B', gradeA: 65, urs: 12, status: 'PASS', color: 'bg-green-100 text-green-700 border-green-200' },
  ];

  const filteredInspections = allInspections.filter((item) => {
    const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === 'Passed') return item.status === 'PASS';
    if (filter === 'Review') return item.status === 'REVIEW';
    if (filter === 'Rejected') return item.status === 'REJECTED';
    return true;
  });

  return (
    <div className="w-full h-full flex flex-col bg-bg-light">
      <Header title="Inspection History" showMenu />
      
      <div className="px-6 py-2 pb-4 space-y-4 shadow-sm bg-white border-b border-border-main/50 z-10 shrink-0">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-secondary">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search batch ID..."
            className="w-full pl-11 pr-4 py-3 bg-bg-light border border-border-main rounded-xl outline-none focus:border-primary-deep text-sm"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === f 
                  ? 'bg-primary-deep text-white shadow-md' 
                  : 'bg-white border border-border-main text-text-secondary hover:text-text-main'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 pb-[100px]">
        {filteredInspections.length > 0 ? (
          filteredInspections.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => onNavigate('results')}
              className="bg-white p-4 rounded-2xl border border-border-main/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:scale-[0.99] transition-transform cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-text-main text-sm">{item.id}</h4>
                  <span className="text-xs text-text-secondary font-medium">{item.date}</span>
                </div>
                <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${item.color}`}>
                  {item.status}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-bg-light flex items-center justify-center font-bold text-xl text-primary-deep border border-border-main/50 shrink-0">
                  {item.grade}
                </div>
                <div className="flex-1 flex gap-2">
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-[10px] text-text-secondary font-medium uppercase tracking-wider mb-0.5">Grade A</div>
                    <div className="font-bold text-text-main text-sm">{item.gradeA}%</div>
                  </div>
                  <div className="w-px bg-border-main/50 my-1"></div>
                  <div className="flex-1 flex flex-col justify-center pl-2">
                    <div className="text-[10px] text-text-secondary font-medium uppercase tracking-wider mb-0.5">URS</div>
                    <div className="font-bold text-text-main text-sm">{item.urs}%</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-text-secondary">
            <p className="text-sm font-medium">No inspections match your search filter.</p>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-light via-bg-light/90 to-transparent pointer-events-none z-40"></div>
      
      <BottomNav activeTab={activeTab} onChange={onTabChange} />
    </div>
  );
}
