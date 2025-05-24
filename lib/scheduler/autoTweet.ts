import { postTweet } from '../actions/post.action';
import { geminiPrompt } from '../gemini/geminiPrompt';
import cron from 'node-cron';
import type { ScheduledTask } from 'node-cron';
import { CronExpression } from 'cron-parser';

export interface AutoTweetConfig {
  enabled: boolean;
  scheduleTime: string; // e.g., "0 12 * * *" for 12:00 PM daily
  timezone?: string;
}

let autoTweetJob: ScheduledTask | null = null;

export async function generateAndTweet(): Promise<void> {
  try {
    console.log('🤖 Generating tweet content...');

    const tweetData = await geminiPrompt();

    if (!tweetData || !tweetData.content) {
      throw new Error('Failed to generate tweet content');
    }

    console.log('📝 Generated content:', tweetData.content);
    console.log('📊 Character count:', tweetData.characterCount);
    console.log('🏷️ Topic:', tweetData.topic);

    const result = await postTweet(tweetData.content);

    if (result.success) {
      console.log('✅ Tweet posted successfully!', result.tweet);
    } else {
      console.error('❌ Failed to post tweet:', result.error);
      throw new Error(result.error);
    }

  } catch (error) {
    console.error('💥 Auto-tweet error:', error);
  }
}

export function startAutoTweet(config: AutoTweetConfig): void {
  if (!config.enabled) {
    console.log('🔇 Auto-tweet is disabled');
    return;
  }

  if (autoTweetJob) {
    autoTweetJob.stop();
  }

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

export function getAutoTweetStatus(config: AutoTweetConfig): { running: boolean; nextRun?: Date } {
  if (!autoTweetJob) {
    return { running: false };
  }

  try {
    const interval = (CronExpression as any).parseExpression(config.scheduleTime, {
      currentDate: new Date(),
      tz: config.timezone || 'UTC',
    });

    return {
      running: true,
      nextRun: interval.next().toDate(),
    };
  } catch (err) {
    console.error('⚠️ Failed to parse cron expression:', err);
    return { running: true };
  }
}
