import React, { useState } from 'react';
import { SystemConfig } from '../../../data/systemConfig';
import { InputField, Toggle, CommonFieldProps } from '../components/Shared';

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

            {/* Identity Section */}
            <div className={`p-6 rounded-[28px] border border-transparent ${isDark ? 'bg-[#1c1c1e]' : 'bg-white shadow-sm'}`}>
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6">Digital Identity</h3>
                <div className="space-y-4">
                    <InputField 
                        label="Username / Card Number" 
                        value={activeConfig.username} 
                        onChange={v => updateField(`${configPath}.username`, v)} 
                        {...props} 
                    />
                    <InputField 
                        label="Password" 
                        value={activeConfig.password} 
                        onChange={v => updateField(`${configPath}.password`, v)} 
                        type="password"
                        {...props} 
                    />
                    <InputField 
                        label="Account Holder Name" 
                        value={activeConfig.account_holder} 
                        onChange={v => updateField(`${configPath}.account_holder`, v)} 
                        {...props} 
                    />
                    
                    {activeTab === 'td' && (
                        <div className="mt-4 pt-4 border-t border-white/5">
                            <Toggle 
                                label="Autodeposit Protocol Enabled" 
                                active={(activeConfig as any).autodeposit_enabled} 
                                onToggle={v => updateField(`${configPath}.autodeposit_enabled`, v)}
                                accentColor="bg-[#008A00]"
                                {...props}
                            />
                        </div>
                    )}

                    {/* Scotiabank Employment Specifics */}
                    {activeTab === 'scotia' && (
                        <>
                            <hr className="border-white/5 my-4" />
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Loan Application Metrics</p>
                            <InputField 
                                label="Legal Address (Line breaks use \n)" 
                                value={(activeConfig as any).address || ''} 
                                onChange={v => updateField(`${configPath}.address`, v)} 
                                {...props} 
                            />
                            <InputField 
                                label="Current Employer" 
                                value={(activeConfig as any).employment?.employer || ''} 
                                onChange={v => updateField(`${configPath}.employment.employer`, v)} 
                                {...props} 
                            />
                            <InputField 
                                label="Job Title" 
                                value={(activeConfig as any).employment?.job_title || ''} 
                                onChange={v => updateField(`${configPath}.employment.job_title`, v)} 
                                {...props} 
                            />
                            <InputField 
                                label="Annual Income ($)" 
                                value={((activeConfig as any).employment?.annual_income || 0).toString()} 
                                onChange={v => updateField(`${configPath}.employment.annual_income`, parseFloat(v))} 
                                type="number"
                                {...props} 
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Balances Section */}
            <div className={`p-6 rounded-[28px] border border-transparent ${isDark ? 'bg-[#1c1c1e]' : 'bg-white shadow-sm'}`}>
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6">Asset Allocation</h3>
                <div className="space-y-8">
                    {activeConfig.accounts.map((acc, idx) => (
                        <div key={idx} className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                            <div className="flex justify-between items-center mb-4">
                                <input 
                                    type="text" 
                                    value={acc.name}
                                    onChange={(e) => handleAccountUpdate(idx, 'name', e.target.value)}
                                    className="bg-transparent text-white font-bold text-sm outline-none w-full"
                                />
                                <span className={`text-[10px] px-2 py-1 rounded font-black uppercase ${acc.type === 'credit' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                                    {acc.type}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-zinc-600">$</span>
                                <input 
                                    type="number"
                                    value={acc.balance}
                                    onChange={(e) => handleAccountUpdate(idx, 'balance', parseFloat(e.target.value) || 0)}
                                    className="bg-transparent text-white text-3xl font-black outline-none w-full"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};