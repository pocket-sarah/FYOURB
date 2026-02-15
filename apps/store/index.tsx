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
  const [filter, setFilter] = useState<'all' | 'finance' | 'social' | 'utilities'>('all');

  const filtered = appsList.filter(a => 
    (filter === 'all' || a.category === filter) && a.id !== 'store' && a.id !== 'settings'
  );

  return (
    <div className="absolute inset-0 bg-[#0c0c0e] flex flex-col z-[100] animate-in slide-up overflow-hidden text-white font-sans">
      <header className="pt-16 px-8 pb-8 bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Marketplace</h1>
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-1">Neural Repository v23</p>
        </div>
        <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 active:bg-white/10 transition-all">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </header>

      <div className="flex gap-4 px-8 py-6 overflow-x-auto no-scrollbar bg-black/20">
        {['all', 'finance', 'social', 'utilities'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f as any)}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${filter === f ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-8 space-y-10 pb-32 no-scrollbar">
        <div className="space-y-8">
          <h2 className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] mt-6">Decentralized Assets</h2>
          {filtered.map(item => (
            <div key={item.id} className="flex items-center gap-6 group">
              <div className="w-20 h-20 rounded-[24px] overflow-hidden shadow-2xl border border-white/10 p-0.5 bg-white/5 shrink-0 group-active:scale-95 transition-transform">
                <img src={item.icon} alt="" className="w-full h-full object-cover rounded-[22px]" />
              </div>
              <div className="flex-1 min-w-0 border-b border-white/5 pb-8">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-xl leading-tight truncate tracking-tight">{item.name}</h3>
                    <div className="px-2 py-0.5 bg-indigo-500/10 rounded text-[9px] font-black text-indigo-400 uppercase tracking-widest">Verified</div>
                </div>
                <p className="text-xs text-white/40 font-medium truncate mb-4 capitalize">{item.category} Matrix Module</p>
                <div className="flex gap-3">
                  {!item.isInstalled ? (
                    <button 
                      onClick={() => onInstall(item.id)}
                      className="px-8 py-2 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-widest active:scale-90 transition-all hover:bg-indigo-400 hover:text-white"
                    >
                      Provision
                    </button>
                  ) : (
                    <button 
                      onClick={() => onUninstall(item.id)}
                      className="px-8 py-2 rounded-full bg-white/5 text-white/30 border border-white/10 font-black text-[10px] uppercase tracking-widest active:scale-90 transition-all"
                    >
                      Active
                    </button>
                  )}
                  <button className="p-2.5 rounded-full bg-white/5 text-white/40 hover:text-white transition-colors border border-white/5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <nav className="h-24 bg-black/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around pb-8 absolute bottom-0 left-0 right-0 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center text-indigo-500 group cursor-pointer">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
           <span className="text-[9px] font-black uppercase mt-2 tracking-tighter">Spotlight</span>
        </div>
        <div className="flex flex-col items-center text-white/20 hover:text-white/40 transition-colors cursor-pointer">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
           <span className="text-[9px] font-black uppercase mt-2 tracking-tighter">Packages</span>
        </div>
        <div className="flex flex-col items-center text-white/20 hover:text-white/40 transition-colors cursor-pointer">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
           <span className="text-[9px] font-black uppercase mt-2 tracking-tighter">Scanner</span>
        </div>
      </nav>
    </div>
  );
};

export default StoreApp;