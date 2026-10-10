import { betterAuth } from 'better-auth'
import { memoryAdapter } from '@better-auth/memory-adapter'
import { pool } from '@/lib/db'

const deployedOrigin = process.env.URL ?? process.env.DEPLOY_PRIME_URL ?? process.env.SITE_URL
const configuredOrigin = process.env.BETTER_AUTH_URL ?? deployedOrigin
const originList = [
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
  configuredOrigin,
  ...['V0_RUNTIME_URL', 'V0_DEV_APP_URL', 'V0_BUILD_URL', 'V0_SANDBOX_URL'].map((key) => process.env[key]),
].filter((value): value is string => Boolean(value))

export const auth = betterAuth({
  database: process.env.DATABASE_URL
    ? pool
    : memoryAdapter({ user: [], session: [], account: [], verification: [] }),
  baseURL: configuredOrigin,
  emailAndPassword: { enabled: true, autoSignIn: true },
  trustedOrigins: originList,
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
  ...(process.env.NODE_ENV === 'development' ? { advanced: { defaultCookieAttributes: { sameSite: 'lax' as const, secure: false } } } : {}),
})
