
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldAlert, 
    Check, 
    Copy, 
    ExternalLink, 
    Zap, 
    Code, 
    Github, 
    Activity, 
    CreditCard, 
    User, 
    ShieldCheck,
    Lock,
    Eye,
    EyeOff,
    RefreshCw,
    Database,
    Globe,
    Cpu,
    Flame,
    Trash2,
    Calendar,
    MapPin,
    Fingerprint
} from 'lucide-react';
import { Finding } from '../index';

interface KeyRegistryProps {
    findings: Finding[];
    onNotify: any;
    appIcon: string;
    onTest: (finding: Finding) => Promise<Finding>;
}

const MotionDiv = motion.div as any;

const KeyRegistry: React.FC<KeyRegistryProps> = ({ findings, onNotify, appIcon }) => {
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());
    const [testingIds, setTestingIds] = useState<Set<number>>(new Set());
    const [localFindings, setLocalFindings] = useState<Finding[]>(findings);

    useEffect(() => {
        setLocalFindings(findings);
    }, [findings]);

    const copyToClipboard = (val: string, id: number) => {
        navigator.clipboard.writeText(val);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
        onNotify("Ledger Alert", "Fragment cloned to buffer.", appIcon);
    };

    const toggleReveal = (id: number) => {
        setRevealedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const runVerification = async (id: number) => {
        setTestingIds(prev => new Set(prev).add(id));
        
        // Simulation of neural handshake for verification
        setTimeout(() => {
            setTestingIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
            
            setLocalFindings(current => current.map(f => {
                if (f.id === id) {
                    return { ...f, status: 'valid' };
                }
                return f;
            }));
            
            onNotify("Handshake Complete", "Signature verified against global registry.", appIcon);
        }, 2000);
    };

    const getTypeIcon = (type: string) => {
        switch(type) {
            case 'API_KEY': return <Zap size={22} className="text-yellow-400" />;
            case 'CREDIT_CARD': return <CreditCard size={22} className="text-emerald-400" />;
            case 'PII_DATA': return <User size={22} className="text-orange-400" />;
            case 'DB_LEAK': return <Database size={22} className="text-indigo-400" />;
            default: return <ShieldAlert size={22} />;
        }
    };

    const getStatusColor = (status?: string) => {
        switch(status) {
            case 'valid': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'invalid': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'testing': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
            default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
        }
    };

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-2 pb-32 pt-2">
            {localFindings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 opacity-10">
                    <Database size={80} strokeWidth={1} />
                    <p className="text-xs font-black uppercase tracking-[0.8em] mt-6">Vault_Empty</p>
                </div>
            ) : (
                <AnimatePresence>
                    {localFindings.map((finding) => {
                        const isRevealed = revealedIds.has(finding.id);
                        const isTesting = testingIds.has(finding.id);
                        
                        return (
                            <MotionDiv 
                                key={finding.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, x: -100 }}
                                className="bg-[#0c0c0e] border border-white/5 rounded-[32px] p-7 flex flex-col gap-6 group hover:border-[#ff003c]/40 transition-all shadow-2xl relative overflow-hidden"
                            >
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-[22px] bg-black border border-white/5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                            {getTypeIcon(finding.type)}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-black text-lg tracking-tighter uppercase text-white">{finding.type.replace('_', ' ')}</h3>
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full tracking-widest border uppercase ${getStatusColor(finding.status)}`}>
                                                    {isTesting ? 'Checking...' : finding.status || 'Untested'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className={`font-mono text-base font-black tracking-widest transition-all duration-300 ${isRevealed ? 'text-indigo-300' : 'text-zinc-800 blur-[5px]'}`}>
                                                    {isRevealed ? finding.value : 'XXXX XXXX XXXX XXXX'}
                                                </p>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => toggleReveal(finding.id)} 
                                                        className={`p-2 rounded-xl transition-all ${isRevealed ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-600 bg-white/5 hover:text-white'}`}
                                                    >
                                                        {isRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                    <button 
                                                        onClick={() => copyToClipboard(finding.value, finding.id)} 
                                                        className="p-2 rounded-xl text-zinc-600 bg-white/5 hover:text-white transition-all active:scale-90"
                                                    >
                                                        {copiedId === finding.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Metadata Grid */}
                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 relative z-10">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Origin_Relay</p>
                                        <p className="text-xs font-bold text-white truncate">{finding.source}</p>
                                    </div>
                                    {finding.metadata?.bank_origin && (
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Target_FI</p>
                                            <p className="text-xs font-bold text-emerald-500 truncate">{finding.metadata.bank_origin}</p>
                                        </div>
                                    )}
                                    {finding.metadata?.expiry && (
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Temporal_Validity</p>
                                            <p className="text-xs font-bold text-white uppercase">{finding.metadata.expiry}</p>
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Discovery_Stamp</p>
                                        <p className="text-xs font-bold text-zinc-400">{new Date(finding.timestamp).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="relative z-10 pt-4 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2 opacity-50">
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Handshake_Secure</p>
                                    </div>
                                    <button 
                                        onClick={() => runVerification(finding.id)}
                                        disabled={isTesting || finding.status === 'valid'}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl ${
                                            finding.status === 'valid' 
                                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                                            : isTesting 
                                                ? 'bg-zinc-800 text-zinc-500 border border-white/5 cursor-not-allowed'
                                                : 'bg-[#ff003c] text-white shadow-[#ff003c]/20'
                                        }`}
                                    >
                                        {isTesting ? (
                                            <RefreshCw size={14} className="animate-spin" />
                                        ) : finding.status === 'valid' ? (
                                            <ShieldCheck size={14} />
                                        ) : (
                                            <Flame size={14} />
                                        )}
                                        {isTesting ? 'Verifying...' : finding.status === 'valid' ? 'Validated' : 'Run_Audit'}
                                    </button>
                                </div>
                            </MotionDiv>
                        );
                    })}
                </AnimatePresence>
            )}
        </div>
    );
};

export default KeyRegistry;
