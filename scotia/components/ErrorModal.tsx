
import React from 'react';

interface ErrorModalProps {
  onRetry: () => void;
  onCancel: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ onRetry, onCancel }) => (
  <div className="fixed inset-0 z-[2000] bg-black/80 flex items-center justify-center p-8 animate-in fade-in">
    <div className="bg-[#1c1c1e] w-full max-w-[340px] rounded-[8px] p-8 flex flex-col items-start shadow-2xl animate-in zoom-in-95">
      {/* Red Error Icon - Matches screenshot triangle */}
      <div className="mb-6">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3L2 21H22L12 3Z" fill="#ED0711" />
          <path d="M12 10V15M12 18H12.01" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      <h2 className="text-white font-bold text-[18px] leading-tight mb-12">
        Something went wrong. Try that again.
      </h2>

      <div className="w-full space-y-4">
        <button 
          onClick={onRetry}
          className="w-full py-4 bg-[#ED0711] text-white font-bold rounded-[8px] text-[15px] active:brightness-90 transition-all shadow-lg"
        >
          Retry
        </button>
        <button 
          onClick={onCancel}
          className="w-full py-4 bg-transparent border border-[#ED0711] text-white font-bold rounded-[8px] text-[15px] active:bg-white/5 transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default ErrorModal;
