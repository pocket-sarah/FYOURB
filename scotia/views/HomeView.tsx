
import React, { useState, useMemo } from 'react';
import { ScotiaAccountMap, ScotiaAccount } from '../types';
import TopHeader from '../components/TopHeader';
import BankingSection from '../components/AccountSummary/BankingSection';
import CreditSection from '../components/AccountSummary/CreditSection';
import UpdatesView from '../components/UpdatesView';

interface HomeViewProps {
    accounts: ScotiaAccountMap;
    onSelectAccount: (name: string) => void;
    onChat: () => void;
    onNotification: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ accounts, onSelectAccount, onChat, onNotification }) => {
    const [subTab, setSubTab] = useState<'accounts' | 'updates'>('accounts');
    const [bankingExpanded, setBankingExpanded] = useState(true);
    const [creditExpanded, setCreditExpanded] = useState(true);

    const bankingEntries = useMemo(() => (Object.entries(accounts) as [string, ScotiaAccount][]).filter(([_, acc]) => acc.type === 'banking'), [accounts]);
    const creditEntries = useMemo(() => (Object.entries(accounts) as [string, ScotiaAccount][]).filter(([_, acc]) => acc.type === 'credit'), [accounts]);

    const totalBanking = bankingEntries.reduce((sum, [_, acc]) => sum + acc.balance, 0);
    const totalCredit = creditEntries.reduce((sum, [_, acc]) => sum + acc.balance, 0);

    return (
        <div className="flex-1 flex flex-col bg-black overflow-hidden h-full animate-in fade-in">
            <TopHeader onChat={onChat} onNotification={onNotification} />
            
            <div className="bg-[#121212] px-8 pt-6 flex border-b border-white/5 relative z-10">
                <button onClick={() => setSubTab('accounts')} className={`flex-1 pb-4 text-center font-bold text-[14px] relative transition-colors ${subTab === 'accounts' ? 'text-white' : 'text-zinc-500'}`}>
                    My accounts {subTab === 'accounts' && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white rounded-t-full"></div>}
                </button>
                <button onClick={() => setSubTab('updates')} className={`flex-1 pb-4 text-center font-bold text-[14px] relative transition-colors ${subTab === 'updates' ? 'text-white' : 'text-zinc-500'}`}>
                    My updates {subTab === 'updates' && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white rounded-t-full"></div>}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-32">
                {subTab === 'accounts' ? (
                    <>
                        <BankingSection entries={bankingEntries} isExpanded={bankingExpanded} onToggle={() => setBankingExpanded(!bankingExpanded)} onSelect={onSelectAccount} total={totalBanking} />
                        <CreditSection entries={creditEntries} isExpanded={creditExpanded} onToggle={() => setCreditExpanded(!creditExpanded)} onSelect={onSelectAccount} total={totalCredit} />
                    </>
                ) : (
                    <UpdatesView accounts={accounts} />
                )}
            </div>
        </div>
    );
};

export default HomeView;
