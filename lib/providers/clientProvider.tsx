import { TwitterApi } from 'twitter-api-v2'
import type { TwitterApiv2 } from 'twitter-api-v2'

export class TwitterClientError extends Error {
    constructor(message: string, public statusCode?: number) {
        super(message)
        this.name = 'TwitterClientError'
    }
}

// Create Twitter client using your own API credentials (no user tokens needed)
export function createTwitterClient(): TwitterApiv2 {
    if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET ||
        !process.env.TWITTER_ACCESS_TOKEN || !process.env.TWITTER_ACCESS_SECRET) {
        throw new TwitterClientError("Twitter API credentials not configured in environment variables")
    }

    try {
        const client = new TwitterApi({
            appKey: process.env.TWITTER_API_KEY,
            appSecret: process.env.TWITTER_API_SECRET,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
            accessSecret: process.env.TWITTER_ACCESS_SECRET,
        })

        return client.v2
    } catch (error) {
        throw new TwitterClientError(
            `Failed to create Twitter client: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
    }
}

// Legacy function for backward compatibility (now uses your credentials instead of user token)
export function createTwitterClientWithToken(accessToken?: string): TwitterApiv2 {
    // Ignore the accessToken parameter and use your own credentials
    return createTwitterClient()
}