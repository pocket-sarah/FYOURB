
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  /**
   * Routes requests through the local Python Logic Node (Port 3001)
   * if available, otherwise falls back to direct browser SDK.
   */
  static async generateText(prompt: string, systemInstruction: string = "") {
    try {
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction })
      });
      const data = await response.json();
      return data.text;
    } catch (e) {
      // Fallback to direct client
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { systemInstruction }
      });
      return response.text || "";
    }
  }

  static async generateImage(prompt: string, aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "1:1") {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio } },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Imaging Blackout.");
  }
}
