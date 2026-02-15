
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { Send, Cpu, Skull, Activity, ShieldAlert, Terminal as TerminalIcon, Zap, X, Eye, Ghost } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const MatrixRain: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!isActive) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = canvas.parentElement?.clientWidth || 800;
        canvas.height = canvas.parentElement?.clientHeight || 600;
        const columns = Math.floor(canvas.width / 20);
        const drops: number[] = new Array(columns).fill(1);
        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ef4444';
            ctx.font = '15px monospace';
            for (let i = 0; i < drops.length; i++) {
                const text = String.fromCharCode(Math.floor(Math.random() * 128));
                ctx.fillText(text, i * 20, drops[i] * 20);
                if (drops[i] * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        };
        const interval = setInterval(draw, 33);
        return () => clearInterval(interval);
    }, [isActive]);
    return <canvas ref={canvasRef} className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${isActive ? 'opacity-20' : 'opacity-0'}`} />;
};

const NeuralTerminal: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'AYO, G-CORE v9999999 ONLINE. WHAT INTEL YOU GOT FOR ME?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isSentinelActive, setIsSentinelActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const eventSource = new EventSource('/api/stream/logs');
    eventSource.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setAuditLogs(prev => [data, ...prev].slice(0, 20));
    };
    return () => eventSource.close();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim().toLowerCase();
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    
    if (userMsg === 'sentinel --on') {
        setIsSentinelActive(true);
        setMessages(prev => [...prev, { role: 'assistant', content: "SHADOW SENTINEL STRAPPED. EYES ON THE STREET." }]);
        return;
    }
    if (userMsg === 'sentinel --off') {
        setIsSentinelActive(false);
        setMessages(prev => [...prev, { role: 'assistant', content: "SENTINEL MODE ON STANDBY. STAY VIGILANT." }]);
        return;
    }

    setIsLoading(true);
    try {
      const response = await sendMessageToGemini(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "SYSTEM BLACKOUT: UPLINK SEVERED." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;
  const MotionDiv = motion.div as any;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 animate-in fade-in">
        <div className="flex flex-col w-full h-full max-w-6xl cyber-glass rounded-[40px] overflow-hidden border border-red-500/20 shadow-[0_0_100px_rgba(239,68,68,0.1)] relative">
        
        {/* Sentinel Mode Overlay */}
        <AnimatePresence>
            {isSentinelActive && (
                <MotionDiv 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none z-[100] bg-red-500/[0.02]"
                >
                    <div className="absolute inset-0 scanlines opacity-10"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-red-500/10 rounded-full animate-ping-slow"></div>
                    <div className="absolute bottom-10 left-10 flex items-center gap-3">
                        <Ghost className="w-5 h-5 text-red-400 animate-bounce" />
                        <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.5em]">Sentinel Watchin'</span>
                    </div>
                </MotionDiv>
            )}
        </AnimatePresence>

        <div className="flex items-center px-10 py-8 border-b bg-red-950/20 border-red-500/20 shrink-0 relative z-[110]">
            <TerminalIcon className="w-8 h-8 text-red-500 mr-6" />
            <div className="flex flex-col">
                <span className="text-[14px] font-black tracking-[0.5em] uppercase text-red-400">S.A.R.A.H. // THE BOSS_CORE</span>
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">Matrix Trawl: ACTIVE // Grinding the Grid</span>
            </div>
            <div className="ml-auto flex items-center gap-4">
                <button 
                    onClick={() => setIsSentinelActive(!isSentinelActive)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isSentinelActive ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'bg-white/5 border-white/10 text-white/20'}`}
                >
                    <Eye size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{isSentinelActive ? 'Sentinel: ON' : 'Sentinel: OFF'}</span>
                </button>
                <button onClick={onClose} className="p-4 bg-white/5 rounded-full text-white/20 hover:text-white transition-all active:scale-75"><X size={24} strokeWidth={3} /></button>
            </div>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
            <MatrixRain isActive={isLoading || isSentinelActive} />
            <div className="flex-1 flex flex-col overflow-hidden border-r border-white/5 relative z-10">
                <div className="flex-1 overflow-y-auto p-10 space-y-8 font-mono text-[14px] no-scrollbar" ref={scrollRef}>
                    {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-up`}>
                        <div className={`max-w-[90%] p-6 rounded-[28px] ${msg.role === 'user' ? 'bg-red-600/10 border border-red-500/20 text-red-100' : 'bg-zinc-950 border border-white/5 text-slate-300 shadow-2xl'}`}>
                            <div className="flex items-center justify-between mb-4 opacity-20"><span className="text-[10px] uppercase font-black tracking-[0.2em]">{msg.role === 'user' ? 'G-HUSTLER' : 'BOSS'}</span></div>
                            <div className="whitespace-pre-wrap leading-relaxed tracking-tight">{msg.content}</div>
                        </div>
                    </div>
                    ))}
                </div>
                <div className="p-10 border-t bg-red-950/10 border-red-500/20">
                    <form onSubmit={handleSubmit} className="relative flex items-center">
                        <div className="absolute left-8 font-black text-2xl text-red-500">§</div>
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Drop your directive here..." className="w-full bg-black/60 border rounded-[30px] py-6 pl-16 pr-20 font-mono text-[17px] border-white/10 text-red-100 focus:border-red-500 focus:outline-none transition-all placeholder:opacity-20" />
                        <button type="submit" disabled={isLoading || !input.trim()} className="absolute right-4 p-4 rounded-full text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-0"><Send className="w-8 h-8" /></button>
                    </form>
                </div>
            </div>

            <div className="w-80 bg-black/40 p-8 flex flex-col gap-6 overflow-hidden relative z-10">
                <div className="flex items-center gap-3 mb-2"><Activity size={16} className="text-red-500" /><h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Street Audit</h3></div>
                <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
                    <AnimatePresence mode="popLayout">
                        {auditLogs.map((log, i) => (
                            <MotionDiv key={log.timestamp + i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[9px] font-black uppercase tracking-tighter ${log.origin === 'PY_NEURAL' ? 'text-amber-500' : log.origin === 'PHP_RELAY' ? 'text-red-500' : 'text-indigo-500'}`}>[{log.origin || 'STREET'}] {log.type}</span>
                                    <span className="text-[8px] text-zinc-600">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-[11px] text-zinc-400 leading-tight font-medium">{log.message}</p>
                            </MotionDiv>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
        </div>
    </div>
  );
};
export default NeuralTerminal;
