
import React from 'react';
import { Contact } from '../types';
import { InteracLogoNew } from '../ScotiaIcons';
import { X, ShieldCheck, Lock } from 'lucide-react';
import SwipeButton from '../etransfer/components/SwipeButton';

export const ReceiptScreen: React.FC<{ 
    contact: Contact, 
    amount: string, 
    txId: string, 
    onClose: () => void,
    accountName: string,
    accountBalance: number,
    onRepeat: () => void,
    securityQ?: string,
    securityA?: string,
    message: string,
    path?: string
}> = ({ contact, amount, txId, onClose, message, onRepeat, securityQ, securityA }) => {
    
    // Format date as "Dec 2, 2024"
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="absolute inset-0 bg-black z-[600] flex flex-col animate-in slide-up font-sans text-white overflow-hidden">
            {/* Header */}
            <div className="h-16 flex items-center justify-center relative shrink-0 bg-black border-b border-white/10 z-20">
                <h1 className="text-white font-bold text-[17px]">Confirmation</h1>
                <button onClick={onClose} className="absolute right-5 p-2 text-zinc-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Content - Dark Fidelity */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                <div className="space-y-6">
                    {/* Status Banner */}
                    <div className="flex flex-col items-center py-4">
                        <div className="w-16 h-16 bg-[#008751]/10 rounded-full flex items-center justify-center text-[#008751] mb-4 border border-[#008751]/20">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-xl font-black tracking-tight">Money Sent</h2>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Ref: {txId}</p>
                    </div>

                    <div className="h-px bg-white/10 w-full" />

                    {/* To Section with Logo on Right */}
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-zinc-500 text-[13px] font-medium mb-1 uppercase tracking-wider">To</p>
                            <p className="text-white font-bold text-[16px] mb-0.5">{contact.name}</p>
                            <p className="text-zinc-400 text-[14px]">{contact.email}</p>
                        </div>
                        <div className="w-10 h-10 flex items-center justify-center opacity-80">
                             <InteracLogoNew className="w-full h-full" />
                        </div>
                    </div>

                    <div className="h-px bg-white/10 w-full" />

                    {/* Security Section */}
                    <div>
                        <p className="text-zinc-500 text-[13px] font-medium mb-2 uppercase tracking-wider">Security Details</p>
                        <div className="bg-zinc-900/50 rounded-2xl p-4 border border-white/5 space-y-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-zinc-500 text-[10px] font-bold uppercase mb-0.5">Question</p>
                                    <p className="text-white font-medium text-sm">{securityQ || "Standard Security"}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <div>
                                    <p className="text-zinc-500 text-[10px] font-bold uppercase mb-0.5">Answer</p>
                                    <p className="text-white font-mono text-sm tracking-widest">••••••••</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-white/10 w-full" />

                    {/* Amount & Date - Side by Side */}
                    <div className="flex">
                        <div className="flex-1 border-r border-white/10 mr-4">
                            <p className="text-zinc-500 text-[13px] font-medium mb-1 uppercase tracking-wider">Amount</p>
                            <p className="text-white font-black text-[18px] tracking-tight">${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="flex-1">
                            <p className="text-zinc-500 text-[13px] font-medium mb-1 uppercase tracking-wider">Date</p>
                            <p className="text-white font-bold text-[16px]">{dateStr}</p>
                        </div>
                    </div>

                    <div className="h-px bg-white/10 w-full" />

                    {/* Message */}
                    <div className="pb-4">
                        <p className="text-zinc-500 text-[13px] font-medium mb-1 uppercase tracking-wider">Message</p>
                        <p className="text-white font-bold text-[16px] break-words">{message || "No message provided"}</p>
                    </div>
                </div>
            </div>

            {/* Footer Buttons - Dark Mode Styled */}
            <div className="p-6 space-y-3 bg-black border-t border-white/5">
                <button 
                    onClick={onRepeat}
                    className="w-full py-4 rounded-[12px] border border-[#ED0711] text-[#ED0711] font-bold text-[15px] active:bg-red-500/5 transition-colors bg-black uppercase tracking-widest text-xs"
                >
                    Make another transfer
                </button>
                <button 
                    onClick={onClose}
                    className="w-full py-4 rounded-[12px] bg-[#ED0711] text-white font-bold text-[15px] shadow-sm active:opacity-90 transition-all uppercase tracking-widest text-xs"
                >
                    Return to home
                </button>
            </div>
        </div>
    );
};

