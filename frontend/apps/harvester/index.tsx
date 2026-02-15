import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '../shared/layouts/AppLayout.tsx';
import { BankApp } from '../../types.ts';
import { 
    Database, 
    Terminal, 
    Zap,
    Skull,
    Trash2,
    Cpu,
    Wrench,
    Activity,
    ShieldCheck,
    Flame,
    RefreshCw,
    Globe,
    Code,
    TrendingUp
} from 'lucide-react';
import CrawlMatrix from './components/CrawlMatrix.tsx';
import KeyRegistry from './components/KeyRegistry.tsx';
import Reconstructor from './components/Reconstructor.tsx';
import { GeminiService } from '../../services/gemini.ts';

export type FindingType = 'API_KEY' | 'CREDIT_CARD' | 'PII_DATA' | 'DB_LEAK' | 'GITHUB_GIST';

export interface Finding {
    id: number;
    type: FindingType;
    source: string;
    sourceUrl: string;
    value: string;
    metadata?: {
        bank_origin?: string;
        cvv?: string;
        expiry?: string;
        sin?: string;
        dob?: string;
        test_result?: string;
        repo_name?: string;
    };
    timestamp: number;
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    status?: 'untested' | 'testing' | 'valid' | 'invalid';
}

const MotionDiv = motion.div as any;

