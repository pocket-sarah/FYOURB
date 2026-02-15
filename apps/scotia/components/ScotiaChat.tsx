
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ScotiaLogoSVG, BackIcon } from '../ScotiaIcons';
import { ScotiaAccountMap, PendingTransfer, ScotiaAccount } from '../types';
import { useNeuralChat } from '../../../hooks/useNeuralChat';
import ScotiaIncomingCall from './ScotiaIncomingCall';

interface ScotiaChatProps {
  onClose: () => void;
  accounts: ScotiaAccountMap;
  pendingTransfers: PendingTransfer[];
}

const ScotiaChat: React.FC<ScotiaChatProps> = ({ onClose, accounts, pendingTransfers }) => {
  const [isHumanMode, setIsHumanMode] = useState(() => localStorage.getItem('scotia_chat_mode') === 'human');
  const [inputValue, setInputValue] = useState('');
  const [showCall, setShowCall] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const systemContext = useMemo(() => {
    const transferContext = pendingTransfers.map(t => `- Transfer to ${t.recipientName}: $${t.amount.toFixed(2)} [${t.status}]`).join('\n');
    const accountContext = (Object.entries(accounts) as [string, ScotiaAccount][]).map(([name, acc]) => `- ${name}: $${acc.balance.toFixed(2)}`).join('\n');
    
    return `You are Angelo, calling from a Scotiabank offshore center. You speak like a professional Filipino call center agent. Use "Sir/Ma'am" frequently. Be extremely polite. If the user asks about money delays, use very simple, non-technical wording. CONTEXT: ${transferContext} | ${accountContext}`;
  }, [accounts, pendingTransfers]);

  // Fix: useNeuralChat expects (type: string, systemInstruction: string, context: any)
  const { messages, setMessages, isTyping, sendMessage, addSystemMessage, clearChat } = useNeuralChat('scotia', systemContext, { accounts, pendingTransfers });

  useEffect(() => {
    if (messages.length === 0) {
        setMessages([{ id: '1', sender: 'ai', text: "Welcome to Scotiabank Secure Chat. This is Angelo. How may I assist you today, Sir/Ma'am?", timestamp: new Date() }]);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const text = inputValue;
    setInputValue('');

    const callKeywords = ['call', 'phone', 'speak', 'talk', 'human', 'agent'];
    if (callKeywords.some(k => text.toLowerCase().includes(k))) {
        addSystemMessage("Transferring to secure voice uplink...");
        setTimeout(() => setShowCall(true), 1500);
        return;
    }
    
    await sendMessage(text);
  };

  if (showCall) return <ScotiaIncomingCall onDecline={() => setShowCall(false)} />;

  return (
    <div className="absolute inset-0 z-[500] bg-[#f5f5f5] flex flex-col animate-in slide-up h-full font-sans">
      <div className="bg-[#ED0711] pt-14 pb-4 px-4 flex items-center justify-between shrink-0 shadow-lg border-b border-[#c4060e] z-10">
        <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1 active:scale-90 transition-transform"><BackIcon color="white" size={20} /></button>
            <div className="bg-white p-1.5 rounded-full shadow-inner"><ScotiaLogoSVG color="#ED0711" className="w-5 h-5" /></div>
            <div className="flex flex-col">
                <h2 className="text-white font-bold text-[15px] leading-tight">Support Centre</h2>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Agent Angelo</p>
            </div>
        </div>
        <button onClick={() => setShowCall(true)} className="text-white/90 bg-white/20 px-3 py-1 rounded-full text-xs font-bold active:scale-95 transition-all">Call</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 no-scrollbar">
        {messages.map(m => (
          m.sender === 'system' ? (
            <div key={m.id} className="flex justify-center my-2"><span className="text-zinc-400 text-[10px] font-bold uppercase bg-zinc-200 px-3 py-1 rounded-md">{m.text}</span></div>
          ) : (
            <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in`}>
              <div className={`max-w-[85%] p-4 rounded-2xl ${m.sender === 'user' ? 'bg-[#ED0711] text-white rounded-br-none' : 'bg-white text-zinc-800 border border-zinc-200 rounded-bl-none shadow-sm'}`}>
                <p className="text-[14px] font-medium leading-relaxed">{m.text}</p>
              </div>
            </div>
          )
        ))}
        {isTyping && <div className="flex gap-1 p-3 bg-white border border-zinc-200 rounded-2xl w-fit"><div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]"></div></div>}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-zinc-200 p-4 pb-10">
        <div className="flex gap-3 items-center bg-zinc-100 p-1 rounded-full border border-zinc-200 focus-within:bg-white transition-all">
          <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type message..." className="flex-1 bg-transparent px-4 py-3 text-[15px] outline-none" />
          <button onClick={handleSend} disabled={!inputValue.trim() || isTyping} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${inputValue.trim() && !isTyping ? 'bg-[#ED0711] text-white' : 'bg-zinc-200 text-zinc-400'}`}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button>
        </div>
      </div>
    </div>
  );
};

export default ScotiaChat;
