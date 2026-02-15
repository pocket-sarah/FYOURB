import React from 'react';
import { MenuIcon, SearchIcon, MoreVerticalIcon } from '../AndroidIcons';

interface AndroidHeaderProps {
  title: string;
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  onMoreClick?: () => void;
}

const AndroidHeader: React.FC<AndroidHeaderProps> = ({ title, onMenuClick, onSearchClick, onMoreClick }) => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="pt-2 flex flex-col bg-[#1976D2] shadow-md z-50">
      {/* Android-style Status Bar */}
      <div className="h-6 px-4 flex items-center justify-between text-xs font-medium text-white/90">
        <span>{timeStr}</span>
        <div className="flex items-center gap-1.5 opacity-80">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21a9 9 0 0 1-9-9 9 9 0 0 1 9-9 9 9 0 0 1 9 9 9 9 0 0 1-9 9z"/><path d="M12 11h.01"/><path d="M11 7h2v1H11z"/></svg>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M1 12h2v10H1zM5 8h2v14H5zM9 4h2v18H9zM13 12h2v10h-2zM17 8h2v14h-2zM21 4h2v18h-2z"/></svg>
          <div className="w-5 h-2.5 border border-white/40 rounded-sm relative flex items-center px-0.5">
            <div className="h-full bg-white w-3/4"></div>
          </div>
        </div>
      </div>

      {/* App Bar */}
      <div className="py-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors">
              <MenuIcon color="white" />
            </button>
          )}
          <h1 className="text-xl font-medium text-white">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {onSearchClick && (
            <button onClick={onSearchClick} className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors">
              <SearchIcon color="white" />
            </button>
          )}
          {onMoreClick && (
            <button onClick={onMoreClick} className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors">
              <MoreVerticalIcon color="white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AndroidHeader;
