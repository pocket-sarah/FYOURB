import React from 'react';
import { BankApp } from '../../types';

interface ContactsAppProps {
  app: BankApp;
  onClose: () => void;
  onNotify: (title: string, message: string, icon: string) => void;
}

const ContactsApp: React.FC<ContactsAppProps> = ({ onClose }) => {
  const contactList = [
    { name: 'Adam Jensen', role: 'Security Chief' },
    { name: 'Brittany Chen', role: 'Interac Specialist' },
    { name: 'David Sarif', role: 'CEO' },
    { name: 'Eliza Cassan', role: 'News Anchor' },
    { name: 'Francis Pritchard', role: 'Tech Lead' },
    { name: 'Jennifer Edwards', role: 'Financial Advisor' },
  ];

  return (
    <div className="absolute inset-0 bg-[#F9F9F9] flex flex-col z-[100] animate-in slide-up overflow-hidden text-zinc-900">
      <header className="pt-20 px-8 pb-10 shrink-0 flex justify-between items-center">
        <h1 className="text-4xl font-normal">Contacts</h1>
        <button onClick={onClose} className="p-2 bg-zinc-200 rounded-full">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-20 no-scrollbar">
        <div className="bg-white rounded-full p-4 flex items-center gap-4 text-zinc-400 mb-10 shadow-md border border-zinc-100">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
           <span className="text-sm font-medium">Search contacts</span>
        </div>

        <div className="space-y-6">
           {contactList.map((c, i) => (
             <div key={i} className="flex items-center gap-6 p-2 active:bg-zinc-100 rounded-2xl transition-all cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                   {c.name[0]}
                </div>
                <div className="flex-1 border-b border-zinc-100 pb-4">
                   <h3 className="font-bold text-zinc-900">{c.name}</h3>
                   <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest mt-0.5">{c.role}</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      <button className="absolute bottom-10 right-8 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl active:scale-90 transition-transform">
         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
      </button>
    </div>
  );
};

export default ContactsApp;