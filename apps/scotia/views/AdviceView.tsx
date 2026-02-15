import React from 'react';
import { AdviceIcon, ChevronRightIcon } from '../ScotiaIcons';
import TopHeader from '../components/TopHeader';
import { motion } from 'framer-motion';

const AdviceView: React.FC<{ onChat: () => void; onNotification: () => void; }> = ({ onChat, onNotification }) => {
    const MotionCircle = motion.circle as any;

    return (
        <div className="flex-1 flex flex-col bg-black animate-in fade-in h-full">
            <TopHeader title="Advice+" onChat={onChat} onNotification={onNotification} />

            <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-6 pt-6 space-y-8">
                {/* Health Score */}
                <div className="bg-[#121212] rounded-[32px] p-8 border border-white/5 shadow-2xl relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl pointer-events-none"></div>
                    <p className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.3em] mb-6">Financial Health Score</p>
                    
                    <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-zinc-900" />
                            <MotionCircle 
                                cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                                strokeDasharray={552.92}
                                initial={{ strokeDashoffset: 552.92 }}
                                animate={{ strokeDashoffset: 552.92 * (1 - 0.78) }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="text-[#ED0711]" 
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-black text-white tracking-tighter">780</span>
                            <span className="text-green-500 font-bold text-xs uppercase mt-1">Strong</span>
                        </div>
                    </div>
                    <p className="text-zinc-400 text-sm font-medium px-4">Your score is up 12 points this month due to reduced credit utilization.</p>
                </div>

                {/* Smart Insights */}
                <div className="space-y-4">
                    <h3 className="text-white font-bold text-lg px-2">Smart Insights</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-[#1c1c1e] p-6 rounded-[24px] border border-white/5 flex gap-5 items-start">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            </div>
                            <div>
                                <p className="text-white font-bold text-[15px] mb-1">Savings Opportunity</p>
                                <p className="text-zinc-500 text-xs leading-relaxed">Based on your utility spend, you could save $45/mo by switching to a pre-authorized plan.</p>
                            </div>
                        </div>

                        <div className="bg-[#1c1c1e] p-6 rounded-[24px] border border-white/5 flex gap-5 items-start">
                            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                            </div>
                            <div>
                                <p className="text-white font-bold text-[15px] mb-1">Budget Alert</p>
                                <p className="text-zinc-500 text-xs leading-relaxed">You've reached 85% of your 'Dining Out' budget for October. Consider a home meal tonight.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Scroller */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-white font-bold text-lg">Coming Up</h3>
                        <button className="text-[#ED0711] font-bold text-xs uppercase tracking-widest">Full Calendar</button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
                        {[
                            { label: 'EPCOR Utilities', date: 'Oct 28', amt: 142.50 },
                            { label: 'Netflix Sub', date: 'Oct 30', amt: 18.99 },
                            { label: 'Auto Loan', date: 'Nov 01', amt: 485.00 }
                        ].map((bill, i) => (
                            <div key={i} className="w-[180px] shrink-0 bg-[#121212] p-5 rounded-[20px] border border-white/5">
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{bill.date}</p>
                                <p className="text-white font-bold text-sm truncate mb-3">{bill.label}</p>
                                <p className="text-white font-black text-xl">${bill.amt.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdviceView;