import React from 'react';
import { TDLogoSVG } from '../TDIcons';
import { Contact } from '../../scotia/types';

export const ReceiptScreen: React.FC<{ 
    contact: Contact, 
    amount: string, 
    txId: string, 
    onClose: () => void,
    accountName: string,
    accountBalance: number,
    onRepeat: () => void,
    message: string,
    path?: string
}> = ({ contact, amount, txId, onClose, accountName, accountBalance, onRepeat, message, path }) => (
    <div className="absolute inset-0 bg-white flex flex-col animate-in slide-up z-[600]">
        {/* iOS Style Status Bar Space */}
        <div className="h-12 bg-white flex justify-between items-center px-8 text-sm font-bold">
            <span>9:41</span>
            <div className="flex gap-1.5 items-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="black"><path d="M1 12h2v10H1zM5 8h2v14H5zM9 4h2v18H9zM13 12h2v10h-2zM17 8h2v14h-2z"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="black"><path d="M12 21a9 9 0 0 1-9-9 9 9 0 0 1 9-9 9 9 0 0 1 9 9 9 9 0 0 1-9 9z"/></svg>
                <div className="w-6 h-3 border-2 border-black/20 rounded-sm"></div>
            </div>
        </div>

        <div className="flex-1 flex flex-col items-center pt-8 px-6">
            {/* Success Icon */}
            <div className="w-12 h-12 rounded-full bg-[#008A00] flex items-center justify-center mb-6 shadow-lg shadow-green-500/20 border-2 border-green-600/10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Money sent</h1>
            <p className="text-gray-400 text-[15px] font-medium mb-6">The recipient will be notified.</p>
            
            <p className="text-sm font-bold text-gray-800 mb-10">Confirmation #{txId.slice(0, 3)}***{txId.slice(-3)}</p>

            {/* Recipient Details Card */}
            <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 p-6 shadow-sm shadow-black/[0.02]">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Profile</p>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{contact.name}</h3>
                <p className="text-gray-500 text-sm font-medium mb-6">{contact.email}</p>

                <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Amount Sent</p>
                        <p className="text-2xl font-black text-gray-900 tracking-tight">${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="px-3 py-1 bg-[#ffcc00] rounded text-[9px] font-black tracking-tighter border border-black/5">INTERAC®</div>
                </div>
            </div>

            <div className="mt-auto w-full max-w-sm pb-10 space-y-4">
                 <button 
                    onClick={onRepeat}
                    className="w-full py-4 bg-[#008A00] text-white font-bold rounded-full text-lg shadow-xl active:scale-95 transition-all"
                >
                    Done
                </button>
                <button 
                    onClick={onClose}
                    className="w-full py-2 text-gray-400 font-bold text-sm"
                >
                    Return to Move Money
                </button>
            </div>
        </div>
    </div>
);
