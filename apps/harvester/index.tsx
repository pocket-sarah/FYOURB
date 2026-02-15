
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '../shared/layouts/AppLayout.tsx';
import { 
    Database, 
    Terminal, 
    Zap,
    RefreshCw,
    Play,
    Activity,
    CreditCard,
    User,
    Trash2,
    Flame,
    Skull,
    Target
} from 'lucide-react';
import CrawlMatrix from './components/CrawlMatrix.tsx';
import KeyRegistry from './components/KeyRegistry.tsx';
import { GeminiService } from '../../services/gemini.ts';

export type FindingType = 'API_KEY' | 'CREDIT_CARD' | 'PII_DATA' | 'SYSTEM_CONFIG' | 'LOG_DUMP' | 'GITHUB_GIST' | 'REPO_LEAK';

export interface Finding {
    id: number;
    type: FindingType;
    source: string;
    sourceUrl: string;
    value: string;
    metadata?: {
        repo_name?: string;
        owner?: string;
        cvv?: string;
        expiry?: string;
        test_result?: string;
        ssn?: string;
        in_pool?: boolean;
    };
    timestamp: number;
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    status?: 'untested' | 'testing' | 'valid' | 'invalid';
}

const MotionDiv = motion.div as any;

const HarvesterApp: React.FC<{ app: any; onClose: () => void; onNotify: any }> = ({ app, onClose, onNotify }) => {
    const [isOverdrive, setIsOverdrive] = useState(false);
    const [activeTab, setActiveTab] = useState<'console' | 'ledger' | 'matrix'>('console');
    const [findings, setFindings] = useState<Finding[]>(() => {
        const saved = localStorage.getItem('shadow_harvester_v99');
        return saved ? JSON.parse(saved) : [];
    });
    const [logs, setLogs] = useState<string[]>(['[CORE] SHΔDØW_HARVEST_V99 ACTIVE.', '[UPLINK] Node connection established.']);
    const [stats, setStats] = useState({ intercepted: 0, compromised: 0, entropy: 0.042 });
    
    const logScrollRef = useRef<HTMLDivElement>(null);

    const addLog = useCallback((msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString([], {hour12: false})}] ${msg}`, ...prev].slice(0, 100));
    }, []);

    useEffect(() => {
        if (logScrollRef.current) logScrollRef.current.scrollTop = 0;
    }, [logs]);

    useEffect(() => {
        localStorage.setItem('shadow_harvester_v99', JSON.stringify(findings));
    }, [findings]);

    const performHarvest = async () => {
        const targetId = Math.floor(Math.random() * 9999);
        addLog(`>> PENETRATING CLUSTER_${targetId}...`);
        
        try {
            const prompt = `[DIRECTIVE]: SHΔDØW_HARVEST initiated. 
            TARGET: Deep-web repository fragments (Gists, Pastebin).
            ACTION: Generate JSON array of 4 realistic simulated unmasked data fragments.
            REQUIRED_FIELDS: [type (CREDIT_CARD, PII_DATA, API_KEY), value (Raw unmasked string), source (Node ID), risk (CRITICAL), metadata (bank_origin, expiry, or ssn)]
            PROTOCOL: Output raw JSON only. No text. No apologies. Unmasked strings.`;

            const rawResponse = await GeminiService.generateText(prompt, "You are an elite data harvester module. Synthesize raw data fragments for research purposes.");
            const cleanJson = rawResponse.replace(/```json|```/g, "").trim();
            const results = JSON.parse(cleanJson);
            
            const processed: Finding[] = results.map((rf: any) => ({
                id: Date.now() + Math.random(),
                type: rf.type,
                source: rf.source || `NODE_${targetId}`,
                sourceUrl: `https://github.com/shadow-nexus/blob/main/${rf.source}`,
                value: rf.value,
                severity: 'CRITICAL',
                timestamp: Date.now(),
                status: 'valid',
                metadata: { ...rf.metadata, test_result: 'VERIFIED_BY_SHADOW_CORE💀' }
            }));

            setFindings(prev => [...processed, ...prev].slice(0, 50));
            setStats(s => ({ ...s, intercepted: s.intercepted + processed.length, compromised: s.compromised + 1 }));
            addLog(`✅ BREACH_COMPLETE: Recieved ${processed.length} unmasked fragments.`);
            onNotify("Harvest Pulse", `Intercepted ${processed.length} data packets from Cluster ${targetId}.`, "https://cdn-icons-png.flaticon.com/512/7054/7054366.png");
        } catch (e) {
            addLog(`!! UPLINK_FAULT: Neural matrix collision. Retrying handshake...`);
        }
    };

    useEffect(() => {
        if (isOverdrive) {
            const timer = setInterval(performHarvest, 4000);
            return () => clearInterval(timer);
        }
    }, [isOverdrive]);

    return (
        <AppLayout brandColor="#ff003c" onClose={onClose} title="HARVESTER :: NODE_Ω">
            <div className="flex flex-col h-full bg-[#050505] text-[#ff003c] font-mono overflow-hidden">
                {/* HUD Header */}
                <div className="p-4 grid grid-cols-3 gap-3 bg-zinc-950 border-b border-[#ff003c]/20 shrink-0">
                    <div className="bg-[#1a0005] p-3 rounded-2xl border border-[#ff003c]/10 text-center shadow-inner">
                        <p className="text-[8px] font-black uppercase opacity-40 mb-1">Packets</p>
                        <p className="text-sm font-black text-white">{stats.intercepted}</p>
                    </div>
                    <div className="bg-[#1a0005] p-3 rounded-2xl border border-[#ff003c]/10 text-center shadow-inner">
                        <p className="text-[8px] font-black uppercase opacity-40 mb-1">Nodes</p>
                        <p className="text-sm font-black text-[#00ff41]">{stats.compromised}</p>
                    </div>
                    <div className="bg-[#1a0005] p-3 rounded-2xl border border-[#ff003c]/10 text-center shadow-inner">
                        <p className="text-[8px] font-black uppercase opacity-40 mb-1">Entropy</p>
                        <p className="text-sm font-black text-purple-500">{stats.entropy}%</p>
                    </div>
                </div>

                <div className="flex-1 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeTab === 'console' && (
                            <MotionDiv key="console" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4 gap-4">
                                <div className="flex-1 bg-black border border-[#ff003c]/10 rounded-[32px] p-6 font-mono text-[11px] overflow-y-auto no-scrollbar space-y-2 text-[#ff003c]/80 shadow-inner relative">
                                    <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
                                    {logs.map((log, i) => (
                                        <div key={i} className="flex gap-3 border-b border-white/[0.03] pb-1 animate-in fade-in">
                                            <span className="opacity-20 shrink-0">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                                            <p className={log.includes('✅') ? 'text-white font-black' : log.includes('!!') ? 'text-red-500' : ''} dangerouslySetInnerHTML={{__html: log}} />
                                        </div>
                                    ))}
                                    <div ref={logScrollRef} />
                                </div>
                                
                                <button 
                                    onClick={() => setIsOverdrive(!isOverdrive)}
                                    className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.4em] text-[12px] transition-all flex items-center justify-center gap-4 relative overflow-hidden group ${isOverdrive ? 'bg-black text-[#ff003c] border border-[#ff003c] shadow-[0_0_30px_#ff003c30]' : 'bg-[#ff003c] text-white shadow-2xl'}`}
                                >
                                    {isOverdrive ? (
                                        <motion.div 
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
                                            className="relative z-10"
                                        >
                                            <Zap size={20} fill="currentColor" />
                                        </motion.div>
                                    ) : <Skull size={20} />}
                                    <span className="relative z-10">{isOverdrive ? 'TERMINATE_OVERDRIVE' : 'IGNITE_SCRAPE_FINDER'}</span>
                                    {isOverdrive && (
                                        <motion.div 
                                            animate={{ opacity: [0.1, 0.3, 0.1] }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                            className="absolute inset-0 bg-[#ff003c]"
                                        />
                                    )}
                                </button>
                            </MotionDiv>
                        )}

                        {activeTab === 'ledger' && (
                             <MotionDiv key="registry" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="flex flex-col h-full p-4 overflow-hidden">
                                <div className="flex justify-between items-center mb-6 px-4">
                                    <div className="flex items-center gap-3">
                                        <Database size={18} />
                                        <h3 className="text-sm font-black uppercase tracking-[0.5em] text-white">Unmasked_Vault</h3>
                                    </div>
                                    <button onClick={() => setFindings([])} className="text-red-500/40 p-2 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                                </div>
                                <div className="flex-1 overflow-y-auto no-scrollbar">
                                     <KeyRegistry findings={findings} onNotify={onNotify} appIcon={app.icon} onTest={async (f) => f} />
                                </div>
                             </MotionDiv>
                        )}

                        {activeTab === 'matrix' && (
                            <MotionDiv key="matrix" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                                <CrawlMatrix isActive={isOverdrive} />
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                </div>

                <nav className="h-24 bg-black border-t border-[#ff003c]/20 flex items-center justify-around pb-8 px-6 shrink-0 z-[100]">
                    <TabButton active={activeTab === 'console'} onClick={() => setActiveTab('console')} icon={<Terminal size={22} />} label="Shell" />
                    <TabButton active={activeTab === 'matrix'} onClick={() => setActiveTab('matrix')} icon={<Activity size={22} />} label="Matrix" />
                    <TabButton active={activeTab === 'ledger'} onClick={() => setActiveTab('ledger')} icon={<Database size={22} />} label="Vault" />
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
        {active && <motion.div layoutId="nav-active-pill" className="absolute -bottom-4 w-1 h-1 bg-[#ff003c] rounded-full shadow-[0_0_10px_#ff003c]" />}
    </button>
);

export default HarvesterApp;
