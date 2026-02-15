
import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    Lock
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

    const copyToClipboard = (val: string, id: number) => {
        navigator.clipboard.writeText(val);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
        onNotify("Ledger Alert", "Fragment moved to buffer.", appIcon);
    };

    const getTypeIcon = (type: string) => {
        switch(type) {
            case 'API_KEY': return <Zap size={24} className="text-yellow-400" />;
            case 'CREDIT_CARD': return <CreditCard size={24} className="text-emerald-400" />;
            case 'PII_DATA': return <User size={24} className="text-orange-400" />;
            case 'GITHUB_GIST': return <Code size={24} className="text-white" />;
            case 'REPO_LEAK': return <Github size={24} className="text-white" />;
            default: return <ShieldAlert size={24} />;
        }
    };

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-2 pb-10">
            {findings.map((finding) => (
                <MotionDiv 
                    key={finding.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0a0a0b] border border-white/5 rounded-[32px] p-6 flex flex-col gap-6 group hover:border-indigo-500/40 transition-all shadow-xl relative overflow-hidden"
                >
                    <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                                {getTypeIcon(finding.type)}
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-black text-lg tracking-tight uppercase text-white">{finding.type.replace('_', ' ')}</h3>
                                    <span className="text-[8px] font-black px-2 py-0.5 rounded-full tracking-tighter bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 uppercase">
                                        {finding.source.split('_')[0]}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="font-mono text-base font-black tracking-widest text-indigo-300">
                                        {finding.type === 'CREDIT_CARD' ? `•••• •••• •••• ${finding.value.slice(-4)}` : finding.value}
                                    </p>
                                    <button onClick={() => copyToClipboard(finding.value, finding.id)} className="p-2 hover:text-white text-zinc-700 transition-colors">
                                        {copiedId === finding.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-5">
                        <div>
                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Target Context</p>
                            <p className="text-xs font-bold text-white uppercase truncate opacity-80">
                                {finding.metadata?.repo_name || finding.sourceUrl}
                            </p>
                        </div>
                        {finding.metadata?.cvv && (
                            <div>
                                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Payload Status</p>
                                <p className="text-xs font-bold text-emerald-400 uppercase">
                                    EXP: {finding.metadata.expiry} • CVV: ***
                                </p>
                            </div>
                        )}
                        {finding.metadata?.ssn && (
                            <div>
                                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">PII Status</p>
                                <p className="text-xs font-bold text-orange-400 uppercase">SSN: {finding.metadata.ssn}</p>
                            </div>
                        )}
                    </div>

                    <div className="relative z-10 pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2 opacity-40">
                            <Lock size={12} className="text-zinc-600" />
                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest truncate max-w-[200px]">
                                Verified by OMNI-CORE
                            </p>
                        </div>
                        <button 
                            onClick={() => window.open(finding.sourceUrl, '_blank')}
                            className="flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                            <ExternalLink size={12} /> Inspect
                        </button>
                    </div>
                </MotionDiv>
            ))}
        </div>
    );
};

export default KeyRegistry;
