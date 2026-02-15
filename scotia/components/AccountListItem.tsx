
import React from 'react';
import { ScotiaAccount } from '../types';

interface AccountListItemProps {
  name: string;
  account: ScotiaAccount;
  onClick: () => void;
}

const AccountListItem: React.FC<AccountListItemProps> = ({ name, account, onClick }) => (
  <div 
    className="p-5 active:bg-white/5 cursor-pointer transition-all flex justify-between items-center" 
    onClick={onClick}
  >
    <div className="max-w-[70%]">
      <p className="font-bold text-white text-[13px] tracking-tight">{name}</p>
      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">Available Balance</p>
    </div>
    <p className="text-[14px] text-white font-black tracking-tight">
      ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </p>
  </div>
);

export default AccountListItem;
