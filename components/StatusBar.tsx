
import React, { useState, useEffect } from 'react';
import { Signal, Wifi, Lock, Activity, Zap, Skull } from 'lucide-react';
import { useDevice } from '../hooks/useDevice';

interface StatusBarProps {
  currentView: string;
  onLock: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ currentView, onLock }) => {
  const [time, setTime] = useState(new Date());
  const [rage, setRage] = useState(99.99);
  const os = useDevice();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const rageTimer = setInterval(() => {
        setRage(prev => Math.min(100, Math.max(99.90, prev + (Math.random() - 0.5) * 0.01)));
    }, 2000);
    return () => {
        clearInterval(timer);
        clearInterval(rageTimer);
    };
  }, []);

  const timeStr = time.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  });

  const StreetUplink = () => (
    <div className="flex items-center gap-2 px-4 py-1 bg-red-600/10 backdrop-blur-md rounded-full border border-red-500/20 shadow-inner group cursor-help">
        <div className="relative flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute opacity-50"></div>
            <div className="w-2 h-2 rounded-full bg-red-500 relative z-10 shadow-[0_0_12px_#ef4444]"></div>
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-red-500/60 group-hover:text-red-400 transition-colors">STREET UPLINK: LOCKED IN</span>
    </div>
  );

  return (
    <div className={`h-12 px-6 flex items-center justify-between text-[13px] font-bold text-white shrink-0 z-[1000] pointer-events-none select-none relative bg-black/40 backdrop-blur-sm border-b border-white/5`}>
      <div className="w-1/3 flex items-center gap-4">
        <span className="tracking-tight glitch-text">{timeStr}</span>
        <div className="flex items-center gap-1 opacity-40">
            <Activity size={10} className="text-red-500" />
            <span className="text-[8px] font-mono">{rage.toFixed(2)}% GRIND</span>
        </div>
      </div>
      
      <div className="w-1/3 flex justify-center">
        <StreetUplink />
      </div>

      <div className="w-1/3 flex items-center justify-end gap-3">
        {currentView === 'app' && (
            <div className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                <Skull size={10} />
                <span className="text-[8px] font-black uppercase tracking-tighter">BOSS_MODE</span>
            </div>
        )}
        <Signal size={16} className="opacity-60" />
        <Wifi size={16} className="opacity-60" />
        <button 
          onClick={onLock}
          className="pointer-events-auto p-1 text-white/20 hover:text-red-500 transition-all ml-2 active:scale-75"
        >
          <Lock size={14} />
        </button>
      </div>
    </div>
  );
};

export default StatusBar;
