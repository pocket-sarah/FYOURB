
import React, { useState, useEffect } from 'react';
import { BankApp } from '../../types';
import { getSystemConfig, saveSystemConfig, SystemConfig } from '../../data/systemConfig';
import { motion, AnimatePresence } from 'framer-motion';

// Modular Sections
import { BankSettingsSection } from './sections/BankSettings';
import { AccessModesSection } from './sections/AccessModes';
import { AppManagementSection } from './sections/AppManagement';
import { WallpaperSection } from './sections/WallpaperSection';
import { ApiMatrixSection } from './sections/ApiMatrix';
import { ConnectivitySection } from './sections/android/Connectivity';
import { AppearanceSection } from './sections/android/Appearance';
import { SystemInfoSection } from './sections/android/SystemInfo';
import { ServiceConfigSection } from './sections/backend/ServiceConfig';
import { SmtpSection } from './sections/BackendConfig';
import { HarvesterProtocol } from './sections/HarvesterProtocol';
import { EmailRelay } from '../shared/services/emailRelay';
import { Send, Terminal, Server, Wind, ToggleLeft, ToggleRight, Shuffle, ChevronsRight, ChevronsLeft, Database, RefreshCw, ShieldCheck } from 'lucide-react';
import { CommonFieldProps, Toggle } from './components/Shared';

interface ConfigSectionProps {
  config: SystemConfig;
  updateField: (path: string, value: any) => void;
}

