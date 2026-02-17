import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateBookDiscussionPrompt = async (): Promise<string> => {
  const ai = getClient();
  if (!ai) return "What are you reading right now?";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a short, thought-provoking question about literature or reading habits that would spark a debate among book lovers. Keep it under 20 words. Do not use quotes.",
    });
    return response.text?.trim() || "What is a book that changed your mind?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "What is a book that changed your mind?";
  }
};

export const polishPostContent = async (text: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return text;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Rewrite the following text to be more evocative and concise, suitable for a literary discussion board. Keep the tone sophisticated but accessible. Text: "${text}"`,
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text;
  }
};
