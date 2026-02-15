import React, { useState, useEffect, useRef } from 'react';
import { BankApp } from '../../types';
import { SearchIcon, BackIcon, MoreIcon, PlusIcon } from './SmsIcons';

interface SmsMessage {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: Date;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  color: string;
  messages: SmsMessage[];
  isVerified?: boolean;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'scotia-alerts',
    name: 'Scotiabank Alerts',
    lastMessage: 'Your Interac e-Transfer was deposited.',
    time: '2m ago',
    avatar: 'S',
    color: '#ED0711',
    isVerified: true,
    messages: [
      { id: '1', text: 'Security Alert: A new sign-in to Scotiabank mobile banking was detected on Pixel 10 Pro.', sender: 'them', timestamp: new Date(Date.now() - 3600000) },
      { id: '2', text: 'INTERAC e-Transfer: You sent $150.00 to R. Banks. Ref: CA829371.', sender: 'them', timestamp: new Date(Date.now() - 1800000) },
      { id: '3', text: 'Your Interac e-Transfer was deposited.', sender: 'them', timestamp: new Date(Date.now() - 120000) },
    ]
  },
  {
    id: 'adam',
    name: 'Adam Jensen',
    lastMessage: 'Did you see the latest research update?',
    time: '1h ago',
    avatar: 'A',
    color: '#3b82f6',
    messages: [
      { id: '1', text: 'Hey, are we still meeting at 2?', sender: 'them', timestamp: new Date(Date.now() - 7200000) },
      { id: '2', text: 'Yeah, see you then.', sender: 'me', timestamp: new Date(Date.now() - 7100000) },
      { id: '3', text: 'Did you see the latest research update?', sender: 'them', timestamp: new Date(Date.now() - 3600000) },
    ]
  },
  {
    id: 'mom',
    name: 'Mom',
    lastMessage: 'Love you!',
    time: 'Yesterday',
    avatar: 'M',
    color: '#ec4899',
    messages: [
      { id: '1', text: 'Call me when you can.', sender: 'them', timestamp: new Date(Date.now() - 86400000) },
      { id: '2', text: 'Love you!', sender: 'them', timestamp: new Date(Date.now() - 82400000) },
    ]
  }
];

const SMS_TONE_URL = 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3';

