
import React from 'react';
import { BankApp } from '../types';

interface AppDrawerProps {
  apps: BankApp[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenApp: (id: string) => void;
  onClose: () => void;
}

const AppDrawer: React.FC<AppDrawerProps> = ({ apps, searchQuery, setSearchQuery, onOpenApp, onClose }) => {
  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl flex flex-col animate-in fade-in z-[200]">
      {/* Search Header */}
      <div className="pt-14 px-6 pb-4">
        <div className="relative">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-white/10 border border-white/10 rounded-[24px] py-3.5 px-12 text-white placeholder:text-white/40 outline-none focus:bg-white/20 transition-all font-medium text-sm"
            autoFocus
          />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          {searchQuery && (
             <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 bg-white/10 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">✕</button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-20 no-scrollbar">
        <div className="grid grid-cols-4 gap-x-4 gap-y-8 pt-4">
          {filteredApps.map((app) => (
            <button 
              key={app.id} 
              onClick={() => onOpenApp(app.id)}
              className="flex flex-col items-center group active:scale-95 transition-transform duration-200"
            >
              <div 
                className="w-[62px] h-[62px] mb-2 overflow-hidden shadow-lg bg-white relative"
                style={{ borderRadius: '22px' }}
              >
                <img 
                  src={app.icon} 
                  alt={app.name} 
                  className="w-full h-full object-cover p-[2px]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=${app.brandColor.replace('#', '')}&color=fff&size=128&bold=true`;
                  }}
                />
              </div>
              <span className="text-[12px] font-medium text-white truncate w-full text-center tracking-tight leading-tight px-1 font-urbanist">
                {app.name}
              </span>
            </button>
          ))}
        </div>
        
        {filteredApps.length === 0 && (
          <div className="mt-20 text-center animate-pulse">
            <p className="text-white/40 text-sm font-medium">No results found</p>
          </div>
        )}
      </div>

      {/* Close Handle */}
      <button 
        onClick={onClose}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 p-4 text-white/50 hover:text-white transition-colors active:scale-90"
      >
         <div className="w-12 h-1 bg-white/30 rounded-full mb-2"></div>
         <span className="text-xs font-medium">Close</span>
      </button>
    </div>
  );
};

export default AppDrawer;
