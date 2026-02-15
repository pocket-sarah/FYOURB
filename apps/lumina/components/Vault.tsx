
import React from 'react';
import { Finding, Status } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldAlert, 
    ShieldCheck, 
    ShieldQuestion, 
    ExternalLink, 
    Activity, 
    Key, 
    CreditCard, 
    User, 
    FileJson, 
    Search,
    Trash2
} from 'lucide-react';

interface VaultProps {
    findings: Finding[];
    onVerify: (id: string) => void;
    onDelete: (id: string) => void;
}

const Vault: React.FC<VaultProps> = ({ findings, onVerify, onDelete }) => {
    const getIcon = (type: string) => {
        switch (type) {
            case 'API_KEY': return <Key size={18} />;
            case 'CREDIT_CARD': return <CreditCard size={18} />;
            case 'PII_DATA': return <User size={18} />;
            case 'SYSTEM_CONFIG': return <FileJson size={18} />;
            default: return <Search size={18} />;
        }
    };

    const getStatusIcon = (status: Status) => {
        switch (status) {
            case 'valid': return <ShieldCheck className="text-emerald-400" size={16} />;
            case 'invalid': return <ShieldAlert className="text-rose-500" size={16} />;
            case 'testing': return <Activity className="text-amber-400 animate-spin" size={16} />;
            default: return <ShieldQuestion className="text-indigo-500/40" size={16} />;
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="flex justify-between items-center px-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Neural Assets Vault</h3>
                <span className="text-[10px] text-indigo-500/60 font-bold">{findings.length} RECORDS RECOVERED</span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar pb-10">
                <AnimatePresence initial={false}>
                    {findings.length === 0 ? (
                        <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-indigo-500/10 rounded-2xl text-indigo-5