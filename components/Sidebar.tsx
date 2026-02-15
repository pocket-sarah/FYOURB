
import React from 'react';
import { ToolMode } from '../types';

interface SidebarProps {
  activeMode: ToolMode;
  onSelectMode: (mode: ToolMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMode, onSelectMode }) => {
  const navItems = [
    { id: ToolMode.TEXT, label: 'Chat & Text', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
    )},
    { id: ToolMode.IMAGE, label: 'Image Studio', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    )},
    { id: ToolMode.VIDEO, label: 'Video Gen', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
    )},
  ];

  return (
    <aside className="w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col backdrop-blur-md">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
          <span className="font-bold text-white">L</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Lumina</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectMode(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeMode === item.id
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <div className={`transition-transform duration-200 ${activeMode === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              {item.icon}
            </div>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4 text-xs text-slate-500">
          Powered by Gemini 3 & Veo
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
