
import React, { useState, useEffect, useRef } from 'react';
import { BankApp } from '../../types';
import { getSystemConfig } from '../../data/systemConfig';

interface PHPAdminAppProps {
  app: BankApp;
  onClose: () => void;
  onNotify: (title: string, message: string, icon: string) => void;
}

const PHPAdminApp: React.FC<PHPAdminAppProps> = ({ app, onClose, onNotify }) => {
  const systemConfig = getSystemConfig();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs' | 'mailer'>('dashboard');
  const [status, setStatus] = useState<any>(null);

  const [logs, setLogs] = useState([
    { id: 1, type: 'info', text: 'Booting Python Neural Engine...', time: '10:22:01' },
    { id: 2, type: 'success', text: 'FastAPI Server Online (Port 3001).', time: '10:22:02' },
    { id: 3, type: 'info', text: 'Telegram Bot Polling Started.', time: '10:22:03' },
  ]);
  const logsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/status');
        const data = await response.json();
        setStatus(data);
      } catch (e) {
        console.error('API Error:', e);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="absolute inset-0 bg-zinc-950 flex flex-col z-[100] animate-in slide-up overflow-hidden text-white font-sans">
      <header className="pt-20 px-8 pb-8 shrink-0 flex justify-between items-center bg-zinc-900/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#4F5B93] flex items-center justify-center shadow-lg border border-white/10">
            <img src={app.icon} alt="Python" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#4F5B93]">Neural Admin</h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Python Control Plane</p>
          </div>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center active:scale-90 transition-transform">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </header>

      <div className="flex border-b border-white/5 bg-zinc-900/20">
         {['dashboard', 'logs', 'mailer'].map(t => (
           <button 
             key={t}
             onClick={() => setActiveTab(t as any)}
             className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === t ? 'text-white' : 'text-zinc-600'}`}
           >
             {t}
             {activeTab === t && <div className="absolute bottom-0 left-4 right-4 h-1 bg-[#4F5B93] rounded-t-full"></div>}
           </button>
         ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-20 no-scrollbar">
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in space-y-6">
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900 rounded-[28px] p-5 border border-white/5 shadow-xl">
                    <p className="text-[9px] font-black text-zinc-600 uppercase mb-4 tracking-widest">Core Engine</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
                        <span className="text-sm font-bold tracking-tight">FastAPI</span>
                    </div>
                </div>
                <div className="bg-zinc-900 rounded-[28px] p-5 border border-white/5 shadow-xl">
                    <p className="text-[9px] font-black text-zinc-600 uppercase mb-4 tracking-widest">Telegram Uplink</p>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full shadow-lg ${status?.bot_active ? 'bg-green-500 shadow-green-500' : 'bg-red-500 shadow-red-500 animate-pulse'}`}></div>
                        <span className="text-sm font-bold tracking-tight">{status?.bot_active ? 'Connected' : 'Offline'}</span>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900 rounded-[28px] p-6 border border-white/5 shadow-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#4F5B93]/20 flex items-center justify-center text-[#4F5B93]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="18" r="4"/></svg>
              </div>
              <div>
                <p className="text-white font-bold text-[15px] mb-0.5">Bot Command Interface</p>
                <p className="text-green-400 text-[10px] font-black uppercase tracking-widest">/status /gen /logs</p>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-[28px] p-6 border border-white/5 shadow-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div>
                <p className="text-white font-bold text-[15px] mb-0.5">SMTP Mailer Service</p>
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Python smtplib Active</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="animate-in fade-in space-y-4 h-full flex flex-col">
            <h2 className="text-xl font-black mb-4 tracking-tight">System Logs</h2>
            <div ref={logsRef} className="bg-zinc-900 rounded-[32px] p-6 border border-white/5 shadow-xl flex-1 font-mono text-[10px] space-y-2 overflow-y-auto no-scrollbar">
              {logs.map(log => (
                <div key={log.id} className="flex gap-3 opacity-80 border-b border-white/5 pb-1">
                  <span className="text-zinc-600 shrink-0">[{log.time}]</span>
                  <span className={`flex-1 ${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : 'text-white/80'}`}>{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PHPAdminApp;
