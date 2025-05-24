import { NextRequest, NextResponse } from 'next/server';
import { geminiPrompt } from '@/lib/gemini/geminiPrompt';
import { postTweet } from '@/lib/actions/post.action';

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron (optional security)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🤖 Cron job triggered - Generating tweet content...');
    
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
      
      return NextResponse.json({
        success: true,
        message: 'Tweet posted successfully',
        tweet: result.tweet,
        generatedContent: {
          topic: tweetData.topic,
          characterCount: tweetData.characterCount,
          hashtags: tweetData.hashtags
        }
      });
    } else {
      console.error('❌ Failed to post tweet:', result.error);
      
      return NextResponse.json({
        success: false,
        error: result.error,
        errorCode: result.errorCode
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('💥 Auto-tweet cron error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}