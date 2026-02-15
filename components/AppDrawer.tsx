
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
    <div className="flex-1 bg-black/95 flex flex-col p-6 pt-12 animate-in">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onClose} className="p-2 text-white/60 active:scale-90 transition-transform">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="flex-1 relative">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Research Apps..."
            className="w-full glass rounded-2xl py-4 px-6 pl-12 text-sm text-white placeholder:text-white/20 outline-none border-white/10 focus:border-white/30 transition-all font-medium"
            autoFocus
          />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-10">
        <div className="grid grid-cols-4 gap-y-10">
          {filteredApps.map((app) => (
            <button 
              key={app.id} 
              onClick={() => onOpenApp(app.id)}
              className="flex flex-col items-center group transition-transform active:scale-95"
            >
              <div 
                className="w-[68px] h-[68px] rounded-[22%] p-0.5 bg-white mb-2 overflow-hidden border border-white/10 shadow-md"
                style={{ backgroundColor: app.brandColor === '#000000' ? '#111' : '#fff' }}
              >
                <img 
                  src={app.icon} 
                  alt={app.name} 
                  className="w-full h-full object-cover rounded-[20%]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=${app.brandColor.replace('#', '')}&color=fff&size=128&bold=true`;
                  }}
                />
              </div>
              <span className="text-[10px] font-semibold text-white/80 truncate w-full text-center tracking-tight px-1">
                {app.name}
              </span>
            </button>
          ))}
        </div>
        
        {filteredApps.length === 0 && (
          <div className="mt-20 text-center animate-pulse">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-4 text-white/10"><path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="8"/><line x1="11" y1="8" x2="11" y2="12"/><line x1="11" y1="14" x2="11.01" y2="14"/></svg>
            <p className="text-white/20 text-xs font-bold uppercase tracking-widest mono">No assets found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppDrawer;
