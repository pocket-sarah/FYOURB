import React, { useState, useEffect } from 'react';
import { BankApp } from '../../types';
import { useBankingState } from '../../hooks/useBankingState';
import { TDLogoSVG } from './TDIcons';
import { getSystemConfig } from '../../data/systemConfig'; 
import { ScotiaAccountMap, ScotiaAccount } from '../scotia/types';

// Modular Components
import LoginView from './views/LoginView';
import HomeView from './views/HomeView';
import AccountDetail from './components/AccountDetail';
import ETransferFlow from './components/ETransferFlow';
import BillPaymentView from './components/BillPaymentView';
import MobileDepositView from './components/MobileDepositView';
import TransferInternalFlow from './components/TransferInternalFlow';
import TabNavigation from './components/TabNavigation';
import TDChat from './components/TDChat';
import MoveMoneyView from './views/MoveMoneyView';
import RewardsView from './views/RewardsView';
import MoreView from './views/MoreView';

// Define a more specific payload interface for handleTransactionComplete
interface TransactionPayload {
    recipientName?: string;
    recipientEmail?: string;
    sourceAccount?: string;
    targetAccount?: string;
    txId?: string;
    description?: string;
    payee?: string;
    message?: string;
}

const TDApp: React.FC<{ app: BankApp, onClose: () => void, onNotify: any, initialParams?: any }> = ({ 
    app, onClose, onNotify, initialParams 
}) => {
  const [stage, setStage] = useState<'splash' | 'login' | 'dashboard'>('splash');
  const [activeTab, setActiveTab] = useState<'home' | 'accounts' | 'move' | 'rewards' | 'more'>('home');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  // Add 'chat' to the workflow state type
  const [workflow, setWorkflow] = useState<'etransfer' | 'billpay' | 'deposit' | 'transfer' | 'chat' | null>(null);
  
  // Hydrate initial accounts from SystemConfig
  const systemConfig = getSystemConfig();
  const initialAccounts: ScotiaAccountMap = {};
  systemConfig.td_config.accounts.forEach(acc => {
      initialAccounts[acc.name] = {
          type: acc.type,
          balance: acc.balance,
          pending: 0,
          available: acc.balance,
          points: acc.type === 'credit' ? 42450 : 0,
          history: []
      };
  });

  const { accounts, performTransaction } = useBankingState('td_mobile_high_fidelity', initialAccounts);
  
  const [pendingTransfers, setPendingTransfers] = useState<any[]>(() => {
      const saved = localStorage.getItem('td_pending_etransfers');
      return saved ? JSON.parse(saved) : [];
  });

  // State for username to pass to login view
  const [username] = useState(systemConfig.td_config.username);
  const [senderName] = useState(systemConfig.general.sender_name);

  useEffect(() => {
      localStorage.setItem('td_pending_etransfers', JSON.stringify(pendingTransfers));
  }, [pendingTransfers]);

  useEffect(() => {
    const t = setTimeout(() => {
        if (initialParams?.action === 'deposit') {
            setStage('dashboard');
            setWorkflow('deposit');
        } else if (initialParams?.selectedAccount) {
            setStage('dashboard');
            setSelectedAccount(initialParams.selectedAccount);
        } else {
            setStage('login');
        }
    }, 1200);
    return () => clearTimeout(t);
  }, [initialParams]);

  const handleTransactionComplete = (type: 'send' | 'bill' | 'deposit' | 'internal', amount: number, payload: TransactionPayload) => {
      performTransaction(type, amount, payload);
      if (type === 'send') {
          const newPending = {
              id: payload.txId || `TD-${Date.now()}`,
              recipientName: payload.recipientName,
              recipientEmail: payload.recipientEmail,
              amount: amount,
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              status: 'Sent',
              message: payload.message,
              sourceAccount: payload.sourceAccount
          };
          setPendingTransfers(prev => [newPending, ...prev]);
      }
  };

  const handleSignOut = () => {
    setActiveTab('home');
    setStage('login');
    setSelectedAccount(null);
    setWorkflow(null);
  };

  if (stage === 'splash') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#008A00] z-[1000] animate-in fade-in duration-500">
        <TDLogoSVG size={120} className="animate-pulse drop-shadow-2xl" />
      </div>
    );
  }

  if (stage === 'login') {
    return <LoginView onSignIn={() => setStage('dashboard')} initialUsername={username} />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden h-full bg-[#f4f7f6] text-[#333] flex flex-col font-sans">
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {activeTab === 'home' && (
            <HomeView 
                accounts={accounts} 
                onSelectAccount={setSelectedAccount} 
                onETransfer={() => setWorkflow('etransfer')}
                onBillPay={() => setWorkflow('billpay')}
                onDeposit={() => setWorkflow('deposit')}
                onTransferInternal={() => setWorkflow('transfer')}
            />
        )}
        
        {activeTab === 'accounts' && (
             <div className="flex flex-col h-full bg-[#f4f7f6]">
                <div className="bg-[#008A00] pt-14 pb-8 px-6 text-white shrink-0">
                    <h2 className="text-2xl font-bold">Accounts</h2>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                   {(Object.entries(accounts) as [string, ScotiaAccount][]).map(([name, acc]) => (
                       <button key={name} onClick={() => setSelectedAccount(name)} className="w-full p-6 border-b border-gray-100 flex justify-between items-center bg-white active:bg-gray-50">
                           <div className="text-left">
                               <p className="font-bold text-gray-800">{name}</p>
                               <p className="text-xs text-gray-400 tracking-widest uppercase">....1234</p>
                           </div>
                           <p className="font-black text-lg text-right">${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                       </button>
                   ))}
                </div>
             </div>
        )}

        {activeTab === 'move' && (
            <MoveMoneyView 
                onAction={(id) => {
                    if (id === 'etransfer') setWorkflow('etransfer');
                    if (id === 'transfer') setWorkflow('transfer');
                    if (id === 'billpay') setWorkflow('billpay');
                    if (id === 'deposit') setWorkflow('deposit');
                }}
            />
        )}

        {activeTab === 'rewards' && (
            <RewardsView points={accounts['TD First Class Travel Visa Infinite* Card']?.points || 0} />
        )}

        {activeTab === 'more' && (
            <MoreView 
                onSignOut={handleSignOut}
                onClose={onClose} 
                onChat={() => setWorkflow('chat')}
            />
        )}
      </div>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {selectedAccount && accounts[selectedAccount] && (
        <AccountDetail accountName={selectedAccount} data={accounts[selectedAccount]} onBack={() => setSelectedAccount(null)} />
      )}

      {workflow === 'etransfer' && (
        <ETransferFlow 
            app={app} 
            onClose={() => setWorkflow(null)} 
            onNotify={onNotify} 
            onComplete={(t, a, p) => handleTransactionComplete(t, a, p)} 
            accounts={accounts}
            pendingTransfers={pendingTransfers}
            setPendingTransfers={setPendingTransfers}
            senderName={senderName} 
        />
      )}
      {workflow === 'billpay' && <BillPaymentView accounts={accounts} onPay={(amt, p, f) => handleTransactionComplete('bill', amt, { payee: p, sourceAccount: f })} onBack={() => setWorkflow(null)} />}
      {workflow === 'deposit' && <MobileDepositView onClose={() => setWorkflow(null)} onDeposit={(amt) => handleTransactionComplete('deposit', amt, { sourceAccount: 'Beyond Checking' })} />}
      {workflow === 'transfer' && <TransferInternalFlow accounts={accounts} onClose={() => setWorkflow(null)} onComplete={(t, a, p) => handleTransactionComplete('internal', a, p)} />}
      {workflow === 'chat' && <TDChat onClose={() => setWorkflow(null)} accountData={accounts} />}
    </div>
  );
};

export default TDApp;