import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/gemini';
import { Message } from '../types';

const TextGenerator: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I am Lumina. How can I help you create today?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      let assistantContent = '';
      const assistantId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', timestamp: Date.now() }]);

      const stream = GeminiService.generateTextStream(input);
      for await (const chunk of stream) {
        // Correct adherence to @google/genai chunk.text property
        assistantContent += chunk;
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m));
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: 'err', role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-6">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pb-24 pr-2 no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-[24px] ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed text-[15px] font-medium">{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-white/5 p-4 rounded-[20px] rounded-tl-none">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your creative request here..."
            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-600 transition-all shadow-2xl text-white font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default TextGenerator;