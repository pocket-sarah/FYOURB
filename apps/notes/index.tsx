
import React, { useState, useEffect } from 'react';
import { BankApp } from '../../types';

interface NotesAppProps {
  app: BankApp;
  onClose: () => void;
  onNotify: (title: string, message: string, icon: string) => void;
}

const NotesApp: React.FC<NotesAppProps> = ({ onClose }) => {
  const [notes, setNotes] = useState(() => {
      const saved = localStorage.getItem('rbos_notes_v2');
      return saved ? JSON.parse(saved) : [
        { id: 1, title: 'Project Singularity', body: 'Modularize all banking uplinks by Q4.', date: 'Today' },
        { id: 2, title: 'Security Protocol', body: 'Cycle Gemini API keys every 24 hours.', date: 'Yesterday' },
      ];
  });

  useEffect(() => {
      localStorage.setItem('rbos_notes_v2', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
      const newNote = {
          id: Date.now(),
          title: 'New Neural Draft',
          body: '',
          date: 'Just now'
      };
      setNotes([newNote, ...notes]);
  };

  return (
    <div className="absolute inset-0 bg-[#0c0c0e] flex flex-col z-[100] animate-in slide-up overflow-hidden text-white">
      <header className="pt-16 px-8 pb-8 shrink-0 flex justify-between items-center bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div>
            <h1 className="text-3xl font-black tracking-tighter">Notes</h1>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mt-1">Synchronized Ledger</p>
        </div>
        <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 active:scale-90 transition-all">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-32 no-scrollbar space-y-6">
        <div className="bg-white/5 rounded-[28px] p-5 flex items-center gap-4 text-white/20 border border-white/5 active:bg-white/10 transition-colors">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
           <span className="text-sm font-bold uppercase tracking-widest text-[11px]">Search Matrix</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {notes.map(n => (
            <div 
                key={n.id} 
                className="bg-white/5 rounded-[32px] p-6 border border-white/5 active:scale-95 transition-all cursor-pointer relative overflow-hidden group"
                onClick={() => {}}
            >
               <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors"></div>
               <h3 className="font-bold text-white mb-2 truncate text-[15px]">{n.title}</h3>
               <p className="text-white/40 text-xs leading-relaxed line-clamp-3 mb-4 font-medium">{n.body || 'Buffer ready...'}</p>
               <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{n.date}</span>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={addNote}
        className="absolute bottom-10 right-8 w-16 h-16 rounded-[24px] bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/30 active:scale-90 transition-transform border border-indigo-500"
      >
         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
      </button>
    </div>
  );
};

export default NotesApp;