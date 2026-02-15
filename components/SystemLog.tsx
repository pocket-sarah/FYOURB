import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { FileText } from 'lucide-react';

interface SystemLogProps {
  logs: LogEntry[];
}

const SystemLog: React.FC<SystemLogProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-slate-900/50 border border-slate-700/50 rounded-lg overflow-hidden backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.1)]">
        <div className="flex items-center px-4 py-2 bg-slate-800/80 border-b border-slate-700">
            <FileText className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider">SYSTEM_LOGS // AUDIT_TRAIL</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2">
            {logs.map((log) => (
                <div key={log.id} className="flex gap-3 hover:bg-slate-800/30 p-1 rounded transition-colors">
                    <span className="text-slate-500 shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
                    <span className={`shrink-0 w-16 font-bold ${
                        log.level === 'ERROR' ? 'text-red-500' :
                        log.level === 'WARN' ? 'text-yellow-500' :
                        log.level === 'SUCCESS' ? 'text-green-500' :
                        log.level === 'SYSTEM' ? 'text-purple-400' :
                        'text-cyan-500'
                    }`}>{log.level}</span>
                    <span className="text-slate-300 break-all">{log.message}</span>
                </div>
            ))}
            <div ref={endRef} />
        </div>
    </div>
  );
};

export default SystemLog;
