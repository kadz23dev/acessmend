import { betterAuth } from 'better-auth'
import { memoryAdapter } from '@better-auth/memory-adapter'
import { pool } from '@/lib/db'

const originList = process.env.NODE_ENV === 'development'
  ? ['http://localhost:3000', ...['V0_RUNTIME_URL', 'V0_DEV_APP_URL', 'V0_BUILD_URL', 'V0_SANDBOX_URL'].map((key) => process.env[key]).filter((value): value is string => Boolean(value))]
  : [process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`, process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`].filter((value): value is string => Boolean(value))

export const auth = betterAuth({
  database: process.env.DATABASE_URL
    ? pool
    : memoryAdapter({ user: [], session: [], account: [], verification: [] }),
  baseURL: process.env.BETTER_AUTH_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.V0_RUNTIME_URL),
  emailAndPassword: { enabled: true, autoSignIn: true },
  trustedOrigins: originList,
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
  ...(process.env.NODE_ENV === 'development' ? { advanced: { defaultCookieAttributes: { sameSite: 'lax' as const, secure: false } } } : {}),
})