const iOSMessengerApp: React.FC<{ 
  app: BankApp; 
  onClose: () => void; 
  onNotify: (title: string, message: string, icon: string) => void;
}> = ({ app, onClose, onNotify }) => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('rros_ios_sms_threads');
    return saved ? JSON.parse(saved).map((c: any) => ({
      ...c,
      messages: c.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
    })) : INITIAL_CONVERSATIONS;
  });
  
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    localStorage.setItem('rros_ios_sms_threads', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedThreadId, conversations]);

  // Listen for external Scotiabank events
  useEffect(() => {
    const handleBankAlert = (e: any) => {
      // This listener is for the iOSMessengerApp, so it continues to use 'scotia-bank-alert'
      const { title, message } = e.detail;
      playSmsTone();
      
      setConversations(prev => {
        const next = [...prev];
        const scotiaIdx = next.findIndex(c => c.id === 'scotia-alerts');
        if (scotiaIdx !== -1) {
          const newMessage: SmsMessage = {
            id: Date.now().toString(),
            text: message,
            sender: 'them',
            timestamp: new Date()
          };
          next[scotiaIdx].messages.push(newMessage);
          next[scotiaIdx].lastMessage = message;
          next[scotiaIdx].time = 'Now';
          // Move to top
          const [movedConv] = next.splice(scotiaIdx, 1);
          next.unshift(movedConv);
        }
        return next;
      });

      onNotify("Messages", `New alert from Scotiabank`, app.icon);
    };

    window.addEventListener('scotia-bank-alert', handleBankAlert);
    return () => window.removeEventListener('scotia-bank-alert', handleBankAlert);
  }, []);

  const playSmsTone = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(SMS_TONE_URL);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(e => console.log("Audio playback blocked", e));
  };

  const handleSend = () => {
    if (!inputValue.trim() || !selectedThreadId) return;

    const newMessage: SmsMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'me',
      timestamp: new Date()
    };

    setConversations(prev => prev.map(c => {
      if (c.id === selectedThreadId) {
        const updatedC = {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: inputValue,
          time: 'Now'
        };
        // Move updated conversation to the top
        const otherConversations = prev.filter(conv => conv.id !== selectedThreadId);
        return [updatedC, ...otherConversations];
      }
      return c;
    }).flat()); // Use flat() to handle the nested array from map correctly

    setInputValue('');
  };

  const selectedThread = conversations.find(c => c.id === selectedThreadId);

  return (
    <div className="absolute inset-0 bg-white flex flex-col z-[100] animate-in slide-up text-zinc-900 overflow-hidden font-sans">
      {/* Thread Detail View */}
      {selectedThreadId && selectedThread ? (
        <div className="absolute inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-right duration-300">
          <header className="pt-14 px-4 pb-4 flex items-center gap-3 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
            <button onClick={() => setSelectedThreadId(null)} className="p-2 -ml-2 text-zinc-600 active:bg-zinc-100 rounded-full">
              <BackIcon />
            </button>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm" style={{ backgroundColor: selectedThread.color }}>
              {selectedThread.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h2 className="font-bold text-[16px] truncate">{selectedThread.name}</h2>
                {selectedThread.isVerified && <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg></div>}
              </div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active now</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-zinc-400"><SearchIcon size={20}/></button>
              <button className="p-2 text-zinc-400"><MoreIcon /></button>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-10">
            <center className="py-10">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-black text-3xl mb-4 shadow-xl" style={{ backgroundColor: selectedThread.color }}>
                    {selectedThread.avatar}
                </div>
                <h3 className="font-bold text-xl">{selectedThread.name}</h3>
                <p className="text-zinc-400 text-sm mt-1">SMS/MMS Thread</p>
            </center>

            {selectedThread.messages.map(m => (
              <div key={m.id} className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-[22px] text-[15px] leading-relaxed shadow-sm ${
                  m.sender === 'me' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-zinc-100 text-zinc-800 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
                <span className="text-[9px] text-zinc-400 mt-1 px-2 font-bold uppercase">
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t border-zinc-100 pb-10 flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500"><PlusIcon size={20}/></button>
            <div className="flex-1 relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Text message"
                    className="w-full bg-zinc-100 rounded-full py-3 px-5 text-sm outline-none focus:bg-zinc-50 border border-transparent focus:border-zinc-200 transition-all"
                />
            </div>
            <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${inputValue.trim() ? 'bg-blue-600 text-white' : 'text-zinc-300'}`}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </div>
      ) : (
        /* Conversations List View */
        <>
          <header className="pt-16 px-6 pb-6 bg-white shrink-0">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-black tracking-tight text-zinc-900">Messages</h1>
              <div className="flex items-center gap-4">
                <button className="p-2 text-zinc-400"><SearchIcon size={24}/></button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-md"></div>
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-zinc-200 flex items-center justify-center text-zinc-400">
                        <PlusIcon />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">New</span>
                </div>
                {conversations.map(c => (
                    <button key={c.id} onClick={() => setSelectedThreadId(c.id)} className="flex flex-col items-center gap-1 shrink-0">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg relative" style={{ backgroundColor: c.color }}>
                            {c.avatar}
                            {c.id === 'scotia-alerts' && <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md"><div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div></div>}
                        </div>
                        <span className="text-[10px] font-bold text-zinc-600 truncate w-14 text-center">{c.name.split(' ')[0]}</span>
                    </button>
                ))}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto no-scrollbar px-2 pb-24">
            <div className="space-y-1">
              {conversations.map((c) => (
                <button 
                  key={c.id} 
                  onClick={() => setSelectedThreadId(c.id)}
                  className="w-full flex items-center gap-4 p-4 active:bg-zinc-50 rounded-[24px] transition-all group"
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-sm transition-transform group-active:scale-95" style={{ backgroundColor: c.color }}>
                    {c.avatar}
                  </div>
                  <div className="flex-1 min-w-0 text-left border-b border-zinc-50 pb-4">
                    <div className="flex justify-between items-center mb-0.5">
                      <div className="flex items-center gap-1">
                        <h3 className="font-bold text-[16px] text-zinc-900 truncate">{c.name}</h3>
                        {c.isVerified && <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center"><svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg></div>}
                      </div>
                      <span className="text-[11px] font-bold text-zinc-400">{c.time}</span>
                    </div>
                    <p className="text-[13px] text-zinc-500 truncate font-medium">{c.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button className="absolute bottom-10 right-8 w-16 h-16 rounded-[24px] bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/30 active:scale-90 transition-transform z-10">
            <PlusIcon size={32} />
          </button>
        </>
      )}

      {/* Hidden Audio for Tone */}
      <audio ref={audioRef} src={SMS_TONE_URL} hidden />
    </div>
  );
};

export default iOSMessengerApp;