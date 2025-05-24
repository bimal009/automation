'use server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  }
});

async function Gemini(prompt: string, retries = 3): Promise<any> {
  let text: string | undefined; // <-- define outside try

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = await response.text(); // assign value here

      console.log(`Gemini attempt ${attempt} raw response:`, text);

      // Clean and parse text...
      const cleanedText = text.trim();
      // ... [rest of your JSON extraction logic]

      const parsed = JSON.parse(cleanedText);

      if (!parsed.content || typeof parsed.content !== 'string') {
        throw new Error('Invalid JSON structure: missing content field');
      }

      return parsed;

    } catch (err) {
      console.error(`Gemini attempt ${attempt} failed:`, err);

      if (attempt === retries) {
        console.error("All Gemini attempts failed. Raw text:", text);

        try {
          const contentMatch = text?.match(/"content":\s*"([^"]*(?:\\.[^"]*)*)"/);
          const topicMatch = text?.match(/"topic":\s*"([^"]*(?:\\.[^"]*)*)"/);
          const hashtagsMatch = text?.match(/"hashtags":\s*\[(.*?)\]/);

          if (contentMatch) {
            const hashtags = hashtagsMatch 
              ? hashtagsMatch[1].split(',').map(h => h.trim().replace(/['"]/g, ''))
              : [];

            return {
              content: contentMatch[1].replace(/\\"/g, '"'),
              characterCount: contentMatch[1].length,
              topic: topicMatch ? topicMatch[1].replace(/\\"/g, '"') : "Tech Content",
              hashtags: hashtags
            };
          }
        } catch (fallbackErr) {
          console.error("Fallback parsing also failed:", fallbackErr);
        }

        throw new Error(`Failed to parse Gemini output after ${retries} attempts`);
      }

      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}


export default Gemini;