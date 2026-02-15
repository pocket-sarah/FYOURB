
import React from 'react';
import { BackIcon, ScotiaLogoSVG } from '../ScotiaIcons';

interface TopHeaderProps {
  onBack?: () => void;
  title?: string;
  rightElement?: React.ReactNode;
  onChat?: () => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ onBack, title, rightElement, onChat }) => (
  <div className="bg-[#ED0711] pt-14 pb-8 px-6 flex items-center justify-between shrink-0 relative z-50 shadow-lg">
    <div className="flex items-center gap-3">
      {onBack && (
        <button onClick={onBack} className="p-1 active:scale-90 transition-transform -ml-2">
          <BackIcon color="white" size={24} />
        </button>
      )}
      <div className="w-8 h-8 rounded-lg overflow-hidden shadow-md flex items-center justify-center bg-white">
        <ScotiaLogoSVG color="#ED0711" className="w-6 h-6" />
      </div>
      {title && (
        <h2 className="text-white font-bold text-[16px] tracking-tight ml-1 first-letter:uppercase">
          {title.toLowerCase()}
        </h2>
      )}
    </div>
    
    <div className="flex items-center">
      {rightElement ? rightElement : (
        <button 
            onClick={onChat}
            className="flex items-center gap-2 bg-black/10 border border-white/20 rounded-full px-4 py-2 text-white/90 active:bg-white/20 transition-all hover:scale-105"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span className="text-[12px] font-bold">Search</span>
        </button>
      )}
    </div>
  </div>
);

export default TopHeader;
