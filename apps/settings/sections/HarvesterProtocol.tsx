
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
    EyeOff
} from 'lucide-react';

export const HarvesterProtocol: React.FC<{ isDark: boolean; isHacker: boolean }> = ({ isDark, isHacker }) => {
    const [status, setStatus] = useState<any>(null);
    const [isHarvesting, setIsHarvesting] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);
    const [activeTarget, setActiveTarget] = useState('GitHub Gists');
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchStatus = async () => {
        try {
            const res = await fetch('/api/harvester/status');
            const data = await res.json();
            setStatus(data);
            setIsHarvesting(data.active);
        } catch (e) {}
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 3000);
        
        const targets = ['GitHub Gists', 'StackOverflow Leaks', 'Pastebin Dorks', 'Azure Key Vaults (Public)', 'Heroku Env Dumps'];
        let tIdx = 0;
        const targetTimer = setInterval(() => {
            if (isHarvesting) {
                tIdx = (tIdx + 1) % targets.length;
                setActiveTarget(targets[tIdx]);
            }
        }, 4000);

        const eventSource = new EventSource('/api/stream/logs');
        eventSource.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.origin === 'HARVESTER_CORE' || data.type.includes('KEY')) {
                setLogs(prev => [data, ...prev].slice(0, 40));
            }
        };
        
        return () => {
            clearInterval(interval);
            clearInterval(targetTimer);
            eventSource.close();
        };
    }, [isHarvesting]);

    const triggerHarvest = async () => {
        setIsHarvesting(true);
        try {
            await fetch('/api/harvester/trigger', { method: 'POST' });
        } catch (e) {}
    };

    const MotionDiv = motion.div as any;

    return (
        <div className="space-y-8 animate-in slide-up pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 ring-1 ring-white/10">
                        <Zap size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase">Harvester Protocol</h2>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Autonomous Matrix Expansion • HP-99</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={triggerHarvest}
                        disabled={isHarvesting}
                        className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${isHarvesting ? 'bg-zinc-800 text-zinc-500' : 'bg-white text-black hover:bg-indigo-500 hover:text-white shadow-xl active:scale-95'}`}
                    >
                        <RefreshCw size={16} className={isHarvesting ? 'animate-spin' : ''} />
                        {isHarvesting ? 'ACTIVE TRAWL' : 'IGNITE HARVEST'}
                    </button>
                </div>
            </div>

            {/* Active Trawl Target Banner */}
            <AnimatePresence>
                {isHarvesting && (
                    <MotionDiv 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Scanning Target:</span>
                            <span className="text-[10px] font-mono text-white/60">{activeTarget}</span>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-indigo-500/30 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>

            {/* Matrix Status Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Neural Pool', value: status?.pool_size || '0', icon: Database, color: 'text-blue-500', trend: '+12%' },
                    { label: 'Harvested', value: status?.stats?.total_extracted || '0', icon: Search, color: 'text-indigo-500', trend: 'LIVE' },
                    { label: 'Integrity', value: 'NOMINAL', icon: ShieldCheck, color: 'text-emerald-500', trend: '100%' },
                    { label: 'Stealth Level', value: 'CLOAKED', icon: EyeOff, color: 'text-rose-500', trend: 'STABLE' }
                ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900/80 border border-white/5 rounded-[28px] p-6 flex flex-col items-start gap-4 relative overflow-hidden group">
                        <div className={`p-2.5 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
                            <div className="flex items-end gap-2">
                                <p className="text-2xl font-black">{stat.value}</p>
                                <span className="text-[8px] font-bold text-white/20 mb-1">{stat.trend}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visualizer and Extraction Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="cyber-glass rounded-[40px] p-8 min-h-[450px] flex flex-col relative overflow-hidden border-indigo-500/10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none" />
                        
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <Terminal size={18} className="text-indigo-500" />
                                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Extraction Handshake Stream</h3>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase text-emerald-500/60">Proxy: Active</span>
                                </div>
                            </div>
                        </div>

                        <div ref={scrollRef} className="flex-1 font-mono text-[12px] space-y-4 overflow-y-auto no-scrollbar relative z-10 pr-2">
                            {logs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-10 gap-4">
                                    <Globe size={48} className="animate-spin-slow" />
                                    <p className="uppercase tracking-[0.6em] text-[10px]">Scanning Matrix Branches...</p>
                                </div>
                            ) : (
                                logs.map((log, i) => (
                                    <MotionDiv 
                                        key={i} 
                                        initial={{ opacity: 0, x: -10 }} 
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex gap-4 p-3 rounded-xl border border-transparent hover:border-white/5 transition-colors ${
                                            log.type.includes('EXTRACTED') ? 'bg-emerald-500/5 text-emerald-400' : 
                                            log.type.includes('ERROR') ? 'bg-red-500/5 text-red-400' : 'text-zinc-500'
                                        }`}
                                    >
                                        <span className="opacity-30 shrink-0 font-bold">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, second: '2-digit' })}]</span>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-black/40 rounded border border-white/5 tracking-tighter">HP-99</span>
                                                <span className="font-black uppercase tracking-widest">{log.type}</span>
                                            </div>
                                            <span className="leading-relaxed break-all font-medium opacity-80">{log.message}</span>
                                        </div>
                                    </MotionDiv>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Providers & Rotation Matrix */}
                <div className="space-y-6">
                    <div className="cyber-glass rounded-[40px] p-6 space-y-6">
                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] px-2">Rotation Matrix</h3>
                        
                        <div className="space-y-3">
                            {[
                                { id: 'gemini', name: 'Gemini AI', icon: Zap, status: 'Active', color: 'text-indigo-400' },
                                { id: 'github', name: 'GitHub Code', icon: Github, status: isHarvesting ? 'Scanning' : 'Standby', color: 'text-white' },
                                { id: 'bing', name: 'Bing Search', icon: Globe, status: isHarvesting ? 'Scanning' : 'Standby', color: 'text-blue-400' }
                            ].map(prov => (
                                <div key={prov.id} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${prov.color}`}>
                                            <prov.icon size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{prov.name}</p>
                                            <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">{prov.status}</p>
                                        </div>
                                    </div>
                                    <div className={`w-1.5 h-1.5 rounded-full ${prov.status === 'Scanning' ? 'bg-emerald-500 shadow-[0_0_8px_#10B981] animate-pulse' : 'bg-zinc-800'}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Node Health Alert */}
                    <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[32px] p-6 flex gap-4 items-start relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />
                        <Cpu size={24} className="text-indigo-400 shrink-0" />
                        <div>
                            <p className="text-indigo-200 font-bold text-sm uppercase tracking-tight">Auto-Rebalance</p>
                            <p className="text-indigo-100/40 text-xs mt-1 leading-relaxed">
                                System intelligently migrates workloads to secondary relays if primary SMTP latency exceeds 2000ms.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
            `}</style>
        </div>
    );
};
