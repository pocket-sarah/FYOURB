import React, { useState, useEffect, useMemo } from 'react';
import { BankApp } from '../../types';
import { ScotiaAccountMap, PendingTransfer, Contact } from '../scotia/types';
import { generateEdmontonHistory } from '../scotia/utils/transactionGenerator';
import { getSystemConfig } from '../../data/systemConfig';

// Reusing High-Fidelity Components from the cloned system
import HomeView from '../scotia/views/HomeView';
import LoginView from '../scotia/LoginFlow';
import AccountDetail from '../scotia/AccountDetail';
import DashboardView from '../scotia/components/DashboardView';
import ETransferFlow from '../scotia/ETransferFlow';
import ScotiaChat from '../scotia/components/ScotiaChat';
import ScotiaMoreView from '../scotia/views/MoreView';
import AdviceView from '../scotia/views/AdviceView';
import SceneView from '../scotia/views/SceneView';
import TabNavigation from '../scotia/components/TabNavigation';
import MobileDepositView from '../scotia/components/MobileDepositView';
import AccountTransferFlow from '../scotia/components/AccountTransferFlow';
import NotificationsView from '../scotia/components/NotificationsView';
import { AnimatePresence, motion } from 'framer-motion';

const INITIAL_CONTACTS: Contact[] = [
  { id: 'sb', name: 'SARAH BANKS', email: 'projectsarah25@gmail.com', isFavorite: true },
  { id: '1', name: 'Adam Jensen', email: 'ajensen@sarif.com' },
  { id: '2', name: 'Elena Fisher', email: 'efisher@explorer.net' }
];

