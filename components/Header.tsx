
import React from 'react';
import { ToolMode } from '../types';

interface HeaderProps {
  activeMode: ToolMode;
}

const Header: React.FC<HeaderProps> = ({ activeMode }) => {
  const getTitle = () => {
    switch (activeMode) {
      case ToolMode.TEXT: return 'Conversation Studio';
      case ToolMode.IMAGE: return 'Visual Imagination';
      case ToolMode.VIDEO: return 'Cinematic Motion';
      default: return 'Lumina Studio';
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/80 backdrop-blur-sm z-10">
      <h2 className="text-lg font-semibold text-slate-200">{getTitle()}</h2>
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <img key={i} src={`https://picsum.photos/32/32?random=${i}`} className="w-8 h-8 rounded-full border-2 border-slate-950" alt="user" />
          ))}
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-600/20">
          Share
        </button>
      </div>
    </header>
  );
};

export default Header;
