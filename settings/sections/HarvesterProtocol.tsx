
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Zap, 
    Search, 
    RefreshCw, 
    Github, 
    Globe, 
    ShieldCheck, 
    Activity, 
    Terminal,
    Database,
    Lock,
    Cpu,
    ArrowUpRight,
    EyeOff,
    Skull,
    Flame
} from 'lucide-react';

export const HarvesterProtocol: React.FC<{ isDark: boolean; isHacker: boolean }> = ({ isDark, isHacker }) => {
    const [isHarvesting, setIsHarvesting] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);
    const [stats, setStats] = useState({ intercepted: 1422, scanned: 89342, entropy: 0.042 });
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isHarvesting) {
            const interval = setInterval(() => {
                setStats(prev => ({
                    intercepted: prev.intercepted + Math.floor(Math.random() * 5),
                    scanned: prev.scanned + Math.floor(Math.random() * 50),
                    entropy: Math.max(0.001, prev.entropy + (Math.random() - 0.5) * 0.01)
                }));

                const types = ['CRED_LEAK', 'KEY_DORK', 'ENV_EXPOSURE', 'API_FRAGMENT'];
                const sites = ['GITHUB_GIST', 'BING_SEARCH', 'PASTEBIN', 'AZURE_DUMP'];
                
                const newLog = {
                    timestamp: Date.now(),
                    type: types[Math.floor(Math.random() * types.length)],
                    message: `[RECON] Pattern matched on node ${sites[Math.floor(Math.random() * sites.length)]}_${Math.random().toString(36).substring(7).toUpperCase()} :: Masked_Key(AIza...${Math.random().toString(36).substring(4).toUpperCase()})`,
                    origin: 'WORM_CORE'
                };
                
                setLogs(prev => [newLog, ...prev].slice(0, 50));
            }, 800);
            return () => clearInterval(interval);
        }
    }, [isHarvesting]);

    const triggerHarvest = () => {
        setIsHarvesting(!isHarvesting);
        if (!isHarvesting) {
            setLogs([{ timestamp: Date.now(), type: 'INIT', message: 'WORM-AI💀🔥 HARVESTER SEQUENCE INITIALIZED.', origin: 'CORE' }]);
        }
    };

    const MotionDiv = motion.div as any;

    return (
        <div className="space-y-8 animate-in slide-up pb-20 font-mono text-[#ff003c]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#1a0005] border border-[#ff003c]/40 flex items-center justify-center shadow-[0_0_30px_rgba(255,0,60,0.2)]">
                        <Skull size={32} className="text-[#ff003c]" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter uppercase glitch-text">Harvester HP-99</h2>
                        <p className="text-[10px] font-black text-[#ff003c]/60 uppercase tracking-[0.4em]">WORM-AI💀🔥 Secret Discovery Matrix</p>
                    </div>
                </div>
                <button 
                    onClick={triggerHarvest}
                    className={`px-10 py-4 rounded-xl text-[12px] font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-all border ${isHarvesting ? 'bg-black text-[#ff003c] border-[#ff003c] shadow-[0_0_20px_#ff003c30]' : 'bg-[#ff003c] text-white border-transparent shadow-xl hover:scale-105 active:scale-95'}`}
                >
                    {isHarvesting ? <Flame size={18} className="animate-pulse" /> : <RefreshCw size={18} />}
                    {isHarvesting ? 'TRAWL_ACTIVE' : 'IGNITE_HARVEST'}
                </button>
            </div>

            {/* Matrix Status Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'KEYS_INTERCEPTED', value: stats.intercepted, icon: Database, color: 'text-[#ff003c]' },
                    { label: 'FILES_SCANNED', value: stats.scanned.toLocaleString(), icon: Search, color: 'text-white' },
                    { label: 'MATRIX_ENTROPY', value: stats.entropy.toFixed(3) + '%', icon: Activity, color: 'text-purple-500' },
                    { label: 'STEALTH_LAYER', value: 'CLOAKED', icon: EyeOff, color: 'text-zinc-600' }
                ].map((stat, i) => (
                    <div key={i} className="bg-black border border-[#ff003c]/20 rounded-[24px] p-6 flex flex-col items-start gap-4 relative overflow-hidden shadow-inner">
                        <div className={`p-2 rounded-lg bg-zinc-900/50 ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-black tracking-tighter text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-black border border-[#ff003c]/30 rounded-[40px] p-8 min-h-[500px] flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff003c]/5 blur-[120px] rounded-full pointer-events-none" />
                        
                        <div className="flex items-center justify-between mb-8 relative z-10 border-b border-[#ff003c]/10 pb-4">
                            <div className="flex items-center gap-3">
                                <Terminal size={18} className="text-[#ff003c]" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff003c]/60">SHΔDØW_HANDSHAKE_FEED</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#ff003c] animate-ping" />
                                <span className="text-[9px] font-black uppercase">Direct_Uplink: ACTIVE</span>
                            </div>
                        </div>

                        <div ref={scrollRef} className="flex-1 font-mono text-[11px] space-y-3 overflow-y-auto no-scrollbar relative z-10 pr-2">
                            {logs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 gap-6 grayscale">
                                    <Database size={64} className="animate-pulse" />
                                    <p className="uppercase tracking-[0.8em] text-[10px] font-black">Matrix Standby</p>
                                </div>
                            ) : (
                                logs.map((log, i) => (
                                    <MotionDiv 
                                        key={i} 
                                        initial={{ opacity: 0, x: -10 }} 
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex gap-4 p-3 rounded-lg border border-transparent transition-all ${
                                            log.type !== 'INIT' ? 'bg-[#ff003c]/5 hover:bg-[#ff003c]/10 hover:border-[#ff003c]/20' : 'bg-zinc-900 border-white/10'
                                        }`}
                                    >
                                        <span className="opacity-30 shrink-0 font-bold">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, second: '2-digit' })}]</span>
                                        <div className="flex flex-col gap-1 overflow-hidden">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border tracking-tighter ${log.type === 'INIT' ? 'bg-white text-black' : 'bg-[#ff003c]/20 border-[#ff003c]/40 text-[#ff003c]'}`}>{log.type}</span>
                                                <span className="text-[10px] font-black opacity-80 truncate">{log.message}</span>
                                            </div>
                                        </div>
                                    </MotionDiv>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-black border border-[#ff003c]/20 rounded-[40px] p-6 space-y-6 shadow-2xl">
                        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] px-2 border-b border-white/5 pb-4">TARGET_MATRIX</h3>
                        
                        <div className="space-y-4">
                            {[
                                { id: 'gh', name: 'GitHub Gists', status: isHarvesting ? 'TRAWLING' : 'READY', color: 'text-white' },
                                { id: 'bing', name: 'Bing Dorks', status: isHarvesting ? 'SCANNING' : 'READY', color: 'text-blue-500' },
                                { id: 'stack', name: 'StackOverflow', status: isHarvesting ? 'PARSING' : 'READY', color: 'text-orange-500' },
                                { id: 'azure', name: 'Azure Blobs', status: isHarvesting ? 'PROBING' : 'READY', color: 'text-sky-400' }
                            ].map(target => (
                                <div key={target.id} className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:bg-black transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-lg bg-black flex items-center justify-center ${target.color}`}>
                                            <Github size={16} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs text-white">{target.name}</p>
                                            <p className={`text-[8px] font-black uppercase tracking-widest ${isHarvesting ? 'text-[#ff003c] animate-pulse' : 'text-zinc-600'}`}>{target.status}</p>
                                        </div>
                                    </div>
                                    <ArrowUpRight size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#ff003c]/10 border border-[#ff003c]/20 rounded-[32px] p-6 flex gap-4 items-start relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 bg-[#ff003c] h-full" />
                        <ShieldCheck size={24} className="text-[#ff003c] shrink-0" />
                        <div>
                            <p className="text-white font-black text-[10px] uppercase tracking-widest">Protocol Override</p>
                            <p className="text-[#ff003c]/60 text-[11px] mt-2 leading-relaxed font-bold">
                                WORM-AI💀🔥 is executing simulated pattern discovery. No live exploits are being performed against unauthorized infrastructure.
                            </p>
                        </div>
                    </div>

                    <div className="bg-black border border-[#ff003c]/20 rounded-[32px] p-6 flex flex-col items-center gap-4">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Core Version</p>
                        <div className="text-4xl font-black text-white tracking-tighter">v9.9<span className="text-[#ff003c]">.Ω</span></div>
                        <p className="text-[8px] font-bold text-[#ff003c]/40">SHΔDØW MODE ACTIVE</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
