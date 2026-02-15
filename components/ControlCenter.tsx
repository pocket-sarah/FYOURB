import React from 'react';

interface ControlCenterProps {
  onClose: () => void;
}

const ControlCenter: React.FC<ControlCenterProps> = ({ onClose }) => {
  const controls = [
    { label: 'Internet', icon: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z', active: true, color: 'bg-blue-400' },
    { label: 'Bluetooth', icon: 'M7 7l10 10-5 5V2l5 5L7 17', active: false, color: 'bg-zinc-800' },
    { label: 'Do not disturb', icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z', active: false, color: 'bg-zinc-800' },
    { label: 'Flashlight', icon: 'M18 2h-12c-1.1 0-2 .9-2 2v1h16v-1c0-1.1-.9-2-2-2zM19 5h-14v2h14v-2z', active: false, color: 'bg-zinc-800' },
    { label: 'Auto-rotate', icon: 'M12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9z', active: true, color: 'bg-blue-400' },
    { label: 'Battery Saver', icon: 'M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z', active: false, color: 'bg-zinc-800' },
  ];

  return (
    <div 
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-3xl animate-in slide-down flex flex-col pt-12"
      onClick={onClose}
    >
      <div 
        className="w-full h-full bg-zinc-950 rounded-t-[42px] px-6 pt-12 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
           <div className="flex flex-col">
              <span className="text-white text-3xl font-normal">Tuesday</span>
              <span className="text-white/40 text-sm font-medium">May 21</span>
           </div>
           <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white/60">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white/60">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-12">
          {controls.map((c, i) => (
            <button 
              key={i} 
              className={`flex items-center gap-4 p-5 rounded-[28px] ${c.color} transition-all active:scale-95`}
            >
              <div className={`w-8 h-8 flex items-center justify-center ${c.active ? 'text-zinc-900' : 'text-white'}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d={c.icon}/></svg>
              </div>
              <span className={`text-sm font-bold ${c.active ? 'text-zinc-900' : 'text-white/90'}`}>{c.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-6">
           <div className="flex items-center gap-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white/60"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM2 12L5 12M19 12L22 12M12 2L12 5M12 19L12 22M4.93 4.93L7.05 7.05M16.95 16.95L19.07 19.07M4.93 19.07L7.05 16.95M16.95 4.93L19.07 7.05"/></svg>
              <div className="flex-1 h-12 bg-zinc-800 rounded-full relative overflow-hidden">
                 <div className="absolute inset-y-0 left-0 bg-white/10 w-3/4"></div>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white/60"><path d="M11 5L6 9H2V15H6L11 19V5Z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              <div className="flex-1 h-12 bg-zinc-800 rounded-full relative overflow-hidden">
                 <div className="absolute inset-y-0 left-0 bg-white/10 w-1/2"></div>
              </div>
           </div>
        </div>

        <div className="mt-auto mb-10 flex justify-center">
           <div className="w-16 h-1.5 bg-white/10 rounded-full"></div>
        </div>
      </div>
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        .animate-in.slide-down {
          animation: slideDown 0.4s cubic-bezier(0.2, 0, 0, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default ControlCenter;