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
  let text: string | undefined;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = await response.text();

      console.log(`Gemini attempt ${attempt} raw response:`, text);

      // Clean the text by removing markdown code blocks and extra whitespace
      let cleanedText = text.trim();
      
      // Remove markdown code blocks if present
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Remove any leading/trailing whitespace again
      cleanedText = cleanedText.trim();

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
          // Enhanced fallback parsing
          let fallbackText = text || "";
          
          // Try to extract JSON from markdown blocks first
          const jsonMatch = fallbackText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[1]);
            if (parsed.content) {
              return parsed;
            }
          }

          // Original fallback logic
          const contentMatch = fallbackText.match(/"content":\s*"([^"]*(?:\\.[^"]*)*)"/);
          const topicMatch = fallbackText.match(/"topic":\s*"([^"]*(?:\\.[^"]*)*)"/);
          const hashtagsMatch = fallbackText.match(/"hashtags":\s*\[(.*?)\]/);

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