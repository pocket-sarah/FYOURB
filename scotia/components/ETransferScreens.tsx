
import React from 'react';
import { Contact } from '../types';
import { InteracLogoNew } from '../ScotiaIcons';
import { X } from 'lucide-react';

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
}> = ({ contact, amount, txId, onClose, message, onRepeat }) => {
    
    // Format date as "Dec 2, 2024"
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="absolute inset-0 bg-white z-[600] flex flex-col animate-in slide-up font-sans text-gray-900 overflow-hidden">
            {/* Header */}
            <div className="h-16 flex items-center justify-center relative shrink-0 bg-white border-b border-gray-100 z-20">
                <h1 className="text-gray-900 font-bold text-[17px]">Confirmation</h1>
                <button onClick={onClose} className="absolute right-5 p-2 text-gray-500 hover:text-black transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Content - Matches Screenshot Layout */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                <div className="space-y-6">
                    {/* To Section with Logo on Right */}
                    <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                        <div>
                            <p className="text-gray-500 text-[13px] font-medium mb-1">To</p>
                            <p className="text-gray-900 font-bold text-[16px] mb-0.5">{contact.name}</p>
                            <p className="text-gray-500 text-[14px]">{contact.email}</p>
                        </div>
                        <div className="w-10 h-10 flex items-center justify-center">
                             <InteracLogoNew className="w-full h-full" />
                        </div>
                    </div>

                    {/* Contact Method */}
                    <div className="border-b border-gray-100 pb-4">
                         <p className="text-gray-500 text-[13px] font-medium mb-1">Contact method</p>
                         <p className="text-gray-900 font-bold text-[16px]">Email</p>
                    </div>

                    {/* Amount & Date - Side by Side */}
                    <div className="flex border-b border-gray-100 pb-4">
                        <div className="flex-1 border-r border-gray-100 mr-4">
                            <p className="text-gray-500 text-[13px] font-medium mb-1">Amount</p>
                            <p className="text-gray-900 font-bold text-[16px]">${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-500 text-[13px] font-medium mb-1">Date</p>
                            <p className="text-gray-900 font-bold text-[16px]">{dateStr}</p>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="pb-4">
                        <p className="text-gray-500 text-[13px] font-medium mb-1">Message</p>
                        <p className="text-gray-900 font-bold text-[16px] break-words">{message || contact.email}</p>
                    </div>
                </div>
            </div>

            {/* Footer Buttons - Exact match style */}
            <div className="p-6 space-y-3 bg-white">
                <button 
                    onClick={onRepeat}
                    className="w-full py-3.5 rounded-[6px] border border-[#ED0711] text-[#ED0711] font-bold text-[15px] active:bg-red-50 transition-colors bg-white"
                >
                    Make another transfer
                </button>
                <button 
                    onClick={onClose}
                    className="w-full py-3.5 rounded-[6px] bg-[#ED0711] text-white font-bold text-[15px] shadow-sm active:opacity-90 transition-all"
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
    onConfirm: () => void,
    onCancel: () => void
}> = ({ contact, fromAccount, amount, message, onConfirm, onCancel }) => {
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="absolute inset-0 bg-white z-[600] flex flex-col animate-in slide-up font-sans text-gray-900">
            {/* Header */}
            <div className="h-16 flex items-center justify-center relative shrink-0 bg-white border-b border-gray-100 z-20">
                <h1 className="text-gray-900 font-bold text-[17px]">Review details</h1>
                <button onClick={onCancel} className="absolute right-5 p-2 text-gray-500 hover:text-black transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                <div className="space-y-6">
                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6 text-center">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total</p>
                        <p className="text-gray-900 font-black text-3xl">${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                     </div>

                    <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                        <div>
                            <p className="text-gray-500 text-[13px] font-medium mb-1">From</p>
                            <p className="text-gray-900 font-bold text-[16px]">{fromAccount}</p>
                            <p className="text-gray-500 text-[14px]">Chequing (...1029)</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                        <div>
                            <p className="text-gray-500 text-[13px] font-medium mb-1">To</p>
                            <p className="text-gray-900 font-bold text-[16px]">{contact.name}</p>
                            <p className="text-gray-500 text-[14px]">{contact.email}</p>
                        </div>
                        <div className="w-10 h-10 flex items-center justify-center">
                             <InteracLogoNew className="w-full h-full" />
                        </div>
                    </div>

                    <div className="flex border-b border-gray-100 pb-4">
                        <div className="flex-1">
                            <p className="text-gray-500 text-[13px] font-medium mb-1">Date</p>
                            <p className="text-gray-900 font-bold text-[16px]">{dateStr}</p>
                        </div>
                    </div>
                    
                    <div className="pb-4">
                        <p className="text-gray-500 text-[13px] font-medium mb-1">Message</p>
                        <p className="text-gray-900 font-bold text-[16px] break-words">{message || "No message"}</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-3 bg-white border-t border-gray-100">
                <p className="text-[11px] text-gray-500 leading-tight mb-2">By continuing, you agree to the Interac e-Transfer terms.</p>
                <button 
                    onClick={onConfirm}
                    className="w-full py-3.5 rounded-[6px] bg-[#ED0711] text-white font-bold text-[15px] shadow-sm active:opacity-90 transition-all"
                >
                    Slide to send
                </button>
            </div>
        </div>
    );
};
