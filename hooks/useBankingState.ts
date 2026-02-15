
import { useState, useEffect, useCallback } from 'react';
import { ScotiaAccountMap, ScotiaAccount, ScotiaTransaction } from '../apps/scotia/types';
import { generateEdmontonHistory } from '../apps/scotia/utils/transactionGenerator';

export const useBankingState = (storageKey: string, initialAccounts: ScotiaAccountMap) => {
    const [accounts, setAccounts] = useState<ScotiaAccountMap>(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Ensure both history and transactions are populated, filling from history if transactions is missing
            Object.keys(parsed).forEach(k => {
                if (!parsed[k].transactions) {
                    parsed[k].transactions = parsed[k].history || generateEdmontonHistory(k.includes('Visa') || k.includes('Amex') ? 20 : 40);
                }
            });
            return parsed;
        }
        
        const fresh = { ...initialAccounts };
        Object.keys(fresh).forEach(k => {
            const history = generateEdmontonHistory(k.includes('Visa') || k.includes('Amex') ? 20 : 40);
            fresh[k].history = history;
            fresh[k].transactions = [...history]; // Initialize transactions with the same data
        });
        return fresh;
    });

    // Neural Sync Loop: Poll for remote overrides from Telegram Bot via Database
    useEffect(() => {
        const syncRemote = async () => {
            try {
                const res = await fetch('/api/status');
                const data = await res.json();
                
                // If the backend has an override from Telegram, apply it
                setAccounts(prev => {
                    const next = { ...prev };
                    let changed = false;

                    if (storageKey.includes('scotia') && data.metrics?.scotia_override) {
                        const name = Object.keys(next).find(k => next[k].type === 'banking') || 'Basic Plus';
                        if (next[name].balance !== data.metrics.scotia_override) {
                            next[name].balance = data.metrics.scotia_override;
                            changed = true;
                        }
                    }

                    if (storageKey.includes('td') && data.metrics?.td_override) {
                        const name = Object.keys(next).find(k => next[k].type === 'banking') || 'TD EveryDay Chequing';
                        if (next[name].balance !== data.metrics.td_override) {
                            next[name].balance = data.metrics.td_override;
                            changed = true;
                        }
                    }

                    return changed ? { ...next } : prev;
                });
            } catch (e) {}
        };

        const interval = setInterval(syncRemote, 5000);
        return () => clearInterval(interval);
    }, [storageKey]);

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
                const newTx = {
                    id: 'tx-' + Date.now() + Math.random().toString(36).substring(7),
                    date: dateStr,
                    description: payload.description || (type.toUpperCase() + ': ' + (payload.recipientName || payload.to || 'Transaction')),
                    amount: -amount,
                    // Fix: replaced 'ScotiaAccount['status']' with 'ScotiaTransaction['status']'
                    status: 'Completed' as ScotiaTransaction['status'],
                };
                acc.history = [newTx, ...acc.history];
                acc.transactions = [newTx, ...acc.transactions];
            }

            if (payload.targetAccount && next[payload.targetAccount]) {
                const acc = next[payload.targetAccount];
                acc.balance += amount;
                const newTx = {
                    id: 'tx-rx-' + Date.now() + Math.random().toString(36).substring(7),
                    date: dateStr,
                    description: 'RECEIVED: ' + (payload.sourceAccount || 'Transfer'),
                    amount: amount,
                    // Fix: replaced 'ScotiaAccount['status']' with 'ScotiaTransaction['status']'
                    status: 'Completed' as ScotiaTransaction['status'],
                };
                acc.history = [newTx, ...acc.history];
                acc.transactions = [newTx, ...acc.transactions];
            }

            return { ...next };
        });
    }, []);

    return { accounts, setAccounts, performTransaction };
};
