
import { GoogleGenAI, Type } from "@google/genai";
import { Finding } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export class GeminiService {
    static async harvestFindings(count: number = 3): Promise<Finding[]> {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Generate a JSON array of ${count} highly realistic but simulated data leaks. 
            Include diverse sources like GitHub, Pastebin, or AWS S3. 
            Ensure values look authentic (e.g., masked CC numbers, real-looking API key patterns).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            type: { 
                                type: Type.STRING,
                                enum: ['API_KEY', 'CREDIT_CARD', 'PII_DATA', 'SYSTEM_CONFIG', 'LOG_DUMP']
                            },
                            source: { type: Type.STRING },
                            sourceUrl: { type: Type.STRING },
                            value: { type: Type.STRING },
                            severity: { 
                                type: Type.STRING,
                                enum: ['CRITICAL', 'WARNING', 'INFO']
                            },
                            metadata: {
                                type: Type.OBJECT,
                                properties: {
                                    repo_name: { type: Type.STRING },
                                    owner: { type: Type.STRING },
                                    provider: { type: Type.STRING },
                                    expiry: { type: Type.STRING }
                                }
                            }
                        },
                        required: ['id', 'type', 'source', 'value', 'severity']
                    }
                }
            }
        });

        const data = JSON.parse(response.text);
        return data.map((item: any) => ({
            ...item,
            id: item.id || Math.random().toString(36).substr(2, 9),
            status: 'untested',
            timestamp: Date.now(),
            metadata: item.metadata || {}
        }));
    }

    static async verifyFinding(finding: Finding): Promise<{ status: 'valid' | 'invalid'; result: string }> {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Simulate a security verification for this found asset: ${JSON.stringify(finding)}.
            Return a JSON object indicating if the asset is valid and a brief technical test result.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        status: { type: Type.STRING, enum: ['valid', 'invalid'] },
                        result: { type: Type.STRING }
                    },
                    required: ['status', 'result']
                }
            }
        });

        return JSON.parse(response.text);
    }
}
