
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Type } from "@google/genai";
import { 
    Database, 
    Terminal as TerminalIcon, 
    Zap,
    RefreshCw,
    Activity,
    CreditCard,
    User,
    Trash2,
    ShieldAlert, 
    ShieldCheck, 
    ShieldQuestion, 
    ExternalLink, 
    Key, 
    FileJson, 
    Search,
    XCircle
} from 'lucide-react';

// --- Global Type Definitions (from types.ts) ---
export type FindingType = 
    | 'API_KEY' 
    | 'CREDIT_CARD' 
    | 'PII_DATA' 
    | 'SYSTEM_CONFIG' 
    | 'LOG_DUMP' 
    | 'GITHUB_GIST' 
    | 'REPO_LEAK';

export type Severity = 'CRITICAL' | 'WARNING' | 'INFO';

export type Status = 'untested' | 'testing' | 'valid' | 'invalid';

export interface Finding {
    id: string;
    type: FindingType;
    source: string;
    sourceUrl: string;
    value: string;
    severity: Severity;
    status: Status;
    timestamp: number;
    metadata: {
        repo_name?: string;
        owner?: string;
        cvv?: string;
        expiry?: string;
        test_result?: string;
        ssn?: string;
        provider?: string;
        latency?: number; // Added for verification latency
    };
}

export interface LogEntry {
    id: string;
    timestamp: number;
    message: string;
    type: 'system' | 'success' | 'error' | 'warning';
}

export enum AppTab {
    CONSOLE = 'console',
    MATRIX = 'matrix',
    VAULT = 'vault',
}

// Minimal BankApp interface (as it's an external prop type)
interface BankApp {
    id: string;
    name: string;
    icon: string; // URL or base64 string for the icon
}

// --- Gemini Service (from services/geminiService.ts) ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

class GeminiService {
    static async harvestFindings(count: number = 3): Promise<Finding[]> {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Generate a JSON array of ${count} highly realistic but simulated data leaks. 
            Include diverse sources like GitHub, Pastebin, or AWS S3. 
            Ensure values look authentic (e.g., masked CC numbers, real-looking API key patterns). 
            For credit cards, provide a dummy CVV and expiry. For API keys, include a provider.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            type: { 
                                type: Type.STRING,
                                enum: ['API_KEY', 'CREDIT_CARD', 'PII_DATA', 'SYSTEM_CONFIG', 'LOG_DUMP', 'GITHUB_GIST', 'REPO_LEAK']
                            },
                            source: { type: Type.STRING },
                            sourceUrl: { type: Type.STRING },
                            value: { type: Type.STRING },
                            severity: { 
                                type: Type.STRING,
                                enum: ['CRITICAL', 'WARNING', 'INFO']
                            },
                            metadata: {
                                type: Type.OBJECT,
                                properties: {
                                    repo_name: { type: Type.STRING },
                                    owner: { type: Type.STRING },
                                    provider: { type: Type.STRING },
                                    expiry: { type: Type.STRING },
                                    cvv: { type: Type.STRING },
                                    ssn: { type: Type.STRING },
                                }
                            }
                        },
                        required: ['id', 'type', 'source', 'value', 'severity']
                    }
                }
            }
        });

        const data = JSON.parse(response.text);
        return data.map((item: any) => ({
            ...item,
            id: item.id || Math.random().toString(36).substr(2, 9),
            status: 'untested',
            timestamp: Date.now(),
            metadata: item.metadata || {}
        }));
    }

    static async verifyFinding(finding: Finding): Promise<{ status: 'valid' | 'invalid'; result: string; latency: number }> {
        const startTime = Date.now();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Simulate a security verification for this found asset: ${JSON.stringify(finding)}.
            Return a JSON object indicating if the asset is valid (true/false) and a brief technical test result. Make the validity seem random but realistic.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        status: { type: Type.BOOLEAN }, // Use boolean here to map to valid/invalid
                        result: { type: Type.STRING }
                    },
                    required: ['status', 'result']
                }
            }
        });
        const endTime = Date.now();
        const latency = endTime - startTime;

        const { status: isValid, result } = JSON.parse(response.text);
        return {
            status: isValid ? 'valid' : 'invalid',
            result,
            latency
        };
    }
}

