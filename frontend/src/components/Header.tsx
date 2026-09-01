import { Menu, Bell, ChevronLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showMenu?: boolean;
  showNotifications?: boolean;
}

export function Header({ title, showBack, onBack, showMenu, showNotifications }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-4">
        {showBack && (
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-text-main">
            <ChevronLeft size={24} />
          </button>
        )}
        {showMenu && (
          <button className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-text-main">
            <Menu size={24} />
          </button>
        )}
        <h1 className="text-xl font-semibold text-text-main tracking-tight">{title}</h1>
      </div>
      
      {showNotifications && (
        <button className="p-2 rounded-full hover:bg-gray-100 text-text-main relative">
          <Bell size={24} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary-bright rounded-full"></span>
        </button>
      )}
    </div>
  );
}
