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
import { Send, Terminal, Server, RefreshCw, Database, Cpu, Zap, ShieldAlert, Wifi, HardDrive } from 'lucide-react';
import { CommonFieldProps, Toggle, InputField } from './components/Shared';

const MotionDiv = motion.div as any;

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
        const response = await fetch('/api/status'); // Verify link first
        if (response.ok) {
            onNotify("System Matrix", "Neural Handshake Verified.", "https://cdn-icons-png.flaticon.com/512/3953/3953226.png");
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
  };

  const menu = [
    { id: 'banking', title: 'Financial Identity', desc: 'Identity & Transactional Rules', color: 'bg-red-500', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    { id: 'connectivity', title: 'Neural Uplinks', desc: 'Sat-Link, VPN & Grid Logic', color: 'bg-blue-500', icon: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z' },
    { id: 'services', title: 'Core Modules', desc: 'Telegram, Mailer & Bot IDs', color: 'bg-indigo-500', icon: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' },
    { id: 'smtp', title: 'Relay Protocol', desc: 'SMTP Gateways & Failover', color: 'bg-teal-500', icon: 'M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8' },
    { id: 'harvester', title: 'Harvester Node', desc: 'Crawl, Scrape & Inject', color: 'bg-amber-500', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
    { id: 'api_matrix', title: 'Neural Matrix', desc: 'Global Key Pool & Health', color: 'bg-purple-600', icon: 'M12 2L2 7l10 5 10-5-10-5z' },
    { id: 'access', title: 'Override', desc: 'System Privileges', color: 'bg-rose-600', icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12' },
  ];

  return (
    <div className="absolute inset-0 z-[100] flex flex-col bg-black text-white overflow-hidden font-sans">
      <header className="pt-16 px-8 pb-6 bg-black/40 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50 flex items-center gap-6">
        {activeSection && (
          <button onClick={() => setActiveSection(null)} className="p-3 -ml-3 bg-white/5 rounded-full active:scale-75 transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
          </button>
        )}
        <h1 className="text-3xl font-black tracking-tighter">{activeSection ? menu.find(m => m.id === activeSection)?.title : 'System Protocol'}</h1>
        {!activeSection && (
          <button onClick={onClose} className="ml-auto p-3 bg-white/5 rounded-full active:scale-75 transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          {!activeSection ? (
            <MotionDiv key="main-list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-6 space-y-4 pb-32">
              <div className="cyber-glass rounded-[32px] p-6 flex flex-col gap-6 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center font-black text-2xl">
                        {config.general.sender_name[0]}
                    </div>
                    <div>
                        <h2 className="font-black text-xl tracking-tight">{config.general.sender_name}</h2>
                        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Neural Master</p>
                    </div>
                </div>
                <button onClick={() => pushConfigToBackend(config)} className="w-full py-4 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center gap-3 text-indigo-400 font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600/30 transition-all">
                    <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                    Sync Matrix Core
                </button>
              </div>

              <div className="cyber-glass rounded-[32px] overflow-hidden divide-y divide-white/5">
                {menu.map((item) => (
                  <button key={item.id} onClick={() => setActiveSection(item.id)} className="w-full flex items-center gap-6 p-6 active:bg-white/5 transition-all text-left group">
                    <div className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform`}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d={item.icon}/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[16px] tracking-tight">{item.title}</h4>
                      <p className="text-white/40 text-[11px] font-medium truncate">{item.desc}</p>
                    </div>
                    <ChevronRight className="text-white/10 group-hover:text-white" size={18} />
                  </button>
                ))}
              </div>
            </MotionDiv>
          ) : (
            <MotionDiv key="detail-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 space-y-10 pb-32">
               {activeSection === 'banking' && <BankSettingsSection config={config} updateField={updateField} isDark={true} />}
               {activeSection === 'connectivity' && <ConnectivitySection config={config} updateField={updateField} />}
               {activeSection === 'services' && <ServiceConfigSection config={config} updateField={updateField} />}
               {activeSection === 'smtp' && <SmtpSection config={config} updateField={updateField} />}
               {activeSection === 'harvester' && <HarvesterProtocol config={config} updateField={updateField} isDark={true} isHacker={config.modes.hacker_mode} />}
               {activeSection === 'api_matrix' && <ApiMatrixSection isDark={true} isHacker={config.modes.hacker_mode} />}
               {activeSection === 'access' && <AccessModesSection config={config} updateField={updateField} />}
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ChevronRight = ({ className, size }: { className?: string, size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>;

export default SettingsApp;
