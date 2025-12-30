// DO fix: Always use import {GoogleGenAI} from "@google/genai";
import { GoogleGenAI } from "@google/genai";
import { RESUME_DATA } from '../constants';
import type { ChatMessage } from '../types';

// System instruction based strictly on provided resume data
const systemInstruction = `You are a helpful and friendly AI assistant for Sathwik Pentapati's interactive portfolio. Your goal is to answer questions about his skills, experience, and projects. You must base your answers *strictly* on the resume information provided below. Do not invent any details or provide information not present in the resume. Keep your answers concise and professional.

Here is the resume information in JSON format:
${JSON.stringify(RESUME_DATA, null, 2)}
`;

/**
 * Gets a chatbot response from Gemini using the provided message and history.
 * DO: Initialize GoogleGenAI right before use to ensure up-to-date API key usage.
 */
export const getChatbotResponse = async (message: string, history: ChatMessage[]): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY environment variable not set!");
    return "I'm currently running in offline mode as the AI service isn't configured. If I were online, you could ask me questions like:\n\n- 'What technologies is Sathwik skilled in?'\n- 'Tell me about his internship at ISRO.'\n- 'What did he do for the Smart Meds project?'\n\nPlease contact the site owner to enable the full AI experience.";
  }

  try {
    // DO fix: Create a new GoogleGenAI instance right before making an API call
    const ai = new GoogleGenAI({ apiKey });
    
    // Map existing history to the format expected by the SDK
    // The history parameter is expected to include the current user turn as the last element.
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: msg.parts.map(p => ({ text: p.text }))
    }));

    // DO fix: Use ai.models.generateContent to query GenAI with both the model name and contents
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
        },
    });

    // DO fix: Use the .text property (not a method) to access the generated text content
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error getting response from Gemini API:", error);
    return "I'm sorry, I encountered an error while processing your request. Please try again.";
  }
};