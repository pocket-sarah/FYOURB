import React from 'react';

interface TabNavigationProps {
  activeTab: 'home' | 'accounts' | 'move' | 'rewards' | 'more';
  onTabChange: (tab: any) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white border-t border-gray-100 h-[92px] flex justify-around items-center shrink-0 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] pb-8">
      <button 
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center flex-1 py-2 transition-colors ${activeTab === 'home' ? 'text-[#008A00]' : 'text-gray-400'}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span className="text-[10px] font-bold mt-1 tracking-tight">Home</span>
      </button>

      <button 
        onClick={() => onTabChange('accounts')}
        className={`flex flex-col items-center flex-1 py-2 transition-colors ${activeTab === 'accounts' ? 'text-[#008A00]' : 'text-gray-400'}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/></svg>
        <span className="text-[10px] font-bold mt-1 tracking-tight">Accounts</span>
      </button>

      <button 
        onClick={() => onTabChange('move')}
        className={`flex flex-col items-center flex-1 py-2 transition-colors ${activeTab === 'move' ? 'text-[#008A00]' : 'text-gray-400'}`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeTab === 'move' ? 'bg-[#008A00] text-white' : 'bg-gray-100 text-gray-400'}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <span className="text-[10px] font-bold mt-1 tracking-tight">Move Money</span>
      </button>

      <button 
        onClick={() => onTabChange('rewards')}
        className={`flex flex-col items-center flex-1 py-2 transition-colors ${activeTab === 'rewards' ? 'text-[#008A00]' : 'text-gray-400'}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M12 7V3M8 3h8"/></svg>
        <span className="text-[10px] font-bold mt-1 tracking-tight">Rewards</span>
      </button>

      <button 
        onClick={() => onTabChange('more')}
        className={`flex flex-col items-center flex-1 py-2 transition-colors ${activeTab === 'more' ? 'text-[#008A00]' : 'text-gray-400'}`}
      >
        <div className="relative">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white">2</div>
        </div>
        <span className="text-[10px] font-bold mt-1 tracking-tight">More</span>
      </button>
    </div>
  );
};

export default TabNavigation;
