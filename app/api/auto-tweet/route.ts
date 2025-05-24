// /app/api/cron/auto-tweet/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { geminiPrompt } from '@/lib/gemini/geminiPrompt';
import { postTweet } from '@/lib/actions/post.action';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const incomingSecret = url.searchParams.get('secret');
  const cronSecret = process.env.CRON_SECRET;

  const isManual = Boolean(incomingSecret && incomingSecret === cronSecret);
  const isFromVercelCron = Boolean(process.env.VERCEL);

  if (!isManual && !isFromVercelCron) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🤖 Cron job triggered - Generating tweet content...');

    const tweetData = await geminiPrompt();

    if (!tweetData?.content) {
      throw new Error('Failed to generate tweet content');
    }

    console.log('📝 Content:', tweetData.content);

    const result = await postTweet(tweetData.content);

    if (result.success) {
      console.log('✅ Tweet posted:', result.tweet);
      return NextResponse.json({
        success: true,
        tweet: result.tweet,
        content: tweetData
      });
    } else {
      console.error('❌ Post failed:', result.error);
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('💥 Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
