
import React from 'react';
import { ScotiaLogoSVG, ChevronRightIcon, BackIcon } from '../ScotiaIcons';
import TopHeader from '../components/TopHeader';

interface MoreViewProps {
    onSignOut: () => void;
    onCloseApp: () => void;
    onChat: () => void;
    senderName: string;
    setSenderName: (n: string) => void;
    onNotification: () => void;
}

const ScotiaMoreView: React.FC<MoreViewProps> = ({ onSignOut, onCloseApp, onChat, senderName, setSenderName, onNotification }) => {
    const sections = [
        {
            title: 'Profile & Settings',
            items: [
                { label: 'Personal Information', sub: 'Address, phone, and employment info', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
                { label: 'Manage Accounts', sub: 'Rename or hide specific ledgers', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6' },
                { label: 'Digital Documents', sub: 'E-Statements and tax forms', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
                { label: 'Neural Link Prefs', sub: 'RR-OS optimization settings', icon: 'M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4' }
            ]
        },
        {
            title: 'Security & Privacy',
            items: [
                { label: 'Security Centre', sub: 'Passwords, 2FA, and alerts', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
                { label: 'Manage Devices', sub: 'Authorized devices and sessions', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' },
                { label: 'Privacy Control', sub: 'Third-party app permissions', icon: 'M12 15V3m0 12l-4-4m4 4l4-4' }
            ]
        },
        {
            title: 'Products & Services',
            items: [
                { label: 'Open New Account', sub: 'Chequing, Savings, Investments', icon: 'M12 5v14M5 12h14' },
                { label: 'Apply for Credit', sub: 'Cards, Lines of credit, Mortgages', icon: 'M3 10h18M7 15h1m4 0h1m4 0h1' },
                { label: 'Insurance', sub: 'Travel, Life, and Home coverage', icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z' }
            ]
        },
        {
            title: 'Communication',
            items: [
                { label: 'Message Centre', sub: 'Secure bank correspondence', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
                { label: 'Feedback', sub: 'Tell us how we can improve', icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }
            ]
        },
        {
            title: 'Help & Legal',
            items: [
                { label: 'Help Centre', sub: 'FAQs and guided tutorials', icon: 'M12 16h.01M12 12a2 2 0 0 0 0-4 2 2 0 0 0 0 4z M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
                { label: 'Legal & Privacy', sub: 'Terms of use and agreements', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
                { label: 'About Scotiabank', sub: 'App version 22.4.0 (Boosted)', icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z' }
            ]
        }
    ];

    return (
        <div className="flex flex-col h-full bg-black animate-in slide-up">
            <TopHeader title="More" onChat={onChat} onNotification={onNotification} />
            
            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                {/* Profile Banner */}
                <div className="p-6 bg-zinc-950 border-b border-white/5 mb-8 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-[#ED0711] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-red-500/10">
                        {senderName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <input 
                            type="text" 
                            value={senderName} 
                            onChange={e => setSenderName(e.target.value)}
                            className="bg-transparent text-white font-black text-xl tracking-tight outline-none w-full focus:text-[#ED0711] transition-colors"
                        />
                        <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mt-1">Profile Level: Platinum Neural</p>
                    </div>
                </div>

                <div className="px-6 space-y-10">
                    {sections.map(section => (
                        <div key={section.title} className="space-y-4">
                            <h3 className="text-[#ED0711] font-black text-[10px] uppercase tracking-[0.3em] px-2 opacity-60">{section.title}</h3>
                            <div className="bg-[#121212] rounded-[28px] border border-white/5 overflow-hidden divide-y divide-white/5 shadow-2xl">
                                {section.items.map(item => (
                                    <button 
                                        key={item.label}
                                        className="w-full p-5 flex items-start gap-5 text-left active:bg-white/5 transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 group-active:scale-90 transition-transform">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d={item.icon}/></svg>
                                        </div>
                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <p className="text-white font-bold text-[15px] leading-none mb-1">{item.label}</p>
                                            <p className="text-zinc-500 text-[12px] font-medium truncate pr-4">{item.sub}</p>
                                        </div>
                                        <div className="pt-2">
                                            <ChevronRightIcon color="#333" size={16} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="pt-8 space-y-4">
                        <button 
                            onClick={onSignOut}
                            className="w-full py-5 bg-white text-black font-black rounded-[22px] text-[13px] uppercase tracking-[0.2em] shadow-2xl active:scale-[0.98] transition-all"
                        >
                            Sign Out
                        </button>
                        <button 
                            onClick={onCloseApp}
                            className="w-full py-4 text-zinc-600 font-bold text-[11px] uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Exit Application
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScotiaMoreView;
