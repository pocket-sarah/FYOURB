import React, { useRef, useState } from 'react';
import { BankApp } from '../types';
import ScotiaBalanceWidget from '../apps/scotia/components/ScotiaBalanceWidget';
import { INITIAL_ACCOUNTS } from '../apps/scotia/constants';
import { ScotiaAccountMap } from '../apps/scotia/types';

interface HomeScreenProps {
  apps: BankApp[];
  dockApps: BankApp[];
  onOpenApp: (id: string, initialData?: any) => void;
  onOpenDrawer: () => void;
  isEditMode: boolean;
  onToggleEdit: () => void;
  onUninstall: (id: string) => void;
  onMove: (id: string, direction: 'left' | 'right') => void;
  onSwipeDown: () => void;
  bankingNonce?: number;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ 
  apps, dockApps, onOpenApp, onOpenDrawer, isEditMode, onToggleEdit, onUninstall, onMove, onSwipeDown
}) => {
  const [scotiaAccounts] = useState<ScotiaAccountMap>(INITIAL_ACCOUNTS);
  const longPressTimer = useRef<number | null>(null);

  const startLongPress = () => {
    if (isEditMode) return;
    longPressTimer.current = window.setTimeout(() => {
      onToggleEdit();
      if (navigator.vibrate) navigator.vibrate(50);
    }, 600);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <div className="flex-1 flex flex-col pt-4 animate-in relative z-10 h-full bg-transparent overflow-hidden">
      
      {/* Main Grid Content */}
      <div className="flex-1 px-5 overflow-y-auto pb-4 no-scrollbar space-y-6">
        
        {/* Weather Widget - Samsung Style */}
        <div className="bg-gradient-to-br from-[#4facfe] to-[#00f2fe] rounded-[26px] p-5 text-white shadow-lg relative overflow-hidden h-40 flex flex-col justify-between">
             <div className="flex justify-between items-start z-10">
                 <div>
                     <h3 className="font-semibold text-lg drop-shadow-md">Edmonton</h3>
                     <p className="text-sm opacity-90 font-medium">Partly Cloudy</p>
                 </div>
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="white" className="drop-shadow-md"><circle cx="12" cy="12" r="5" opacity="0.8"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
             </div>
             <div className="z-10">
                 <span className="text-5xl font-light tracking-tighter drop-shadow-md">14°</span>
             </div>
             {/* Cloud shapes background */}
             <div className="absolute -right-4 -bottom-8 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        </div>

        {/* Google Search Pill */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[28px] h-[52px] flex items-center px-5 gap-3 shadow-md mx-1">
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            <span className="text-gray-500 font-medium text-sm">Search...</span>
            <div className="ml-auto flex gap-4 text-gray-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3.2"/><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
            </div>
        </div>

        {/* App Grid */}
        <div className="grid grid-cols-4 gap-x-4 gap-y-6 pt-4">
          {apps.map((app) => (
            <div key={app.id} className="relative flex flex-col items-center group">
              {isEditMode && (
                <button 
                  onClick={() => onUninstall(app.id)}
                  className="absolute -top-2 -right-2 z-20 w-6 h-6 bg-gray-500/80 backdrop-blur text-white rounded-full flex items-center justify-center shadow-sm animate-pulse text-xs"
                >
                  -
                </button>
              )}
              
              <button 
                onClick={() => onOpenApp(app.id)}
                onPointerDown={startLongPress}
                onPointerUp={cancelLongPress}
                onPointerLeave={cancelLongPress}
                className={`flex flex-col items-center transition-all ${isEditMode ? 'animate-[wiggle_0.25s_infinite]' : 'active:scale-90 duration-200'}`}
              >
                <div className="w-[62px] h-[62px] mb-1.5 overflow-hidden bg-white shadow-md relative" style={{ borderRadius: '22px' }}>
                  <img src={app.icon} alt={app.name} className="w-full h-full object-cover p-[2px]" />
                </div>
                <span className="text-[12px] text-white font-medium truncate w-full text-center drop-shadow-md tracking-tight leading-tight px-1 font-urbanist">
                    {app.name}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dock (Strict 4 Icon Limit) */}
      <div className="px-3 pb-6 mt-auto">
        <div className="flex justify-around items-center px-2">
          {dockApps.slice(0, 3).map((app) => (
            <button key={app.id} onClick={() => onOpenApp(app.id)} className={`w-[62px] h-[62px] transition-all active:scale-90 duration-200 flex items-center justify-center ${isEditMode ? 'animate-[wiggle_0.25s_infinite]' : ''}`}>
              <div className="w-full h-full bg-white shadow-lg overflow-hidden relative" style={{ borderRadius: '22px' }}>
                 <img src={app.icon} alt={app.name} className="w-full h-full object-cover p-[2px]" />
              </div>
            </button>
          ))}
          {/* App Drawer Trigger (The 4th icon) */}
          <button onClick={onOpenDrawer} className="w-[60px] h-[60px] flex items-center justify-center active:scale-90 transition-transform">
             <div className="w-[54px] h-[54px] bg-white/20 backdrop-blur-md rounded-[20px] flex flex-wrap gap-1 p-3.5 justify-center content-center border border-white/10">
                 {[...Array(9)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>)}
             </div>
          </button>
        </div>
      </div>
      <style>{`
        @keyframes wiggle {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default HomeScreen;