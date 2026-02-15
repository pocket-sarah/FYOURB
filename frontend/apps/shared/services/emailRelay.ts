
export interface RelayPayload {
    recipient_email: string;
    recipient_name: string;
    amount: number;
    purpose: string;
    template: string;
    bank_name?: string;
    force?: boolean;
}

export class EmailRelay {
    static async send(payload: RelayPayload) {
        try {
            const response = await fetch('/api/mailer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            return await response.json();
        } catch (e) {
            console.error("[RELAY] Critical Handshake Failure:", e);
            return { success: false, message: "Handshake Severed" };
        }
    }

    static async sendDebug(params: { to: string, subject: string, body: string, relay: 'php' | 'python' }) {
        const endpoint = params.relay === 'php' ? '/api/mailer.php' : '/api/py/mailer';
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipient_email: params.to,
                    recipient_name: 'Debug Test',
                    amount: 0,
                    purpose: params.subject,
                    raw_body: params.body
                })
            });
            const data = await response.json();
            return { success: data.success, message: data.message || (data.success ? 'Signal Delivered' : 'Relay Refused') };
        } catch (e) {
            return { success: false, message: 'Transport Error' };
        }
    }
}
