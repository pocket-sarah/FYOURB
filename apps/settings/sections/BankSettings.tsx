import React, { useState } from 'react';
import { SystemConfig } from '../../../data/systemConfig.ts';
import { InputField, CommonFieldProps } from '../components/Shared.tsx';

interface BankSettingsProps extends CommonFieldProps {
  config: SystemConfig;
  updateField: (path: string, value: any) => void;
  isDark: boolean;
}

export const BankSettingsSection: React.FC<BankSettingsProps> = ({ config, updateField, isDark, ...props }) => {
    const [activeTab, setActiveTab] = useState<'scotia' | 'td'>('scotia');
    const activeConfig = activeTab === 'scotia' ? config.scotia_config : config.td_config;
    const configPath = activeTab === 'scotia' ? 'scotia_config' : 'td_config';

    const handleAccountUpdate = (idx: number, field: string, val: any) => {
        const newAccounts = [...activeConfig.accounts];
        newAccounts[idx] = { ...newAccounts[idx], [field]: val };
        updateField(`${configPath}.accounts`, newAccounts);
    };

    return (
        <div className="space-y-6 animate-in slide-up">
            <h2 className="text-2xl font-bold mb-4">Banking Protocols</h2>
            
            <div className="flex p-1 bg-zinc-900 rounded-2xl mb-8 border border-white/10">
                <button 
                    onClick={() => setActiveTab('scotia')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'scotia' ? 'bg-[#ED0711] text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                >
                    Scotiabank
                </button>
                <button 
                    onClick={() => setActiveTab('td')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'td' ? 'bg-[#008A00] text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                >
                    TD Canada Trust
                </button>
            </div>

            <div className={`p-6 rounded-[28px] border border-transparent ${isDark ? 'bg-[#1c1c1e]' : 'bg-white shadow-sm'}`}>
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6">Digital Identity</h3>
                <div className="space-y-4">
                    <InputField label="Username" value={activeConfig.username} onChange={v => updateField(`${configPath}.username`, v)} {...props} />
                    <InputField label="Account Holder" value={activeConfig.account_holder} onChange={v => updateField(`${configPath}.account_holder`, v)} {...props} />
                </div>
            </div>

            <div className={`p-6 rounded-[28px] border border-transparent ${isDark ? 'bg-[#1c1c1e]' : 'bg-white shadow-sm'}`}>
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6">Asset Allocation</h3>
                <div className="space-y-6">
                    {activeConfig.accounts.map((acc, idx) => (
                        <div key={idx} className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-black uppercase text-zinc-500">{acc.name}</span>
                                <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold uppercase">{acc.type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-zinc-600">$</span>
                                <input 
                                    type="number" 
                                    value={acc.balance} 
                                    onChange={e => handleAccountUpdate(idx, 'balance', parseFloat(e.target.value) || 0)}
                                    className="bg-transparent text-white font-black text-2xl outline-none w-full"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};