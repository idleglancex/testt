import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCharmDesign = async (prompt: string): Promise<{
  name: string;
  color: string;
  shape: 'sphere' | 'cube' | 'heart' | 'star';
  description: string;
}> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Design a jewelry charm based on this description: "${prompt}". 
      Return a JSON object with:
      - name: A creative name for the charm.
      - color: A hex color code relevant to the description (e.g., #FF0000).
      - shape: The closest primitive shape ('sphere', 'cube', 'heart', 'star').
      - description: A short, elegant marketing description (max 20 words).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            color: { type: Type.STRING },
            shape: { type: Type.STRING, enum: ['sphere', 'cube', 'heart', 'star'] },
            description: { type: Type.STRING },
          },
          required: ['name', 'color', 'shape', 'description'],
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating charm:", error);
    // Fallback
    return {
      name: "Mystery Charm",
      color: "#D4AF37",
      shape: "sphere",
      description: "A unique creation inspired by your imagination."
    };
  }
};

export const chatWithPandora = async (message: string, history: {role: string, parts: {text: string}[]}[] = []) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are Pandora AI, a luxury jewelry assistant. You are helpful, elegant, and concise. You help users design bracelets and find gifts.",
      },
      history: history as any,
    });
    
    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "I am currently polishing some gems. Please try again later.";
  }
};