import React from 'react';

interface AndroidFooterProps {
  onHomeClick?: () => void;
  onBackClick?: () => void;
  onRecentsClick?: () => void;
}

const AndroidFooter: React.FC<AndroidFooterProps> = ({ onHomeClick, onBackClick, onRecentsClick }) => {
  return (
    <div className="h-16 bg-white border-t border-gray-100 flex items-center justify-around shadow-inner sticky bottom-0 z-50">
      {onBackClick && (
        <button onClick={onBackClick} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
      {onHomeClick && (
        <button onClick={onHomeClick} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
      )}
      {onRecentsClick && (
        <button onClick={onRecentsClick} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="3" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AndroidFooter;
