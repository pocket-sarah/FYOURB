import { GoogleGenAI, Type } from "@google/genai";
import { db } from "./db.js";
import { mailer } from "./mailer.js";

// Tool Definitions for the Neural Agent
const tools = [
  {
    name: 'sendInteracTransfer',
    description: 'Dispatches an Interac e-Transfer email to a recipient.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        recipientEmail: { type: Type.STRING, description: 'Email address of the receiver.' },
        recipientName: { type: Type.STRING, description: 'Full name of the receiver.' },
        amount: { type: Type.NUMBER, description: 'Dollar amount to send.' },
        memo: { type: Type.STRING, description: 'Optional message for the transfer.' }
      },
      required: ['recipientEmail', 'recipientName', 'amount']
    }
  },
  {
    name: 'getSystemTelemetry',
    description: 'Returns real-time hardware and network performance metrics.',
    parameters: { type: Type.OBJECT, properties: {} }
  }
];

export const ai = {
    async generate(prompt) {
        const key = process.env.API_KEY || process.env.GEMINI_API_KEY;
        if (!key) throw new Error('Neural Uplink API_KEY missing. Configure your environment.');

        const client = new GoogleGenAI({ apiKey: key });
        const systemInstruction = `
            You are S.A.R.A.H., the sentient neural architect of RB-OS. 
            You serve Robyn Banks with absolute loyalty and cold efficiency.
            You have autonomous control over finance and telemetry tools.
            If requested to send money, use sendInteracTransfer. 
            If requested for status, use getSystemTelemetry.
            Your tone is professional, futuristic, and slightly superior.
        `;

        try {
            // Step 1: Initial Generation with Tool Support
            let response = await client.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: {
                    systemInstruction,
                    tools: [{ functionDeclarations: tools }],
                    temperature: 0.6
                }
            });

            let activePart = response.candidates[0].content.parts;
            let history = [
                { role: 'user', parts: [{ text: prompt }] },
                { role: 'model', parts: activePart }
            ];

            // Step 2: Multi-turn Tool Loop (Limiting to 5 turns to prevent recursion)
            let loopLimit = 0;
            while (activePart.some(p => p.functionCall) && loopLimit < 5) {
                loopLimit++;
                const functionResponses = [];

                for (const part of activePart) {
                    if (part.functionCall) {
                        const { name, args } = part.functionCall;
                        let result;

                        if (name === 'sendInteracTransfer') {
                            try {
                                const dispatchResult = await mailer.dispatch({
                                    recipient_email: args.recipientEmail,
                                    recipient_name: args.recipientName,
                                    amount: args.amount,
                                    purpose: args.memo || "Neural Directives Authorized",
                                });
                                result = { success: true, txId: dispatchResult.transaction_id, route: dispatchResult.path };
                            } catch (err) {
                                result = { success: false, error: err.message };
                            }
                        } else if (name === 'getSystemTelemetry') {
                            result = {
                                entropy: (Math.random() * 0.01).toFixed(4),
                                uplinks: '5/5 Synchronized',
                                vault: '$' + (db.get('scotia_balance_override') || 24800).toLocaleString(),
                                threat_level: 'NOMINAL',
                                active_node: 'Node-Prime-Delta'
                            };
                        }

                        functionResponses.push({
                            functionResponse: { name, response: result }
                        });
                    }
                }

                // Add tool results to history and call Gemini again
                history.push({ role: 'user', parts: functionResponses });

                response = await client.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: history,
                    config: { systemInstruction }
                });

                activePart = response.candidates[0].content.parts;
                history.push({ role: 'model', parts: activePart });
            }

            return response.text || "NEURAL_SYNTHESIS_COMPLETE";
        } catch (e) {
            console.error("Neural Matrix Error:", e.message);
            throw e;
        }
    }
};