import { GoogleGenAI, Chat } from "@google/genai";
import { RESUME_DATA } from '../constants';
import type { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

// Lazily initialize to prevent app crash on load if API_KEY is not set.
let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

const systemInstruction = `You are a helpful and friendly AI assistant for Sathwik Pentapati's interactive portfolio. Your goal is to answer questions about his skills, experience, and projects. You must base your answers *strictly* on the resume information provided below. Do not invent any details or provide information not present in the resume. Keep your answers concise and professional.

Here is the resume information in JSON format:
${JSON.stringify(RESUME_DATA, null, 2)}
`;

const initializeChat = (): boolean => {
    if (!API_KEY) {
        return false;
    }
    // Initialize the main AI client if it hasn't been already.
    if (!ai) {
        try {
            ai = new GoogleGenAI({ apiKey: API_KEY });
        } catch (error) {
            console.error("Failed to initialize GoogleGenAI:", error);
            return false;
        }
    }
    // Create a new chat session.
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
        history: [],
    });
    return true;
};


export const getChatbotResponse = async (message: string, history: ChatMessage[]): Promise<string> => {
  if (!API_KEY) {
    console.error("API_KEY environment variable not set!");
    return "I'm currently running in offline mode as the AI service isn't configured. If I were online, you could ask me questions like:\n\n- 'What technologies is Sathwik skilled in?'\n- 'Tell me about his internship at Kritno.'\n- 'Summarize the CrowdConnect project.'\n\nPlease contact the site owner to enable the full AI experience.";
  }

  // Initialize the chat on the first call.
  if (!chat) {
    if (!initializeChat()) {
        return "There was an error initializing the chat service. Please check the API key.";
    }
  }

  try {
    const response = await chat!.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error getting response from Gemini API:", error);
    // Reset the chat session on error, so the user can try again.
    // This can help recover from transient network issues or invalid session states.
    chat = null;
    return "I'm sorry, I encountered an error while processing your request. It could be a network issue or an invalid API key. Please try again.";
  }
};