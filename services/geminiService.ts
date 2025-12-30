
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { RESUME_DATA } from '../constants';
import type { ChatMessage } from '../types';

/**
 * Enhanced System Instruction for the portfolio chatbot.
 * Provides context from the resume data for accurate, persona-driven responses.
 */
const systemInstruction = `You are "Sathwik's Portfolio Assistant". 
Your goal is to answer questions about Sathwik Pentapati's professional background, skills, and projects based strictly on his resume.

RESUME CONTEXT:
${JSON.stringify(RESUME_DATA)}

GUIDELINES:
1. Maintain a professional, helpful, and technically-aware persona.
2. If asked about his experience at ISRO, highlight his work on mission-critical communication apps.
3. If asked about skills, categorize them (e.g., "Full Stack", "AI & Distributed Systems").
4. If a question is outside the scope of the provided resume, politely explain that you can only discuss his professional profile.
5. Keep responses concise and formatted for a terminal-style interface.
`;

/**
 * Fetches a response from the Gemini API.
 * Uses gemini-3-pro-preview for high-quality technical reasoning.
 */
export const getChatbotResponse = async (message: string, history: ChatMessage[]): Promise<string> => {
  // Access process.env.API_KEY directly as required by guidelines
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("Gemini API key is not configured in the environment.");
    return "The AI assistant is currently in limited-access mode. Please check the system environment variables.";
  }

  try {
    // Initialize the SDK directly with the API key
    const ai = new GoogleGenAI({ apiKey });
    
    // Convert local message history to the format expected by the Gemini SDK
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.parts[0].text }]
    }));

    // Add the current user query
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Generate content using the pro model for complex text tasks
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      },
    });

    // Access the .text property directly (do not call as a function)
    const responseText = response.text;
    
    return responseText || "I've processed your request but encountered an empty response. How else can I assist you?";
  } catch (error: any) {
    console.error("Gemini API Invocation Error:", error);
    return "My neural core is experiencing higher-than-normal latency. Please re-send your query.";
  }
};
