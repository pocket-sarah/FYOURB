import React from 'react';
import { Conversation } from '../types';
import { SearchIcon, MoreVerticalIcon, MenuIcon } from '../AndroidIcons';

interface ConversationsListProps {
  conversations: Conversation[];
  onSelectThread: (id: string) => void;
  senderName: string;
}

const ConversationsList: React.FC<ConversationsListProps> = ({ conversations, onSelectThread, senderName }) => {
  return (
    <div className="flex-1 flex flex-col bg-white text-zinc-900 overflow-hidden">
      <header className="bg-[#1976D2] text-white py-4 px-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors">
            <MenuIcon color="white" />
          </button>
          <h1 className="text-xl font-medium">Messages</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors">
            <SearchIcon color="white" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors">
            <MoreVerticalIcon color="white" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectThread(c.id)}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm shrink-0`} style={{ backgroundColor: c.color }}>
              {c.avatar}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <h3 className="font-semibold text-base truncate">{c.name}</h3>
                <span className="text-xs text-gray-500">{c.time}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{c.lastMessage}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Floating Action Button */}
      <button className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#1976D2] text-white flex items-center justify-center shadow-lg hover:bg-[#1565C0] active:scale-95 transition-transform">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
};

export default ConversationsList;
