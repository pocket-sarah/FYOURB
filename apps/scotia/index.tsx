import React, { useState, useEffect } from 'react';
import { BankApp } from '../../types.ts';
import { INITIAL_ACCOUNTS } from './constants.ts';
import { ScotiaAccountMap, PendingTransfer, Contact, ScotiaAccount } from './types.ts';
import { generateEdmontonHistory } from './utils/transactionGenerator.ts';

// Modular Views
import HomeView from './views/HomeView.tsx';
import LoginView from './views/LoginView.tsx';
import DashboardView from './components/DashboardView.tsx';
import AccountDetail from './AccountDetail.tsx';
import ETransferFlow from './ETransferFlow.tsx';
import ScotiaChat from './components/ScotiaChat.tsx';
import SettingsView from './components/SettingsView.tsx';
import TabNavigation from './components/TabNavigation.tsx';
import TopHeader from './components/TopHeader.tsx'; 
import MobileDepositView from './components/MobileDepositView.tsx';
import AccountTransferFlow from './components/AccountTransferFlow.tsx';
import TransferWarningModal from './components/TransferWarningModal.tsx';
import { ScotiaLogoSVG } from './ScotiaIcons.tsx';
import ETransferHubView from './views/ETransferHubView.tsx';
import ManageContactsView from './views/ManageContactsView.tsx';
import PendingTransfersView from './views/PendingTransfersView.tsx';

