import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TDStatementOptionsModalProps {
    onGenerate: (month: number, year: number) => void;
    onClose: () => void;
}

const TDStatementOptionsModal: React.FC<TDStatementOptionsModalProps> = ({ onGenerate, onClose }) => {
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    const months = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    const years = [2023, 2024, 2025];

    const MotionDiv = motion.div as any;

    return (
        <div className="absolute inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
            <MotionDiv 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white w-full max-w-sm rounded-[16px] p-8 shadow-2xl overflow-hidden relative"
            >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#008A00]"></div>
                <h3 className="text-gray-900 font-black text-xl mb-6">Select Statement</h3>
                
                <div className="space-y-6">
                    <div>
                        <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 block px-1">Statement Month</label>
                        <select 
                            value={month} 
                            onChange={(e) => setMonth(parseInt(e.target.value))}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 font-bold p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#008A00]/10"
                        >
                            {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 block px-1">Statement Year</label>
                        <select 
                            value={year} 
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 font-bold p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#008A00]/10"
                        >
                            {years.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>

                    <div className="pt-4 space-y-3">
                        <button 
                            onClick={() => onGenerate(month, year)}
                            className="w-full py-4 bg-[#008A00] text-white font-black rounded-lg text-[14px] uppercase tracking-wider shadow-lg active:scale-95 transition-transform"
                        >
                            View Statement
                        </button>
                        <button 
                            onClick={onClose}
                            className="w-full py-4 bg-transparent text-gray-400 font-bold text-[13px] uppercase tracking-wider active:bg-gray-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </MotionDiv>
        </div>
    );
};

export default TDStatementOptionsModal;