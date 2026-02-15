import { getSystemConfig } from '../../../data/systemConfig';

interface EmailPayload {
  recipient_email: string;
  recipient_name: string;
  amount: number;
  purpose: string;
  template: string;
  bank_name?: string;
  force?: boolean;
  simulate_fail?: boolean;
}

interface EmailResponse {
  success: boolean;
  transaction_id: string;
  path?: string;
  error?: string;
  message?: string;
  telemetry?: string[];
}

const AUTH_TOKEN = 'projectsarah';

export const EmailRelay = {
  /**
   * Triple-Threat Dispatch Protocol
   * Cascades through Node, Python, and PHP environments.
   * Returns precise error telemetry if all exit nodes fail.
   */
  send: async (payload: EmailPayload): Promise<EmailResponse> => {
    const isForce = payload.force || false;
    
    const environments = [
        { name: 'NEXUS_NODE_JS', url: '/api/mailer.php' },
        { name: 'VOID_THUG_PY', url: '/api/py/mailer' },
        { name: 'STREET_PHP_RELAY', url: '/api/mailer' }
    ];

    let technicalLog: string[] = [];
    
    for (const env of environments) {
        try {
            console.log(`[RELAY] Probing ${env.name} corridor...`);
            
            const res = await fetch(`${env.url}?token=${AUTH_TOKEN}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-FORCE-PROTOCOL': isForce ? 'OBLIVION' : 'STANDARD'
                },
                body: JSON.stringify({ ...payload, token: AUTH_TOKEN })
            });

            const data = await res.json();
            
            if (res.ok && data.success) {
                return { 
                    ...data, 
                    path: env.name,
                    message: `Signal released via ${env.name}.`
                };
            } else {
                const errMsg = data.message || data.error || `HTTP_${res.status}_REJECTION`;
                technicalLog.push(`${env.name}: ${errMsg}`);
            }
        } catch (e: any) {
            technicalLog.push(`${env.name}: NETWORK_TIMEOUT_OR_BLOCKED`);
        }
        
        await new Promise(r => setTimeout(r, 400));
    }

    return { 
        success: false, 
        transaction_id: "", 
        error: "TRIPLE_BLACKOUT", 
        message: "All corridors monitored. Signal withheld.",
        telemetry: technicalLog
    };
  },

  sendDebug: async (payload: { to: string, subject: string, body: string, relay: 'php' | 'python' | 'node' }): Promise<EmailResponse> => {
    let url = `/api/mailer-debug.php?token=${AUTH_TOKEN}`;
    if (payload.relay === 'python') url = `/api/py/mailer/debug?token=${AUTH_TOKEN}`;
    
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, token: AUTH_TOKEN })
        });
        return await res.json();
    } catch (e: any) {
        return { success: false, transaction_id: "", message: e.message };
    }
  }
};