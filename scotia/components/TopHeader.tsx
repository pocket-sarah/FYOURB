
import React from 'react';
import { BackIcon, ScotiaLogoSVG, BellIcon, HelpCircleIcon } from '../ScotiaIcons';

interface TopHeaderProps {
  onBack?: () => void;
  title?: string;
  rightElement?: React.ReactNode;
  onChat?: () => void;
  onNotification?: () => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ onBack, title, rightElement, onChat, onNotification }) => (
  <div className="bg-[#ED0711] pt-14 pb-8 px-6 flex items-center justify-between shrink-0 relative z-50 shadow-lg">
    <div className="flex items-center gap-3">
      {onBack && (
        <button onClick={onBack} className="p-1 active:scale-90 transition-transform -ml-2">
          <BackIcon color="white" size={24} />
        </button>
      )}
      {/* Pure white SVG logo, no white box container */}
      <ScotiaLogoSVG color="white" className="w-8 h-8" />
      
      {title && (
        <h2 className="text-white font-bold text-[16px] tracking-tight ml-1 first-letter:uppercase">
          {title.toLowerCase()}
        </h2>
      )}
    </div>
    
    <div className="flex items-center gap-5">
      {rightElement ? rightElement : (
        <>
            <button 
                onClick={onNotification}
                className="text-white/90 active:scale-90 transition-transform hover:text-white"
            >
                <BellIcon size={24} color="currentColor" />
            </button>
            <button 
                onClick={onChat}
                className="text-white/90 active:scale-90 transition-transform hover:text-white"
            >
                <HelpCircleIcon size={24} color="currentColor" />
            </button>
        </>
      )}
    </div>
  </div>
);

export default TopHeader;
