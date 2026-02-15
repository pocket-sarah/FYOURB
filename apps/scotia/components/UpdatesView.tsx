
import React from 'react';
import { ScotiaAccountMap } from '../types';
import { ChevronRightIcon, GiftIcon } from '../ScotiaIcons';

const UpdatesView: React.FC<{ accounts: ScotiaAccountMap }> = ({ accounts }) => {
  return (
    <div className="px-4 pt-6 space-y-6 animate-in fade-in pb-20">
        
        {/* Insight Card: Credit Score */}
        <div className="bg-zinc-900 rounded-[24px] p-6 border border-white/5 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-[100px] pointer-events-none"></div>
            <div className="relative z-10">
                <h3 className="text-white font-bold text-lg mb-2">Your TransUnion Credit Score</h3>
                <div className="flex items-end gap-2 mb-4">
                    <span className="text-4xl font-black text-white tracking-tighter">784</span>
                    <span className="text-green-500 font-bold text-sm mb-1.5">Excellent</span>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed mb-4">Your score has increased by 12 points since last month. Keep up the good work!</p>
                <button className="text-[#ED0711] font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                    View Full Report <ChevronRightIcon color="#ED0711" size={12} />
                </button>
            </div>
        </div>

        {/* Marketing Card */}
        <div className="bg-zinc-900 rounded-[24px] p-6 border border-white/5 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#ED0711]/10 flex items-center justify-center text-[#ED0711]">
                    <GiftIcon size={20} />
                </div>
                <div>
                    <h3 className="text-white font-bold text-sm">Special Offer</h3>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Scene+ Rewards</p>
                </div>
            </div>
            <p className="text-white text-sm font-medium leading-relaxed mb-4">
                Earn 3x Scene+ points on all grocery purchases this weekend when you use your Scotiabank Gold American Express® Card.
            </p>
            <button className="w-full py-3 bg-white/5 rounded-xl text-white font-bold text-xs hover:bg-white/10 transition-colors">
                Activate Offer
            </button>
        </div>

        {/* Insight Card: Spending */}
        <div className="bg-zinc-900 rounded-[24px] p-6 border border-white/5 shadow-lg">
            <h3 className="text-white font-bold text-lg mb-4">Monthly Spending</h3>
            <div className="h-2 w-full bg-zinc-800 rounded-full mb-2 overflow-hidden">
                <div className="h-full bg-[#ED0711] w-[65%] rounded-full"></div>
            </div>
            <div className="flex justify-between items-center text-xs">
                <span className="text-white font-bold">$1,240 spent</span>
                <span className="text-zinc-500">$2,000 budget</span>
            </div>
        </div>

    </div>
  );
};

export default UpdatesView;
