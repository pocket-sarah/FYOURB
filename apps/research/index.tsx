
import React, { useState, useEffect } from 'react';
import { BankApp } from '../../types';
import AppLayout from '../shared/layouts/AppLayout';
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
    ShieldCheck
} from 'lucide-react';
import WormShell from './components/WormShell';
import ReconMatrix from './components/ReconMatrix';
import PayloadForge from './components/PayloadStudio';
import EvidenceVault from './components/EvidenceVault';

const MotionDiv = motion.div as any;

const ResearchHub: React.FC<{ app: BankApp; onClose: () => void; onNotify: any }> = ({ app, onClose, onNotify }) => {
    const [booting, setBooting] = useState(true);
    const [activeTab, setActiveTab] = useState<'shell' | 'recon' | 'forge' | 'vault'>('shell');
    const [systemLoad, setSystemLoad] = useState(42.5);

    useEffect(() => {
        const timer = setTimeout(() => setBooting(false), 2200);
        return () => clearTimeout(timer);
    }, []);

    if (booting) {
        return (
            <div className="absolute inset-0 bg-black flex flex-col items-center justify-center font-mono text-[#ff003c] z-[2000]">
                <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                    <div className="w-full h-full animate-pulse bg-[radial-gradient(circle_at_center,_#ff003c30_0%,_transparent_70%)]"></div>
                </div>
                <MotionDiv 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-10 relative z-10"
                >
                    <div className="relative">
                        <div className="absolute inset-0 blur-2xl bg-[#ff003c] opacity-20 animate-pulse"></div>
                        <Skull size={100} strokeWidth={1} className="text-[#ff003c] relative z-10" />
                    </div>
                    <div className="text-center space-y-3">
                        <h2 className="text-3xl font-black tracking-[0.4em] uppercase glitch-text">WORM-GPT</h2>
                        <p className="text-[10px] opacity-40 uppercase tracking-[0.6em]">Secure_Core_V9_Init</p>
                    </div>
                    <div className="w-64 h-1 bg-[#1a0005] rounded-full overflow-hidden border border-[#ff003c]/20">
                        <MotionDiv 
                            initial={{ width: 0 }} 
                            animate={{ width: '100%' }} 
                            transition={{ duration: 1.8, ease: "circOut" }} 
                            className="h-full bg-[#ff003c] shadow-[0_0_15px_#ff003c]" 
                        />
                    </div>
                </MotionDiv>
            </div>
        );
    }

    return (
        <AppLayout brandColor="#ff003c" onClose={onClose} title="RESEARCH NODE">
            <div className={`flex flex-col h-full bg-[#050505] text-[#ff003c] font-mono relative overflow-hidden`}>
                {/* CRT Overlay Effect */}
                <div className="absolute inset-0 pointer-events-none z-[1000] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_2px]"></div>

                {/* Main Viewport */}
                <div className="flex-1 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeTab === 'shell' && (
                            <MotionDiv key="shell" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="h-full">
                                <WormShell onNotify={onNotify} />
                            </MotionDiv>
                        )}
                        {activeTab === 'recon' && (
                            <MotionDiv key="recon" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-full">
                                <ReconMatrix />
                            </MotionDiv>
                        )}
                        {activeTab === 'forge' && (
                            <MotionDiv key="forge" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="h-full">
                                <PayloadForge />
                            </MotionDiv>
                        )}
                        {activeTab === 'vault' && (
                            <MotionDiv key="vault" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                                <EvidenceVault onNotify={onNotify} />
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                </div>

                {/* Tactical Bottom Navigation */}
                <nav className="h-[84px] bg-black border-t border-[#ff003c]/20 flex items-center justify-around pb-8 px-4 shrink-0 relative z-50 shadow-[0_-10px_40px_rgba(255,0,60,0.1)]">
                    <TabButton 
                        active={activeTab === 'shell'} 
                        onClick={() => setActiveTab('shell')} 
                        icon={<Terminal size={22} />} 
                        label="Shell" 
                    />
                    <TabButton 
                        active={activeTab === 'recon'} 
                        onClick={() => setActiveTab('recon')} 
                        icon={<Globe size={22} />} 
                        label="Recon" 
                    />
                    <TabButton 
                        active={activeTab === 'forge'} 
                        onClick={() => setActiveTab('forge')} 
                        icon={<Code size={22} />} 
                        label="Forge" 
                    />
                    <TabButton 
                        active={activeTab === 'vault'} 
                        onClick={() => setActiveTab('vault')} 
                        icon={<HardDrive size={22} />} 
                        label="Vault" 
                    />
                </nav>
            </div>
        </AppLayout>
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active ? 'text-[#ff003c] scale-110' : 'text-[#ff003c]/30 hover:text-[#ff003c]/60'}`}
    >
        {icon}
        <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
        {active && (
            // Fix: Using MotionDiv (casted as any) instead of motion.div to bypass missing layoutId property error on intrinsic attributes.
            <MotionDiv layoutId="active-pill" className="w-1 h-1 bg-[#ff003c] rounded-full absolute -bottom-1" />
        )}
    </button>
);

export default ResearchHub;
