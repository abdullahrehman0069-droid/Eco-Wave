
import { GoogleGenAI, Type, Modality } from "@google/genai";

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
Identify pollutants, explain impact, suggest safe handling, and encourage reporting.
`;

export async function getGeminiResponse(message: string, base64Image?: string): Promise<string> {
  try {
    // ALWAYS use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
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
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "Connection lost to the deep sea relay. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The ocean is vast, and sometimes signals get crossed. Please check your connection.";
  }
}

export async function getSimulationResults(scenario: string) {
  try {
    // ALWAYS use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: `Predict the ecological impact of this scenario: ${scenario}` }] },
      config: {
        systemInstruction: "You are an advanced ecological simulation engine. Analyze the provided scenario and return projected outcomes for marine life over 50 years in JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vitalityIndex: { type: Type.INTEGER, description: "Ecosystem vitality percentage (0-100)" },
            recoveryTime: { type: Type.STRING, description: "Time to stable state" },
            primaryImpact: { type: Type.STRING, description: "Main consequence" },
            speciesForecast: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  species: { type: Type.STRING },
                  status: { type: Type.STRING }
                },
                required: ["species", "status"]
              }
            },
            recommendation: { type: Type.STRING, description: "Conservation advice" }
          },
          required: ["vitalityIndex", "recoveryTime", "primaryImpact", "speciesForecast", "recommendation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty simulation response");
    return JSON.parse(text);
  } catch (error) {
    console.error("Simulation Error:", error);
    throw error;
  }
}

/**
 * Generates professional podcast audio from a given topic using Gemini TTS.
 */
export async function generatePodcastAudio(topic: string): Promise<Uint8Array> {
  try {
    // ALWAYS use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Generate a compelling and educational podcast segment about: ${topic}. Narrate it with an inspiring and professional tone.` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    // Extracting audio data from GenerateContentResponse
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio data received from deep sea relay.");
    }
    return decode(base64Audio);
  } catch (error) {
    console.error("Podcast Generation Error:", error);
    throw error;
  }
}

/**
 * Manually decodes a base64 string into a Uint8Array.
 * Follows the requirement to implement encoding/decoding manually as per Guidelines.
 */
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decodes raw PCM audio data into an AudioBuffer for playback.
 * The audio bytes returned by the TTS API are raw PCM data.
 */
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
