
import { useState, useCallback } from 'react';

export interface ChatOption {
  label: string;
  id: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: Date;
  options?: ChatOption[];
}

export const useNeuralChat = (type: string, systemInstruction: string, context: any = {}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [stage, setStage] = useState<'bot' | 'queue' | 'agent' | 'confirming_pin'>('bot');
  const [queueInfo] = useState({ wait: 2, position: 1 });

  const sendMessage = useCallback(async (text: string, isOption: boolean = false) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            prompt: `${systemInstruction}\n\nContext: ${JSON.stringify(context)}\n\nUser: ${text}` 
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: result.text,
          timestamp: new Date(),
          options: result.options
        }]);
      } else {
        throw new Error("Relay fault");
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: 'err-' + Date.now(),
        sender: 'ai',
        text: 'Neural uplink unstable. Please retry connection.',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [systemInstruction, context]);

  const addSystemMessage = useCallback((text: string) => {
    setMessages(prev => [...prev, {
      id: 'sys-' + Date.now(),
      sender: 'system',
      text,
      timestamp: new Date()
    }]);
  }, []);

  const enterQueue = () => {
    setStage('queue');
    setTimeout(() => setStage('agent'), 5000);
  };
  
  const confirmIdentity = () => setStage('confirming_pin');

  const clearChat = () => setMessages([]);

  return { 
    messages, 
    setMessages, 
    isTyping, 
    sendMessage, 
    addSystemMessage, 
    clearChat,
    stage,
    queueInfo,
    enterQueue,
    confirmIdentity
  };
};
