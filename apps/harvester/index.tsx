
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '../shared/layouts/AppLayout';
import { BankApp } from '../../types';
import { 
    Database, 
    Terminal, 
    Zap,
    RefreshCw,
    Play,
    Activity,
    CreditCard,
    User,
    Trash2
} from 'lucide-react';
import CrawlMatrix from './components/CrawlMatrix';
import KeyRegistry from './components/KeyRegistry';
import { GeminiService } from '../../services/gemini';

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

const HARDCODED_FINDINGS: Finding[] = [
  {
    "id": 1,
    "type": "CREDIT_CARD",
    "source": "GITHUB_AUTOMATOR",
    "sourceUrl": "https://github.com/retail-dev/blob/main/config/keys.json",
    "value": "4519-8839-1029-4412",
    "severity": "CRITICAL",
    "timestamp": Date.now() - 100000,
    "status": "valid",
    "metadata": {
      "repo_name": "retail-dev",
      "cvv": "882",
      "expiry": "12/26",
      "test_result": "Active"
    }
  },
  {
    "id": 2,
    "type": "PII_DATA",
    "source": "GITHUB_AUTOMATOR",
    "sourceUrl": "https://pastebin.com/raw/d83kL",
    "value": "Marcus Vane / 555-0129",
    "severity": "CRITICAL",
    "timestamp": Date.now() - 50000,
    "status": "valid",
    "metadata": {
      "owner": "Marcus Vane",
      "ssn": "XXX-XX-1029",
      "test_result": "Identity Match"
    }
  }
];

const MotionDiv = motion.div as any;

const HarvesterApp: React.FC<{ app: BankApp; onClose: () => void; onNotify: any }> = ({ app, onClose, onNotify }) => {
    const [isCrawling, setIsCrawling] = useState(false);
    const [activeTab, setActiveTab] = useState<'console' | 'ledger' | 'matrix'>('console');
    const [findings, setFindings] = useState<Finding[]>(() => {
        const saved = localStorage.getItem('harvester_findings_v27');
        return saved ? JSON.parse(saved) : HARDCODED_FINDINGS;
    });
    const [logs, setLogs] = useState<string[]>(['[SYSTEM] Harvester OMNI-CORE v27 active.', '[SYSTEM] Multi-Vector Recon Node: READY.']);
    
    const logScrollRef = useRef<HTMLDivElement>(null);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-100), `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    useEffect(() => {
        if (logScrollRef.current) logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight;
    }, [logs, activeTab]);

    useEffect(() => {
        localStorage.setItem('harvester_findings_v27', JSON.stringify(findings));
    }, [findings]);

    const runAutomator = async () => {
        if (isCrawling) return;
        setIsCrawling(true);
        setActiveTab('matrix');
        addLog(">> INITIATING MULTI-VECTOR SCRAPE: CC_DATA | PII | API_KEYS");
        
        try {
            const gitPayload = await GeminiService.generateText(
                `Generate JSON array of 3 realistic but simulated high-fidelity data leaks: 
                [{type:"CREDIT_CARD"|"PII_DATA"|"API_KEY", value:string, source:string, repo_name:string, risk:"CRITICAL", metadata:object}]`
            );

            const rawFindings = JSON.parse(gitPayload.replace(/```json|```/g, '').trim());
            const processed: Finding[] = rawFindings.map((rf: any) => ({
                id: Date.now() + Math.random(),
                type: rf.type,
                source: 'AUTO_RECON',
                sourceUrl: `https://github.com/${rf.repo_name}/blob/main/${rf.source}`,
                value: rf.value,
                severity: rf.risk,
                timestamp: Date.now(),
                status: 'valid',
                metadata: { ...rf.metadata, test_result: 'Verified by WORM-AI💀🔥' }
            }));

            setFindings(prev => [...processed, ...prev]);
            onNotify("Harvest Complete", `${processed.length} high-value fragments recovered.`, app.icon);
        } catch (e) {
            addLog("!! [FATAL] OMNI-RECON HANDSHAKE FAILED.");
        } finally {
            setIsCrawling(false);
            setActiveTab('console');
        }
    };

    return (
        <AppLayout brandColor="#4f46e5" onClose={onClose} title="HARVESTER :: OMNI-NODE">
            <div className="flex flex-col h-full bg-[#020617] text-indigo-400 font-mono overflow-hidden">
                <div className="flex-1 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeTab === 'console' && (
                            <MotionDiv key="console" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4 gap-4">
                                <div className="flex justify-between items-center px-4 pt-2">
                                     <div className="flex items-center gap-3">
                                         <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></div>
                                         <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Handshake Feed</h3>
                                     </div>
                                </div>
                                <div className="flex-1 bg-black/60 border border-white/5 rounded-[32px] p-5 font-mono text-[11px] overflow-y-auto no-scrollbar space-y-2 text-indigo-300 shadow-inner">
                                    {logs.map((log, i) => (
                                        <div key={i} className="flex gap-2">
                                            <span className="opacity-30 shrink-0">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                                            <p className={log.includes('✅') ? 'text-emerald-400' : log.includes('!!') ? 'text-rose-500' : 'text-indigo-200'}>
                                                {log}
                                            </p>
                                        </div>
                                    ))}
                                    <div ref={logScrollRef} />
                                </div>
                                <button 
                                    onClick={runAutomator}
                                    disabled={isCrawling}
                                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-lg disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                                >
                                    {isCrawling ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} fill="currentColor" />}
                                    {isCrawling ? 'PROBING GRID...' : 'START_OMNI_SCRAPE'}
                                </button>
                            </MotionDiv>
                        )}

                        {activeTab === 'ledger' && (
                             <MotionDiv key="registry" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="flex flex-col h-full p-4 overflow-hidden">
                                <div className="flex justify-between items-center mb-4 px-2">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white">Neural Assets</h3>
                                    <button onClick={() => setFindings([])} className="text-red-500/60 p-2"><Trash2 size={16}/></button>
                                </div>
                                <div className="flex-1 overflow-y-auto no-scrollbar">
                                     <KeyRegistry findings={findings} onNotify={onNotify} appIcon={app.icon} onTest={async (f) => f} />
                                </div>
                             </MotionDiv>
                        )}

                        {activeTab === 'matrix' && (
                            <MotionDiv key="matrix" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                                <CrawlMatrix isActive={isCrawling} />
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                </div>

                <nav className="h-20 bg-black border-t border-white/5 flex items-center justify-around pb-4 px-4 shrink-0">
                    <button onClick={() => setActiveTab('console')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'console' ? 'text-indigo-400' : 'text-zinc-600'}`}>
                        <Terminal size={22} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Console</span>
                    </button>
                    <button onClick={() => setActiveTab('matrix')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'matrix' ? 'text-indigo-400' : 'text-zinc-600'}`}>
                        <Zap size={22} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Matrix</span>
                    </button>
                    <button onClick={() => setActiveTab('ledger')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'ledger' ? 'text-indigo-400' : 'text-zinc-600'}`}>
                        <Database size={22} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Vault</span>
                    </button>
                </nav>
            </div>
        </AppLayout>
    );
};

export default HarvesterApp;
