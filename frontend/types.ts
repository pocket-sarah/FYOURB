export interface BankApp {
  id: string;
  name: string;
  brandColor: string;
  secondaryColor?: string;
  icon: string;
  isDocked?: boolean;
  isBank?: boolean;
  appTitle?: string;
  isInstalled: boolean;
  order: number;
  category: 'finance' | 'social' | 'system' | 'utilities' | 'communication' | 'admin' | 'research' | 'intelligence';
}

export type ViewState = 'locked' | 'home' | 'drawer' | 'app' | 'store';

export interface AppState {
  isLocked: boolean;
  currentView: ViewState;
  activeAppId: string | null;
  isEditMode: boolean;
  isSwitcherOpen: boolean;
}

export type InstallStage = 'idle' | 'preparing' | 'installing' | 'completed';

export enum ToolMode {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIT = 'audit',
  EXPLOIT = 'exploit',
  HARVEST = 'harvest',
  TRACK = 'track'
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    type?: 'code' | 'alert' | 'discovery' | 'tracking';
    code?: string;
    suggestions?: string[];
  };
}

export interface GeneratedAsset {
  id: string;
  type: 'image' | 'video' | 'data_dump';
  url: string;
  prompt: string;
  timestamp: number;
}

export interface EvidenceRecord {
  id: string;
  node: string;
  event: string;
  payload: any;
  timestamp: number;
  integrity_hash: string;
}