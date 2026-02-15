
import React, { useState, useEffect } from 'react';
import { BankApp } from '../../types';
import { ScotiaAccountMap, PendingTransfer, Contact, ScotiaAccount } from './types';
import { generateEdmontonHistory } from './utils/transactionGenerator';
import { getSystemConfig } from '../../data/systemConfig';

// Modular Views
import HomeView from './views/HomeView';
import LoginView from './LoginFlow';
import AccountDetail from './AccountDetail';
import DashboardView from './components/DashboardView';
import ETransferFlow from './ETransferFlow';
import ScotiaChat from './components/ScotiaChat';
import ScotiaMoreView from './views/MoreView';
import AdviceView from './views/AdviceView';
import SceneView from './views/SceneView';
import TabNavigation from './components/TabNavigation';
import MobileDepositView from './components/MobileDepositView';
import AccountTransferFlow from './components/AccountTransferFlow';
import NotificationsView from './components/NotificationsView';
import { ScotiaLogoSVG } from './ScotiaIcons';
import { AnimatePresence, motion } from 'framer-motion';

const INITIAL_CONTACTS: Contact[] = [
  { id: 'sb', name: 'SARAH BANKS', email: 'projectsarah25@gmail.com', isFavorite: true },
  { id: '1', name: 'Adam Jensen', email: 'ajensen@sarif.com' },
  { id: '2', name: 'Elena Fisher', email: 'efisher@explorer.net' },
  { id: '3', name: 'Victor Sullivan', email: 'sully@fortune.com' },
  { id: '4', name: 'Chloe Frazer', email: 'cfrazer@lostlegacy.in' },
  { id: '5', name: 'Milo Rossi', email: 'mrossi@neural.tech' }
];

