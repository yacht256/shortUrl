export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  APP_PASSWORD_HASH: process.env.APP_PASSWORD_HASH!,
  SESSION_SECRET: process.env.SESSION_SECRET!,
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
} as const
