
import React from 'react';
import { ScotiaLogoSVG, ChevronRightIcon, SendIcon, GiftIcon, MoreIcon, InfoIcon } from '../ScotiaIcons';
import TopHeader from '../components/TopHeader';
import { PendingTransfer } from '../types';

interface ETransferHubViewProps {
  onClose: () => void;
  onOpenSendMoney: () => void;
  onOpenRequestMoney: () => void;
  onOpenManageContacts: () => void;
  onOpenPendingTransfers: () => void;
  pendingTransfers: PendingTransfer[];
}

const ETransferHubView: React.FC<ETransferHubViewProps> = ({
  onClose,
  onOpenSendMoney,
  onOpenRequestMoney,
  onOpenManageContacts,
  onOpenPendingTransfers,
  pendingTransfers
}) => {
  return (
    <div className="absolute inset-0 z-[550] bg-black flex flex-col animate-in slide-up h-full">
      <TopHeader onBack={onClose} title="Interac e-Transfer®" />

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-8">
        {/* Main Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onOpenSendMoney}
            className="bg-[#1c1c1e] rounded-[24px] p-5 flex flex-col items-start gap-4 border border-white/5 shadow-2xl active:bg-white/5 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-[#ED0711]/10 flex items-center justify-center text-[#ED0711] group-active:scale-90 transition-transform">
              <SendIcon size={22} />
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-lg">Send Money</p>
              <p className="text-zinc-500 text-xs font-medium">Send money to anyone instantly</p>
            </div>
          </button>
          
          <button 
            onClick={onOpenRequestMoney}
            className="bg-[#1c1c1e] rounded-[24px] p-5 flex flex-col items-start gap-4 border border-white/5 shadow-2xl active:bg-white/5 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-[#ED0711]/10 flex items-center justify-center text-[#ED0711] group-active:scale-90 transition-transform">
              <GiftIcon size={22} />
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-lg">Request Money</p>
              <p className="text-zinc-500 text-xs font-medium">Request funds from a contact</p>
            </div>
          </button>
          
          <button 
            onClick={onOpenManageContacts}
            className="bg-[#1c1c1e] rounded-[24px] p-5 flex flex-col items-start gap-4 border border-white/5 shadow-2xl active:bg-white/5 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-[#ED0711]/10 flex items-center justify-center text-[#ED0711] group-active:scale-90 transition-transform">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 11V3L15 6 12 3 7 6v14"/></svg>
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-lg">Manage Contacts</p>
              <p className="text-zinc-500 text-xs font-medium">Add, edit, or remove e-Transfer contacts</p>
            </div>
          </button>
          
          <button 
            onClick={onOpenPendingTransfers}
            className="bg-[#1c1c1e] rounded-[24px] p-5 flex flex-col items-start gap-4 border border-white/5 shadow-2xl active:bg-white/5 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-[#ED0711]/10 flex items-center justify-center text-[#ED0711] group-active:scale-90 transition-transform">
              <MoreIcon size={22} />
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-lg">Pending Transfers</p>
              <p className="text-zinc-500 text-xs font-medium">View and manage outstanding e-Transfers</p>
            </div>
          </button>
        </div>

        {/* Recent Pending Transfers */}
        {pendingTransfers.length > 0 && (
          <div className="bg-[#1c1c1e] rounded-[24px] p-6 border border-white/5 shadow-2xl space-y-4">
            <h3 className="text-zinc-400 font-black text-[11px] uppercase tracking-widest px-1">Recent Pending Transfers</h3>
            <div className="divide-y divide-white/5">
              {pendingTransfers.slice(0, 3).map((transfer) => (
                <div key={transfer.id} className="py-3 flex justify-between items-center text-white/80">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#ED0711]/10 flex items-center justify-center">
                        <SendIcon size={14} color="#ED0711" />
                    </div>
                    <div>
                        <p className="font-bold text-sm">{transfer.recipientName}</p>
                        <p className="text-zinc-500 text-[10px] uppercase font-medium">{transfer.date} • {transfer.status}</p>
                    </div>
                  </div>
                  <p className="font-black text-sm text-[#ED0711]">-${transfer.amount.toFixed(2)}</p>
                </div>
              ))}
              {pendingTransfers.length > 3 && (
                 <button 
                    onClick={onOpenPendingTransfers}
                    className="w-full pt-4 text-[#ED0711] font-bold text-xs uppercase tracking-widest text-center active:opacity-70 transition-opacity"
                 >
                    View All ({pendingTransfers.length})
                 </button>
              )}
            </div>
          </div>
        )}

        {pendingTransfers.length === 0 && (
            <div className="bg-[#1c1c1e] rounded-[24px] p-6 border border-white/5 shadow-2xl flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-4">
                    <InfoIcon size={24} />
                </div>
                <p className="text-zinc-500 text-sm font-medium">No pending transfers found.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ETransferHubView;