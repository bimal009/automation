import { z } from 'zod'

const envSchema = z.object({
  TWITTER_CLIENT_ID: z.string().min(1, "Twitter Client ID is required"),
  TWITTER_CLIENT_SECRET: z.string().min(1, "Twitter Client Secret is required"),
  NEXTAUTH_SECRET: z.string().min(1, "NextAuth Secret is required"),
  NEXTAUTH_URL: z.string().url("NextAuth URL must be a valid URL"),
  DATABASE_URL: z.string().min(1, "Database URL is required"),
})

export const env = envSchema.parse(process.env)