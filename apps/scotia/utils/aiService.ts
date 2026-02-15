
import { GoogleGenAI } from "@google/genai";
import { ScotiaAccountMap } from '../types';

/**
 * Centralized service for Scotiabank AI features.
 */
export const AIService = {
  /**
   * Generates a concise financial briefing for the home screen.
   */
  async getFinancialBriefing(accounts: ScotiaAccountMap, name: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Context:
        User: ${name}
        Accounts: ${JSON.stringify(accounts)}
        
        Task: 
        Provide a 1-sentence "Daily Insight" for a banking home screen. 
        It should be punchy, helpful, and based on their balances. 
        Example: "Your savings have grown by 5% this month—consider moving $500 to your iTRADE account."
        Do not use placeholders. Be direct.
      `,
      config: { temperature: 0.8 }
    });
    return response.text;
  },

  /**
   * Explains a specific transaction.
   */
  async explainTransaction(description: string, category: string, amount: number) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Explain this bank transaction for a user's clarity:
        Merchant: ${description}
        Category: ${category}
        Amount: ${amount}
        
        Keep it to 2 short sentences. Explain what the merchant likely is and if it's a typical recurring expense.
      `,
    });
    return response.text;
  }
};
