
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertIcon } from '../ScotiaIcons'; // Changed alias to relative path

interface StatementOptionsModalProps {
    onGenerate: (month: number, year: number) => void;
    onClose: () => void;
}

const StatementOptionsModal: React.FC<StatementOptionsModalProps> = ({ onGenerate, onClose }) => {
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    const months = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    const years = [2022, 2023, 2024, 2025];

    return (
        <div className="absolute inset-0 z-[700] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-[#1c1c1e] w-full max-w-sm rounded-[32px] border border-white/10 p-8 shadow-2xl animate-in zoom-in-95">
                <h3 className="text-white font-black text-xl mb-6 text-center">Generate Statement</h3>
                
                <div className="space-y-6">
                    <div>
                        <label className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2 block">Month</label>
                        <select 
                            value={month} 
                            onChange={(e) => setMonth(parseInt(e.target.value))}
                            className="w-full bg-black/50 border border-white/10 text-white font-bold p-4 rounded-xl outline-none"
                        >
                            {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2 block">Year</label>
                        <select 
                            value={year} 
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            className="w-full bg-black/50 border border-white/10 text-white font-bold p-4 rounded-xl outline-none"
                        >
                            {years.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>

                    <div className="pt-4 space-y-3">
                        <button 
                            onClick={() => onGenerate(month, year)}
                            className="w-full py-4 bg-[#ED0711] text-white font-black rounded-xl text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
                        >
                            Generate PDF
                        </button>
                        <button 
                            onClick={onClose}
                            className="w-full py-4 bg-transparent border border-white/10 text-white font-bold rounded-xl text-sm uppercase tracking-widest active:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatementOptionsModal;
