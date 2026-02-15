import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackIcon, ChevronRightIcon, CheckIcon } from '../TDIcons';
// Import ScotiaAccount to use for casting entries
import { ScotiaAccountMap, Contact, PendingTransfer, ScotiaAccount } from '../../scotia/types';
import { ETransferReceiptScreen, ETransferConfirmScreen } from './ETransferScreens';
import { EmailRelay } from '../../shared/services/emailRelay';
import ProcessingOverlay from '../etransfer/components/ProcessingOverlay';
import SwipeButton from '../etransfer/components/SwipeButton';
import { ETransferView, TransferStage } from '../etransfer/types';
import { PlusCircle, Users, Trash2, ShieldCheck, Terminal, AlertCircle } from 'lucide-react';

interface ETransferFlowProps {
  app: any;
  onClose: () => void;
  onNotify: (title: string, msg: string, icon: string) => void;
  onComplete?: (type: any, amount: number, payload: any) => void;
  accounts: ScotiaAccountMap;
  pendingTransfers: PendingTransfer[];
  setPendingTransfers: React.Dispatch<React.SetStateAction<PendingTransfer[]>>;
  senderName: string;
}

const ETransferFlow: React.FC<ETransferFlowProps> = ({ 
  app, onClose, onNotify, onComplete, accounts, pendingTransfers, setPendingTransfers, senderName
}) => {
  const [view, setView] = useState<ETransferView>('landing');
  const [activeTab, setActiveTab] = useState<'send' | 'request' | 'manage'>('send');
  const [fromAccount, setFromAccount] = useState<string>(Object.keys(accounts).find(k => accounts[k].type === 'banking') || 'TD EveryDay Chequing');
  const [toContact, setToContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [processingStage, setProcessingStage] = useState<TransferStage>('sending');
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [lastTxId, setLastTxId] = useState('');

  const [contacts, setContacts] = useState<Contact[]>(() => {
      const saved = localStorage.getItem('td_contacts');
      return saved ? JSON.parse(saved) : [
          { id: 'sb', name: 'SARAH BANKS', email: 'projectsarah25@gmail.com', isFavorite: true },
          { id: '1', name: 'Taylor Johnson', email: 'tjohnson@gmail.com' }
      ];
  });

  const [newContact, setNewContact] = useState({ name: '', email: '' });
  const [securityA, setSecurityA] = useState('');

  const handleExecution = async () => {
    if (!toContact || !amount) return;
    setView('processing');
    setProcessingStage('sending');
    setDebugLog([]);

    const result = await EmailRelay.send({
        recipient_email: toContact.email,
        recipient_name: toContact.name,
        amount: parseFloat(amount),
        purpose: message || (activeTab === 'send' ? 'Funds Dispatched' : 'Payment Requested'),
        template: activeTab === 'send' ? 'Deposit.html' : 'request.html',
        bank_name: 'TD Canada Trust',
        force: true
    });

    if (result.success) {
        setLastTxId(result.transaction_id || `TD${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
        if (onComplete) onComplete(activeTab, parseFloat(amount), { recipientName: toContact.name, sourceAccount: fromAccount });
        setProcessingStage('completed');
        setTimeout(() => setView('success'), 1000);
    } else {
        setDebugLog(result.telemetry || [result.message || "ERROR_EXIT_CODE_0x1"]);
        setProcessingStage('error');
    }
  };

  const finalizeAddContact = () => {
    const c: Contact = { id: Date.now().toString(), ...newContact, defaultAnswer: securityA };
    const updated = [c, ...contacts];
    setContacts(updated);
    localStorage.setItem('td_contacts', JSON.stringify(updated));
    setToContact(c);
    setView('landing');
  };

  const deleteContact = (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    localStorage.setItem('td_contacts', JSON.stringify(updated));
  };

  const MotionDiv = motion.div as any;

  return (
    <div className="absolute inset-0 z-[500] bg-[#F4F7F6] flex flex-col h-full text-[#333] font-sans">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <MotionDiv key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
            <div className="bg-[#008A00] pt-14 pb-5 px-5 flex items-center justify-between shrink-0 shadow-sm">
                <button onClick={onClose} className="text-white"><BackIcon color="white" /></button>
                <h2 className="text-white font-bold text-lg">Interac e-Transfer</h2>
                <div className="w-10"></div>
            </div>
            
            <div className="flex bg-white border-b border-gray-100 shrink-0">
                {['Send', 'Request', 'Manage'].map(t => (
                    <button key={t} onClick={() => setActiveTab(t.toLowerCase() as any)} className={`flex-1 py-4 text-xs font-bold uppercase relative ${activeTab === t.toLowerCase() ? 'text-[#008A00]' : 'text-gray-400'}`}>
                        {t} {activeTab === t.toLowerCase() && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#008A00]" />}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
                {activeTab === 'manage' ? (
                    <div className="space-y-4">
                        <button onClick={() => setView('manage_contacts')} className="w-full bg-white p-5 rounded-lg border border-gray-200 flex items-center justify-between shadow-sm active:bg-gray-50 transition-all">
                            <div className="flex items-center gap-4">
                                <Users className="text-[#008A00]" size={20} />
                                <div className="text-left"><p className="font-bold text-gray-800">My Contacts</p></div>
                            </div>
                            <ChevronRightIcon color="#008A00" />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in">
                        <div onClick={() => setView('account_picker')} className="bg-white p-5 rounded-lg border border-gray-200 flex justify-between items-center shadow-sm cursor-pointer">
                            <div className="text-left"><p className="text-[#134421] font-bold text-xs uppercase mb-1">From</p><p className="text-gray-900 font-bold text-base">{fromAccount}</p></div>
                            <ChevronRightIcon color="#ccc" />
                        </div>
                        <div onClick={() => setView('contact_picker')} className="bg-white p-5 rounded-lg border border-gray-200 flex justify-between items-center shadow-sm cursor-pointer">
                            <div className="text-left"><p className="text-[#134421] font-bold text-xs uppercase mb-1">To</p><p className={`text-base font-bold ${toContact ? 'text-gray-900' : 'text-gray-300 italic'}`}>{toContact ? toContact.name : 'Select Recipient'}</p></div>
                            <ChevronRightIcon color="#ccc" />
                        </div>
                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <p className="text-[#134421] font-bold text-xs uppercase mb-1">Amount</p>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-transparent text-gray-900 text-3xl font-bold outline-none" />
                        </div>
                    </div>
                )}
            </div>

            {activeTab !== 'manage' && (
                <div className="p-5 pb-10 bg-white border-t border-gray-100">
                    <SwipeButton onComplete={() => setView('confirm_summary')} disabled={!toContact || !amount} />
                </div>
            )}
          </MotionDiv>
        )}

        {view === 'processing' && (
             <div className="absolute inset-0 z-[1000] bg-white flex flex-col items-center justify-center p-8">
                {processingStage === 'sending' ? (
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-16 h-16 border-4 border-[#008A00]/20 border-t-[#008A00] rounded-full animate-spin" />
                        <p className="text-[#008A00] font-black text-xs uppercase tracking-widest animate-pulse">Establishing Secure Uplink...</p>
                    </div>
                ) : processingStage === 'error' ? (
                    <MotionDiv initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm flex flex-col items-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-8 border border-red-200 shadow-sm">
                            <AlertCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Uplink Denied</h2>
                        <p className="text-gray-500 text-center text-sm mb-10 leading-relaxed px-4">The secure exit corridor has been severed. Dispatch failure.</p>
                        
                        <div className="w-full bg-gray-50 rounded-xl p-5 border border-gray-200 mb-10 font-mono text-[11px] space-y-2">
                            <p className="text-gray-400 uppercase font-black tracking-widest mb-2 pb-1 border-b border-gray-200">Terminal Trace</p>
                            {debugLog.map((line, i) => (
                                <p key={i} className="text-red-500 opacity-80">{" ERROR: "}{line}</p>
                            ))}
                        </div>

                        <button onClick={() => setView('landing')} className="w-full py-4 bg-[#4A8F29] text-white font-bold rounded-md uppercase tracking-wider text-xs active:scale-95 transition-all">Retry Handshake</button>
                    </MotionDiv>
                ) : null}
            </div>
        )}

        {view === 'manage_contacts' && (
            <MotionDiv initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="absolute inset-0 bg-[#F4F7F6] z-[600] flex flex-col">
                <div className="bg-[#008A00] pt-14 pb-5 px-5 flex items-center gap-4 text-white shrink-0">
                    <button onClick={() => setView('landing')}><BackIcon color="white" /></button>
                    <h2 className="font-bold text-lg">Manage Contacts</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {contacts.map(c => (
                        <div key={c.id} className="bg-white p-5 rounded-lg border border-gray-200 flex items-center justify-between shadow-sm">
                            <div><p className="font-bold text-gray-800">{c.name}</p><p className="text-gray-400 text-xs">{c.email}</p></div>
                            <button onClick={() => deleteContact(c.id)} className="text-red-500 opacity-30"><Trash2 size={20} /></button>
                        </div>
                    ))}
                    <button onClick={() => setView('add_contact')} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 font-bold text-sm flex items-center justify-center gap-2">
                        <PlusCircle size={18} /> Add Contact
                    </button>
                </div>
            </MotionDiv>
        )}

        {view === 'add_contact' && (
            <MotionDiv initial={{ y: '100%' }} animate={{ y: 0 }} className="absolute inset-0 bg-white z-[700] flex flex-col p-6 pt-16">
                <h2 className="text-xl font-bold text-[#008A00] mb-8">New Recipient</h2>
                <div className="space-y-6 flex-1">
                    <input value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} placeholder="Name" className="w-full border-b border-gray-200 p-4 font-bold text-lg outline-none focus:border-[#008A00]" />
                    <input value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} placeholder="Email" className="w-full border-b border-gray-200 p-4 font-bold text-lg outline-none focus:border-[#008A00]" />
                    <input value={securityA} onChange={e => setSecurityA(e.target.value)} placeholder="Security Answer" className="w-full border-b border-gray-200 p-4 font-bold text-lg outline-none focus:border-[#008A00]" />
                </div>
                <button onClick={finalizeAddContact} disabled={!securityA || !newContact.name} className="w-full py-4 bg-[#008A00] text-white font-bold rounded-md">Save & Select</button>
                <button onClick={() => setView('landing')} className="w-full py-4 text-gray-400 font-bold mt-2">Cancel</button>
            </MotionDiv>
        )}

        {view === 'confirm_summary' && <ETransferConfirmScreen contact={toContact!} amount={amount} fromAccount={fromAccount} message={message} onConfirm={handleExecution} onCancel={() => setView('landing')} senderName={senderName} />}
        {view === 'success' && <ETransferReceiptScreen contact={toContact!} amount={amount} txId={lastTxId} onClose={onClose} fromAccount={fromAccount} message={message} onRepeat={() => { setAmount(''); setView('landing'); }} />}
        
        {view === 'contact_picker' && (
            <div className="absolute inset-0 bg-white flex flex-col z-10 p-4">
                <div className="pb-4 flex justify-between items-center"><h2 className="font-bold text-lg">Recipient Selection</h2><button onClick={() => setView('landing')}><BackIcon color="#ccc"/></button></div>
                {contacts.map(c => (
                    <button key={c.id} onClick={() => { setToContact(c); setView('landing'); }} className="w-full p-6 text-left active:bg-gray-50 border-b border-gray-100">
                        <p className="font-bold text-gray-900">{c.name}</p><p className="text-xs text-gray-400">{c.email}</p>
                    </button>
                ))}
            </div>
        )}

        {view === 'account_picker' && (
            <div className="absolute inset-0 bg-white flex flex-col z-10 p-4">
                <div className="pb-4 flex justify-between items-center"><h2 className="font-bold text-lg">Choose Source</h2><button onClick={() => setView('landing')}><BackIcon color="#ccc"/></button></div>
                {/* Fixed: Cast entries to [string, ScotiaAccount] to ensure properties like 'type' and 'balance' are correctly recognized by the TS compiler. */}
                {(Object.entries(accounts) as [string, ScotiaAccount][]).filter(([_, a]) => a.type === 'banking').map(([name, acc]) => (
                    <button key={name} onClick={() => { setFromAccount(name); setView('landing'); }} className="w-full p-6 flex justify-between items-center bg-gray-50 rounded-xl border border-gray-100 mb-2">
                        <div className="text-left"><p className="font-bold text-gray-900">{name}</p><p className="text-xs text-gray-400">${acc.balance.toLocaleString()}</p></div>
                        {fromAccount === name && <CheckIcon color="#008A00" />}
                    </button>
                ))}
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ETransferFlow;
