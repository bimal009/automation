import { NextRequest, NextResponse } from 'next/server';
import { geminiPrompt } from '@/lib/gemini/geminiPrompt';
import { postTweet } from '@/lib/actions/post.action';

export async function POST(request: NextRequest) {
  try {
    console.log('📱 Manual tweet generation triggered...');
    
    // Generate content using Gemini
    const tweetData = await geminiPrompt();
    
    if (!tweetData || !tweetData.content) {
      throw new Error('Failed to generate tweet content');
    }
    
    console.log('📝 Generated content:', tweetData.content);
    
    // Post the tweet
    const result = await postTweet(tweetData.content);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Tweet posted successfully',
        tweet: result.tweet,
        generatedContent: tweetData
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        errorCode: result.errorCode
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Manual tweet error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
