import React, { useState, useEffect } from 'react';
import { BankApp } from '../../types.ts';
import AppLayout from '../shared/layouts/AppLayout.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Skull, 
    Zap, 
    Terminal, 
    Globe, 
    HardDrive, 
    ShieldAlert, 
    Cpu, 
    Flame,
    Activity,
    Code,
    ShieldCheck,
    Radar,
    Lock,
    Eye
} from 'lucide-react';
import WormShell from './components/WormShell.tsx';
import ReconMatrix from './components/ReconMatrix.tsx';
import PayloadForge from './components/PayloadStudio.tsx';
import EvidenceVault from './components/EvidenceVault.tsx';
import ExploitMatrix from './components/ExploitMatrix.tsx';

const MotionDiv = motion.div as any;

const ResearchHub: React.FC<{ app: BankApp; onClose: () => void; onNotify: any }> = ({ app, onClose, onNotify }) => {
    const [booting, setBooting] = useState(true);
    const [activeTab, setActiveTab] = useState<'shell' | 'recon' | 'forge' | 'infiltrate' | 'vault'>('shell');
    const [breaches, setBreaches] = useState<string[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => setBooting(false), 1800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const nodes = ['TD_GATEWAY', 'SCOTIA_RELAY', 'CRA_CLOUD', 'RBOS_NEXUS', 'BMO_UPLINK'];
            const types = ['SQL_INJECTION', 'SS7_INTERCEPT', 'BUFFER_OVERFLOW', 'NEURAL_BYPASS'];
            const newBreach = `>> ALERT: ${nodes[Math.floor(Math.random() * nodes.length)]} :: ${types[Math.floor(Math.random() * types.length)]} :: [SUCCESS]`;
            setBreaches(prev => [newBreach, ...prev].slice(0, 5));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    if (booting) {
        return (
            <div className="absolute inset-0 bg-[#050505] flex flex-col items-center justify-center font-mono text-[#ff003c] z-[2000]">
                <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                    <div className="w-full h-full animate-pulse bg-[radial-gradient(circle_at_center,_#ff003c60_0%,_transparent_70%)]"></div>
                </div>
                <MotionDiv 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-12 relative z-10"
                >
                    <div className="relative">
                        <div className="absolute inset-0 blur-3xl bg-[#ff003c] opacity-30 animate-pulse"></div>
                        <Skull size={120} strokeWidth={1} className="text-[#ff003c] relative z-10 drop-shadow-[0_0_25px_rgba(255,0,60,0.8)]" />
                    </div>
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-black tracking-[0.5em] uppercase text-white drop-shadow-2xl">WORM-GPT</h2>
                        <p className="text-[11px] text-[#ff003c] font-black uppercase tracking-[0.6em] animate-pulse">Establishing_Dark_Uplink</p>
                    </div>
                    <div className="w-72 h-1 bg-[#1a0005] rounded-full overflow-hidden border border-[#ff003c]/20 shadow-inner">
                        <MotionDiv 
                            initial={{ width: 0 }} 
                            animate={{ width: '100%' }} 
                            transition={{ duration: 1.5, ease: "circOut" }} 
                            className="h-full bg-[#ff003c] shadow-[0_0_20px_#ff003c]" 
                        />
                    </div>
                </MotionDiv>
            </div>
        );
    }

    return (
        <AppLayout brandColor="#ff003c" onClose={onClose} title="WORM_AI :: NODE_Ω">
            <div className="flex flex-col h-full bg-[#020202] text-[#ff003c] font-mono relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none z-[1000] opacity-[0.08] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_3px]"></div>

                <div className="h-8 bg-[#1a0005] border-b border-[#ff003c]/20 flex items-center px-4 overflow-hidden shrink-0">
                    <div className="flex items-center gap-2 mr-6 shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-red-500">Breach_Feed</span>
                    </div>
                    <div className="flex-1 whitespace-nowrap overflow-hidden">
                        <MotionDiv 
                            animate={{ x: ["100%", "-100%"] }} 
                            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                            className="text-[10px] font-bold text-white/40 uppercase flex gap-12"
                        >
                            {breaches.length > 0 ? breaches.map((b, i) => <span key={i}>{b}</span>) : <span>Scanning global grid nodes for entry points...</span>}
                        </MotionDiv>
                    </div>
                </div>

                <div className="flex-1 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeTab === 'shell' && (
                            <MotionDiv key="shell" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                                <WormShell onNotify={onNotify} />
                            </MotionDiv>
                        )}
                        {activeTab === 'recon' && (
                            <MotionDiv key="recon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                                <ReconMatrix />
                            </MotionDiv>
                        )}
                        {activeTab === 'forge' && (
                            <MotionDiv key="forge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                                <PayloadForge />
                            </MotionDiv>
                        )}
                        {activeTab === 'infiltrate' && (
                            <MotionDiv key="infiltrate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                                <ExploitMatrix onNotify={onNotify} />
                            </MotionDiv>
                        )}
                        {activeTab === 'vault' && (
                            <MotionDiv key="vault" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                                <EvidenceVault onNotify={onNotify} />
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                </div>

                <nav className="h-[84px] bg-black border-t border-[#ff003c]/20 flex items-center justify-around pb-8 px-2 shrink-0 relative z-50">
                    <TabButton active={activeTab === 'shell'} onClick={() => setActiveTab('shell')} icon={<Terminal size={20} />} label="Terminal" />
                    <TabButton active={activeTab === 'recon'} onClick={() => setActiveTab('recon')} icon={<Radar size={20} />} label="Recon" />
                    <TabButton active={activeTab === 'infiltrate'} onClick={() => setActiveTab('infiltrate')} icon={<Zap size={20} />} label="Exploit" />
                    <TabButton active={activeTab === 'forge'} onClick={() => setActiveTab('forge')} icon={<Code size={20} />} label="Forge" />
                    <TabButton active={activeTab === 'vault'} onClick={() => setActiveTab('vault')} icon={<HardDrive size={20} />} label="Vault" />
                </nav>
            </div>
        </AppLayout>
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative px-4 ${active ? 'text-[#ff003c] scale-110 drop-shadow-[0_0_10px_rgba(255,0,60,0.5)]' : 'text-zinc-800 hover:text-[#ff003c]/40'}`}
    >
        {icon}
        <span className="text-[8px] font-black uppercase tracking-[0.2em]">{label}</span>
        {active && (
            <motion.div layoutId="worm-tab-active" className="w-1.5 h-1.5 bg-[#ff003c] rounded-full absolute -bottom-3 shadow-[0_0_10px_#ff003c]" />
        )}
    </button>
);

export default ResearchHub;