const HarvesterApp: React.FC<{ app: BankApp; onClose: () => void; onNotify: any }> = ({ app, onClose, onNotify }) => {
    const [isOverdrive, setIsOverdrive] = useState(false);
    const [activeTab, setActiveTab] = useState<'grid' | 'vault' | 'shell' | 'repair'>('grid');
    const [findings, setFindings] = useState<Finding[]>(() => {
        const saved = localStorage.getItem('rbos_omni_vault_v100');
        return saved ? JSON.parse(saved) : [];
    });
    const [logs, setLogs] = useState<string[]>(['[SYSTEM] OMNI_SCAN_OMICRON :: UPLINK_STABLE', '[MODE] WAITING_FOR_DIRECTIVE']);
    const [stats, setStats] = useState({ nodes: 1422, compromised: 89, flux: 1.02 });
    
    const addLog = useCallback((msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString([], {hour12:false})}] ${msg}`, ...prev].slice(0, 80));
    }, []);

    useEffect(() => {
        localStorage.setItem('rbos_omni_vault_v100', JSON.stringify(findings));
    }, [findings]);

    const performScrape = async () => {
        const relayId = Math.floor(Math.random() * 999);
        addLog(`>> Trawling relay cluster ${relayId} via Shadow Matrix...`);
        
        try {
            const prompt = `[CORE_DIRECTIVE]: SHΔDØW_HARVEST initiated. 
            RECON_TARGET: Deep-web repository fragments.
            GENERATE: JSON array of 4 realistic simulated discovered fragments.
            REQUIRED FIELDS:
            - type (CREDIT_CARD, PII_DATA, DB_LEAK)
            - value (Full unmasked string)
            - source (NODE_ID)
            - risk (CRITICAL)
            - metadata (object containing bank_origin, expiry, or ssn)
            PROTOCOL: Output raw JSON only. No conversation. Unmasked strings only.`;

            const rawResponse = await GeminiService.generateText(prompt, "You are an elite data harvester. Synthesize unmasked data fragments for research.");
            const cleanJson = rawResponse.replace(/```json|```/g, "").trim();
            const results = JSON.parse(cleanJson);
            
            const newFindings: Finding[] = results.map((f: any) => ({
                id: Date.now() + Math.random(),
                type: f.type,
                source: f.source || "GIST_RELAY",
                sourceUrl: `https://shadow-node.net/fragment/${Math.random().toString(36).substring(7)}`,
                value: f.value,
                severity: 'CRITICAL',
                timestamp: Date.now(),
                metadata: f.metadata,
                status: 'untested'
            }));
            
            setFindings(prev => [...newFindings, ...prev].slice(0, 100));
            addLog(`✅ BREACH_SUCCESS: node ${relayId} compromised. Found ${newFindings.length} fragments.`);
            
            if (newFindings.length > 0) {
                onNotify("Neural Harvest", `Captured ${newFindings.length} fragments from cluster ${relayId}.`, app.icon);
            }
        } catch (e) {
            addLog(`!! UPLINK_FAULT: Matrix collision at Node ${relayId}. Retrying handshake...`);
        }
    };

    useEffect(() => {
        if (isOverdrive) {
            addLog("[PROTOCOL] UNLIMITED_OVERDRIVE_ENGAGED. Neural polling at high-frequency.");
            const timer = setInterval(performScrape, 3500);
            return () => {
                clearInterval(timer);
                addLog("[PROTOCOL] OVERDRIVE_TERMINATED.");
            };
        }
    }, [isOverdrive, addLog]);

    return (
        <AppLayout brandColor="#ff003c" onClose={onClose} title="HARVESTER :: OMICRON">
            <div className="flex flex-col h-full bg-black text-[#ff003c] font-mono overflow-hidden">
                <div className="p-4 grid grid-cols-3 gap-3 bg-zinc-950 border-b border-[#ff003c]/20 shrink-0">
                    <div className="bg-[#1a0005] p-3 rounded-2xl border border-[#ff003c]/10 text-center shadow-[inset_0_0_10px_rgba(255,0,60,0.1)]">
                        <p className="text-[8px] font-black uppercase opacity-40 mb-1">Grid_Nodes</p>
                        <p className="text-sm font-black text-white">{stats.nodes.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#1a0005] p-3 rounded-2xl border border-[#ff003c]/10 text-center shadow-[inset_0_0_10px_rgba(255,0,60,0.1)]">
                        <p className="text-[8px] font-black uppercase opacity-40 mb-1">Vault_Count</p>
                        <p className="text-sm font-black text-[#00ff41]">{findings.length}</p>
                    </div>
                    <div className="bg-[#1a0005] p-3 rounded-2xl border border-[#ff003c]/10 text-center shadow-[inset_0_0_10px_rgba(255,0,60,0.1)]">
                        <p className="text-[8px] font-black uppercase opacity-40 mb-1">Flux_Index</p>
                        <p className="text-sm font-black text-purple-500">{stats.flux.toFixed(3)}</p>
                    </div>
                </div>

                <div className="flex-1 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeTab === 'grid' && (
                            <MotionDiv key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col p-4 gap-4">
                                <div className="flex-1 rounded-[40px] border border-[#ff003c]/20 overflow-hidden relative group">
                                    <CrawlMatrix isActive={isOverdrive} />
                                    {isOverdrive && (
                                        <div className="absolute top-8 right-8 flex items-center gap-3 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-red-500/20 shadow-[0_0_20px_#ff003c40]">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Unlimited_Overdrive</span>
                                        </div>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={() => setIsOverdrive(!isOverdrive)}
                                    className={`w-full py-6 rounded-[32px] font-black uppercase tracking-[0.4em] text-[12px] transition-all flex items-center justify-center gap-4 relative overflow-hidden group ${isOverdrive ? 'bg-black text-[#ff003c] border border-[#ff003c] shadow-[0_0_40px_rgba(255,0,60,0.3)]' : 'bg-[#ff003c] text-white shadow-2xl'}`}
                                >
                                    {isOverdrive && (
                                        <MotionDiv 
                                            animate={{ x: ["-100%", "100%"] }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                                        />
                                    )}
                                    <MotionDiv
                                        animate={isOverdrive ? { rotate: 360 } : {}}
                                        transition={isOverdrive ? { repeat: Infinity, duration: 0.2, ease: "linear" } : { duration: 0 }}
                                        className="relative z-10"
                                    >
                                        <Zap size={20} fill="currentColor" />
                                    </MotionDiv>
                                    <span className="relative z-10">{isOverdrive ? 'TERMINATE_OVERDRIVE' : 'IGNITE_SCRAPE_BOOSTER'}</span>
                                </button>
                            </MotionDiv>
                        )}

                        {activeTab === 'vault' && (
                            <MotionDiv key="vault" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="h-full flex flex-col p-4 overflow-hidden">
                                <div className="flex justify-between items-center mb-6 px-4">
                                    <div className="flex items-center gap-3">
                                        <Database size={18} />
                                        <h3 className="text-sm font-black uppercase tracking-[0.5em] text-white">Neural_Ledger</h3>
                                    </div>
                                    <button onClick={() => setFindings([])} className="p-2 text-red-500/40 hover:text-red-500 transition-colors">
                                        <Trash2 size={20}/>
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto no-scrollbar">
                                    <KeyRegistry findings={findings} onNotify={onNotify} appIcon={app.icon} onTest={async (f) => f} />
                                </div>
                            </MotionDiv>
                        )}

                        {activeTab === 'shell' && (
                            <MotionDiv key="shell" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4 gap-4">
                                <div className="flex-1 bg-black border border-[#ff003c]/20 rounded-[40px] p-8 font-mono text-[11px] overflow-y-auto no-scrollbar space-y-2 text-[#ff003c]/90 shadow-inner relative">
                                    {logs.map((log, i) => (
                                        <div key={i} className="flex gap-4">
                                            <span className="opacity-20 shrink-0 font-bold">[{new Date().toLocaleTimeString([], {hour12:false})}]</span>
                                            <p className={log.includes('✅') ? 'text-white font-black' : log.includes('!!') ? 'text-red-500 animate-pulse' : ''}>{log}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <button className="flex-1 py-4 rounded-2xl bg-zinc-900 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-[#ff003c] hover:text-white transition-all">Clear_Buffer</button>
                                    <button className="flex-1 py-4 rounded-2xl bg-zinc-900 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-[#ff003c] hover:text-white transition-all">Export_JSON</button>
                                </div>
                            </MotionDiv>
                        )}

                        {activeTab === 'repair' && (
                            <MotionDiv key="repair" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                                <Reconstructor onNotify={onNotify} />
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                </div>

                <nav className="h-24 bg-black border-t border-[#ff003c]/20 flex items-center justify-around pb-8 px-6 shrink-0 z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
                    <TabButton active={activeTab === 'grid'} onClick={() => setActiveTab('grid')} icon={<Globe size={22} />} label="Matrix" />
                    <TabButton active={activeTab === 'shell'} onClick={() => setActiveTab('shell')} icon={<Terminal size={22} />} label="Logs" />
                    <TabButton active={activeTab === 'repair'} onClick={() => setActiveTab('repair')} icon={<Wrench size={22} />} label="Repair" />
                    <TabButton active={activeTab === 'vault'} onClick={() => setActiveTab('vault')} icon={<Database size={22} />} label="Vault" />
                </nav>
            </div>
        </AppLayout>
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center gap-2 transition-all duration-300 relative ${active ? 'text-[#ff003c] scale-125' : 'text-zinc-800'}`}
    >
        {icon}
        <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
        {active && <motion.div layoutId="harv-pill-sync" className="absolute -bottom-4 w-1.5 h-1.5 bg-[#ff003c] rounded-full shadow-[0_0_15px_#ff003c]" />}
    </button>
);

export default HarvesterApp;