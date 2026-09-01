import { Home, Camera, BarChart2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BottomNavProps {
  activeTab: 'home' | 'camera' | 'reports' | 'profile';
  onChange: (tab: 'home' | 'camera' | 'reports' | 'profile') => void;
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'camera', icon: Camera, label: 'Camera' },
    { id: 'reports', icon: BarChart2, label: 'Reports' },
    { id: 'profile', icon: User, label: 'Profile' }
  ] as const;

  const navWidth = 342;
  const navHeight = 60;
  const sectionWidth = navWidth / 4;
  const activeIndex = tabs.findIndex(t => t.id === activeTab);
  const cx = (activeIndex === -1 ? 0 : activeIndex) * sectionWidth + (sectionWidth / 2);

  // Generates a compact, moderately rounded rectangle (16px radius) with a shallow, smooth U-shaped notch
  const getPath = (x: number) => {
    return `M 16 0 
            L ${x - 40} 0 
            C ${x - 24} 0, ${x - 24} 28, ${x} 28 
            C ${x + 24} 28, ${x + 24} 0, ${x + 40} 0 
            L ${navWidth - 16} 0 
            A 16 16 0 0 1 ${navWidth} 16 
            L ${navWidth} ${navHeight - 16} 
            A 16 16 0 0 1 ${navWidth - 16} ${navHeight} 
            L 16 ${navHeight} 
            A 16 16 0 0 1 0 ${navHeight - 16} 
            L 0 16 
            A 16 16 0 0 1 16 0 Z`.replace(/\s+/g, ' ');
  };

  return (
    <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <div style={{ width: navWidth, height: navHeight }} className="relative pointer-events-auto">
        
        {/* Animated SVG Background */}
        <svg width={navWidth} height={navHeight} viewBox={`0 0 ${navWidth} ${navHeight}`} className="absolute inset-0 drop-shadow-[0_8px_16px_rgba(30,13,24,0.3)]">
          <motion.path
            d={getPath(cx)}
            fill="#5A1242"
            animate={{ d: getPath(cx) }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
          />
        </svg>

        {/* Floating Active Element (Circle + Label) */}
        <motion.div
          className="absolute top-0 left-0 h-full pointer-events-none z-20 flex flex-col items-center"
          initial={false}
          animate={{ x: cx - (sectionWidth / 2) }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          style={{ width: sectionWidth }}
        >
          {/* Active Circle - 44px diameter, protruding exactly half (22px) */}
          <div className="absolute top-[-22px] w-[44px] h-[44px] rounded-full bg-[#F9D8EE] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
             <AnimatePresence>
               <motion.div 
                 key={activeTab}
                 initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
                 animate={{ opacity: 1, scale: 1, rotate: 0 }}
                 exit={{ opacity: 0, scale: 0.5, rotate: 30 }}
                 transition={{ duration: 0.2 }}
                 className="absolute inset-0 flex items-center justify-center"
               >
                 {(() => {
                   const ActiveIcon = tabs.find(t => t.id === activeTab)?.icon;
                   return ActiveIcon ? <ActiveIcon size={20} color="#5A1242" strokeWidth={2.5} /> : null;
                 })()}
               </motion.div>
             </AnimatePresence>
          </div>
          
        </motion.div>

        {/* Interactive Buttons & Inactive State */}
        <div className="absolute inset-0 flex items-center z-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id as any)}
                className="relative flex-1 h-full flex flex-col items-center justify-center outline-none group pt-1 overflow-hidden rounded-2xl"
              >
                <div className="flex flex-col items-center gap-[3px]">
                  <div className={`transition-all duration-300 ${isActive ? 'opacity-0 translate-y-1 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
                    <Icon size={20} className="text-[#B9A7B2] group-hover:text-white transition-colors" strokeWidth={1.5} />
                  </div>
                  <span className={`text-[11px] whitespace-nowrap transition-all duration-300 ${isActive ? 'font-bold text-white tracking-wide' : 'font-medium text-[#B9A7B2] group-hover:text-white'}`}>
                    {tab.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}
