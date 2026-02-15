
import React, { useState, useEffect, useRef } from 'react';
import { BankApp } from '../../types';
import AppLayout from '../shared/layouts/AppLayout';
import { EmailRelay } from '../shared/services/emailRelay';
import { Send, Terminal, Activity, CheckCircle, AlertTriangle, Zap, Flame, ShieldAlert, Cpu, Ghost, Layers, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ZDMApp: React.FC<{ app: BankApp; onClose: () => void; onNotify: any }> = ({ app, onClose, onNotify }) => {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [logs, setLogs] = useState<any[]>([]);
    const [status, setStatus] = useState<'idle' | 'failed' | 'debugging' | 'forcing' | 'success'>('idle');
    const [activeEnvironment, setActiveEnvironment] = useState<string | null>(null);
    const [showConfigError, setShowConfigError] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const addLog = (type: string, message: string, origin = 'SYSTEM') => {
        setLogs(prev => [{ timestamp: Date.now(), type, message, origin }, ...prev]);
    };

    const handleMagicForce = async () => {
        setStatus('forcing');
        setLogs([]);
        setShowConfigError(false);
        addLog('INIT', 'Commencing OBLIVION_FORCE Triple-Corridor Dispatch...');
        
        await new Promise(r => setTimeout(r, 800));

        // Corridors to attempt
        const corridors = [
            { id: 'NEXUS_JS_NODE', label: 'Node.js Core' },
            { id: 'VOID_THUG_PY', label: 'Python Logic Matrix' },
            { id: 'STREET_NODE_PHP', label: 'Legacy PHP Relay' }
        ];

        let successData = null;

        for (const corridor of corridors) {
            setActiveEnvironment(corridor.label);
            addLog('ATTEMPT', `Opening handshake with ${corridor.id}...`, corridor.id);
            
            // Wait for a simulated server response delay
            await new Promise(r => setTimeout(r, 1200));

            try {
                const result = await EmailRelay.send({ 
                    recipient_email: to, 
                    recipient_name: 'Validated Target', 
                    amount: 100, 
                    purpose: subject || 'Interac e-Transfer Forced Signal', 
                    template: 'Deposit.html',
                    force: true 
                });
                
                if (result.success) {
                    successData = result;
                    break;
                } else {
                    const traceMsg = result.telemetry?.[0] || result.message || "CORRIDOR_BLOCKED";
                    addLog('CRITICAL', traceMsg, corridor.id);
                    
                    if (traceMsg.includes('CONFIG_INCOMPLETE')) {
                        setShowConfigError(true);
                    }
                    
                    setStatus('failed');
                    await new Promise(r => setTimeout(r, 800));
                    setStatus('forcing');
                }
            } catch (e) {
                addLog('FATAL', 'Total Blackout. Manual Intervention Required.');
            }
        }
        
        if (successData) {
            setStatus('success');
            addLog('SUCCESS', `Signal released via ${successData.path}. HANDSHAKE CONFIRMED.`, 'VOID_BRIDGE');
            onNotify("ZDM OBLIVION", "SIGNAL FORCED OUT SUCCESSFULLY.", app.icon);
        } else {
            setStatus('failed');
            addLog('FATAL', 'All corridors monitored. Signal withheld to avoid detection.');
        }
    };

    const MotionDiv = motion.div as any;

    return (
        <AppLayout brandColor="#ff0000" onClose={onClose} title="Zero-Day Mailer // TRIPLE_CORRIDOR">
            <div className="h-full bg-black flex flex-col text-white font-sans overflow-hidden">
                
                {/* Visual Status Header */}
                <div className="bg-zinc-900/90 border-b border-white/5 px-8 py-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-6">
                        <div className={`p-3 rounded-2xl ${status === 'failed' ? 'bg-red-500 animate-pulse' : status === 'success' ? 'bg-emerald-500' : 'bg-red-600/20'} text-white`}>
                            {status === 'failed' ? <ShieldAlert size={28} /> : status === 'success' ? <CheckCircle size={28} /> : <Cpu size={28} />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Dispatch Array:</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${status === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>{status}</span>
                            </div>
                            <h2 className="text-xl font-black tracking-tighter uppercase italic">
                                {status === 'idle' ? 'G-Core v10.0 Armed' : activeEnvironment || 'Searching...'}
                            </h2>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="bg-black/40 px-6 py-2 rounded-full border border-white/5 flex items-center gap-3">
                            <Activity size={14} className="text-indigo-500" />
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Entropy: 0.042%</span>
                        </div>
                    </div>
                </div>

                {showConfigError && (
                    <MotionDiv 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }}
                        className="bg-red-600/20 border-b border-red-500/30 p-6 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center text-red-500">
                                <ShieldAlert size={24} />
                            </div>
                            <div>
                                <p className="font-black text-xs uppercase tracking-widest">Neural Warning: Handshake Prevented</p>
                                <p className="text-zinc-400 text-[11px] mt-1">The Logic Core is missing SMTP credentials. You must sync your settings to continue.</p>
                            </div>
                        </div>
                        <button 
                            className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        >
                            <Settings size={14} /> Fix Matrix
                        </button>
                    </MotionDiv>
                )}

                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                    
                    {/* Failure / Debug Overlay */}
                    <AnimatePresence>
                        {status === 'debugging' && (
                            <MotionDiv 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-10"
                            >
                                <div className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-8" />
                                <h3 className="text-2xl font-black italic text-emerald-400 animate-pulse uppercase tracking-tighter text-center">
                                    Corridors Monitored.<br/>Bypassing Host Blocks...
                                </h3>
                                <div className="mt-6 flex gap-1">
                                    {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }} />)}
                                </div>
                            </MotionDiv>
                        )}
                    </AnimatePresence>

                    {/* Inputs */}
                    <div className="w-full lg:w-1/2 p-10 space-y-8 overflow-y-auto no-scrollbar border-r border-white/5 bg-[#080808]">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Receiver Uplink</label>
                                <input value={to} onChange={e => setTo(e.target.value)} placeholder="target@vault.net" className="w-full bg-black border border-white/10 p-6 rounded-3xl outline-none focus:border-red-500/50 transition-all font-bold text-lg shadow-inner" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Subject Token</label>
                                <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Action Required: Deposit" className="w-full bg-black border border-white/10 p-6 rounded-3xl outline-none focus:border-red-500/50 transition-all font-bold text-sm shadow-inner" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Raw Payload</label>
                                <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Enter encrypted text segments..." className="w-full h-48 bg-black border border-white/10 p-6 rounded-[40px] outline-none focus:border-red-500/50 transition-all resize-none font-mono text-[13px] leading-relaxed shadow-inner" />
                            </div>
                        </div>

                        <button 
                            onClick={handleMagicForce}
                            disabled={status === 'forcing' || !to}
                            className={`w-full py-6 font-black rounded-[28px] transition-all flex items-center justify-center gap-4 uppercase tracking-[0.5em] text-sm active:scale-[0.98] shadow-2xl ${status === 'success' ? 'bg-emerald-600' : 'bg-red-700 hover:bg-red-600 shadow-red-900/40'}`}
                        >
                            {status === 'forcing' ? <Zap size={20} className="animate-spin" /> : <Flame size={20} />}
                            {status === 'success' ? 'SIGNAL RELEASED' : 'EXECUTE CASCADING SEND'}
                        </button>
                    </div>

                    {/* Resiliency Monitor */}
                    <div className="w-full lg:w-1/2 bg-[#030303] flex flex-col relative overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/40 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <Terminal size={18} className="text-red-500" />
                                <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em]">Audit: Neural Cascade</h3>
                            </div>
                            <Layers size={14} className="text-zinc-700" />
                        </div>
                        
                        <div className="flex-1 p-8 font-mono text-[12px] space-y-4 overflow-y-auto no-scrollbar scroll-smooth" ref={scrollRef}>
                            {logs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-10 text-center gap-4">
                                    <Ghost size={32} />
                                    <p className="uppercase tracking-[0.5em] text-[10px]">Awaiting Core Signal...</p>
                                </div>
                            ) : (
                                logs.map((log, i) => (
                                    <MotionDiv 
                                        key={i} 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`whitespace-pre-wrap flex gap-4 p-4 rounded-2xl border ${
                                            log.type === 'SUCCESS' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                                            log.type === 'CRITICAL' || log.type === 'ERROR' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                                            log.type === 'RECOVERY' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 
                                            log.type === 'ATTEMPT' ? 'bg-amber-500/5 border-amber-500/10 text-amber-500' :
                                            'bg-white/5 border-white/5 text-zinc-400'
                                        }`}
                                    >
                                        <div className="flex flex-col gap-1 flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-black text-[10px] uppercase tracking-widest">[{log.origin}]</span>
                                                <span className="opacity-30 text-[9px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                            <span className="font-bold text-[13px] tracking-tight">{log.message}</span>
                                        </div>
                                    </MotionDiv>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default ZDMApp;
