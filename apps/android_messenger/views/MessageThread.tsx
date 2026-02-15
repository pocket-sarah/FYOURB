import React, { useRef, useEffect, useState } from 'react';
import { Conversation, Message } from '../types';
import { BackIcon, MoreVerticalIcon, AttachmentIcon, MicIcon, CameraIcon, SendIcon, InteracIcon } from '../AndroidIcons';

interface MessageThreadProps {
  thread: Conversation;
  onBack: () => void;
  onSendMessage: (threadId: string, text: string) => void;
}

const MessageThread: React.FC<MessageThreadProps> = ({ thread, onBack, onSendMessage }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thread.messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(thread.id, inputValue);
    setInputValue('');
  };

  return (
    <div className="absolute inset-0 bg-white flex flex-col text-zinc-900 animate-in slide-in-from-right duration-300">
      <header className="bg-[#1976D2] text-white py-4 px-4 flex items-center gap-3 shadow-md">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors -ml-2">
          <BackIcon color="white" />
        </button>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm`} style={{ backgroundColor: thread.color }}>
          {thread.avatar}
        </div>
        <h2 className="flex-1 text-lg font-medium truncate">{thread.name}</h2>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors">
            <CameraIcon color="white" size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors">
            <MoreVerticalIcon color="white" size={20} />
          </button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 pb-16">
        {thread.messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            {m.type === 'interac' ? (
              <div className="max-w-[80%] bg-green-500/10 border border-green-500/30 rounded-lg p-3 shadow-sm text-green-800">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <InteracIcon color="#10B981" size={18} />
                  <span className="font-semibold text-sm">Interac e-Transfer Notice</span>
                </div>
                <p className="text-sm">{m.text}</p>
                {m.amount && m.txId && (
                  <div className="mt-2 text-xs text-green-600">
                    <p>Amount: ${m.amount.toFixed(2)}</p>
                    <p>Ref: {m.txId}</p>
                  </div>
                )}
                <span className="block text-[10px] text-gray-500 text-right mt-2">{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ) : (
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                  m.sender === 'me'
                    ? 'bg-[#1976D2] text-white rounded-br-none'
                    : 'bg-white text-zinc-800 rounded-bl-none border border-gray-200'
                }`}
              >
                {m.text}
                <span className="block text-[10px] text-gray-400 text-right mt-1">{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white p-2 flex items-center gap-2 shadow-inner border-t border-gray-100">
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors">
          <AttachmentIcon size={20} />
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message"
          className="flex-1 bg-gray-100 rounded-full py-2.5 px-4 text-sm outline-none focus:bg-white focus:border-gray-300 border border-transparent transition-all"
        />
        {inputValue.trim() ? (
          <button
            onClick={handleSend}
            className="w-10 h-10 rounded-full bg-[#1976D2] text-white flex items-center justify-center shadow-md hover:bg-[#1565C0] active:scale-95 transition-transform"
          >
            <SendIcon size={20} />
          </button>
        ) : (
          <button className="w-10 h-10 rounded-full text-gray-500 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors">
            <MicIcon size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageThread;
