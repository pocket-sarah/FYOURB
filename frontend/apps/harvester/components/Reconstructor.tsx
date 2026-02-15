
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Cpu, RefreshCw, Hash, Database, Check } from 'lucide-react';

const MotionDiv = motion.div as any;

const Reconstructor: React.FC<{ onNotify: any }> = ({ onNotify }) => {
    const [input, setInput] = useState('');
    const [isFixing, setIsFixing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const checkLuhn = (num: string) => {
        let sum = 0;
        let shouldDouble = false;
        for (let i = num.length - 1; i >= 0; i--) {
            let digit = parseInt(num.charAt(i));
            if (shouldDouble) {
                if ((digit *= 2) > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return sum % 10 === 0;
    };

    const getBank = (bin: string) => {
        if (bin.startsWith('472409') || bin.startsWith('4519')) return 'TD Canada Trust';
        if (bin.startsWith('4538') || bin.startsWith('4537')) return 'Scotiabank';
        if (bin.startsWith('4514')) return 'RBC Royal Bank';
        return 'UNKNOWN_OFFSHORE';
    };

    const repairLuhn = (num: string) => {
        if (num.length < 13) return null;
        const prefix = num.substring(0, num.length - 1);
        for (let i = 0; i <= 9; i++) {
            const candidate = prefix + i;
            if (checkLuhn(candidate)) return candidate;
        }
        return null;
    };

    const handleRepair = () => {
        const cleanInput = input.replace(/\s|-/g, '');
        if (cleanInput.length < 13) {
            onNotify("Handshake Error", "Input string below minimum entropy.", "https://cdn-icons-png.flaticon.com/512/3953/3953226.png");
            return;
        }

        setIsFixing(true);
        setResult(null);

        setTimeout(() => {
            const isValid = checkLuhn(cleanInput);
            const bank = getBank(cleanInput);
            const repaired = isValid ? null : repairLuhn(cleanInput);

            setResult({
                original: cleanInput,
                repaired: repaired,
                isValid: isValid,
                bank: bank,
                bin: cleanInput.substring(0, 6)
            });
            setIsFixing(false);
            if (repaired) onNotify("Handshake Repaired", "Luhn Checksum corrected via Neural Logic.", "https://cdn-icons-png.flaticon.com/512/3953/3953226.png");
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full p-6 gap-6 overflow-hidden">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-white">Neural Reconstructor</h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Repairing broken data fragments & BIN discovery</p>
            </div>

            <div className="space-y-6 max-w-sm mx-auto w-full">
                <div className="bg-black border border-[#ff003c]/20 rounded-3xl p-6 shadow-inner focus-within:border-[#ff003c]/60 transition-all">
                    <label className="text-[9px] font-black uppercase text-zinc-600 tracking-widest block mb-3">Input Fragment</label>
                    <div className="flex items-center gap-4">
                        <Hash size={20} className="opacity-20" />
                        <input 
                            type="text" 
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="4724 0910 7449 9505"
                            className="bg-transparent border-none outline-none text-xl font-bold tracking-widest text-white w-full"
                        />
                    </div>
                </div>

                <button 
                    onClick={handleRepair}
                    disabled={isFixing || !input.trim()}
                    className="w-full py-5 bg-[#ff003c] text-white rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] shadow-[0_0_30px_rgba(255,0,60,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                >
                    {isFixing ? <RefreshCw size={16} className="animate-spin" /> : <Cpu size={16} />}
                    {isFixing ? 'RECONSTRUCTING...' : 'REPAIR_HANDSHAKE'}
                </button>
            </div>

            <div className="flex-1 bg-zinc-950/60 border border-white/5 rounded-[40px] overflow-hidden p-8 flex flex-col relative">
                <AnimatePresence mode="wait">
                    {isFixing ? (
                        <MotionDiv key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center gap-6">
                            <div className="w-16 h-16 border-2 border-dashed border-[#ff003c] rounded-full animate-[spin_4s_linear_infinite]"></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.6em] animate-pulse">Scanning_BIN_Registry</p>
                        </MotionDiv>
                    ) : result ? (
                        <MotionDiv key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Detected Origin</h4>
                                    <p className="text-2xl font-black text-white tracking-tighter">{result.bank}</p>
                                    <p className="text-[#ff003c] text-[10px] font-bold uppercase mt-1">BIN: {result.bin}</p>
                                </div>
                                <div className={`p-4 rounded-2xl ${result.isValid ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'} border border-current`}>
                                    {result.isValid ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 bg-black border border-white/5 rounded-2xl">
                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-2">Original State</span>
                                    <p className="font-mono text-lg font-bold text-zinc-500 line-through decoration-[#ff003c] opacity-50 tracking-widest">{result.original}</p>
                                </div>

                                {result.repaired && (
                                    <div className="p-6 bg-[#00ff41]/5 border border-[#00ff41]/20 rounded-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-3 opacity-20"><Check size={24} /></div>
                                        <span className="text-[#00ff41] font-black text-[9px] uppercase tracking-widest block mb-2">Reconstructed Sequence</span>
                                        <p className="font-mono text-2xl font-black text-white tracking-widest shadow-emerald-500/20">{result.repaired}</p>
                                        <div className="mt-4 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse"></div>
                                            <span className="text-[8px] font-black uppercase text-[#00ff41]">Checksum: VALID_LUHN_10</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between opacity-30">
                                <span className="text-[8px] font-black uppercase tracking-[0.4em]">Handshake_Sync_V9.Ω</span>
                                <span className="text-[8px] font-black uppercase tracking-[0.4em]">RBOS_CORE</span>
                            </div>
                        </MotionDiv>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-10 gap-6">
                            <Database size={80} strokeWidth={1} />
                            <p className="text-[11px] font-black uppercase tracking-[0.8em]">Awaiting_Handshake_Packet</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Reconstructor;
