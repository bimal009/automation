import { postTweet } from '../actions/post.action';
import { geminiPrompt } from '../gemini/geminiPrompt';
import cron from 'node-cron';
import type { ScheduledTask } from 'node-cron';

export interface AutoTweetConfig {
  enabled: boolean;
  scheduleTime: string; // e.g., "0 12 * * *" for 12:00 PM daily
  timezone?: string;
}

let autoTweetJob: ScheduledTask | null = null;

export async function generateAndTweet(): Promise<void> {
  try {
    console.log('🤖 Generating tweet content...');
    
    // Generate content using Gemini
    const tweetData = await geminiPrompt();
    
    if (!tweetData || !tweetData.content) {
      throw new Error('Failed to generate tweet content');
    }
    
    console.log('📝 Generated content:', tweetData.content);
    console.log('📊 Character count:', tweetData.characterCount);
    console.log('🏷️ Topic:', tweetData.topic);
    
    // Post the tweet
    const result = await postTweet(tweetData.content);
    
    if (result.success) {
      console.log('✅ Tweet posted successfully!', result.tweet);
    } else {
      console.error('❌ Failed to post tweet:', result.error);
      throw new Error(result.error);
    }
    
  } catch (error) {
    console.error('💥 Auto-tweet error:', error);
    // You might want to implement retry logic or notifications here
  }
}

export function startAutoTweet(config: AutoTweetConfig): void {
  if (!config.enabled) {
    console.log('🔇 Auto-tweet is disabled');
    return;
  }

  // Stop existing job if running
  if (autoTweetJob) {
    autoTweetJob.destroy();
  }

  // Schedule new job
  autoTweetJob = cron.schedule(config.scheduleTime, async () => {
    console.log('⏰ Auto-tweet triggered at:', new Date().toISOString());
    await generateAndTweet();
  }, {
    timezone: config.timezone || 'UTC'
  });

  console.log(`🚀 Auto-tweet scheduled for: ${config.scheduleTime}`);
}

export function stopAutoTweet(): void {
  if (autoTweetJob) {
    autoTweetJob.stop();
    autoTweetJob = null;
    console.log('🛑 Auto-tweet stopped');
  }
}

export function getAutoTweetStatus(): { running: boolean; nextRun?: Date } {
  if (!autoTweetJob) {
    return { running: false };
  }

  return {
    running: true,
    nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000) // Approximate next run time
  };
}
