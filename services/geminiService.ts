
import { GoogleGenAI, Chat } from "@google/genai";
import { RESUME_DATA } from '../constants';
import type { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // A bit of a hack for the environment, but prevents a hard crash.
  // In a real app, this would be handled by the build process.
  console.error("API_KEY environment variable not set!");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `You are a helpful and friendly AI assistant for Sathwik Pentapati's interactive portfolio. Your goal is to answer questions about his skills, experience, and projects. You must base your answers *strictly* on the resume information provided below. Do not invent any details or provide information not present in the resume. Keep your answers concise and professional.

Here is the resume information in JSON format:
${JSON.stringify(RESUME_DATA, null, 2)}
`;

let chat: Chat | null = null;

const initializeChat = () => {
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
        history: [],
    });
};


export const getChatbotResponse = async (message: string, history: ChatMessage[]): Promise<string> => {
  if (!API_KEY) {
    return "I'm sorry, my connection to the AI service is not configured. Please contact Sathwik about this issue.";
  }

  if (!chat) {
    initializeChat();
  }

  try {
    // The history is managed within the chat session itself, so we don't need to pass it in each time.
    // However, if we want to rebuild the session from a saved history, we could do that here.
    const response = await chat!.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error getting response from Gemini API:", error);
    return "I'm sorry, I encountered an error while processing your request. Please try again.";
  }
};
