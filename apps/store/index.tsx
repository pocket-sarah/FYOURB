
import React, { useState } from 'react';
import { BankApp } from '../../types';

interface StoreAppProps {
  app: BankApp;
  appsList: BankApp[];
  onClose: () => void;
  onNotify: (title: string, message: string, icon: string) => void;
  onInstall: (id: string) => void;
  onUninstall: (id: string) => void;
}

const StoreApp: React.FC<StoreAppProps> = ({ appsList, onClose, onInstall, onUninstall }) => {
  const [filter, setFilter] = useState<'all' | 'exploits' | 'clones' | 'stealers'>('all');

  // Map categories to new hacker categories for visual display
  const mapCategory = (cat: string) => {
      if (cat === 'finance') return 'Bank Clone';
      if (cat === 'social') return 'Social Eng';
      if (cat === 'system') return 'Rootkit';
      return 'Exploit';
  };

  const filtered = appsList.filter(a => a.id !== 'store' && a.id !== 'settings');

  return (
    <div className="absolute inset-0 bg-[#050505] flex flex-col z-[100] animate-in slide-up overflow-hidden text-white font-mono">
      <header className="pt-16 px-8 pb-8 bg-black/80 backdrop-blur-xl border-b border-[#ff003c]/20 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-[#ff003c] glitch-text">BLACK_MARKET</h1>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-1">Onion Routing Active</p>
        </div>
        <button onClick={onClose} className="w-12 h-12 flex items-center justify-center text-[#ff003c] border border-[#ff003c]/20 hover:bg-[#ff003c]/10 transition-all">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </header>

      <div className="flex gap-4 px-8 py-6 overflow-x-auto no-scrollbar bg-black/40 border-b border-[#ff003c]/10">
        {['all', 'exploits', 'clones', 'stealers'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f as any)}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all border ${filter === f ? 'bg-[#ff003c] text-black border-[#ff003c]' : 'bg-transparent border-[#ff003c]/30 text-[#ff003c] hover:bg-[#ff003c]/10'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-8 space-y-10 pb-32 no-scrollbar">
        <div className="space-y-6">
          <h2 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.3em] mt-6">Verified Payloads</h2>
          {filtered.map(item => (
            <div key={item.id} className="flex items-center gap-6 group p-4 border border-transparent hover:border-[#ff003c]/20 hover:bg-[#ff003c]/5 transition-all">
              <div className="w-16 h-16 bg-black border border-[#ff003c]/20 p-1 shrink-0">
                <img src={item.icon} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg leading-tight truncate tracking-tight text-[#ff003c]">{item.name}</h3>
                    <div className="px-2 py-0.5 bg-[#ff003c]/10 border border-[#ff003c]/30 text-[8px] font-black text-[#ff003c] uppercase tracking-widest">v9.0</div>
                </div>
                <p className="text-xs text-zinc-500 font-medium truncate mb-3 uppercase tracking-widest">{mapCategory(item.category)} // {item.isInstalled ? 'ACTIVE' : 'READY'}</p>
                <div className="flex gap-3">
                  {!item.isInstalled ? (
                    <button 
                      onClick={() => onInstall(item.id)}
                      className="px-6 py-1 bg-[#ff003c] text-black font-black text-[10px] uppercase tracking-widest hover:bg-white transition-colors"
                    >
                      INJECT
                    </button>
                  ) : (
                    <button 
                      onClick={() => onUninstall(item.id)}
                      className="px-6 py-1 bg-transparent text-[#ff003c] border border-[#ff003c] font-black text-[10px] uppercase tracking-widest hover:bg-[#ff003c] hover:text-black transition-colors"
                    >
                      PURGE
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <nav className="h-16 bg-black border-t border-[#ff003c]/20 flex items-center justify-between px-8 absolute bottom-0 left-0 right-0 z-50">
         <span className="text-[10px] font-black text-[#ff003c] uppercase tracking-widest">Balance: ₿ 4.2049</span>
         <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">TOR: Connected</span>
      </nav>
    </div>
  );
};

export default StoreApp;
