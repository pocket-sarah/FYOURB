import React from 'react';
import { TDLogoSVG, SearchIcon } from '../TDIcons';

interface MoveMoneyViewProps {
    onAction: (id: string) => void;
}

const MoveMoneyView: React.FC<MoveMoneyViewProps> = ({ onAction }) => {
    const actions = [
        { id: 'etransfer', label: 'Interac e-Transfer®', desc: 'Send money, view your payment history and manage your contacts', icon: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z' },
        { id: 'transfer', label: 'Transfer Between Accounts', desc: 'Transfer between your TD accounts', icon: 'M7 16l-4-4 4-4M17 8l4 4-4 4M3 12h18' },
        { id: 'billpay', label: 'Bill Payments', desc: 'Pay bills and manage your scheduled payments and payees', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6' },
        { id: 'deposit', label: 'Deposit Cheque', desc: "Take a photo of your cheque for deposit and view mobile deposit history", icon: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z' },
        { id: 'global', label: 'TD Global Transfer', desc: 'Securely send money internationally', icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z M2 12h20 M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20' },
        { id: 'foreign', label: 'Order Foreign Currency', desc: 'Order online and pick up at your nearest branch', icon: 'M12 22a7 7 0 0 0 7-7V9a7 7 0 0 0-14 0v6a7 7 0 0 0 7 7z' }
    ];

    return (
        <div className="flex flex-col h-full bg-[#f4f7f6] animate-in fade-in">
            {/* Formal Green Header */}
            <div className="bg-[#008A00] pt-14 pb-8 px-6 shadow-sm shrink-0 flex justify-between items-center text-white">
                <h1 className="text-xl font-bold tracking-tight">Move Money</h1>
                <SearchIcon size={20} />
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-32 no-scrollbar pt-6">
                <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                    {actions.map(action => (
                        <button 
                            key={action.id} 
                            onClick={() => onAction(action.id)}
                            className="w-full p-5 flex items-start gap-5 text-left active:bg-gray-50 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-sm flex items-center justify-center text-[#008A00] bg-[#f8fcf8] shrink-0 border border-green-50">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={action.icon}/></svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-800 text-[15px] leading-tight mb-1">{action.label}</p>
                                <p className="text-gray-400 text-[12px] leading-snug font-medium pr-4">{action.desc}</p>
                            </div>
                            <div className="pt-1.5">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="3"><path d="m9 18 6-6-6-6"/></svg>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MoveMoneyView;