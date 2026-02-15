import React from 'react';
import { ScotiaLogoSVG, ChevronRightIcon } from '../ScotiaIcons';
import { Contact } from '../types';

export const ReceiptScreen: React.FC<{ 
    contact: Contact, 
    amount: string, 
    txId: string, 
    onClose: () => void,
    accountName: string,
    accountBalance: number,
    onRepeat: () => void,
    securityQ: string,
    securityA: string,
    message: string,
    path?: string
}> = ({ contact, amount, txId, onClose, accountName, accountBalance, onRepeat, securityQ, securityA, message, path }) => (
    <div className="absolute inset-0 bg-zinc-50 flex flex-col animate-in slide-up z-[600]">
        {/* Header - Official Styling */}
        <div className="bg-white pt-14 pb-4 px-4 flex items-center justify-between shadow-sm shrink-0 border-b border-gray-200">
            <button onClick={onClose} className="p-2 -ml-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
            <h2 className="text-[#333] font-bold text-[17px] tracking-tight">Transfer Details</h2>
            <div className="w-10"></div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
            <div className="p-8 flex flex-col items-center bg-white border-b border-gray-100">
                <div className="w-20 h-20 rounded-full bg-[#008A00] flex items-center justify-center mb-6 shadow-xl shadow-green-500/20">
                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <h2 className="text-[#333] text-[22px] font-black tracking-tight text-center">Successfully Sent</h2>
                <p className="text-gray-500 text-[14px] font-medium text-center mt-2">The recipient will receive a notification shortly.</p>
                
                {/* Reference Card */}
                <div className="w-full mt-10 bg-[#f9f9f9] border border-gray-200 rounded-[20px] p-5 flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#ED0711]/5 rounded-bl-full pointer-events-none"></div>
                    <div className="w-12 h-12 rounded-full bg-[#ED0711]/10 flex items-center justify-center text-[#ED0711] shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    </div>
                    <div className="min-w-0">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Ref Number</p>
                        <p className="text-[#333] font-black text-[16px] tracking-tight truncate">{txId}</p>
                    </div>
                </div>
            </div>

            {/* Neural Relay Status Banner */}
            <div className="bg-black p-3 px-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Handshake Verified</span>
                </div>
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">Route: {path || "RELAY_AUTO"}</span>
            </div>

            {/* Details Grid */}
            <div className="p-6 space-y-8 bg-white border-b border-gray-100">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">From</p>
                        <p className="text-[#333] font-bold text-[15px]">{accountName}</p>
                        <p className="text-gray-500 text-[12px] font-medium">Available: ${accountBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Amount (CAD)</p>
                        <p className="text-[#333] font-black text-[24px] tracking-tighter">${parseFloat(amount).toFixed(2)}</p>
                    </div>
                </div>

                <div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Recipient</p>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-[#333] font-bold text-[15px]">{contact.name}</p>
                            <p className="text-gray-500 text-[13px] font-medium">{contact.email}</p>
                        </div>
                        <div className="px-3 py-1 bg-[#ffcc00] rounded text-[9px] font-black tracking-tighter border border-black/5 shadow-sm">INTERAC®</div>
                    </div>
                </div>

                {message && (
                    <div className="pt-4 border-t border-gray-50">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Message</p>
                        <p className="text-[#333] font-medium text-sm italic">"{message}"</p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-8 space-y-4">
                <button 
                    onClick={onRepeat}
                    className="w-full py-5 bg-[#ED0711] text-white font-black rounded-[18px] text-[14px] uppercase tracking-[0.2em] shadow-2xl shadow-red-500/20 active:scale-[0.98] transition-all"
                >
                    Create new transfer
                </button>
                <button 
                    onClick={onClose}
                    className="w-full py-4 bg-transparent text-gray-500 font-bold text-[14px] hover:bg-gray-100 rounded-[18px] transition-all"
                >
                    Close & Finish
                </button>
            </div>
        </div>

        {/* Brand Accent */}
        <div className="h-2 bg-[#ED0711] w-full shrink-0"></div>
    </div>
);

export const SecurityScreen: React.FC<any> = () => null;
export const ConfirmScreen: React.FC<any> = () => null;
export const SuccessScreen: React.FC<any> = () => null;
export const ErrorScreen: React.FC<any> = () => null;
