import React, { useState, useEffect, useRef } from 'react';
import { BankApp } from '../../types';
import ConversationsList from './views/ConversationsList';
import MessageThread from './views/MessageThread';
import AndroidHeader from './components/AndroidHeader';
import AndroidFooter from './components/AndroidFooter';
import { Conversation, Message } from './types';
import { getSystemConfig } from '../../data/systemConfig';

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: '10001',
    name: '10001',
    lastMessage: 'Security protocol active.',
    time: 'Just now',
    avatar: '!',
    color: '#333333',
    isVerified: true,
    messages: [
      { id: '1', text: 'Secure automated notification channel established.', sender: 'system', timestamp: new Date(), type: 'text' },
    ]
  },
  {
    id: 'interac-notices',
    name: 'Interac Notices',
    lastMessage: 'No new notices.',
    time: '1h ago',
    avatar: 'I',
    color: '#008A00',
    isVerified: true,
    messages: [
      { id: '1', text: 'Welcome to your Interac Notices feed.', sender: 'system', timestamp: new Date(Date.now() - 3600000), type: 'text' },
    ]
  },
  {
    id: 'sarah-banks',
    name: 'SARAH BANKS',
    lastMessage: 'Did you get the file?',
    time: '2h ago',
    avatar: 'S',
    color: '#3F51B5', 
    messages: [
      { id: '1', text: 'Hey, I sent the encrypted file.', sender: 'them', timestamp: new Date(Date.now() - 7200000), type: 'text' },
      { id: '2', text: 'Received. Decrypting now...', sender: 'me', timestamp: new Date(Date.now() - 7100000), type: 'text' },
      { id: '3', text: 'Did you get the file?', sender: 'them', timestamp: new Date(Date.now() - 6000000), type: 'text' },
    ]
  }
];

const ANDROID_MESSAGE_TONE_URL = 'https://assets.mixkit.co/active_storage/sfx/2281/2281-preview.mp3'; 

const AndroidMessengerApp: React.FC<{
  app: BankApp;
  onClose: () => void;
  onNotify: (title: string, message: string, icon: string) => void;
}> = ({ app, onClose, onNotify }) => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('android_messenger_threads');
    return saved ? JSON.parse(saved).map((c: any) => ({
      ...c,
      messages: c.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
    })) : INITIAL_CONVERSATIONS;
  });

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const systemConfig = getSystemConfig();
  const senderName = systemConfig.general.sender_name;

  useEffect(() => {
    localStorage.setItem('android_messenger_threads', JSON.stringify(conversations));
  }, [conversations]);

  // Listen for custom Interac notices from 10001
  useEffect(() => {
    const handleInteracAlert = (e: CustomEvent<{ title: string; sender: string; message: string; icon: string; amount: number; txId: string }>) => {
      const { message, amount, txId, sender } = e.detail;
      playNotificationSound();

      setConversations(prev => {
        const next = [...prev];
        // Target 10001 specifically as requested
        const targetId = '10001';
        let targetIdx = next.findIndex(c => c.id === targetId);
        
        if (targetIdx === -1) {
            // Failsafe: recreate 10001 if purged
            next.push({
                id: '10001',
                name: '10001',
                lastMessage: '',
                time: '',
                avatar: '!',
                color: '#333333',
                isVerified: true,
                messages: []
            });
            targetIdx = next.length - 1;
        }

        const newInteracMessage: Message = {
          id: Date.now().toString(),
          text: message,
          sender: 'them',
          timestamp: new Date(),
          type: 'interac',
          amount: amount,
          txId: txId
        };
        
        next[targetIdx].messages.push(newInteracMessage);
        next[targetIdx].lastMessage = message;
        next[targetIdx].time = 'Now';
        
        // Move to top
        const [movedConv] = next.splice(targetIdx, 1);
        next.unshift(movedConv);
        
        return [...next];
      });
    };

    window.addEventListener('android-interac-alert' as any, handleInteracAlert);
    return () => window.removeEventListener('android-interac-alert' as any, handleInteracAlert);
  }, [app.icon, onNotify, conversations]);

  const playNotificationSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(ANDROID_MESSAGE_TONE_URL);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(e => console.log("Audio playback blocked", e));
  };

  const handleSendMessage = (threadId: string, text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'me',
      timestamp: new Date(),
      type: 'text'
    };

    setConversations(prev => prev.map(c => {
      if (c.id === threadId) {
        const updatedC = {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: text,
          time: 'Now'
        };
        const otherConversations = prev.filter(conv => conv.id !== threadId);
        return [updatedC, ...otherConversations];
      }
      return c;
    }).flat());
  };

  const selectedThread = conversations.find(c => c.id === selectedThreadId);

  return (
    <div className="absolute inset-0 bg-white flex flex-col z-[100] animate-in slide-up overflow-hidden">
      {selectedThreadId && selectedThread ? (
        <MessageThread thread={selectedThread} onBack={() => setSelectedThreadId(null)} onSendMessage={handleSendMessage} />
      ) : (
        <ConversationsList
          conversations={conversations}
          onSelectThread={setSelectedThreadId}
          senderName={senderName}
        />
      )}
      <AndroidFooter onHomeClick={onClose} onBackClick={onClose} onRecentsClick={() => {}} />

      <audio ref={audioRef} src={ANDROID_MESSAGE_TONE_URL} hidden />
    </div>
  );
};

export default AndroidMessengerApp;