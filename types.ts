
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
  category: 'finance' | 'social' | 'system' | 'utilities' | 'communication' | 'admin' | 'research';
}

export type ViewState = 'locked' | 'home' | 'drawer' | 'app' | 'store';

export interface AppState {
  isLocked: boolean;
  currentView: ViewState;
  activeAppId: string | null;
  isEditMode: boolean;
}

export type InstallStage = 'idle' | 'preparing' | 'installing' | 'completed';

export enum ToolMode {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIT = 'audit',
  EXPLOIT = 'exploit'
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
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

export interface NetworkNode {
  id: string;
  group: number;
  status: 'active' | 'compromised' | 'offline';
  ip: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface NetworkLink {
  source: string | NetworkNode;
  target: string | NetworkNode;
  value: number;
  id?: string;
}

export interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

export interface LogEntry {
  id: string;
  timestamp: string | Date;
  level: 'SYSTEM' | 'INFO' | 'SUCCESS' | 'ERROR' | 'WARN';
  message: string;
}

export interface MetricPoint {
  time: string | number;
  inbound: number;
  outbound: number;
  cpu: number;
}
