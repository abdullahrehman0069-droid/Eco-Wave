
import { GoogleGenAI } from "@google/genai";

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
  image?: string;
}

const SYSTEM_INSTRUCTION = `
You are EcoWave's Marine Conservation AI Assistant. 
Your goal is to help users identify marine pollution, provide tips for ocean conservation, 
and explain the risks to marine life. 

Be helpful, scientific yet accessible, and encouraging. 
When asked to identify pollution from an image description or text:
1. Identify the likely pollutant (Plastic, Oil, Chemical, etc.)
2. Explain the environmental impact.
3. Suggest the best way to handle it safely.
4. Encourage reporting it via the EcoWave app to earn points.

Keep responses concise (max 3 paragraphs) for mobile readability. 
Use emojis where appropriate to keep it engaging.
`;

export async function getGeminiResponse(message: string, base64Image?: string): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const parts: any[] = [{ text: message }];
    if (base64Image) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image.split(",")[1] || base64Image
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, the ocean depth is causing some signal loss. Please try asking again!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The ocean is vast, and sometimes my signals get crossed. Please check your connection and try again.";
  }
}
