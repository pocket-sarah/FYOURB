
import React, { useState, useEffect, useRef } from 'react';
import { ScotiaLogoSVG, BackIcon, MoreIcon } from '../ScotiaIcons';
import { ScotiaAccountMap, PendingTransfer } from '../types';
import { useNeuralChat, ChatOption } from '../../../hooks/useNeuralChat';
import { motion, AnimatePresence } from 'framer-motion';

interface ScotiaChatProps {
  onClose: () => void;
  accounts: ScotiaAccountMap;
  pendingTransfers: PendingTransfer[];
  senderName: string;
}

const ScotiaChat: React.FC<ScotiaChatProps> = ({ onClose, accounts, pendingTransfers, senderName }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  const { 
    messages, 
    setMessages, 
    isTyping, 
    sendMessage, 
    stage,
    enterQueue,
    confirmIdentity
  } = useNeuralChat('scotia', "Scotiabank Mobile Support Chat.", { accounts, pendingTransfers, senderName });

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ 
        id: 'initial', 
        sender: 'ai', 
        text: "Hi! I'm your Scotiabank virtual assistant. How can I help you today?", 
        timestamp: new Date(),
        options: [
            { label: 'Check account balance', id: 'bal' },
            { label: 'Payment issue', id: 'xfer' },
            { label: 'Talk to an agent', id: 'human' }
        ]
      }]);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim() || stage === 'queue') return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleOptionClick = (opt: ChatOption) => {
    if (opt.id === 'human' || opt.id === 'xfer') {
      enterQueue();
    } else if (opt.id === 'verify_identity') {
      confirmIdentity();
    } else {
      sendMessage(opt.label, true);
    }
  };

  return (
    <div className="absolute inset-0 z-[600] bg-white flex flex-col animate-in slide-up h-full font-sans text-zinc-900">
      {/* Authentic Red Header */}
      <header className="pt-14 pb-4 px-5 bg-[#ED0711] flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-1 active:opacity-60 transition-opacity">
                <BackIcon color="white" size={24} />
            </button>
            <div className="flex flex-col">
                <h2 className="text-white font-bold text-[17px] leading-tight">Help Centre</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                    <span className="text-white/80 text-[11px] font-medium">Virtual Assistant</span>
                </div>
            </div>
        </div>
        <button className="p-1 text-white/80">
            <MoreIcon size={20} />
        </button>
      </header>

      {/* Main Chat Body */}
      <div className="flex-1 relative flex flex-col overflow-hidden bg-[#F4F4F6]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map(m => (
                m.sender === 'system' ? (
                    <div key={m.id} className="flex justify-center my-2">
                        <span className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider bg-white/50 px-3 py-1 rounded-md border border-zinc-100">{m.text}</span>
                    </div>
                ) : (
                    <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}>
                        <div className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm ${
                            m.sender === 'user' 
                            ? 'bg-[#ED0711] text-white rounded-tr-none' 
                            : 'bg-white text-zinc-800 border border-zinc-200 rounded-tl-none'
                        }`}>
                            <p className="text-[14px] leading-relaxed font-medium">{m.text}</p>
                        </div>

                        {/* Professional Options Display */}
                        {m.options && (stage !== 'queue') && (
                            <div className="mt-3 flex flex-col gap-2 w-full max-w-[85%] animate-in fade-in">
                                {m.options.map(opt => (
                                    <button 
                                        key={opt.id}
                                        onClick={() => handleOptionClick(opt)}
                                        className="bg-white border border-[#ED0711] text-[#ED0711] px-4 py-2.5 rounded-xl text-[13px] font-bold text-left hover:bg-[#ED0711]/5 transition-colors shadow-sm active:scale-[0.98]"
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )
            ))}
            
            {isTyping && (
                <div className="flex items-center gap-1 p-3 bg-white border border-zinc-200 rounded-2xl rounded-tl-none w-fit shadow-sm">
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
            )}
        </div>

        {/* Quiet Connection State (No crazy animations) */}
        {stage === 'queue' && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center z-50">
                <div className="w-12 h-12 border-4 border-[#ED0711]/20 border-t-[#ED0711] rounded-full animate-spin mb-6"></div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">Connecting to an agent...</h3>
                <p className="text-zinc-500 text-sm">Please stay on this screen. We'll be with you shortly.</p>
            </div>
        )}
      </div>

      {/* Professional Input Bar */}
      <div className="p-4 pb-10 bg-white border-t border-zinc-200 shadow-lg">
        <div className="flex gap-2 items-center bg-[#F4F4F6] p-1.5 rounded-full border border-zinc-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#ED0711]/10 transition-all">
          <input 
            type="text" 
            value={inputValue} 
            onChange={e => setInputValue(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && handleSend()} 
            placeholder={stage === 'confirming_pin' ? "Enter PIN" : "Type a message..."}
            className="flex-1 bg-transparent px-4 py-2 text-[14px] outline-none text-zinc-900 font-medium" 
            disabled={stage === 'queue'}
          />
          <button 
            onClick={handleSend} 
            disabled={!inputValue.trim() || stage === 'queue'} 
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${inputValue.trim() ? 'bg-[#ED0711] text-white shadow-md' : 'bg-zinc-300 text-zinc-500'}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScotiaChat;
