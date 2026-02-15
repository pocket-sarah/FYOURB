export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them' | 'system';
  timestamp: Date;
  type?: 'text' | 'interac'; // Added 'interac' type
  amount?: number; // For Interac messages
  txId?: string; // For Interac messages
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  color: string;
  messages: Message[];
  isVerified?: boolean;
}
