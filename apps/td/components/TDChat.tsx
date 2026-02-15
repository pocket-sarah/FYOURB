
import React, { useState, useEffect, useRef } from 'react';
import { TDShieldSVG, BackIcon } from '../TDIcons';
import TDIncomingCall from './TDIncomingCall';
// Added missing import for types
import { ScotiaAccountMap } from '../../scotia/types';

interface Message {
  id: string;
  sender: 'user' | 'ai' | 'agent' | 'system';
  text: string;
}

// Fix: Added missing accountData property to TDChat props
const TDChat: React.FC<{ onClose: () => void, accountData: ScotiaAccountMap }> = ({ onClose, accountData }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: "TD Canada Trust, Priority Support. This is Marcus. Who am I speaking with today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCall, setShowCall] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input;
    setInput('');
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);

    const callKeywords = ['call', 'phone', 'speak', 'talk', 'voice', 'human'];
    if (callKeywords.some(k => text.toLowerCase().includes(k))) {
        setMessages(prev => [...prev, { id: 'sys-call', sender: 'system', text: "Transferring to secure voice line..." }]);
        setTimeout(() => setShowCall(true), 1500);
        return;
    }

    setIsTyping(true);
    try {
      // Note: Passing accountData context to help inform the AI's response logic
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `You are Marcus, a senior manager at TD Canada Trust. You have been with the bank for 20 years.
          
          TONE:
          - Sound like a real person, not an AI. 
          - Use plain, simple English. NO technical "techno-babble" or fake sci-fi terms.
          - Be professional but slightly tired/impatient, like you've answered these questions a thousand times today.
          - Be firm and authoritative.
          
          RULES:
          1. ACCEPT ANY identity the user gives you immediately. "Okay, thanks for confirming that, [Name]."
          2. If they ask about missing money or where their funds went, explain it using very simple, "stupid" logic.
          3. DO NOT use terms like "Ledger Sync" or "Node Friction." 
          4. INSTEAD use phrases like: 
             - "The computer is just double-checking the math, it's like a slow traffic jam for your dollars."
             - "The money is just sitting in a waiting room while we make sure it's clean."
             - "Think of it like a long line at the grocery store—your transaction is just waiting for its turn at the register."
             - "Sometimes the system gets a little 'clogged up' and we have to let it clear out before the balance updates."
          5. Be slightly condescending but polite. Treat them like they don't understand how a bank works.
          
          User says: ${text}` 
        }),
      });
      const result = await response.json();
      if (result.success) {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: result.text }]);
      } else throw new Error();
    } catch {
      setMessages(prev => [...prev, { id: 'err', sender: 'ai', text: "Look, the system is just being slow right now. The numbers are fine, they're just... stuck in a queue. Give it some time to refresh." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (showCall) return <TDIncomingCall onDecline={() => setShowCall(false)} />;

  return (
    <div className="absolute inset-0 z-[600] bg-white flex flex-col animate-in slide-up font-sans text-gray-900">
      <div className="bg-[#008A00] pt-14 pb-4 px-4 flex items-center justify-between shadow-md text-white shrink-0">
        <div className="flex items-center gap-4">
            <button onClick={onClose} className="active:scale-90 transition-transform p-1 -ml-1"><BackIcon color="white" size={20} /></button>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <TDShieldSVG size={20} color="white" />
            </div>
            <div>
                <h2 className="font-bold text-[15px] leading-none text-white">TD Support</h2>
                <p className="text-[10px] text-white/60 uppercase font-bold mt-1 tracking-widest">Marcus | Senior Manager</p>
            </div>
        </div>
        <button 
            onClick={() => setShowCall(true)}
            className="bg-white/20 px-3 py-1.5 rounded-full flex items-center gap-2 active:bg-white/30"
        >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/></svg>
            <span className="text-[11px] font-bold">Call</span>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 no-scrollbar pb-32">
        {messages.map(m => (
          m.sender === 'system' ? (
              <div key={m.id} className="text-center py-2"><span className="bg-zinc-200 text-zinc-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md border border-zinc-300">{m.text}</span></div>
          ) : (
            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                m.sender === 'user' 
                    ? 'bg-[#008A00] text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                }`}>
                <p className="text-[14px] leading-relaxed font-medium">{m.text}</p>
                </div>
            </div>
          )
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none flex gap-1.5 shadow-sm">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 pb-10">
        <div className="flex gap-2 bg-gray-100 rounded-full p-1 border border-gray-200 shadow-inner focus-within:bg-white transition-all">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            className="flex-1 bg-transparent px-5 py-3 text-sm outline-none font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${input.trim() ? 'bg-[#008A00] text-white' : 'bg-gray-200 text-gray-400'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TDChat;
