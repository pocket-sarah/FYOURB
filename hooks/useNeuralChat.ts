
import { useState, useCallback, useEffect, useRef } from 'react';
import { GeminiService } from '../services/gemini';

export interface ChatOption {
  label: string;
  id: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai' | 'agent' | 'system';
  text: string;
  timestamp: Date;
  options?: ChatOption[];
}

export type ChatStage = 'automated' | 'queue' | 'connecting' | 'verifying' | 'confirming_pin' | 'agent' | 'failed';

export const useNeuralChat = (bankId: string, initialSystemContext: string, accountData?: any) => {
  const storageKey = `rros_chat_history_${bankId}`;
  
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
    }
    return [];
  });

  const [stage, setStage] = useState<ChatStage>(() => {
    const savedStage = localStorage.getItem(`${storageKey}_stage`);
    return (savedStage as ChatStage) || 'automated';
  });

  const [connectionStep, setConnectionStep] = useState(0);
  const [queueInfo, setQueueInfo] = useState({ pos: 1, wait: 1 });
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
    localStorage.setItem(`${storageKey}_stage`, stage);
  }, [messages, stage, storageKey]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setStage('automated');
    localStorage.removeItem(storageKey);
    localStorage.removeItem(`${storageKey}_stage`);
  }, [storageKey]);

  const enterQueue = useCallback(() => {
    setStage('queue');
    setConnectionStep(0);
    setQueueInfo({ pos: 5, wait: 3 });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => { setConnectionStep(1); setQueueInfo({ pos: 3, wait: 2 }); }, 1200) as unknown as number;
    timeoutRef.current = setTimeout(() => { setConnectionStep(2); setQueueInfo({ pos: 1, wait: 1 }); }, 2400) as unknown as number;
    timeoutRef.current = setTimeout(() => {
        setStage('verifying');
        setMessages(prev => [...prev, {
            id: 'sys-' + Date.now(),
            sender: 'system',
            text: 'Secure Channel Established. Agent Sarah Joined.',
            timestamp: new Date()
        }, {
            id: 'verify-' + Date.now(),
            sender: 'agent',
            text: "Hello, this is Sarah. I'm reviewing your secure session logs now. To access full details, please verify your identity.",
            timestamp: new Date(),
            options: [{ label: 'Verify Identity', id: 'verify_identity' }]
        }]);
    }, 4000) as unknown as number;
  }, [storageKey]);

  const confirmIdentity = useCallback(() => {
    setStage('confirming_pin');
    setMessages(prev => [...prev, {
      id: 'agent-pin-req-' + Date.now(),
      sender: 'agent',
      text: 'Please enter your 4-digit Account PIN to proceed.',
      timestamp: new Date()
    }]);
  }, []);

  const sendMessage = useCallback(async (text: string, isFromOption: boolean = false) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    
    if (stage === 'queue' || stage === 'verifying' || stage === 'connecting' || stage === 'failed') return;

    if (stage === 'confirming_pin') {
      setStage('agent');
      setMessages(prev => [...prev, {
        id: 'agent-verified-' + Date.now(),
        sender: 'agent',
        text: 'Thank you. Identity confirmed. How can I assist you with your account today?',
        timestamp: new Date(),
        options: [{ label: 'Request a Callback', id: 'request_call' }]
      }]);
      return;
    }

    setIsTyping(true);
    const contextString = `ACCOUNT_DATA: ${JSON.stringify(accountData || {})}\nCONTEXT: ${initialSystemContext}`;
    
    try {
      const assistantId = (Date.now() + 1).toString();
      let assistantText = "";
      
      setMessages(prev => [...prev, {
        id: assistantId,
        sender: stage === 'agent' ? 'agent' : 'ai',
        text: "",
        timestamp: new Date()
      }]);

      const stream = GeminiService.generateStream(text, contextString);
      
      for await (const chunk of stream) {
        assistantText += chunk;
        setMessages(prev => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last.id === assistantId) last.text = assistantText;
          return next;
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: 'err', sender: 'system', text: 'Uplink unstable. Handshake lost.', timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  }, [stage, accountData, initialSystemContext]);

  return { 
    messages, 
    setMessages, 
    isTyping, 
    sendMessage, 
    stage, 
    connectionStep,
    queueInfo,
    enterQueue,
    confirmIdentity,
    clearChat
  };
};
