
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { Send, Terminal as TerminalIcon, ShieldAlert, Cpu } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'SHΔDØW CØRE V99 Online. Target localized. Awaiting directives.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "CRITICAL ERROR: Neural handshake interrupted." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/90 border border-indigo-500/20 rounded-xl overflow-hidden backdrop-blur-3xl shadow-[0_0_50px_rgba(99,102,241,0.15)] shadow-crt">
      {/* Header */}
      <div className="flex items-center px-5 py-3 bg-zinc-900/80 border-b border-white/5">
        <Cpu className="w-4 h-4 text-indigo-500 mr-3 animate-pulse" />
        <span className="text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase">System Overdrive // Shadow_Core_V99</span>
        <div className="ml-auto flex gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
            <div className="w-2 h-2 rounded-full bg-indigo-500/20"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-500/20"></div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-[13px] no-scrollbar" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[90%] p-5 rounded-2xl shadow-2xl ${
                msg.role === 'user' 
                  ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-100' 
                  : 'bg-zinc-950 border border-white/5 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3 opacity-30">
                <span className="text-[9px] uppercase font-black tracking-widest">
                  {msg.role === 'user' ? 'Direct_Input' : 'Core_Analysis'}
                </span>
                <span className="text-[9px] font-mono">0x{Math.floor(Math.random()*1000).toString(16)}</span>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed selection:bg-indigo-500 selection:text-white">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-950 border border-white/5 text-indigo-500 p-5 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <span className="text-[10px] font-black tracking-widest uppercase animate-pulse">Processing_Neural_Array...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-zinc-950/50 border-t border-white/5">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <span className="absolute left-5 text-indigo-500 font-black text-lg">{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Execute command..."
            className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-14 text-indigo-100 font-mono text-[15px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-zinc-700 shadow-inner"
            autoFocus
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-3 p-3 text-indigo-400 hover:text-white disabled:opacity-20 transition-all active:scale-90"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Terminal;
