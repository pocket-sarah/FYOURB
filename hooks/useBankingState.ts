import { useState, useEffect, useCallback } from 'react';
import { ScotiaAccountMap, ScotiaAccount, PendingTransfer, Contact } from '../apps/scotia/types';
import { generateEdmontonHistory } from '../apps/scotia/utils/transactionGenerator';

export const useBankingState = (storageKey: string, initialAccounts: ScotiaAccountMap) => {
    const [accounts, setAccounts] = useState< ScotiaAccountMap>(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) return JSON.parse(saved);
        const fresh = { ...initialAccounts };
        Object.keys(fresh).forEach(k => {
            fresh[k].history = generateEdmontonHistory(k.includes('Visa') || k.includes('Amex') ? 20 : 40);
        });
        return fresh;
    });

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(accounts));
    }, [accounts, storageKey]);

    const performTransaction = useCallback((type: string, amount: number, payload: any) => {
        setAccounts(prev => {
            const next = { ...prev };
            const dateStr = 'Today';
            
            if (payload.sourceAccount && next[payload.sourceAccount]) {
                const acc = next[payload.sourceAccount];
                acc.balance -= amount;
                acc.history = [{
                    id: 'tx-' + Date.now() + Math.random().toString(36).substring(7),
                    date: dateStr,
                    description: payload.description || (type.toUpperCase() + ': ' + (payload.recipientName || payload.to || 'Transfer')),
                    amount: -amount,
                    status: 'Pending'
                }, ...acc.history];
            }

            if (payload.targetAccount && next[payload.targetAccount]) {
                const acc = next[payload.targetAccount];
                acc.balance += amount;
                acc.history = [{
                    id: 'tx-rx-' + Date.now() + Math.random().toString(36).substring(7),
                    date: dateStr,
                    description: 'RECEIVED: ' + (payload.sourceAccount || 'Transfer'),
                    amount: amount,
                    status: 'Completed'
                }, ...acc.history];
            }

            return { ...next };
        });
    }, []);

    return { accounts, setAccounts, performTransaction };
};