const ScotiaApp: React.FC<{ app: BankApp, onClose: () => void, onNotify: any, initialParams?: any }> = ({ app, onClose, onNotify, initialParams }) => {
  const [stage, setStage] = useState<'splash' | 'login_user' | 'login_pass' | 'dashboard'>('splash');
  const [activeTab, setActiveTab] = useState<'home' | 'transfers' | 'advice' | 'scene' | 'more'>('home');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<'etransfer_hub' | 'etransfer_send' | 'etransfer_request' | 'manage_contacts' | 'pending_transfers' | 'chat' | 'deposit' | 'transfer' | null>(null);
  const [etransferFlowMode, setEtransferFlowMode] = useState<'send' | 'request'>('send');
  const [viewingSettings, setViewingSettings] = useState(false);
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [accounts, setAccounts] = useState<ScotiaAccountMap>(() => {
    const saved = localStorage.getItem('scotia_accounts_v5');
    if (saved) return JSON.parse(saved);
    const fresh = { ...INITIAL_ACCOUNTS };
    Object.keys(fresh).forEach(k => {
        fresh[k].history = generateEdmontonHistory(k.includes('Card') || k.includes('Visa') || k.includes('Amex') ? 20 : 40);
    });
    return fresh;
  });

  const [senderName, setSenderName] = useState(localStorage.getItem('scotia_sender_name') || 'JENNIFER EDWARDS');
  const [pendingTransfers, setPendingTransfers] = useState<PendingTransfer[]>(() => JSON.parse(localStorage.getItem('scotia_pending_transfers') || '[]') as PendingTransfer[]);
  const [contacts, setContacts] = useState<Contact[]>(() => JSON.parse(localStorage.getItem('scotia_contacts') || '[]'));

  useEffect(() => { localStorage.setItem('scotia_accounts_v5', JSON.stringify(accounts)); }, [accounts]);
  useEffect(() => { localStorage.setItem('scotia_pending_transfers', JSON.stringify(pendingTransfers)); }, [pendingTransfers]);
  useEffect(() => { localStorage.setItem('scotia_contacts', JSON.stringify(contacts)); }, [contacts]);

  useEffect(() => {
    const t = setTimeout(() => {
        if (initialParams?.action === 'deposit') {
            setStage('dashboard');
            const defaultAcc = Object.keys(accounts).find(k => accounts[k].type === 'banking');
            setSelectedAccount(initialParams.selectedAccount || defaultAcc || null);
            setWorkflow('deposit');
        } else if (initialParams?.action === 'transfer') {
            setStage('dashboard');
            setWorkflow('transfer');
        } else if (initialParams?.selectedAccount) { 
            setStage('dashboard'); 
            setSelectedAccount(initialParams.selectedAccount); 
        } else {
            setStage('login_user');
        }
    }, 1200);
    return () => clearTimeout(t);
  }, [initialParams]);

  const handleTransactionComplete = (type: string, amount: number, payload: any) => {
      setAccounts(prev => {
          const next = { ...prev };
          const dateStr = 'Today';
          
          if (payload.sourceAccount && next[payload.sourceAccount]) {
              const acc = next[payload.sourceAccount];
              acc.balance -= amount;
              acc.history = [{
                  id: 'tx-' + Date.now(),
                  date: dateStr,
                  description: `${type.toUpperCase()}: ${payload.recipientName || payload.to || 'Transaction'}`,
                  amount: -amount,
                  status: 'Pending'
              }, ...acc.history];
          }

          if (payload.targetAccount && next[payload.targetAccount]) {
              const acc = next[payload.targetAccount];
              acc.balance += amount;
              acc.history = [{
                  id: 'tx-rx-' + Date.now(),
                  date: dateStr,
                  description: `RECEIVED FROM: ${payload.sourceAccount}`,
                  amount: amount,
                  status: 'Completed'
              }, ...acc.history];
          }

          return { ...next };
      });
      setWorkflow(null);
      if (type === 'send') setShowSecurityAlert(true);
  };

  return (
    <div className="absolute inset-0 overflow-hidden h-full bg-black">
      {stage === 'splash' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center animate-in bg-[#ED0711] z-[100]">
          <ScotiaLogoSVG color="white" className="w-24 h-24 animate-pulse" />
        </div>
      )}

      {stage.startsWith('login') && (
        <LoginView 
          stage={stage} 
          username={username} 
          setUsername={setUsername} 
          password={password} 
          setPassword={setPassword} 
          onContinue={() => setStage('login_pass')} 
          onSignIn={() => setStage('dashboard')} 
          onSwitchAccount={() => setStage('login_user')} 
        />
      )}

      {stage === 'dashboard' && (
        <div className="absolute inset-0 z-[60] bg-black flex flex-col animate-in h-full overflow-hidden">
          {viewingSettings ? (
            <SettingsView senderName={senderName} setSenderName={setSenderName} accounts={accounts} onAdjustBalance={(n, v) => setAccounts(p => ({ ...p, [n]: { ...p[n], balance: parseFloat(v) || 0 } }))} onBack={() => setViewingSettings(false)} />
          ) : (
            <>
                <div className="flex-1 relative z-20 overflow-y-auto no-scrollbar flex flex-col h-full">
                    {activeTab === 'home' && <HomeView accounts={accounts} onSelectAccount={setSelectedAccount} onChat={() => setWorkflow('chat')} />}
                    {activeTab === 'transfers' && <DashboardView accounts={accounts} onSelectAccount={setSelectedAccount} onMobileDeposit={() => setWorkflow('deposit')} onETransferHub={() => setWorkflow('etransfer_hub')} onChat={() => setWorkflow('chat')} />}
                    {activeTab === 'more' && (
                        <div className="flex-1 bg-black flex flex-col">
                            <TopHeader title="Menu" onChat={() => setWorkflow('chat')} />
                            <div className="p-6 space-y-4">
                                <button onClick={() => setViewingSettings(true)} className="w-full p-6 bg-zinc-900 rounded-3xl text-white font-bold text-left border border-white/5 active:bg-white/5 transition-all">Profile & Settings</button>
                                <button onClick={onClose} className="w-full p-6 bg-zinc-900 rounded-3xl text-red-500 font-bold text-left border border-white/5 active:bg-white/5 transition-all">Sign Out</button>
                            </div>
                        </div>
                    )}
                </div>
                <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            </>
          )}
        </div>
      )}

      {selectedAccount && accounts[selectedAccount] && (
        <AccountDetail accountName={selectedAccount} data={accounts[selectedAccount]} onBack={() => setSelectedAccount(null)} onDownload={() => {}} onMobileDeposit={() => setWorkflow('deposit')} onChat={() => setWorkflow('chat')} />
      )}

      {workflow === 'etransfer_hub' && (
        <ETransferHubView 
          onClose={() => setWorkflow(null)} 
          onOpenSendMoney={() => { setEtransferFlowMode('send'); setWorkflow('etransfer_send'); }}
          onOpenRequestMoney={() => { setEtransferFlowMode('request'); setWorkflow('etransfer_request'); }}
          onOpenManageContacts={() => setWorkflow('manage_contacts')}
          onOpenPendingTransfers={() => setWorkflow('pending_transfers')}
          pendingTransfers={pendingTransfers}
        />
      )}

      {(workflow === 'etransfer_send' || workflow === 'etransfer_request') && (
        <ETransferFlow 
          app={app} 
          onNotify={onNotify} 
          onClose={() => setWorkflow('etransfer_hub')} 
          onComplete={(a:any, b:any, c:any) => handleTransactionComplete('send', b, c)} 
          pendingTransfers={pendingTransfers} 
          setPendingTransfers={setPendingTransfers} 
          contacts={contacts} 
          setContacts={setContacts} 
          senderName={senderName} 
          accounts={accounts} 
          flowMode={etransferFlowMode}
        />
      )}

      {workflow === 'manage_contacts' && (
        <ManageContactsView
          onClose={() => setWorkflow('etransfer_hub')}
          contacts={contacts}
          setContacts={setContacts}
          onNotify={onNotify}
          appIcon={app.icon}
        />
      )}

      {workflow === 'pending_transfers' && (
        <PendingTransfersView
          onClose={() => setWorkflow('etransfer_hub')}
          pendingTransfers={pendingTransfers}
          setPendingTransfers={setPendingTransfers}
          onNotify={onNotify}
        />
      )}

      {workflow === 'deposit' && (
        <MobileDepositView onClose={() => setWorkflow(null)} onDeposit={(amt) => handleTransactionComplete('deposit', amt, { sourceAccount: 'Basic Plus' })} />
      )}

      {workflow === 'transfer' && (
        <AccountTransferFlow accounts={accounts} onClose={() => setWorkflow(null)} onComplete={(t:any, a:any, p:any) => handleTransactionComplete('internal', a, p)} />
      )}

      {workflow === 'chat' && <ScotiaChat onClose={() => setWorkflow(null)} accounts={accounts} pendingTransfers={pendingTransfers} />}

      {showSecurityAlert && <TransferWarningModal onClose={() => setShowSecurityAlert(false)} />}
    </div>
  );
};

export default ScotiaApp;