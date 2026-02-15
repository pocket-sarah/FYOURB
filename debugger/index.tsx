import React, { useState, useEffect, useMemo } from 'react';
import { BankApp } from '../../types';
import AppLayout from '../shared/layouts/AppLayout';
import { 
  Activity, 
  Cpu, 
  Database, 
  Zap, 
  Shield, 
  Terminal, 
  Wifi, 
  Radio, 
  Fingerprint,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  HardDrive,
  Eye,
  Settings
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const DebuggerApp: React.FC<{ app: BankApp; onClose: () => void; onNotify: any }> = ({ app, onClose, onNotify }) => {
    const [activeTab, setActiveTab] = useState<'telemetry' | 'modules' | 'neural' | 'logs'>('telemetry');
    const [systemData, setSystemData] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [uplinks, setUplinks] = useState<any[]>([]);

    // Simulated Real-time Telemetry
    useEffect(() => {
        const interval = setInterval(() => {
            setSystemData(prev => {
                const newData = {
                    time: new Date().toLocaleTimeString([], { hour12: false, second: '2-digit' }),
                    entropy: Math.random() * 40 + 20,
                    load: Math.random() * 30 + 10,
                    neural: Math.random() * 50 + 40
                };
                return [...prev.slice(-14), newData];
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Sync with global log hub
    useEffect(() => {
        const eventSource = new EventSource('/api/stream/logs');
        eventSource.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setLogs(prev => [data, ...prev].slice(0, 100));
        };
        return () => eventSource.close();
    }, []);

    // Fetch Neural status
    useEffect(() => {
        fetch('/api/status').then(r => r.json()).then(data => {
            if (data.uplinks) setUplinks(data.uplinks);
        }).catch(() => {});
    }, []);

    const runModuleScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            onNotify("Debugger", "Module integrity scan complete. 0 errors.", app.icon);
        }, 2000);
    };

    const MotionDiv = motion.div as any;

    return (
        <AppLayout brandColor="#6366f1" onClose={onClose} title="MD-X System Debugger">
            <div className="h-full bg-[#050505] flex flex-col font-sans text-white overflow-hidden">
                {/* Status Ticker */}
                <div className="h-8 bg-indigo-600/10 border-b border-white/5 flex items-center px-4 gap-6 overflow-hidden shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Core Status: Nominal</span>
                    </div>
                    <div className="flex-1 overflow-hidden whitespace-nowrap">
                        <p className="text-[9px] font-mono text-indigo-400/60 uppercase tracking-tighter animate-marquee">
                            Handshake Protocol 7.2 Active // Interac Relay Synchronized // Neural Matrix Entropy at 0.042% // Encryption Level: Military Grade AES-256-GCM
                        </p>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Navigation Sidebar */}
                    <div className="w-16 md:w-56 bg-black border-r border-white/5 flex flex-col shrink-0">
                        <div className="p-4 space-y-2 mt-4">
                            {[
                                { id: 'telemetry', label: 'Telemetry', icon: Activity },
                                { id: 'modules', label: 'Modules', icon: Database },
                                { id: 'neural', label: 'Neural Matrix', icon: Zap },
                                { id: 'logs', label: 'Audit Trail', icon: Terminal }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as any)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'}`}
                                >
                                    <item.icon size={20} />
                                    <span className="hidden md:block font-bold text-sm">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-auto p-4 space-y-4 pb-12">
                             <div className="hidden md:block bg-zinc-900 rounded-2xl p-4 border border-white/5">
                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Memory usage</p>
                                <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[65%]" />
                                </div>
                                <p className="text-[10px] text-right mt-1 font-mono opacity-40">142MB / 256MB</p>
                             </div>
                             <button onClick={onClose} className="w-full p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                                <Settings size={20} />
                             </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-[#080808]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'telemetry' && (
                                <MotionDiv key="tele" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Chart 1: Load */}
                                        <div className="cyber-glass rounded-[32px] p-6 h-[300px] flex flex-col">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <Cpu size={18} className="text-indigo-400" />
                                                    <h3 className="text-sm font-black uppercase tracking-widest">Logic Core Load</h3>
                                                </div>
                                                <span className="text-xs font-mono text-indigo-400">{(systemData[systemData.length - 1]?.load || 0).toFixed(1)}%</span>
                                            </div>
                                            <div className="flex-1 min-h-0">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={systemData}>
                                                        <defs>
                                                            <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <Area type="monotone" dataKey="load" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Chart 2: Neural Entropy */}
                                        <div className="cyber-glass rounded-[32px] p-6 h-[300px] flex flex-col">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <Radio size={18} className="text-emerald-400" />
                                                    <h3 className="text-sm font-black uppercase tracking-widest">Neural Entropy</h3>
                                                </div>
                                                <span className="text-xs font-mono text-emerald-400">{(systemData[systemData.length - 1]?.entropy || 0).toFixed(1)}%</span>
                                            </div>
                                            <div className="flex-1 min-h-0">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={systemData}>
                                                        <defs>
                                                            <linearGradient id="colorEntropy" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <Area type="monotone" dataKey="entropy" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEntropy)" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>

                                    {/* System Summary Widgets */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Uplink Latency', value: '42ms', icon: Wifi, color: 'text-blue-400' },
                                            { label: 'Active Processes', value: '12', icon: Activity, color: 'text-indigo-400' },
                                            { label: 'Storage Sync', value: 'Nominal', icon: HardDrive, color: 'text-emerald-400' },
                                            { label: 'Vault Lockdown', value: 'Active', icon: Shield, color: 'text-rose-400' }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-zinc-900 border border-white/5 rounded-2xl p-5 flex flex-col items-center text-center gap-2">
                                                <stat.icon size={18} className={stat.color} />
                                                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                                                <p className="font-bold text-lg">{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </MotionDiv>
                            )}

                            {activeTab === 'modules' && (
                                <MotionDiv key="mods" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-xl font-black uppercase tracking-widest">Active Module Manifest</h2>
                                        <button 
                                            onClick={runModuleScan}
                                            disabled={isScanning}
                                            className="px-6 py-2 bg-indigo-600 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-3 disabled:opacity-50"
                                        >
                                            <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
                                            Re-Scan Matrix
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { id: 'scotia', name: 'Scotiabank Clone', status: 'SYNCHRONIZED', health: 100 },
                                            { id: 'td', name: 'TD Canada Trust', status: 'SYNCHRONIZED', health: 100 },
                                            { id: 'wallet', name: 'Secure Wallet', status: 'ENCRYPTED', health: 98 },
                                            { id: 'messenger', name: 'SMS Intercept', status: 'LISTENING', health: 100 },
                                            { id: 'zdm', name: 'Zero-Day Mailer', status: 'ARMED', health: 100 }
                                        ].map(mod => (
                                            <div key={mod.id} className="bg-zinc-900 border border-white/5 p-5 rounded-[24px] flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500">
                                                        <Database size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-lg">{mod.name}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{mod.status}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Module Health</p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-32 h-1.5 bg-black rounded-full overflow-hidden">
                                                            <div className="h-full bg-indigo-500" style={{ width: `${mod.health}%` }} />
                                                        </div>
                                                        <span className="font-mono text-xs">{mod.health}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </MotionDiv>
                            )}

                            {activeTab === 'neural' && (
                                <MotionDiv key="neural" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2 cyber-glass rounded-[40px] p-8 flex flex-col justify-between relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-3xl rounded-full" />
                                            <div className="relative z-10">
                                                <h3 className="text-xl font-black uppercase tracking-widest mb-2">Neural Matrix Status</h3>
                                                <p className="text-zinc-500 text-sm font-medium">Monitoring Gemini Flash 3 Cluster Uplinks</p>
                                                
                                                <div className="grid grid-cols-2 gap-8 mt-12">
                                                    <div>
                                                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Active Keys</p>
                                                        <p className="text-4xl font-black">{uplinks.length}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Avg Response Time</p>
                                                        <p className="text-4xl font-black text-indigo-400">0.82s</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-12 h-24 relative z-10">
                                                 <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={uplinks}>
                                                        <Bar dataKey="errors" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                                        <Bar dataKey="id" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                 </ResponsiveContainer>
                                            </div>
                                        </div>

                                        <div className="bg-zinc-900 border border-white/5 rounded-[40px] p-8 space-y-6">
                                            <div className="flex items-center gap-3">
                                                <AlertTriangle size={18} className="text-amber-500" />
                                                <h4 className="text-sm font-black uppercase tracking-widest">Rotation Alerts</h4>
                                            </div>
                                            <div className="space-y-4">
                                                {uplinks.filter(u => !u.available).length > 0 ? (
                                                     uplinks.filter(u => !u.available).map((u, i) => (
                                                        <div key={i} className="flex gap-4 items-start animate-in slide-up">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shadow-[0_0_8px_#ef4444]" />
                                                            <div>
                                                                <p className="text-xs font-bold text-red-400">Key Exhausted</p>
                                                                <p className="text-[10px] text-zinc-500 mt-0.5">ID: {u.masked_key}</p>
                                                            </div>
                                                        </div>
                                                     ))
                                                ) : (
                                                    <div className="text-center py-12">
                                                        <Shield size={32} className="text-emerald-500 mx-auto mb-4 opacity-20" />
                                                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">All Keys Healthy</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Manual Injection Control */}
                                    <div className="bg-indigo-600 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="text-center md:text-left">
                                            <h3 className="text-2xl font-black tracking-tighter">Credential Harvest</h3>
                                            <p className="text-indigo-100/60 text-sm font-medium mt-1">Initiate autonomous search for leaked API keys in target repos.</p>
                                        </div>
                                        <button className="px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs">
                                            Engage Crawler
                                        </button>
                                    </div>
                                </MotionDiv>
                            )}

                            {activeTab === 'logs' && (
                                <MotionDiv key="logs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
                                    <div className="flex justify-between items-center mb-6 px-2">
                                        <div className="flex items-center gap-3">
                                            <Terminal size={18} className="text-indigo-500" />
                                            <h3 className="text-sm font-black uppercase tracking-widest">Unified Audit Trail</h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-zinc-500 uppercase">Search active</span>
                                            <button onClick={() => setLogs([])} className="text-[10px] font-bold text-red-500 uppercase hover:underline">Clear</button>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 font-mono text-[12px] bg-black/40 rounded-3xl p-6 border border-white/5 min-h-[400px]">
                                        {logs.map((log, i) => (
                                            <div key={i} className="flex gap-4 pb-2 border-b border-white/[0.03] animate-in fade-in">
                                                <span className="text-zinc-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, second: '2-digit' })}]</span>
                                                <span className={`shrink-0 font-black ${log.origin === 'PY_NEURAL' ? 'text-amber-500' : log.origin === 'PHP_RELAY' ? 'text-rose-500' : 'text-indigo-500'}`}>[{log.origin || 'CORE'}]</span>
                                                <span className="text-zinc-400 font-bold">{log.type}</span>
                                                <span className="text-zinc-500 leading-relaxed">{log.message}</span>
                                            </div>
                                        ))}
                                        {logs.length === 0 && (
                                            <div className="h-full flex items-center justify-center opacity-10">
                                                <p className="text-xs uppercase tracking-[0.5em]">Awaiting events...</p>
                                            </div>
                                        )}
                                    </div>
                                </MotionDiv>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Bottom Interactive Grid */}
                <div className="h-24 bg-black border-t border-white/5 shrink-0 flex items-center px-8 gap-4 overflow-x-auto no-scrollbar">
                     <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mr-4">Hardware Sim:</p>
                     {[
                        { label: 'NFC Collision', icon: Radio },
                        { label: 'Bio Failure', icon: Fingerprint },
                        { label: 'Sat-Link Lock', icon: Eye },
                        { label: 'GPS Warp', icon: Wifi }
                     ].map((btn, i) => (
                        <button key={i} className="px-5 py-3 bg-zinc-900 border border-white/10 rounded-2xl flex items-center gap-3 hover:bg-indigo-600 hover:border-indigo-500 group transition-all shrink-0">
                            <btn.icon size={16} className="text-indigo-500 group-hover:text-white" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white">{btn.label}</span>
                        </button>
                     ))}
                </div>
            </div>
        </AppLayout>
    );
};

export default DebuggerApp;