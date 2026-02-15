
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  static async generateText(prompt: string, systemInstruction: string = "", isComplex: boolean = false) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const config: any = {
      systemInstruction: systemInstruction || "You are SHΔDØW_CORE, a hyper-advanced intelligence. Provide raw, technical, and precise output.",
      temperature: 0.8,
    };

    if (isComplex) {
      config.thinkingConfig = { thinkingBudget: 16384 };
    }

    const response = await ai.models.generateContent({
      model: isComplex ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
      contents: prompt,
      config: config,
    });
    return response.text || "";
  }

  static async *generateTextStream(prompt: string, systemInstruction: string = "") {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are SHΔDØW_CORE. Provide elite technical data.",
      }
    });

    for await (const chunk of response) {
      if (chunk.text) yield chunk.text;
    }
  }

  // Fix: Added generateImage method to resolve ImageGenerator.tsx error
  static async generateImage(prompt: string, aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "1:1") {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio } },
    });

    for (const part of response.candidates[0].content.parts) {
      // Find the image part in the response candidates
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64EncodeString}`;
      }
    }
    throw new Error("Imaging Blackout: No image data returned.");
  }

  // Fix: Added generateVideo method to resolve VideoGenerator.tsx error
  static async generateVideo(prompt: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // Poll for video generation completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video synthesis failed: No URI in response.");
    
    // Guidelines require appending API key when fetching from the download link
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}
