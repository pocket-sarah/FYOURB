import React from 'react';
import { TDLogoSVG } from '../TDIcons';

interface MoreViewProps {
    onSignOut: () => void;
    onClose: () => void;
    onChat: () => void;
}

const MoreView: React.FC<MoreViewProps> = ({ onSignOut, onClose, onChat }) => {
    const sections = [
        {
            title: 'Investing',
            items: [
                { label: 'TD Direct Investing', sub: 'Take control of your portfolio', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
                { label: 'TD Easy-Trade™', sub: 'Simplified stock and ETF investing', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' }
            ]
        },
        {
            title: 'Settings & Security',
            items: [
                { label: 'Personal Information', sub: 'Update address, email, phone', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
                { label: 'Security & Privacy', sub: 'Manage passwords and alerts', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
                { label: 'Notification Settings', sub: 'Customize your push alerts', icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0' }
            ]
        },
        {
            title: 'Support & Feedback',
            items: [
                { label: 'Contact Support Chat', action: onChat, sub: 'Speak with our virtual or live team', highlight: true, icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
                { label: 'Find a Branch or ATM', sub: 'Locate TD services near you', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' },
                { label: 'Give App Feedback', sub: 'Help us improve your experience', icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' }
            ]
        },
        {
            title: 'About TD App',
            items: [
                { label: 'What\'s New', sub: 'Check out the latest features', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
                { label: 'Legal & Privacy', sub: 'Terms and conditions', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
                { label: 'App Version', sub: 'v11.45.2 (Build 992)', icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z' }
            ]
        }
    ];

    return (
        <div className="flex flex-col h-full bg-[#f4f7f6] animate-in slide-up font-sans">
            <div className="bg-[#008A00] pt-14 pb-8 px-6 text-white shrink-0 flex justify-between items-center shadow-sm">
                <h1 className="text-xl font-bold tracking-tight">More</h1>
                <button onClick={onClose} className="p-2 -mr-2 bg-white/10 rounded-full active:scale-90 transition-transform">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-32 pt-6 px-5 space-y-8">
                {sections.map(section => (
                    <div key={section.title} className="space-y-3">
                        <h3 className="text-gray-400 font-black text-[10px] uppercase tracking-[0.25em] px-2">{section.title}</h3>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                            {section.items.map(item => (
                                <button 
                                    key={item.label} 
                                    onClick={item.action}
                                    className={`w-full p-5 text-left flex justify-between items-center active:bg-gray-50 transition-all ${item.highlight ? 'bg-green-50/30' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.highlight ? 'bg-[#008A00] text-white' : 'bg-gray-50 text-gray-400'}`}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d={item.icon}/></svg>
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`font-bold text-[15px] ${item.highlight ? 'text-[#008A00]' : 'text-gray-800'}`}>{item.label}</p>
                                            <p className="text-gray-400 text-[12px] font-medium mt-0.5 truncate pr-4">{item.sub}</p>
                                        </div>
                                    </div>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="3"><path d="m9 18 6-6-6-6"/></svg>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                <button 
                    onClick={onSignOut}
                    className="w-full py-5 text-red-600 font-bold bg-white rounded-2xl border border-red-50 shadow-sm active:bg-red-50 transition-all"
                >
                    Sign Out
                </button>
                <button 
                    onClick={onClose}
                    className="w-full py-3 text-gray-400 font-bold text-xs uppercase tracking-widest"
                >
                    Close App
                </button>
            </div>
        </div>
    );
};

export default MoreView;