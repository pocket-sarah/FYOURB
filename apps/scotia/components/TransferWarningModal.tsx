
import React from 'react';
import { AlertIcon } from '../ScotiaIcons';

const TransferWarningModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="absolute inset-0 z-[600] bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
        <div className="bg-[#1c1c1e] w-full max-w-sm rounded-[24px] border border-white/10 p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 text-yellow-500 border border-yellow-500/20">
                    <AlertIcon size={32} color="#eab308" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3 tracking-tight">Security Alert</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                    An Interac e-Transfer transaction was recently processed from this device. Please verify your transaction history for accuracy.
                </p>
                <button 
                    onClick={onClose} 
                    className="w-full py-4 bg-white text-black font-bold rounded-2xl text-sm hover:bg-zinc-200 transition-colors"
                >
                    Dismiss
                </button>
            </div>
        </div>
    </div>
);

export default TransferWarningModal;