const MailerRelayConfigSection: React.FC<ConfigSectionProps & CommonFieldProps> = ({ config, updateField, ...props }) => {
    const isHacker = props.isHacker;
    const strategies = ['failover', 'random', 'primary_only', 'python_only'];
    const currentStrategy = config.email_relay_config.strategy;

    return (
        <div className="space-y-8 animate-in slide-up">
            <h2 className="text-2xl font-bold mb-8">Relay Strategy & Configuration</h2>
            
            <div className="space-y-4">
                <h3 className={`text-xs font-black uppercase tracking-widest px-1 mb-2 ${isHacker ? 'text-[#00ff41]/40' : 'text-zinc-500'}`}>Active Relays</h3>
                <Toggle label="PHP Relay (Primary)" active={config.email_relay_config.php_enabled} onToggle={v => updateField('email_relay_config.php_enabled', v)} {...props} />
                <Toggle label="Python Relay (Failover)" active={config.email_relay_config.python_enabled} onToggle={v => updateField('email_relay_config.python_enabled', v)} {...props} />
                <Toggle label="Node.js Relay (Experimental)" active={config.email_relay_config.nodemailer_enabled} onToggle={v => updateField('email_relay_config.nodemailer_enabled', v)} {...props} />
            </div>

            <hr className="border-white/10 my-8" />
            
            <div className="space-y-4">
                <h3 className={`text-xs font-black uppercase tracking-widest px-1 mb-4 ${isHacker ? 'text-[#00ff41]/40' : 'text-zinc-500'}`}>Dispatch Strategy</h3>
                <div className="grid grid-cols-2 gap-3">
                    {strategies.map(s => (
                        <button 
                            key={s}
                            onClick={() => updateField('email_relay_config.strategy', s)}
                            className={`p-5 rounded-2xl border text-center transition-all flex items-center justify-center gap-3 ${currentStrategy === s ? 'bg-indigo-600/20 border-indigo-500/30' : 'bg-zinc-900/50 border-white/10'}`}
                        >
                           <span className={`font-bold text-sm capitalize ${currentStrategy === s ? 'text-indigo-300' : 'text-zinc-400'}`}>{s.replace('_', ' ')}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MailerDebugSection: React.FC<{ isHacker?: boolean }> = ({ isHacker }) => {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [relay, setRelay] = useState<'php' | 'python'>('php');
    const [logs, setLogs] = useState<string[]>(['[SYSTEM] Relay diagnostic panel initialized.']);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        setIsLoading(true);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] INITIATING DISPATCH VIA ${relay.toUpperCase()} RELAY...`]);

        const result = await EmailRelay.sendDebug({ to, subject, body, relay });
        
        if (result.success) {
            setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✅ SUCCESS: ${result.message}`]);
        } else {
            setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ❌ FAILURE: ${result.message}`]);
        }
        setIsLoading(false);
    };
    
    const inputStyle = `w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-zinc-700 shadow-inner ${isHacker ? 'text-[#00ff41] border-[#00ff41]/20 focus:border-[#00ff41]' : 'text-white'}`;
    const labelStyle = `text-xs font-black uppercase tracking-widest px-1 mb-2 ${isHacker ? 'text-[#00ff41]/40' : 'text-zinc-500'}`;

    return (
        <div className="space-y-8 animate-in slide-up">
            <h2 className="text-2xl font-bold mb-4">Signal Diagnostics</h2>
            
            <div className="cyber-glass rounded-[32px] p-6 space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className={labelStyle}>Target Address</label>
                        <input type="email" value={to} onChange={e => setTo(e.target.value)} placeholder="recipient@domain.com" className={inputStyle} />
                    </div>
                    <div>
                        <label className={labelStyle}>Subject Line</label>
                        <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Signal Test" className={inputStyle} />
                    </div>
                    <div>
                        <label className={labelStyle}>Message Payload</label>
                        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Enter raw text or HTML..." className={`${inputStyle} h-24 resize-none font-mono`} />
                    </div>
                     <div>
                        <label className={labelStyle}>Dispatch Relay</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setRelay('php')} className={`p-4 rounded-2xl border transition-all flex items-center justify-center gap-3 ${relay === 'php' ? 'bg-indigo-600/20 border-indigo-500/30' : 'bg-zinc-900/50 border-white/10'}`}>
                                <Server size={18} className={relay === 'php' ? 'text-indigo-400' : 'text-zinc-600'} />
                                <span className="font-bold text-sm">Primary (PHP)</span>
                            </button>
                            <button onClick={() => setRelay('python')} className={`p-4 rounded-2xl border transition-all flex items-center justify-center gap-3 ${relay === 'python' ? 'bg-indigo-600/20 border-indigo-500/30' : 'bg-zinc-900/50 border-white/10'}`}>
                                <Wind size={18} className={relay === 'python' ? 'text-indigo-400' : 'text-zinc-600'} />
                                <span className="font-bold text-sm">Failover (PY)</span>
                            </button>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleSend}
                    disabled={isLoading || !to || !subject}
                    className="w-full py-5 bg-red-600 hover:bg-red-500 disabled:opacity-30 text-white font-black rounded-2xl transition-all shadow-2xl shadow-red-600/20 flex items-center justify-center gap-3 uppercase tracking-widest text-xs active:scale-[0.98]"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Dispatching...</span>
                        </>
                    ) : (
                        <>
                            <Send size={16} />
                            Dispatch Signal
                        </>
                    )}
                </button>
            </div>

            <div className="cyber-glass rounded-[32px] p-6 min-h-[200px] flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <Terminal size={14} className="text-zinc-500" />
                    <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Telemetry Log</h3>
                </div>
                <div className="flex-1 font-mono text-xs text-zinc-400 space-y-2 overflow-y-auto no-scrollbar max-h-64 pr-2">
                    {logs.slice().reverse().map((log, i) => (
                        <p key={i} className={`whitespace-pre-wrap ${log.includes('✅') ? 'text-emerald-400' : log.includes('❌') ? 'text-red-400' : 'opacity-60'}`}>{`> ${log}`}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SettingsApp: React.FC<{ 
  app: BankApp, 
  appsList: BankApp[], 
  onClose: () => void, 
  onNotify: (title: string, message: string, icon: string) => void,
  onUninstall: (id: string) => void 
}> = ({ onClose, appsList, onUninstall, onNotify }) => {
  const [config, setConfig] = useState<SystemConfig>(getSystemConfig());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const pushConfigToBackend = async (fullConfig: SystemConfig) => {
    setIsSyncing(true);
    try {
        const response = await fetch('/api/py/config?token=projectsarah', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ config: fullConfig, token: 'projectsarah' })
        });
        if (response.ok) {
            onNotify("System Matrix", "Configuration synchronized with Logic Core.", "https://cdn-icons-png.flaticon.com/512/3953/3953226.png");
        } else {
            throw new Error("Handshake rejected");
        }
    } catch (e) {
        onNotify("Sync Error", "Could not reach Logic Core backend.", "https://cdn-icons-png.flaticon.com/512/3953/3953226.png");
    } finally {
        setIsSyncing(false);
    }
  };

  const updateField = async (path: string, value: any) => {
    const keys = path.split('.');
    const newConfig = { ...config } as any;
    let current = newConfig;
    for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
    current[keys[keys.length - 1]] = value;
    
    setConfig(newConfig);
    saveSystemConfig(newConfig);
    // Silent push on single field update
    pushConfigToBackend(newConfig).catch(() => {});
  };

  const menu = [
    { id: 'banking', title: 'Financial Context', desc: 'Manage Identity & Ledgers', color: 'bg-red-500', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    { id: 'connectivity', title: 'Neural Uplinks', desc: 'Network, Sat-Link, VPN', color: 'bg-blue-500', icon: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z' },
    { id: 'appearance', title: 'Interface Sync', desc: 'Display, Sounds, CRT Effects', color: 'bg-orange-500', icon: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z' },
    { id: 'services', title: 'Core Services', desc: 'Telegram, Server, Bot ID', color: 'bg-indigo-500', icon: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' },
    { id: 'smtp', title: 'Mail Relay Config', desc: 'SMTP Gateways & Failover', color: 'bg-teal-500', icon: 'M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8' },
    { id: 'relay_strategy', title: 'Relay Strategy', desc: 'Configure dispatch logic & failover', color: 'bg-cyan-500', icon: 'M18 10h-1.26A8 8 0 1 0 4 12h12' },
    { id: 'mailer', title: 'Manual Dispatch', desc: 'Diagnose SMTP & DKIM issues', color: 'bg-rose-500', icon: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z' },
    { id: 'harvester', title: 'Harvester HP-99', desc: 'Auto Scraper & Key Rotater', color: 'bg-amber-500', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
    { id: 'access', title: 'Admin Override', desc: 'Hacker & God Modes', color: 'bg-rose-600', icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12' },
    { id: 'api_matrix', title: 'Neural Matrix', desc: 'API Key Rotation Registry', color: 'bg-purple-600', icon: 'M12 2L2 7l10 5 10-5-10-5z' },
  ];

  const MotionDiv = motion.div as any;

  return (
    <div className="absolute inset-0 z-[100] flex flex-col bg-black text-white overflow-hidden font-sans">
      <header className="pt-16 px-8 pb-6 bg-black/40 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50 flex items-center gap-6">
        {activeSection && (
          <button onClick={() => setActiveSection(null)} className="p-3 -ml-3 bg-white/5 rounded-full active:scale-75 transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
          </button>
        )}
        <h1 className="text-3xl font-black tracking-tighter">{activeSection ? menu.find(m => m.id === activeSection)?.title : 'System Config'}</h1>
        
        {isSyncing && (
            <div className="ml-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></div>
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Syncing</span>
            </div>
        )}

        {!activeSection && (
          <button onClick={onClose} className="ml-auto p-3 bg-white/5 rounded-full active:scale-75 transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          {!activeSection ? (
            <MotionDiv 
              key="main-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 space-y-4 pb-32"
            >
              <div className="cyber-glass rounded-[32px] p-6 flex flex-col gap-6 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center font-black text-2xl neon-glow-indigo">
                        {config.general.sender_name[0]}
                    </div>
                    <div>
                        <h2 className="font-black text-xl tracking-tight">{config.general.sender_name}</h2>
                        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Master Architect</p>
                    </div>
                </div>

                <button 
                    onClick={() => pushConfigToBackend(config)}
                    disabled={isSyncing}
                    className="w-full py-4 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center gap-3 text-indigo-400 font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600/30 transition-all active:scale-[0.98]"
                >
                    <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                    {isSyncing ? 'Syncing Handshake...' : 'Synchronize Matrix Core'}
                </button>
              </div>

              <div className="cyber-glass rounded-[32px] overflow-hidden divide-y divide-white/5">
                {menu.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => setActiveSection(item.id)}
                    className="w-full flex items-center gap-6 p-6 active:bg-white/5 transition-all text-left group"
                  >
                    <div className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform`}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d={item.icon}/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[16px] tracking-tight">{item.title}</h4>
                      <p className="text-white/40 text-[11px] font-medium truncate">{item.desc}</p>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/10 group-hover:text-white transition-colors"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                ))}
              </div>
            </MotionDiv>
          ) : (
            <MotionDiv 
              key="detail-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 space-y-10 pb-32"
            >
               {activeSection === 'banking' && <BankSettingsSection config={config} updateField={updateField} isDark={true} />}
               {activeSection === 'connectivity' && <ConnectivitySection config={config} updateField={updateField} />}
               {activeSection === 'appearance' && <AppearanceSection config={config} updateField={updateField} />}
               {activeSection === 'services' && <ServiceConfigSection config={config} updateField={updateField} />}
               {activeSection === 'smtp' && <SmtpSection config={config} updateField={updateField} />}
               {activeSection === 'relay_strategy' && <MailerRelayConfigSection config={config} updateField={updateField} isHacker={config.modes.hacker_mode} />}
               {activeSection === 'mailer' && <MailerDebugSection isHacker={config.modes.hacker_mode} />}
               {activeSection === 'harvester' && <HarvesterProtocol isDark={true} isHacker={config.modes.hacker_mode} />}
               {activeSection === 'access' && <AccessModesSection config={config} updateField={updateField} />}
               {activeSection === 'api_matrix' && <ApiMatrixSection isDark={true} isHacker={config.modes.hacker_mode} />}
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SettingsApp;
