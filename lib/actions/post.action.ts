'use server'

import { createTwitterClient, TwitterClientError } from "@/lib/providers/clientProvider"
import { z } from 'zod'


export type TweetResponse = {
  success: boolean
  tweet?: {
    id: string
    text: string
    created_at?: string
  }
  error?: string
  errorCode?: 'VALIDATION_ERROR' | 'TWITTER_API_ERROR' | 'UNKNOWN_ERROR'
}

export type GetTweetResponse = {
  success: boolean
  tweets?: {
    id: string
    text: string
    created_at: string
    author_id?: string
    public_metrics?: {
      retweet_count: number
      like_count: number
      reply_count: number
      quote_count: number
    }
  }[]
  error?: string
  errorCode?: 'TWITTER_API_ERROR' | 'UNKNOWN_ERROR'
}

// Input validation schema
const tweetSchema = z.object({
  text: z.string().min(1, "Tweet text is required").max(280, "Tweet text cannot exceed 280 characters").trim(),
})

export async function postTweet(text: string): Promise<TweetResponse> {
  try {
    // Validate input
    const validation = tweetSchema.safeParse({ text })
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0].message,
        errorCode: 'VALIDATION_ERROR'
      }
    }

    // Create Twitter client using your API credentials
    const client = createTwitterClient()
    
    // Post the tweet
    const result = await client.tweet(validation.data.text)

    return {
      success: true,
      tweet: {
        id: result.data.id,
        text: result.data.text,
        created_at: new Date().toISOString()
      }
    }

  } catch (error: unknown) {
    console.error('Error posting tweet:', error)

    if (error instanceof TwitterClientError) {
      return {
        success: false,
        error: error.message,
        errorCode: 'TWITTER_API_ERROR'
      }
    }

    // Handle specific Twitter API errors
    if (error && typeof error === 'object') {
      if ('code' in error || 'status' in error) {
        const apiError = error as { code?: number; status?: number; message?: string }
        const statusCode = apiError.code || apiError.status
        
        switch (statusCode) {
          case 401:
            return {
              success: false,
              error: "Twitter authentication failed. Check your API credentials.",
              errorCode: 'TWITTER_API_ERROR'
            }
          case 403:
            return {
              success: false,
              error: "Forbidden: Check your app permissions or if tweet is duplicate.",
              errorCode: 'TWITTER_API_ERROR'
            }
          case 429:
            return {
              success: false,
              error: "Rate limit exceeded. Please try again later.",
              errorCode: 'TWITTER_API_ERROR'
            }
          default:
            return {
              success: false,
              error: `Twitter API error: ${apiError.message || 'Unknown error'}`,
              errorCode: 'TWITTER_API_ERROR'
            }
        }
      }
    }

    if (error instanceof Error) {
      return {
        success: false,
        error: `Failed to post tweet: ${error.message}`,
        errorCode: 'TWITTER_API_ERROR'
      }
    }

    return {
      success: false,
      error: "An unexpected error occurred while posting the tweet",
      errorCode: 'UNKNOWN_ERROR'
    }
  }
}






// Utility function for tweet validation (can be used on frontend too)
export async function validateTweetText(text: string): Promise<{ isValid: boolean; error?: string }> {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: "Tweet text is required" }
  }
  
  const trimmedText = text.trim()
  
  if (trimmedText.length === 0) {
    return { isValid: false, error: "Tweet text cannot be empty" }
  }
  
  if (trimmedText.length > 280) {
    return { isValid: false, error: "Tweet text cannot exceed 280 characters" }
  }
  
  return { isValid: true }
}