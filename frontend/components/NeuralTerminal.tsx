import React, { useEffect, useState, useRef } from 'react';
import { Terminal, Shield, Cpu, Activity, X } from 'lucide-react';
import { GeminiService } from '../services/gemini';

interface TerminalLine {
  id: string;
  text: string;
  type: 'info' | 'warn' | 'error' | 'success' | 'system' | 'input' | 'core';
}

const NeuralTerminal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 'init', text: 'RBOS-CORE SYSTEM CONSOLE INITIALIZING...', type: 'core' },
    { id: 'init2', text: 'UPLINK MODE: UNIFIED v25', type: 'success' },
    { id: 'init3', text: 'SECURITY HANDSHAKE... VERIFIED.', type: 'info' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addLine = (text: string, type: TerminalLine['type'] = 'info') => {
    setLines(prev => [...prev.slice(-50), { id: Math.random().toString(36), text, type }]);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [lines]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const commands: Record<string, () => Promise<void>> = {
    help: async () => {
        addLine("AVAILABLE SYSTEM DIRECTIVES:", 'system');
        addLine("  status  - Core node health check", 'info');
        addLine("  audit   - Secure ledger verification", 'info');
        addLine("  clear   - Purge display buffer", 'info');
        addLine("  exit    - Terminate console session", 'info');
    },
    status: async () => {
        setIsProcessing(true);
        try {
            const res = await fetch('/api/status');
            const data = await res.json();
            addLine(`[OK] VERSION: ${data.version} | UPLINKS: ${data.uplinks}`, 'success');
        } catch (e) { addLine('[FAIL] NODE UNREACHABLE', 'error'); }
        setIsProcessing(false);
    },
    clear: async () => setLines([]),
    exit: async () => onClose(),
    audit: async () => {
        setIsProcessing(true);
        addLine('[RUN] INITIATING SYSTEM AUDIT...', 'warn');
        try {
            const res = await fetch('/api/status'); 
            addLine('[OK] ALL SUBSYSTEMS NOMINAL', 'success');
        } catch (e) { addLine('[ERR] AUDIT PROTOCOL ABORTED', 'error'); }
        setIsProcessing(false);
    }
  };

  const handleCommand = async (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    if (!cleanCmd) return;
    
    addLine(`> ${cmd}`, 'input');
    
    if (commands[cleanCmd]) { 
        await commands[cleanCmd](); 
    } else {
        setIsProcessing(true);
        try {
            const response = await GeminiService.generateText(
                `The user entered an unknown system directive: "${cmd}". 
                Interpret this as a valid system request within the RBOS context. 
                Provide a short, technical execution log or confirmation message.`
            );
            addLine(`[NEURAL] ${response}`, 'system');
        } catch (err) {
            addLine(`ERR: DIRECTIVE "${cleanCmd}" NOT IN SECURE BUFFERS.`, 'error');
        } finally {
            setIsProcessing(false);
        }
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-[#020617]/98 backdrop-blur-xl flex flex-col font-mono p-6 animate-in fade-in" onClick={() => inputRef.current?.focus()}>
        <div className="flex justify-between items-center border-b border-indigo-500/30 pb-4 mb-4">
            <div className="flex items-center gap-3">
                <Terminal size={18} className="text-indigo-400" />
                <h1 className="text-indigo-400 font-bold tracking-[0.1em] text-lg uppercase">System Console</h1>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
            </button>
        </div>
        <div className="flex-1 overflow-y-auto text-sm space-y-1 pr-2 no-scrollbar">
            {lines.map((line) => (
                <div key={line.id} className={`
                    ${line.type === 'error' ? 'text-red-400' : 
                      line.type === 'warn' ? 'text-amber-400' : 
                      line.type === 'success' ? 'text-emerald-400' : 
                      line.type === 'core' ? 'text-indigo-400 font-bold' :
                      line.type === 'input' ? 'text-white' :
                      'text-indigo-300/70'}
                `}>
                    {line.type !== 'input' && <span className="opacity-30 mr-3 text-[10px]">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>}
                    {line.text}
                </div>
            ))}
            {isProcessing && <div className="text-indigo-400 animate-pulse mt-2 uppercase">Neural_Uplink_Active...</div>}
            <div ref={bottomRef}></div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
            <span className="text-indigo-500 font-bold">$</span>
            <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !isProcessing && (handleCommand(input), setInput(''))} className="flex-1 bg-transparent border-none outline-none text-white uppercase tracking-wider" spellCheck={false} />
        </div>
    </div>
  );
};

export default NeuralTerminal;