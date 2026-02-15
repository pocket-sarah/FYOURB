
import React from 'react';
import { ChevronRightIcon, InfoIcon } from '../TDIcons';

const UpdatesView: React.FC = () => {
  return (
    <div className="px-4 py-6 space-y-6 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#008A00]/5 rounded-bl-[80px]"></div>
        <h3 className="text-gray-800 font-bold text-lg mb-2">Spending Summary</h3>
        <div className="flex items-end gap-2 mb-4">
          <span className="text-3xl font-black text-[#008A00] tracking-tight">$2,412.50</span>
          <span className="text-gray-400 text-xs mb-1.5 font-bold uppercase">this month</span>
        </div>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">You've spent 8% less than last month. Great job managing your budget!</p>
        <button className="text-[#008A00] font-bold text-xs uppercase tracking-wider flex items-center gap-1">
          View Trends <ChevronRightIcon size={12} />
        </button>
      </div>

      <div className="bg-[#008A00] rounded-xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute -bottom-4 -right-4 opacity-10">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor">
            <rect width="100" height="100"/>
          </svg>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <InfoIcon size={18} color="white" />
          </div>
          <span className="font-bold text-sm">TD Rewards Offer</span>
        </div>
        <p className="text-white/90 text-sm font-medium mb-4">
          Earn 50% more points when you shop at participating grocery stores this week.
        </p>
        <button className="bg-white text-[#008A00] px-4 py-2 rounded-lg font-bold text-xs shadow-lg active:scale-95 transition-transform">
          Activate Now
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-800 font-bold text-sm mb-4 uppercase tracking-widest opacity-60">Security Tip</h3>
        <div className="flex gap-4">
          <div className="text-[#008A00] mt-1">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Never share your one-time verification codes with anyone, even if they claim to be from TD Canada Trust.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdatesView;