export const ConfirmScreen: React.FC<{
    contact: Contact,
    fromAccount: string,
    amount: string,
    message: string,
    securityQ?: string,
    securityA?: string,
    onConfirm: () => void,
    onCancel: () => void
}> = ({ contact, fromAccount, amount, message, securityQ, securityA, onConfirm, onCancel }) => {
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="absolute inset-0 bg-black z-[600] flex flex-col animate-in slide-up font-sans text-white">
            {/* Header */}
            <div className="h-16 flex items-center justify-center relative shrink-0 bg-black border-b border-white/10 z-20">
                <h1 className="text-white font-bold text-[17px]">Review details</h1>
                <button onClick={onCancel} className="absolute right-5 p-2 text-zinc-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                <div className="space-y-6">
                     <div className="bg-zinc-900 p-8 rounded-[32px] border border-white/10 mb-6 text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#ED0711]" />
                        <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mb-3">Total Amount</p>
                        <p className="text-white font-black text-5xl tracking-tighter">${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                     </div>

                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-zinc-500 text-[13px] font-medium mb-1 uppercase tracking-wider">From</p>
                            <p className="text-white font-bold text-[16px]">{fromAccount}</p>
                            <p className="text-zinc-400 text-[14px]">Chequing (...1029)</p>
                        </div>
                    </div>

                    <div className="h-px bg-white/10 w-full" />

                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-zinc-500 text-[13px] font-medium mb-1 uppercase tracking-wider">To</p>
                            <p className="text-white font-bold text-[16px]">{contact.name}</p>
                            <p className="text-zinc-400 text-[14px]">{contact.email}</p>
                        </div>
                        <div className="w-10 h-10 flex items-center justify-center opacity-80">
                             <InteracLogoNew className="w-full h-full" />
                        </div>
                    </div>

                    <div className="h-px bg-white/10 w-full" />

                    {/* Security Section in Confirmation */}
                    <div>
                        <p className="text-zinc-500 text-[13px] font-medium mb-3 uppercase tracking-wider">Identity Verification</p>
                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500 text-xs font-bold uppercase">Question</span>
                                <span className="text-white font-medium text-sm">{securityQ || "Standard Security"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500 text-xs font-bold uppercase">Answer</span>
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <Lock size={12} />
                                    <span className="font-mono tracking-widest text-sm">••••••••</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-white/10 w-full" />

                    <div className="flex">
                        <div className="flex-1">
                            <p className="text-zinc-500 text-[13px] font-medium mb-1 uppercase tracking-wider">Date</p>
                            <p className="text-white font-bold text-[16px]">{dateStr}</p>
                        </div>
                    </div>

                    <div className="h-px bg-white/10 w-full" />
                    
                    <div className="pb-4">
                        <p className="text-zinc-500 text-[13px] font-medium mb-1 uppercase tracking-wider">Message</p>
                        <p className="text-white font-bold text-[16px] break-words">{message || "No message added"}</p>
                    </div>
                </div>
            </div>

            <div className="p-6 pb-12 bg-black border-t border-white/10 shadow-2xl">
                <p className="text-[11px] text-zinc-500 leading-tight mb-6 px-2">By sliding, you authorize this immutable Interac e-Transfer from your selected account.</p>
                <SwipeButton onComplete={onConfirm} />
            </div>
        </div>
    );
};
