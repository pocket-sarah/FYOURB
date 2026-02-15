
import crypto from 'crypto';
import { db } from './db.js';

export const interac = {
    decryptToken(token) {
        const config = db.get('system_config') || {};
        const key = config.general?.encryption_key || 'a3f91b6cd024e8c29b76a149efcc5d42';
        
        const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
        const buffer = Buffer.from(base64, 'base64');
        
        const iv = buffer.subarray(0, 16);
        const ciphertext = buffer.subarray(16);
        
        const secretKey = crypto.createHash('sha256').update(key).digest();
        const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
        
        let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        
        // Convert query string back to object
        const params = new URLSearchParams(decrypted);
        return Object.fromEntries(params);
    }
};
