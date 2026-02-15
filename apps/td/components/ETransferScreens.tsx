import React from 'react';
import { Contact } from '../../scotia/types';
import { Check, X, Info } from 'lucide-react';

/**
 * High-Fidelity Receipt Screen
 * Formalized to match the confirmation page style with full details.
 */
export const ETransferReceiptScreen: React.FC<{ 
    contact: Contact, 
    amount: string, 
    txId: string, 
    onClose: () => void,
    fromAccount: string,
    message?: string,
    onRepeat: () => void,
}> = ({ contact, amount, txId, onClose, fromAccount, message, onRepeat }) => {
    
    // Masking logic to replicate the #C0***GKJ format from the image
    const maskedTxId = React.useMemo(() => {
        if (!txId) return "#C0***GKJ";
        const suffix = txId.endsWith('GKJ') ? 'GKJ' : txId.substring(txId.length - 3);
        const prefix = txId.substring(0, 2);
        return `${prefix}***${suffix}`;
    }, [txId]);

    const dateStr = React.useMemo(() => {
        return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }, []);

    return (
        <div className="absolute inset-0 bg-white flex flex-col z-[600] overflow-hidden font-sans text-gray-900 animate-in fade-in duration-500">
            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                
                {/* 1. Formal Success Header - Tightened Spacing */}
                <div className="flex flex-col items-center pt-10 px-10 mb-4">
                    <div className="mb-3">
                        <svg width="42" height="42" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="32" cy="32" r="32" fill="#25A648" />
                            <path 
                                d="M19 33L28 42L45 23" 
                                stroke="white" 
                                strokeWidth="5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                            />
                        </svg>
                    </div>
                    <h1 className="text-[22px] font-bold text-gray-900 mb-0.5 leading-tight text-center">Money sent</h1>
                    <p className="text-gray-500 text-[14px] font-medium text-center">The recipient will be notified.</p>
                </div>

                {/* 2. Amount Summary Section - Reduced Vertical Space & Formal Font */}
                <div className="bg-[#F4F7F6]/50 border-y border-gray-100 py-6 px-6 text-center mb-4">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5">Total amount sent</p>
                    <div className="flex items-center justify-center gap-1 text-gray-900">
                        <span className="text-lg font-semibold mt-1">$</span>
                        <h2 className="font-bold text-4xl tracking-tight">
                            {parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </h2>
                        <span className="text-gray-400 font-bold text-[10px] ml-1 mt-4">CAD</span>
                    </div>
                </div>

                {/* 3. Formal Details Grid - Mirroring Confirmation Page */}
                <div className="px-6 py-1 divide-y divide-gray-100">
                    <div className="py-4 flex justify-between items-start gap-4">
                        <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider shrink-0 mt-0.5">From</span>
                        <div className="text-right">
                            <p className="text-gray-800 font-bold text-[14px]">{fromAccount}</p>
                            <p className="text-gray-400 text-[11px] font-medium mt-0.5">Funds debited successfully</p>
                        </div>
                    </div>

                    <div className="py-4 flex justify-between items-start gap-4">
                        <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider shrink-0 mt-0.5">To</span>
                        <div className="text-right min-w-0">
                            <p className="text-gray-800 font-bold text-[14px] truncate">{contact.name}</p>
                            <p className="text-gray-400 text-[12px] truncate">{contact.email}</p>
                        </div>
                    </div>

                    <div className="py-4 flex justify-between items-center">
                        <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Date</span>
                        <p className="text-gray-800 font-bold text-[14px]">{dateStr}</p>
                    </div>

                    <div className="py-4 flex justify-between items-start gap-4">
                        <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider shrink-0 mt-0.5">Confirmation #</span>
                        <p className="text-gray-800 font-bold text-[14px] tracking-wide">{maskedTxId}</p>
                    </div>

                    <div className="py-4 flex justify-between items-start gap-4">
                        <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider shrink-0 mt-0.5">Message</span>
                        <p className="text-gray-800 font-bold text-[14px] text-right break-words max-w-[70%]">
                            {message || "No message provided"}
                        </p>
                    </div>

                    <div className="py-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                             <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Fee</span>
                             <Info size={13} className="text-gray-300" />
                        </div>
                        <p className="text-[#008A00] font-bold text-[14px]">FREE</p>
                    </div>
                </div>

                <div className="p-6">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                        <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-blue-800/80 text-[11px] leading-relaxed font-medium">
                            The funds will be available to the recipient immediately upon deposit. A copy of this receipt has been sent to your registered email.
                        </p>
                    </div>
                </div>
            </div>

            {/* 4. Action Path Footer - Button sized to match others */}
            <div className="p-6 bg-white border-t border-gray-100 shrink-0 z-50 shadow-[0_-8px_24px_rgba(0,0,0,0.04)] pb-10">
                <button 
                    onClick={onClose} 
                    className="w-full py-4 bg-[#4A8F29] text-white font-bold text-[15px] rounded-md shadow-lg active:scale-[0.99] transition-all uppercase tracking-wider mb-3"
                >
                    Done
                </button>
                <button 
                    onClick={onRepeat}
                    className="w-full py-4 text-[#008A00] font-bold text-[13px] active:bg-gray-50 rounded-md transition-colors"
                >
                    Send another e-Transfer
                </button>
            </div>
        </div>
    );
};

export const ETransferConfirmScreen: React.FC<{
    contact: Contact,
    fromAccount: string,
    amount: string,
    message: string,
    onConfirm: () => void,
    onCancel: () => void,
    senderName: string,
}> = ({ contact, fromAccount, amount, message, onConfirm, onCancel, senderName }) => {
    return (
        <div className="absolute inset-0 bg-[#F4F7F6] flex flex-col z-[600] font-sans text-gray-900 overflow-hidden">
            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                {/* Refined Amount Section */}
                <div className="bg-white border-b border-gray-100 py-10 px-6 text-center mb-4">
                    <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] mb-3">Total amount to send</p>
                    <div className="flex items-center justify-center gap-1 text-[#008A00]">
                        <span className="text-xl font-bold mt-1">$</span>
                        <h2 className="text-gray-900 font-black text-4xl tracking-tighter">
                            {parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </h2>
                        <span className="text-gray-400 font-bold text-[10px] ml-1 mt-4">CAD</span>
                    </div>
                </div>

                {/* Details List - Professional Grid Style */}
                <div className="bg-white border-y border-gray-100 px-6 py-2 divide-y divide-gray-50">
                    <div className="py-5 flex justify-between items-start gap-4">
                        <span className="text-gray-400 text-[12px] font-bold uppercase tracking-wider shrink-0 mt-0.5">From</span>
                        <div className="text-right">
                            <p className="text-gray-800 font-bold text-[15px]">{fromAccount}</p>
                            <p className="text-gray-400 text-xs font-medium mt-0.5">Funds debited immediately</p>
                        </div>
                    </div>

                    <div className="py-5 flex justify-between items-start gap-4">
                        <span className="text-gray-400 text-[12px] font-bold uppercase tracking-wider shrink-0 mt-0.5">To</span>
                        <div className="text-right min-w-0">
                            <p className="text-gray-800 font-bold text-[15px] truncate">{contact.name}</p>
                            <p className="text-gray-400 text-[13px] truncate">{contact.email}</p>
                        </div>
                    </div>

                    <div className="py-5 flex justify-between items-start gap-4">
                        <span className="text-gray-400 text-[12px] font-bold uppercase tracking-wider shrink-0 mt-0.5">Message</span>
                        <p className="text-gray-800 font-bold text-[15px] text-right break-words max-w-[70%]">
                            {message || "No message provided"}
                        </p>
                    </div>

                    <div className="py-5 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                             <span className="text-gray-400 text-[12px] font-bold uppercase tracking-wider">Fee</span>
                             <Info size={14} className="text-gray-300" />
                        </div>
                        <p className="text-[#008A00] font-black text-[15px]">FREE</p>
                    </div>
                </div>

                {/* Standard Legal Text */}
                <div className="p-6">
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3">
                        <Info size={18} className="text-orange-400 shrink-0 mt-0.5" />
                        <p className="text-orange-800/80 text-[12px] leading-relaxed font-medium">
                            Please ensure the recipient's information is correct. Once sent, an Interac e-Transfer cannot be reversed if the recipient has Autodeposit enabled.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer - Fixed Equal Width Buttons */}
            <div className="p-6 bg-white border-t border-gray-100 shrink-0 z-50 shadow-[0_-8px_24px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onCancel}
                        className="flex-1 py-4 bg-white text-gray-600 font-bold text-[15px] border border-gray-300 rounded-md active:bg-gray-50 transition-all uppercase tracking-wider"
                    >
                        Back
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="flex-1 py-4 rounded-md bg-[#008A00] text-white font-bold text-[15px] shadow-md active:brightness-95 active:scale-[0.98] transition-all uppercase tracking-wider"
                    >
                        Send Money
                    </button>
                </div>
            </div>
        </div>
    );
};

export const SecurityScreen: React.FC<any> = () => null;
export const SuccessScreen: React.FC<any> = () => null;
export const ErrorScreen: React.FC<any> = () => null;