import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import AuthForm, { AuthPageShell } from '@/components/auth-form'

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/')
  return <AuthPageShell><div><div className="auth-heading"><p className="eyebrow">WELCOME BACK</p><h2>Sign in to AccessMend</h2><p>Use your account credentials or enter the demo environment.</p></div><AuthForm /></div></AuthPageShell>
}
