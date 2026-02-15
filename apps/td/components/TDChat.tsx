
import React, { useState, useEffect, useRef } from 'react';
import { BackIcon, TDLogoSVG } from '../TDIcons';
import { useNeuralChat, ChatOption } from '../../../hooks/useNeuralChat';
import { motion, AnimatePresence } from 'framer-motion';

const TDChat: React.FC<{ onClose: () => void, accountData?: any }> = ({ onClose, accountData }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  const { 
    messages, 
    setMessages, 
    isTyping, 
    sendMessage, 
    stage, 
    queueInfo, 
    enterQueue,
    confirmIdentity
  } = useNeuralChat('td', "TD Canada Trust Support Chat.", { ...accountData, senderName: 'Jennifer Edwards' });

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ 
        id: 'start', 
        sender: 'ai', 
        text: "Hello, I'm your TD Virtual Assistant. I can help with account balances, lost cards, and more. What can I do for you?", 
        timestamp: new Date(),
        options: [
            { label: 'View account balance', id: 'bal' },
            { label: 'Missing transaction', id: 'xfer' },
            { label: 'Chat with a representative', id: 'human' }
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
    <div className="absolute inset-0 z-[600] bg-[#F3F3F3] flex flex-col animate-in slide-up h-full font-sans text-gray-900">
      {/* TD Green Professional Header */}
      <header className="pt-14 pb-4 px-5 bg-[#008A00] flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1 active:opacity-60 transition-opacity">
                <BackIcon color="white" size={24} />
            </button>
            <div className="flex flex-col">
                <h2 className="text-white font-bold text-[17px]">Support</h2>
                <p className="text-white/80 text-[11px] font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    Virtual Assistant
                </p>
            </div>
        </div>
        <div className="w-10 h-10 bg-white rounded-lg p-1.5 flex items-center justify-center">
            <TDLogoSVG size={28} />
        </div>
      </header>

      {/* Messaging Area */}
      <div className="flex-1 relative flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-[#F9F9F9]">
            {messages.map(m => (
                m.sender === 'system' ? (
                    <div key={m.id} className="text-center py-2">
                        <span className="bg-gray-200 text-gray-500 text-[11px] font-bold uppercase px-4 py-1.5 rounded-full">{m.text}</span>
                    </div>
                ) : (
                    <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}>
                        <div className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm ${
                            m.sender === 'user' 
                            ? 'bg-[#008A00] text-white rounded-tr-none' 
                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                        }`}>
                            <p className="text-[14px] leading-relaxed font-medium">{m.text}</p>
                        </div>
                        
                        {m.options && (stage !== 'queue') && (
                            <div className="mt-3 flex flex-col gap-2 w-full max-w-[85%] animate-in fade-in">
                                {m.options.map(opt => (
                                    <button 
                                        key={opt.id}
                                        onClick={() => handleOptionClick(opt)}
                                        className="bg-white border border-[#008A00] text-[#008A00] px-4 py-2.5 rounded-lg text-[13px] font-bold text-left shadow-sm hover:bg-green-50 active:scale-[0.98] transition-all"
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
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none flex gap-1 shadow-sm w-fit">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
            )}
        </div>

        {/* Clean Queue/Connecting State */}
        {stage === 'queue' && (
            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-10 text-center z-50">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-[#008A00] rounded-full animate-spin mb-6"></div>
                <h3 className="text-gray-900 font-bold text-lg mb-2 uppercase tracking-wide">Please stay on the line</h3>
                <p className="text-gray-500 text-sm font-medium">Connecting you to a representative. Est. wait time: {queueInfo.wait} min.</p>
            </div>
        )}
      </div>

      {/* Footer Input */}
      <div className="p-4 bg-white border-t border-gray-200 pb-10">
        <div className="flex gap-3 bg-[#F3F3F3] rounded-full p-1.5 border border-gray-200 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-green-500/10">
          <input 
            type="text" 
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="How can we help?"
            className="flex-1 bg-transparent px-4 py-2 text-[14px] outline-none font-medium text-gray-900"
            disabled={stage === 'queue'}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || stage === 'queue'}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${inputValue.trim() ? 'bg-[#008A00] text-white active:scale-95' : 'bg-gray-300 text-gray-500'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TDChat;
