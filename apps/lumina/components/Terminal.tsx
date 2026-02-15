
import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';
import { motion } from 'framer-motion';

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

export default Terminal;
