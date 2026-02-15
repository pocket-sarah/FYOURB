
export interface ScotiaTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status?: 'Pending' | 'Completed' | 'Cancelled' | 'Refunded' | 'Failed';
  category?: 'Income' | 'Bills' | 'Shopping' | 'Dining' | 'Transfer' | 'Deposit' | 'Payment';
}

export interface ScotiaAccount {
  type: 'banking' | 'credit';
  balance: number;
  pending?: number;
  available?: number;
  points: number;
  history: ScotiaTransaction[];
}

export type ScotiaAccountMap = Record<string, ScotiaAccount>;

export interface PendingTransfer {
  id: string;
  recipientName: string;
  recipientEmail: string;
  amount: number;
  date: string;
  securityQuestion?: string;
  securityAnswer?: string;
  status: 'Sent' | 'Pending' | 'Deposited' | 'Expired' | 'Failed' | 'Cancelled';
  link?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  isFavorite?: boolean;
  autodeposit?: boolean;
  defaultQuestion?: string;
  defaultAnswer?: string;
}