// --- Terminal Component (from components/Terminal.tsx) ---
interface TerminalProps {
    logs: LogEntry[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const getLogColor = (type: string) => {
        switch (type) {
            case 'success': return 'text-emerald-400';
            case 'error': return 'text-rose-500 font-bold';
            case 'warning': return 'text-amber-400';
            default: return 'text-indigo-300';
        }
    };

    return (
        <div className="flex-1 bg-black/80 border border-indigo-500/20 rounded-2xl p-6 font-mono text-[12px] overflow-hidden flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4 border-b border-indigo-500/10 pb-2">
                <div className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
                <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                <span className="ml-2 text-[10px] text-indigo-500/60 uppercase tracking-widest font-bold">Harvester-Core@omni: ~</span>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1.5 no-scrollbar">
                {logs.map((log) => (
                    <motion.div 
                        key={log.id} 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-3 leading-relaxed"
                    >
                        <span className="text-indigo-500/40 shrink-0">
                            [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                        </span>
                        <p className={getLogColor(log.type)}>
                            {log.message}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};


// --- CrawlMatrix Component (from components/CrawlMatrix.tsx) ---
const CrawlMatrix: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*()_+=[]{}|;:,.<>?/πΩΣΔ";
        const fontSize = 14;
        const columns = width / fontSize;
        const drops: number[] = Array(Math.floor(columns)).fill(1);

        const draw = () => {
            ctx.fillStyle = "rgba(2, 6, 23, 0.1)"; // Very slight transparency to fade old characters
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = isActive ? "#10b981" : "#6366f1"; // Green when active, indigo when idle
            ctx.font = `${fontSize}px 'JetBrains Mono'`;

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33); // Approximately 30 FPS

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, [isActive]);

    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <canvas ref={canvasRef} />
        </div>
    );
};

// --- Vault Component (from components/Vault.tsx, formerly KeyRegistry) ---
interface VaultProps {
    findings: Finding[];
    onVerify: (id: string) => void;
    onDelete: (id: string) => void;
    onNotify: (title: string, message: string, icon: string) => void;
    appIcon: string;
}

const Vault: React.FC<VaultProps> = ({ findings, onVerify, onDelete, onNotify, appIcon }) => {
    const getIcon = (type: FindingType) => {
        switch (type) {
            case 'API_KEY': return <Key size={18} />;
            case 'CREDIT_CARD': return <CreditCard size={18} />;
            case 'PII_DATA': return <User size={18} />;
            case 'SYSTEM_CONFIG': return <FileJson size={18} />;
            case 'GITHUB_GIST': return <ExternalLink size={18} />;
            case 'REPO_LEAK': return <Database size={18} />;
            default: return <Search size={18} />;
        }
    };

    const getStatusIcon = (status: Status) => {
        switch (status) {
            case 'valid': return <ShieldCheck className="text-emerald-400" size={16} />;
            case 'invalid': return <ShieldAlert className="text-rose-500" size={16} />;
            case 'testing': return <Activity className="text-amber-400 animate-spin" size={16} />;
            default: return <ShieldQuestion className="text-indigo-500/40" size={16} />;
        }
    };

    const getSeverityBadge = (severity: Severity) => {
        const colors = {
            CRITICAL: 'bg-rose-700/50 text-rose-300 border-rose-600',
            WARNING: 'bg-amber-700/50 text-amber-300 border-amber-600',
            INFO: 'bg-indigo-700/50 text-indigo-300 border-indigo-600',
        };
        return (
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${colors[severity]}`}>
                {severity}
            </span>
        );
    };

    const handleCopy = (value: string, type: FindingType) => {
        navigator.clipboard.writeText(value);
        onNotify("Copied to Clipboard", `${type} value copied!`, appIcon);
    };

    return (
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="flex justify-between items-center px-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Neural Assets Vault</h3>
                <span className="text-[10px] text-indigo-500/60 font-bold">{findings.length} RECORDS RECOVERED</span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar pb-10">
                <AnimatePresence initial={false}>
                    {findings.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -20 }}
                            className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-indigo-500/10 rounded-2xl text-indigo-500/60 text-sm italic p-4 text-center"
                        >
                            <ShieldQuestion size={24} className="mb-2" />
                            <p>No neural assets recovered yet. Initiate OMNI-SCRAPE.</p>
                        </motion.div>
                    ) : (
                        findings.map((finding) => (
                            <motion.div
                                key={finding.id}
                                layout
                                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="bg-black/70 border border-indigo-500/20 rounded-xl p-4 shadow-lg flex flex-col gap-2 relative group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-700/30 rounded-full text-indigo-300">
                                            {getIcon(finding.type)}
                                        </div>
                                        <div>
                                            <div className="text-white text-sm font-bold flex items-center gap-2">
                                                {finding.type.replace(/_/g, ' ')}
                                                {getSeverityBadge(finding.severity)}
                                            </div>
                                            <a href={finding.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-400 opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1 mt-0.5">
                                                {finding.source} <ExternalLink size={10} />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-indigo-300 text-[10px] opacity-70">
                                        {getStatusIcon(finding.status)}
                                        <span className="capitalize">{finding.status}</span>
                                    </div>
                                </div>
                                <div className="text-sm bg-indigo-900/20 p-3 rounded-md break-all relative group">
                                    <span className="text-indigo-200">{finding.value}</span>
                                    <button 
                                        onClick={() => handleCopy(finding.value, finding.type)} 
                                        className="absolute top-1 right-1 p-1 bg-indigo-700/50 rounded-md text-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[10px]"
                                        title="Copy to clipboard"
                                    >
                                        Copy
                                    </button>
                                </div>

                                {finding.metadata.test_result && (
                                    <p className="text-[10px] text-indigo-400 opacity-80 mt-1">
                                        Verification Result: {finding.metadata.test_result} 
                                        {finding.metadata.latency && ` (Latency: ${finding.metadata.latency}ms)`}
                                    </p>
                                )}

                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => onVerify(finding.id)}
                                        disabled={finding.status === 'testing'}
                                        className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {finding.status === 'testing' ? (
                                            <>
                                                <RefreshCw size={12} className="animate-spin" /> VERIFYING...
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck size={12} /> VERIFY
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => onDelete(finding.id)}
                                        className="py-2 px-3 bg-rose-700/50 hover:bg-rose-600/70 text-rose-300 text-[11px] font-bold rounded-lg transition-colors duration-200"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};


// --- AppLayout Component (minimal, inlined) ---
interface AppLayoutProps {
    children: React.ReactNode;
    brandColor: string;
    onClose: () => void;
    title: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, brandColor, onClose, title }) => {
    return (
        <div className="relative w-full h-full flex flex-col bg-gray-950 text-white rounded-lg shadow-2xl overflow-hidden">
            <header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
                <h1 className="text-xl font-bold" style={{ color: brandColor }}>{title}</h1>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                    <XCircle size={20} className="text-red-400" />
                </button>
            </header>
            <main className="flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    );
};


// --- Main Application Component (from HarvesterApp.tsx, renamed to App) ---

// Hardcoded findings as initial data for demonstration
const HARDCODED_FINDINGS: Finding[] = [
  {
    "id": "cc-1",
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
    "id": "pii-2",
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

// Assuming `app` and `onNotify` are passed from a parent container.
// For a standalone app, `app` can be a mock object.
const MockBankApp: BankApp = {
    id: 'harvester',
    name: 'Harvester',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgZXhwPSIxLjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iaW5kaWdvIj48cGF0aCBkPSJNMTIgMi41TDQgNlYxOGw4IDNoOGwtNy45OTctMy4wMDMtMEw0IDZ6bTAgNS4wNDRsMy45OTkgMi42NjYtMy45OTkgMi41LTQtMi41IDQtMi42NjZ6TTEyIDE2Ljk1N2wtNCAyLjVDOCA4LjkgNCA0LjQgNCA0LjQgNiA4LjkgNi4zIDkgMTIgMTIuMTV4IiBmaWxsPSJjdXJyZW50Q29sb3IiLz48L3N2Zz4=' // A simple SVG data URI for a database icon
};

const App: React.FC<{ app?: BankApp; onClose?: () => void; onNotify?: (title: string, message: string, icon: string) => void }> = ({ 
    app = MockBankApp, 
    onClose = () => console.log("App Closed"), 
    onNotify = (title, message, icon) => console.log(`Notification: ${title} - ${message}`) 
}) => {
    const [isCrawling, setIsCrawling] = useState(false);
    const [activeTab, setActiveTab] = useState<AppTab>(AppTab.CONSOLE);
    const [findings, setFindings] = useState<Finding[]>(() => {
        const saved = localStorage.getItem('harvester_findings_v27');
        return saved ? JSON.parse(saved) : HARDCODED_FINDINGS;
    });
    const [logs, setLogs] = useState<LogEntry[]>(() => [
        { id: 'sys-init-1', timestamp: Date.now(), message: 'Harvester OMNI-CORE v27 active.', type: 'system' },
        { id: 'sys-init-2', timestamp: Date.now(), message: 'Multi-Vector Recon Node: READY.', type: 'system' }
    ]);
    
    const logScrollRef = useRef<HTMLDivElement>(null);

    const addLog = useCallback((message: string, type: LogEntry['type'] = 'system') => {
        setLogs(prev => [...prev.slice(-100), { id: Math.random().toString(36).substr(2, 9) + Date.now(), timestamp: Date.now(), message, type }]);
    }, []);

    useEffect(() => {
        if (logScrollRef.current) logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight;
    }, [logs, activeTab]);

    useEffect(() => {
        localStorage.setItem('harvester_findings_v27', JSON.stringify(findings));
    }, [findings]);

    const runAutomator = async () => {
        if (isCrawling) return;
        setIsCrawling(true);
        setActiveTab(AppTab.MATRIX);
        addLog(">> INITIATING MULTI-VECTOR SCRAPE: CC_DATA | PII | API_KEYS", 'system');
        
        try {
            const newFindings = await GeminiService.harvestFindings(5);
            
            setFindings(prev => [...newFindings, ...prev]);
            addLog(`✅ ${newFindings.length} high-value fragments recovered.`, 'success');
            onNotify("Harvest Complete", `${newFindings.length} high-value fragments recovered.`, app.icon);
        } catch (e: any) {
            addLog(`!! [FATAL] OMNI-RECON HANDSHAKE FAILED: ${e.message || 'Unknown error'}`, 'error');
        } finally {
            setIsCrawling(false);
            setActiveTab(AppTab.CONSOLE);
        }
    };

    const handleVerifyFinding = useCallback(async (id: string) => {
        setFindings(prev => prev.map(f => f.id === id ? { ...f, status: 'testing' } : f));
        addLog(`Initiating verification for finding ID: ${id}...`, 'system');

        const findingToVerify = findings.find(f => f.id === id);
        if (!findingToVerify) {
            addLog(`Finding ID ${id} not found for verification.`, 'error');
            return;
        }

        try {
            const { status, result, latency } = await GeminiService.verifyFinding(findingToVerify);
            setFindings(prev => prev.map(f => 
                f.id === id ? { ...f, status, metadata: { ...f.metadata, test_result: result, latency } } : f
            ));
            addLog(`Verification for ID ${id}: ${status.toUpperCase()} - ${result} (Latency: ${latency}ms)`, status === 'valid' ? 'success' : 'warning');
            onNotify("Verification Complete", `Finding ID ${id} is ${status}.`, app.icon);
        } catch (e: any) {
            addLog(`!! [FATAL] Verification failed for ID ${id}: ${e.message || 'Unknown error'}`, 'error');
            setFindings(prev => prev.map(f => f.id === id ? { ...f, status: 'untested', metadata: { ...f.metadata, test_result: 'Verification failed.' } } : f));
        }
    }, [findings, addLog, onNotify, app.icon]);

    const handleDeleteFinding = useCallback((id: string) => {
        setFindings(prev => {
            const updated = prev.filter(f => f.id !== id);
            addLog(`Finding ID ${id} deleted.`, 'system');
            onNotify("Finding Deleted", `Asset ${id} removed from vault.`, app.icon);
            return updated;
        });
    }, [addLog, onNotify, app.icon]);

    const handleClearAllFindings = useCallback(() => {
        setFindings([]);
        addLog("All neural assets cleared from vault.", 'warning');
        onNotify("Vault Cleared", "All recovered assets have been purged.", app.icon);
    }, [addLog, onNotify, app.icon]);


    return (
        <AppLayout brandColor="#4f46e5" onClose={onClose} title="HARVESTER :: OMNI-NODE">
            <div className="flex flex-col h-full bg-[#020617] text-indigo-400 font-mono overflow-hidden">
                <div className="flex-1 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeTab === AppTab.CONSOLE && (
                            <MotionDiv key="console" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4 gap-4">
                                <div className="flex justify-between items-center px-4 pt-2">
                                     <div className="flex items-center gap-3">
                                         <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></div>
                                         <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Handshake Feed</h3>
                                     </div>
                                </div>
                                <Terminal logs={logs} />
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

                        {activeTab === AppTab.VAULT && (
                             <MotionDiv key="vault" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="flex flex-col h-full p-4 overflow-hidden">
                                <div className="flex justify-between items-center mb-4 px-2">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white">Neural Assets</h3>
                                    <button onClick={handleClearAllFindings} className="text-rose-500/60 p-2 hover:text-rose-400 transition-colors" title="Clear All Assets"><Trash2 size={16}/></button>
                                </div>
                                <Vault findings={findings} onVerify={handleVerifyFinding} onDelete={handleDeleteFinding} onNotify={onNotify} appIcon={app.icon} />
                             </MotionDiv>
                        )}

                        {activeTab === AppTab.MATRIX && (
                            <MotionDiv key="matrix" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full">
                                <CrawlMatrix isActive={isCrawling} />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xl font-bold uppercase tracking-widest">
                                    {isCrawling && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="flex flex-col items-center gap-4 p-8 bg-black/70 rounded-2xl shadow-2xl border border-emerald-500/30"
                                        >
                                            <RefreshCw size={40} className="animate-spin text-emerald-400" />
                                            <p className="text-emerald-300">OMNI-SCRAPE IN PROGRESS...</p>
                                            <p className="text-sm text-indigo-300/60 mt-2 animate-pulse">Scanning deep-web vectors for fragments...</p>
                                        </motion.div>
                                    )}
                                </div>
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                </div>

                <nav className="h-20 bg-black border-t border-white/5 flex items-center justify-around pb-4 px-4 shrink-0">
                    <button onClick={() => setActiveTab(AppTab.CONSOLE)} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === AppTab.CONSOLE ? 'text-indigo-400' : 'text-zinc-600'}`}>
                        <TerminalIcon size={22} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Console</span>
                    </button>
                    <button onClick={() => setActiveTab(AppTab.MATRIX)} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === AppTab.MATRIX ? 'text-indigo-400' : 'text-zinc-600'}`}>
                        <Zap size={22} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Matrix</span>
                    </button>
                    <button onClick={() => setActiveTab(AppTab.VAULT)} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === AppTab.VAULT ? 'text-indigo-400' : 'text-zinc-600'}`}>
                        <Database size={22} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Vault</span>
                    </button>
                </nav>
            </div>
        </AppLayout>
    );
};

export default App;
