import React, { useState, useEffect } from 'react';
import { BankApp } from '../../types';
import AppLayout from '../shared/layouts/AppLayout';
import { motion } from 'framer-motion';

const GenericApp: React.FC<{ app: BankApp; onClose: () => void; onNotify: any }> = ({ app, onClose, onNotify }) => {
    const [stage, setStage] = useState<'login' | 'dashboard'>('login');
    const [balance] = useState(() => Math.random() * 25000 + 5000);
    const [transactions] = useState(() => [
        { id: 1, desc: 'SYSTEM_SYNC', amt: -12.50, date: 'Today' },
        { id: 2, desc: 'PAYROLL_UPLINK', amt: 3200.00, date: 'Yesterday' },
        { id: 3, desc: 'RETAIL_DEBIT', amt: -84.21, date: '2 days ago' }
    ]);

    return (
        <AppLayout brandColor={app.brandColor} onClose={onClose} title={`${app.name} Mobile`}>
            <div className="h-full bg-[#f4f4f4] flex flex-col font-sans text-zinc-900">
                {stage === 'login' ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
                        <div className="w-24 h-24 mb-8 rounded-[22%] bg-white shadow-xl flex items-center justify-center overflow-hidden border border-zinc-100">
                            <img src={app.icon} className="w-full h-full object-cover" alt="" />
                        </div>
                        <h2 className="text-2xl font-black mb-2 tracking-tight uppercase" style={{ color: app.brandColor }}>{app.name}</h2>
                        <p className="text-zinc-400 text-sm mb-12 font-medium">Secure Neural Handshake Required.</p>
                        
                        <div className="w-full max-w-xs space-y-4">
                            <div className="bg-white border border-zinc-200 rounded-2xl p-4 text-left">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Digital ID</span>
                                <p className="font-bold text-zinc-800">4839-XXXX-XXXX-1029</p>
                            </div>
                            <button 
                                onClick={() => setStage('dashboard')}
                                className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-all"
                                style={{ backgroundColor: app.brandColor }}
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col animate-in slide-up">
                        <div className="p-8 pb-12 text-white shadow-2xl relative overflow-hidden" style={{ backgroundColor: app.brandColor }}>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-2 relative z-10">Total Balance</p>
                            <h1 className="text-5xl font-black tracking-tighter mb-8 relative z-10">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h1>
                            
                            <div className="flex gap-4 relative z-10">
                                <button className="flex-1 py-3 bg-white/20 backdrop-blur-md rounded-xl text-xs font-black uppercase tracking-widest border border-white/10">Transfer</button>
                                <button className="flex-1 py-3 bg-white/20 backdrop-blur-md rounded-xl text-xs font-black uppercase tracking-widest border border-white/10">Pay Bill</button>
                            </div>
                        </div>

                        <div className="flex-1 bg-white rounded-t-[40px] -mt-6 relative z-20 p-8 space-y-6">
                            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Recent Activity</h3>
                            <div className="space-y-4">
                                {transactions.map(tx => (
                                    <div key={tx.id} className="flex justify-between items-center p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                        <div>
                                            <p className="font-bold text-sm text-zinc-800">{tx.desc}</p>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase">{tx.date}</p>
                                        </div>
                                        <span className={`font-black text-sm ${tx.amt > 0 ? 'text-green-600' : 'text-zinc-800'}`}>
                                            {tx.amt > 0 ? '+' : ''}{tx.amt.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            
                            <button 
                                onClick={() => setStage('login')}
                                className="w-full py-4 text-zinc-400 font-bold text-[11px] uppercase tracking-widest mt-8 border-t border-zinc-100"
                            >
                                Secure Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default GenericApp;