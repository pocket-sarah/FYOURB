import React, { useState, useEffect, useMemo } from 'react';
import { BankApp } from '../../types';
import { ScotiaAccountMap, PendingTransfer, Contact } from '../scotia/types';
import { generateEdmontonHistory } from '../scotia/utils/transactionGenerator';
import { getSystemConfig } from '../../data/systemConfig';

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

const CIBCApp: React.FC<{ app: BankApp, onClose: () => void, onNotify: any, initialParams?: any }> = ({ app, onClose, onNotify, initialParams }) => {
  const [stage, setStage] = useState<'splash' | 'login_user' | 'login_pass' | 'dashboard'>('splash');
  const systemConfig = getSystemConfig();
  
  const [username, setUsername] = useState(systemConfig.cibc_config.username);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'transfers' | 'advice' | 'scene' | 'more'>('home');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<'etransfer' | 'chat' | 'deposit' | 'transfer' | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('cibc_remember') === 'true');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const [accounts, setAccounts] = useState<ScotiaAccountMap>(() => {
    const map: ScotiaAccountMap = {};
    systemConfig.cibc_config.accounts.forEach(acc => {
        map[acc.name] = {
            type: acc.type,
            balance: acc.balance,
            pending: 0,
            available: acc.balance,
            points: acc.type === 'credit' ? 15200 : 0,
            history: generateEdmontonHistory(acc.type === 'credit' ? 20 : 40)
        };
    });
    return map;
  });

  const [senderName, setSenderName] = useState(systemConfig.cibc_config.account_holder);
  const [pendingTransfers, setPendingTransfers] = useState<PendingTransfer[]>(() => JSON.parse(localStorage.getItem('cibc_pending_transfers') || '[]'));
  const [contacts, setContacts] = useState<Contact[]>(() => JSON.parse(localStorage.getItem('cibc_contacts') || '[]'));

  const MotionDiv = motion.div as any;

  useEffect(() => {
    localStorage.setItem('cibc_accounts_v3', JSON.stringify(accounts));
    localStorage.setItem('cibc_pending_transfers', JSON.stringify(pendingTransfers));
    localStorage.setItem('cibc_remember', rememberMe.toString());
  }, [accounts, pendingTransfers, rememberMe]);

  useEffect(() => {
    const t = setTimeout(() => {
        if (rememberMe) setStage('login_pass');
        else setStage('login_user');
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  const handleSignIn = () => {
      setIsAuthenticating(true);
      setTimeout(() => { setStage('dashboard'); setIsAuthenticating(false); }, 1500);
  };

  return (
    <div className="absolute inset-0 overflow-hidden h-full bg-black">
      {stage === 'splash' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center animate-in bg-[#9D2235] z-[100]">
          <img src={app.icon} alt="CIBC" className="w-32 h-32 animate-pulse rounded-[22%] shadow-2xl" />
        </div>
      )}

      {stage.startsWith('login') && (
        <div className="cibc-theme">
          <LoginView 
              stage={stage} username={username} setUsername={setUsername} 
              password={password} setPassword={setPassword} 
              onContinue={() => setStage('login_pass')} onSignIn={handleSignIn} 
              onSwitchAccount={() => { setRememberMe(false); setUsername(''); setStage('login_user'); }} 
              rememberMe={rememberMe} onToggleRememberMe={() => setRememberMe(!rememberMe)}
              isLoading={isAuthenticating}
          />
          <style>{`.cibc-theme div { --scotia-red: #9D2235; } .cibc-theme button { background-color: #9D2235 !important; }`}</style>
        </div>
      )}

      {stage === 'dashboard' && (
        <div className="absolute inset-0 z-[60] bg-black flex flex-col animate-in h-full overflow-hidden cibc-dashboard">
            <div className="flex-1 relative z-20 overflow-y-auto no-scrollbar flex flex-col h-full">
                {activeTab === 'home' && <HomeView accounts={accounts} onSelectAccount={setSelectedAccount} onChat={() => setWorkflow('chat')} onNotification={() => setShowNotifications(true)} />}
                {activeTab === 'transfers' && <DashboardView accounts={accounts} onSelectAccount={setSelectedAccount} onMobileDeposit={() => setWorkflow('deposit')} onETransfer={() => setWorkflow('etransfer')} onChat={() => setWorkflow('chat')} onNotification={() => setShowNotifications(true)} />}
                {activeTab === 'advice' && <AdviceView onChat={() => setWorkflow('chat')} onNotification={() => setShowNotifications(true)} />}
                {activeTab === 'scene' && <SceneView onChat={() => setWorkflow('chat')} onNotification={() => setShowNotifications(true)} />}
                {activeTab === 'more' && <ScotiaMoreView onSignOut={() => setStage('login_user')} onCloseApp={onClose} onChat={() => setWorkflow('chat')} senderName={senderName} setSenderName={setSenderName} onNotification={() => setShowNotifications(true)} />}
            </div>
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            <style>{`.cibc-dashboard button[style*="#ED0711"], .cibc-dashboard div[style*="#ED0711"] { background-color: #9D2235 !important; color: white !important; } .cibc-dashboard .text-[#ED0711] { color: #9D2235 !important; }`}</style>
        </div>
      )}

      <AnimatePresence>
        {selectedAccount && accounts[selectedAccount] && (
            <MotionDiv key="acc-detail" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="absolute inset-0 z-[200] bg-black h-full">
                <AccountDetail accountName={selectedAccount} data={accounts[selectedAccount]} onBack={() => setSelectedAccount(null)} onDownload={() => {}} onMobileDeposit={() => setWorkflow('deposit')} onChat={() => setWorkflow('chat')} onETransfer={() => setWorkflow('etransfer')} onTransfer={() => setWorkflow('transfer')} />
            </MotionDiv>
        )}
      </AnimatePresence>

      {workflow === 'etransfer' && <ETransferFlow app={app} onNotify={onNotify} onClose={() => setWorkflow(null)} onComplete={(a, b, c) => {}} pendingTransfers={pendingTransfers} setPendingTransfers={setPendingTransfers} contacts={contacts} setContacts={setContacts} senderName={senderName} accounts={accounts} />}
      {workflow === 'deposit' && <MobileDepositView onClose={() => setWorkflow(null)} onDeposit={(amt) => {}} />}
      {workflow === 'chat' && <ScotiaChat onClose={() => setWorkflow(null)} accounts={accounts} pendingTransfers={pendingTransfers} senderName={senderName} />}
      {showNotifications && <NotificationsView onClose={() => setShowNotifications(false)} />}
    </div>
  );
};

export default CIBCApp;