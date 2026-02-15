
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNeuralChat } from '../hooks/useNeuralChat';
import { Sparkles, Send, Shield, Info } from 'lucide-react';

interface SystemAIProps {
  os: 'ios' | 'android';
}

// Fix: Use casted any for motion components to bypass intrinsic property errors
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

const SystemAI: React.FC<SystemAIProps> = ({ os }) => {
  const [isActive, setIsActive] = useState(false);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { messages, sendMessage, isTyping } = useNeuralChat(
    "system",
    "You are SARAH (Secure Automated Research & Analysis Hub), the primary AI core for RBOS OS. Your purpose is to assist the user with technical research, data analysis, and system navigation. Your tone is professional, efficient, and highly intelligent. You provide precise data points and helpful insights. You operate in Unified Mode v25.",
    {}
  );

  useEffect(() => {
    if (isActive) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isActive]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
    setInput('');
  };

  return (
    <>
      {/* Floating Trigger Button - Clean SARAH Style */}
      <div className="fixed bottom-6 right-6 z-[4000] pointer-events-auto">
        {/* Fix: Use MotionButton */}
        <MotionButton
          onClick={() => setIsActive(true)}
          className="w-14 h-14 rounded-[24px] bg-gradient-to-tr from-indigo-600 to-blue-700 shadow-xl flex items-center justify-center border-2 border-white/20 active:scale-90 transition-transform relative overflow-hidden group"
          whileHover={{ scale: 1.05 }}
        >
            <Sparkles size={24} className="text-white group-hover:rotate-12 transition-transform" />
        </MotionButton>
      </div>

      {/* SARAH Bottom Sheet */}
      <AnimatePresence>
        {isActive && (
          /* Fix: Use MotionDiv */
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] bg-slate-950/80 backdrop-blur-xl flex flex-col justify-end"
            onClick={() => setIsActive(false)}
          >
            {/* Fix: Use MotionDiv */}
            <MotionDiv
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full bg-[#1e293b] rounded-t-[32px] p-6 pb-12 shadow-2xl border-t border-white/10 relative overflow-hidden"
              onClick={(e: any) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                        <Shield size={20} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg leading-none">SARAH Core</h3>
                        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-1">Status: Operational</p>
                    </div>
                 </div>
                 <button onClick={() => setIsActive(false)} className="text-slate-400 hover:text-white transition-colors">
                    <Info size={20} />
                 </button>
              </div>

              {/* Chat Content */}
              <div className="mb-6 space-y-4 max-h-[40vh] overflow-y-auto no-scrollbar pt-2 px-1">
                {messages.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                        <p className="text-white font-bold text-lg tracking-tight">How can I assist you today?</p>
                        <p className="text-slate-400 text-xs mt-2">Neural Link established. Awaiting input.</p>
                    </div>
                )}
                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-5 py-3 rounded-[20px] text-[15px] leading-relaxed ${
                            m.sender === 'user' 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-slate-800 text-slate-200 border border-white/5'
                        }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-2 ml-4">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                    </div>
                )}
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmit} className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask SARAH..."
                    className="w-full bg-slate-900 border border-white/10 rounded-[22px] px-6 py-4 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium pr-14"
                />
                <button 
                    type="submit"
                    className="absolute right-2 top-2 w-11 h-11 bg-indigo-600 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform shadow-lg"
                >
                    <Send size={20} />
                </button>
              </form>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
};

export default SystemAI;