const BMOApp: React.FC<{ app: BankApp, onClose: () => void, onNotify: any, initialParams?: any }> = ({ app, onClose, onNotify, initialParams }) => {
  const [stage, setStage] = useState<'splash' | 'login_user' | 'login_pass' | 'dashboard'>('splash');
  const systemConfig = getSystemConfig();
  
  const [username, setUsername] = useState(systemConfig.bmo_config.username);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'transfers' | 'advice' | 'scene' | 'more'>('home');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<'etransfer' | 'chat' | 'deposit' | 'transfer' | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('bmo_remember') === 'true');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const [accounts, setAccounts] = useState<ScotiaAccountMap>(() => {
    const config = getSystemConfig();
    const map: ScotiaAccountMap = {};
    config.bmo_config.accounts.forEach(acc => {
        map[acc.name] = {
            type: acc.type,
            balance: acc.balance,
            pending: 0,
            available: acc.balance,
            points: acc.type === 'credit' ? 12450 : 0,
            history: generateEdmontonHistory(acc.type === 'credit' ? 20 : 40)
        };
    });
    return map;
  });

  const [senderName, setSenderName] = useState(systemConfig.bmo_config.account_holder);
  const [pendingTransfers, setPendingTransfers] = useState<PendingTransfer[]>(() => JSON.parse(localStorage.getItem('bmo_pending_transfers') || '[]'));
  const [contacts, setContacts] = useState<Contact[]>(() => JSON.parse(localStorage.getItem('bmo_contacts') || JSON.stringify(INITIAL_CONTACTS)));

  const MotionDiv = motion.div as any;

  useEffect(() => {
    localStorage.setItem('bmo_accounts_v3', JSON.stringify(accounts));
    localStorage.setItem('bmo_pending_transfers', JSON.stringify(pendingTransfers));
    localStorage.setItem('bmo_contacts', JSON.stringify(contacts));
    localStorage.setItem('bmo_remember', rememberMe.toString());
  }, [accounts, pendingTransfers, contacts, rememberMe]);

  useEffect(() => {
    const t = setTimeout(() => {
        if (rememberMe) setStage('login_pass');
        else setStage('login_user');
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  const handleSignIn = () => {
      setIsAuthenticating(true);
      setTimeout(() => {
          setIsAuthenticating(false);
          setStage('dashboard');
      }, 1500);
  };

  const handleTransactionComplete = (type: string, amount: number, payload: any) => {
      const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      setAccounts(prev => {
          const next = { ...prev };
          if (payload.sourceAccount && next[payload.sourceAccount]) {
              next[payload.sourceAccount].balance -= amount;
              next[payload.sourceAccount].history = [{
                  id: 'tx-' + Date.now(),
                  date: dateStr,
                  description: payload.description || `${type.toUpperCase()}: ${payload.recipientName || 'Transaction'}`,
                  amount: -amount,
                  status: 'Completed'
              }, ...next[payload.sourceAccount].history];
          }
          return next;
      });
      if (type === 'send') {
          setPendingTransfers(prev => [{ id: `et-${Date.now()}`, recipientName: payload.recipientName, recipientEmail: payload.recipientEmail || 'N/A', amount, date: dateStr, status: 'Sent' }, ...prev]);
      }
      setWorkflow(null);
  };

  return (
    <div className="absolute inset-0 overflow-hidden h-full bg-black">
      {stage === 'splash' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center animate-in bg-[#0079C1] z-[100]">
          <img src={app.icon} alt="BMO" className="w-32 h-32 animate-pulse rounded-[22%] shadow-2xl" />
        </div>
      )}

      {stage.startsWith('login') && (
        <div className="bmo-theme">
          <LoginView 
              stage={stage} username={username} setUsername={setUsername} 
              password={password} setPassword={setPassword} 
              onContinue={() => setStage('login_pass')} onSignIn={handleSignIn} 
              onSwitchAccount={() => { setRememberMe(false); setUsername(''); setStage('login_user'); }} 
              rememberMe={rememberMe} onToggleRememberMe={() => setRememberMe(!rememberMe)}
              isLoading={isAuthenticating}
          />
          <style>{`.bmo-theme div { --scotia-red: #0079C1; } .bmo-theme button { background-color: #0079C1 !important; }`}</style>
        </div>
      )}

      {stage === 'dashboard' && (
        <div className="absolute inset-0 z-[60] bg-black flex flex-col animate-in h-full overflow-hidden bmo-dashboard">
            <div className="flex-1 relative z-20 overflow-y-auto no-scrollbar flex flex-col h-full">
                {activeTab === 'home' && <HomeView accounts={accounts} onSelectAccount={setSelectedAccount} onChat={() => setWorkflow('chat')} onNotification={() => setShowNotifications(true)} />}
                {activeTab === 'transfers' && <DashboardView accounts={accounts} onSelectAccount={setSelectedAccount} onMobileDeposit={() => setWorkflow('deposit')} onETransfer={() => setWorkflow('etransfer')} onChat={() => setWorkflow('chat')} onNotification={() => setShowNotifications(true)} />}
                {activeTab === 'advice' && <AdviceView onChat={() => setWorkflow('chat')} onNotification={() => setShowNotifications(true)} />}
                {activeTab === 'scene' && <SceneView onChat={() => setWorkflow('chat')} onNotification={() => setShowNotifications(true)} />}
                {activeTab === 'more' && <ScotiaMoreView onSignOut={() => setStage('login_user')} onCloseApp={onClose} onChat={() => setWorkflow('chat')} senderName={senderName} setSenderName={setSenderName} onNotification={() => setShowNotifications(true)} />}
            </div>
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            <style>{`.bmo-dashboard button[style*="#ED0711"], .bmo-dashboard div[style*="#ED0711"] { background-color: #0079C1 !important; color: white !important; } .bmo-dashboard .text-[#ED0711] { color: #0079C1 !important; }`}</style>
        </div>
      )}

      <AnimatePresence>
        {selectedAccount && accounts[selectedAccount] && (
            <MotionDiv key="acc-detail" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="absolute inset-0 z-[200] bg-black h-full">
                <AccountDetail 
                    accountName={selectedAccount} data={accounts[selectedAccount]} 
                    onBack={() => setSelectedAccount(null)} onDownload={() => {}} 
                    onMobileDeposit={() => setWorkflow('deposit')} onChat={() => setWorkflow('chat')}
                    onETransfer={() => setWorkflow('etransfer')} onTransfer={() => setWorkflow('transfer')}
                />
            </MotionDiv>
        )}
      </AnimatePresence>

      {workflow === 'etransfer' && <ETransferFlow app={app} onNotify={onNotify} onClose={() => setWorkflow(null)} onComplete={(a, b, c) => handleTransactionComplete('send', b, c)} pendingTransfers={pendingTransfers} setPendingTransfers={setPendingTransfers} contacts={contacts} setContacts={setContacts} senderName={senderName} accounts={accounts} />}
      {workflow === 'deposit' && <MobileDepositView onClose={() => setWorkflow(null)} onDeposit={(amt) => handleTransactionComplete('deposit', amt, { sourceAccount: Object.keys(accounts)[0] })} />}
      {workflow === 'transfer' && <AccountTransferFlow accounts={accounts} onClose={() => setWorkflow(null)} onComplete={(t, a, p) => handleTransactionComplete('internal', a, p)} />}
      {workflow === 'chat' && <ScotiaChat onClose={() => setWorkflow(null)} accounts={accounts} pendingTransfers={pendingTransfers} senderName={senderName} />}
      {showNotifications && <NotificationsView onClose={() => setShowNotifications(false)} />}
    </div>
  );
};

export default BMOApp;