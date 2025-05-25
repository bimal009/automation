import Gemini from "./Gemini"

// Array of diverse tech topics to ensure variety
const techTopics = [
  "AI developments and breakthroughs",
  "Programming languages and frameworks", 
  "Developer productivity tools",
  "Startup funding and acquisitions",
  "Open source project updates",
  "Cloud computing innovations",
  "Mobile app development trends",
  "Web development best practices",
  "Tech career advice",
  "Software engineering insights",
  "Database and backend technologies",
  "Frontend frameworks and libraries",
  "DevOps and deployment strategies",
  "Tech industry predictions",
  "Coding tips and tricks",
  "API design and development",
  "Testing and quality assurance",
  "Performance optimization",
  "Security best practices",
  "Remote work and collaboration tools"
];

export const geminiPrompt = async () => {
  // Randomly select a topic to ensure variety
  const randomTopic = techTopics[Math.floor(Math.random() * techTopics.length)];
  
  const prompt = `You are a tech content creator. Create engaging IT content for Twitter/X focused on: ${randomTopic}

CRITICAL INSTRUCTIONS:
- Return ONLY a valid JSON object
- NO markdown code blocks (\\\`\\\`\\\`json)
- NO explanatory text before or after
- Content must be under 280 characters total
- Be creative and engaging, not just news

CONTENT VARIETY (choose ONE approach):
1. Hot take or opinion on ${randomTopic}
2. Helpful tip or trick related to ${randomTopic}  
3. Interesting fact or insight about ${randomTopic}
4. Personal experience or lesson learned
5. Question to engage the community
6. Thread starter or discussion point
7. Funny programming joke or meme related to ${randomTopic}
8. Relatable developer struggle or funny story about ${randomTopic}
9. Humorous observation about tech culture and ${randomTopic}
10. Witty comparison or analogy involving ${randomTopic}

TONE OPTIONS (pick one):
- Inspirational/motivational
- Educational/helpful
- Controversial/debate-worthy
- Humorous/relatable
- Insightful/thought-provoking
- Comedic/joke-focused
- Sarcastic/witty
- Story-telling/narrative

REQUIREMENTS:
- Use 1-2 relevant emojis (not more)
- Include 3-5 trending hashtags
- Make it shareable and engaging
- Avoid generic cybersecurity news
- Focus on practical value or entertainment

JSON FORMAT (return exactly this):
{
  "content": "your tweet text here with hashtags",
  "characterCount": 250,
  "topic": "${randomTopic}",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]
}

EXAMPLES OF VARIETY:
- "🔥 Unpopular opinion: Learning vanilla JavaScript before React made me 10x better at debugging. Frameworks are shortcuts, not fundamentals. #JavaScript #WebDev #React #Programming #DevTips"
- "💡 Pro tip: Use console.table() instead of console.log() for arrays and objects. Your debugging sessions will thank you later! #JavaScript #WebDev #DevTips #Programming #DebuggingTips"
- "🤔 Why do we call it 'full-stack' when most of us are really just 'full-panic' developers trying to remember CSS flexbox? #WebDev #Programming #DeveloperLife #CSS #Humor"
- "😂 Git commit messages be like: 'fixed stuff', 'more fixes', 'PLEASE WORK', 'I have no idea what I'm doing but it works now' #Git #Programming #DevLife #CodeHumor #DevStruggles"
- "📚 Story time: Spent 6 hours debugging only to realize I had caps lock on for a variable name. The computer is always right, even when it's not. #Programming #DebuggingLife #DevStory #CodeFails"
- "🎭 APIs are like dating: You send a request, hope for a good response, and sometimes you get ghosted with a 404. #APIs #WebDev #TechHumor #DeveloperLife #Programming"
- "🚀 Me explaining my code during code review: 'It works on my machine' - Famous last words of every developer ever #CodeReview #Programming #DevLife #TechMemes #SoftwareDev"

Return only the JSON object with no additional text:`;

  return await Gemini(prompt);
};
