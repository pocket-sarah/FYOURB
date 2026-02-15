
import React from 'react';
import TopHeader from '../components/TopHeader';
import { PendingTransfer } from '../types';
import { SendIcon, InfoIcon } from '../ScotiaIcons';
import RRButton from '../../shared/components/RRButton';

interface PendingTransfersViewProps {
  onClose: () => void;
  pendingTransfers: PendingTransfer[];
  setPendingTransfers: (transfers: PendingTransfer[]) => void;
  onNotify: (title: string, message: string, icon: string) => void;
}

// Fix: Added `export default` and wrapped the component's content in a `return` statement.
const PendingTransfersView: React.FC<PendingTransfersViewProps> = ({
  onClose,
  pendingTransfers,
  setPendingTransfers,
  onNotify
}) => {
  const handleCancelTransfer = (id: string) => {
    const updatedTransfers = pendingTransfers.map(t =>
      t.id === id ? { ...t, status: 'Cancelled' as 'Cancelled' } : t
    );
    setPendingTransfers(updatedTransfers);
    localStorage.setItem('scotia_pending_transfers', JSON.stringify(updatedTransfers));
    onNotify("Transfer Cancelled", `e-Transfer ${id.substring(0,6)}... cancelled.`, "https://cdn-icons-png.flaticon.com/512/3953/3953226.png");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent':
      case 'Pending':
        return 'text-yellow-500';
      case 'Deposited':
        return 'text-green-500';
      case 'Cancelled':
      case 'Failed':
      case 'Expired':
        return 'text-red-500';
      default:
        return 'text-zinc-500';
    }
  };

  return (
    <div className="absolute inset-0 z-[600] bg-black flex flex-col animate-in slide-in-from-right h-full">
      <TopHeader onBack={onClose} title="Pending Transfers" />
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
        {pendingTransfers.length === 0 ? (
          <div className="text-center text-zinc-500 text-sm py-10">
            <InfoIcon size={32} color="#555" className="mx-auto mb-4" />
            No pending transfers found.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTransfers.map((transfer) => (
              <div key={transfer.id} className="bg-[#1c1c1e] p-4 rounded-[24px] border border-white/5 shadow-2xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#ED0711]/10 flex items-center justify-center text-[#ED0711]">
                    <SendIcon size={18} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">{transfer.recipientName}</p>
                    <p className="text-zinc-500 text-xs">{transfer.date} • <span className={getStatusColor(transfer.status)}>{transfer.status}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-black text-lg text-white">-${transfer.amount.toFixed(2)}</p>
                  {transfer.status !== 'Cancelled' && transfer.status !== 'Deposited' && (
                    <RRButton
                      onClick={() => handleCancelTransfer(transfer.id)}
                      brand="scotia"
                      variant="outline"
                      className="!px-3 !py-1 !text-xs !rounded-full"
                    >
                      Cancel
                    </RRButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-8 bg-black/90 backdrop-blur-xl border-t border-white/5">
        <RRButton onClick={onClose} brand="scotia">
          Done
        </RRButton>
      </div>
    </div>
  );
};

export default PendingTransfersView;
