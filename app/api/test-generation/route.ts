import { NextRequest, NextResponse } from 'next/server';
import { geminiPrompt } from '@/lib/gemini/geminiPrompt';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing content generation...');
    
    const tweetData = await geminiPrompt();
    
    return NextResponse.json({
      success: true,
      generatedContent: tweetData,
      message: 'Content generated successfully (not posted)'
    });
    
  } catch (error) {
    console.error('Content generation test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