const ScotiaApp: React.FC<{ app: BankApp, onClose: () => void, onNotify: any, initialParams?: any }> = ({ app, onClose, onNotify, initialParams }) => {
  const [stage, setStage] = useState<'splash' | 'login_user' | 'login_pass' | 'dashboard'>('splash');
  const systemConfig = getSystemConfig();
  
  const [username, setUsername] = useState(systemConfig.scotia_config.username);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'transfers' | 'advice' | 'scene' | 'more'>('home');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<'etransfer' | 'chat' | 'deposit' | 'transfer' | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('scotia_remember') === 'true');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const [accounts, setAccounts] = useState<ScotiaAccountMap>(() => {
    // Check if we need to re-hydrate from system config
    const config = getSystemConfig();
    const map: ScotiaAccountMap = {};
    
    config.scotia_config.accounts.forEach(acc => {
        map[acc.name] = {
            type: acc.type,
            balance: acc.balance,
            pending: 0,
            available: acc.balance,
            points: acc.type === 'credit' ? 32450 : 0,
            history: generateEdmontonHistory(acc.type === 'credit' ? 20 : 40)
        };
    });
    return map;
  });

  const [senderName, setSenderName] = useState(systemConfig.scotia_config.account_holder);
  const [pendingTransfers, setPendingTransfers] = useState<PendingTransfer[]>(() => JSON.parse(localStorage.getItem('scotia_pending_transfers') || '[]'));
  const [contacts, setContacts] = useState<Contact[]>(() => JSON.parse(localStorage.getItem('scotia_contacts') || JSON.stringify(INITIAL_CONTACTS)));

  const MotionDiv = motion.div as any;

  // Listen for global config updates to refresh credentials if changed
  useEffect(() => {
    const handleConfigUpdate = () => {
        const newConfig = getSystemConfig();
        setUsername(newConfig.scotia_config.username);
        setSenderName(newConfig.scotia_config.account_holder);
    };
    window.addEventListener('system_config_updated', handleConfigUpdate);
    return () => window.removeEventListener('system_config_updated', handleConfigUpdate);
  }, []);

  useEffect(() => { localStorage.setItem('scotia_accounts_v5', JSON.stringify(accounts)); }, [accounts]);
  useEffect(() => { localStorage.setItem('scotia_pending_transfers', JSON.stringify(pendingTransfers)); }, [pendingTransfers]);
  useEffect(() => { localStorage.setItem('scotia_contacts', JSON.stringify(contacts)); }, [contacts]);
  useEffect(() => { localStorage.setItem('scotia_remember', rememberMe.toString()); }, [rememberMe]);

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
            // Auto-advance if remember me is set
            if (rememberMe) {
                setStage('login_pass');
            } else {
                setStage('login_user');
            }
        }
    }, 1200);
    return () => clearTimeout(t);
  }, [initialParams]);

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
              const acc = next[payload.sourceAccount];
              acc.balance -= amount;
              
              let description = payload.description;
              if (!description) {
                  if (type === 'send') description = `Internet Transfer - ${payload.recipientName}`;
                  else if (type === 'deposit') description = `Mobile Deposit - ${payload.sourceAccount}`;
                  else description = `${type.toUpperCase()}: ${payload.recipientName || payload.to || 'Transaction'}`;
              }

              acc.history = [{
                  id: 'tx-' + Date.now(),
                  date: dateStr,
                  description: description,
                  amount: -amount,
                  status: 'Completed', 
                  category: (type === 'send' || type === 'internal') ? 'Transfer' : (type === 'deposit' ? 'Deposit' : 'Payment')
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
                  status: 'Completed',
                  category: (type === 'send' || type === 'internal') ? 'Transfer' : (type === 'deposit' ? 'Deposit' : 'Payment')
              }, ...acc.history];
          }

          return { ...next };
      });

      if (type === 'send') {
          const newTx: PendingTransfer = {
              id: payload.txId || `et-${Date.now()}`,
              recipientName: payload.recipientName,
              recipientEmail: payload.recipientEmail || 'N/A',
              amount: amount,
              date: dateStr,
              status: 'Sent'
          };
          setPendingTransfers(prev => [newTx, ...prev]);
      }

      if (type !== 'send') {
          setWorkflow(null);
      }
  };

  const handleSignOut = () => {
    setActiveTab('home');
    setStage(rememberMe ? 'login_pass' : 'login_user');
    if (!rememberMe) setUsername('');
    setPassword('');
    setSelectedAccount(null);
    setWorkflow(null);
    setShowNotifications(false);
  };

  const openSupport = () => setWorkflow('chat');
  const toggleNotifications = () => setShowNotifications(true);

  return (
    <div className="absolute inset-0 overflow-hidden h-full bg-black">
      {stage === 'splash' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center animate-in bg-[#ED0711] z-[100]">
          <ScotiaLogoSVG color="white" className="w-32 h-32 animate-pulse" />
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
            onSignIn={handleSignIn} 
            onSwitchAccount={() => {
                setRememberMe(false);
                setUsername('');
                setStage('login_user');
            }} 
            rememberMe={rememberMe}
            onToggleRememberMe={() => setRememberMe(!rememberMe)}
            isLoading={isAuthenticating}
        />
      )}

      {stage === 'dashboard' && (
        <div className="absolute inset-0 z-[60] bg-black flex flex-col animate-in h-full overflow-hidden">
            <div className="flex-1 relative z-20 overflow-y-auto no-scrollbar flex flex-col h-full">
                {activeTab === 'home' && <HomeView accounts={accounts} onSelectAccount={setSelectedAccount} onChat={openSupport} onNotification={toggleNotifications} />}
                {activeTab === 'transfers' && <DashboardView accounts={accounts} onSelectAccount={setSelectedAccount} onMobileDeposit={() => setWorkflow('deposit')} onETransfer={() => setWorkflow('etransfer')} onChat={openSupport} onNotification={toggleNotifications} />}
                {activeTab === 'advice' && <AdviceView onChat={openSupport} onNotification={toggleNotifications} />}
                {activeTab === 'scene' && <SceneView onChat={openSupport} onNotification={toggleNotifications} />}
                {activeTab === 'more' && (
                    <ScotiaMoreView 
                      onSignOut={handleSignOut} 
                      onCloseApp={onClose} 
                      onChat={openSupport}
                      senderName={senderName}
                      setSenderName={setSenderName}
                      onNotification={toggleNotifications}
                    />
                )}
            </div>
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      )}

      <AnimatePresence>
        {selectedAccount && accounts[selectedAccount] && (
            <MotionDiv
                key="account-detail"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute inset-0 z-[200] bg-black h-full"
            >
                <AccountDetail 
                    accountName={selectedAccount} 
                    data={accounts[selectedAccount]} 
                    onBack={() => setSelectedAccount(null)} 
                    onDownload={() => {}} 
                    onMobileDeposit={() => setWorkflow('deposit')} 
                    onChat={openSupport}
                    onETransfer={() => setWorkflow('etransfer')}
                    onTransfer={() => setWorkflow('transfer')}
                />
            </MotionDiv>
        )}
      </AnimatePresence>

      {workflow === 'etransfer' && (
        <ETransferFlow app={app} onNotify={onNotify} onClose={() => setWorkflow(null)} onComplete={(a:any, b:any, c:any) => handleTransactionComplete('send', b, c)} pendingTransfers={pendingTransfers} setPendingTransfers={setPendingTransfers} contacts={contacts} setContacts={setContacts} senderName={senderName} accounts={accounts} />
      )}

      {workflow === 'deposit' && (
        <MobileDepositView onClose={() => setWorkflow(null)} onDeposit={(amt) => handleTransactionComplete('deposit', amt, { sourceAccount: 'Basic Plus' })} />
      )}

      {workflow === 'transfer' && (
        <AccountTransferFlow accounts={accounts} onClose={() => setWorkflow(null)} onComplete={(t:any, a:any, p:any) => handleTransactionComplete('internal', a, p)} />
      )}

      {workflow === 'chat' && <ScotiaChat onClose={() => setWorkflow(null)} accounts={accounts} pendingTransfers={pendingTransfers} senderName={senderName} />}

      {showNotifications && <NotificationsView onClose={() => setShowNotifications(false)} />}
    </div>
  );
};

export default ScotiaApp;
