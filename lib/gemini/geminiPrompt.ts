import Gemini from "./Gemini"

export const geminiPrompt = async () => {
  const prompt = `You are a tech content creator. Create viral IT content for Twitter/X.

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON with no markdown, explanations, or extra text
2. Content must be EXACTLY under 280 characters including hashtags
3. Include 3-5 trending IT hashtags
4. Use 1-2 emojis maximum
5. Focus on current tech trends (AI, cybersecurity, programming, startups)

TRENDING TOPICS TO CHOOSE FROM:
- AI developments (ChatGPT, Claude, Gemini updates)
- Cybersecurity breaches/news
- Programming languages/frameworks
- Tech layoffs/hiring news
- Startup funding/acquisitions
- Developer tools/productivity
- Cloud computing updates
- Open source projects

JSON STRUCTURE (return exactly this format):
{
  "content": "tweet text with hashtags",
  "characterCount": 250,
  "topic": "chosen topic",
  "hashtags": ["#AI", "#TechNews", "#Programming"]
}

EXAMPLE OUTPUT:
{
  "content": "🚀 GitHub Copilot Chat just got 10x smarter! Now it understands your entire codebase context. This is a game-changer for developers. Time to level up your coding workflow! #AI #GitHub #Programming #DevTools #TechNews",
  "characterCount": 215,
  "topic": "GitHub Copilot Update",
  "hashtags": ["#AI", "#GitHub", "#Programming", "#DevTools", "#TechNews"]
}

Return only the JSON object:`;

  return await Gemini(prompt);
}