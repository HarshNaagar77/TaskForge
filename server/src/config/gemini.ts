// server/src/lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);


export const generateTasks = async (topic: string) => {
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

  const prompt = `Generate a list of 5 concise, actionable tasks to learn about ${topic}. Return only the tasks, no numbering or formatting.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text
    .split("\n")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
};
