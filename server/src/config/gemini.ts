// server/src/lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);


export const generateTasks = async (topic: string) => {
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

  const prompt = `
      Generate a list of exactly 5 concise, actionable tasks to learn about "${topic}".
      Format the output strictly as:
      1. First task
      2. Second task
      3. Third task
      4. Fourth task
      5. Fifth task
      Do not include any introduction or explanation.
      `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text
  .split(/\d+\.\s+/) // split on "1. ", "2. ", etc.
  .map((t) => t.trim())
  .filter((t) => t.length > 3);

};
