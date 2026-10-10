'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/auth-client'

const DEMO_EMAIL = 'demo@accessmend.dev'
const DEMO_PASSWORD = 'AccessMendDemo123!'

export function AuthForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    const result = mode === 'sign-in'
      ? await signIn.email({ email, password })
      : await signUp.email({ email, password, name: name || email.split('@')[0] })
    if (result.error) setError('Unable to authenticate. Check your details and try again.')
    else { router.push('/'); router.refresh() }
    setPending(false)
  }

  async function useDemo() {
    setPending(true)
    setError('')

    try {
      let result = await signIn.email({ email: DEMO_EMAIL, password: DEMO_PASSWORD })

      if (result.error) {
        const provisioned = await signUp.email({
          email: DEMO_EMAIL,
          password: DEMO_PASSWORD,
          name: 'Demo Analyst',
        })

        // An existing demo account is expected to return a sign-up error;
        // authenticate it again after either provisioning path.
        result = provisioned.error
          ? await signIn.email({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
          : provisioned
      }

      if (result.error) {
        setError('Demo access is temporarily unavailable. Please try again.')
        return
      }

      router.push('/')
      router.refresh()
    } catch {
      setError('Demo access is temporarily unavailable. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return <div className="auth-card">
    <div className="auth-tabs"><button className={mode === 'sign-in' ? 'active' : ''} onClick={() => setMode('sign-in')}>Sign in</button><button className={mode === 'sign-up' ? 'active' : ''} onClick={() => setMode('sign-up')}>Create account</button></div>
    <form onSubmit={submit} className="auth-form">
      {mode === 'sign-up' && <label>Full name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Alex Morgan" autoComplete="name" required /></label>}
      <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" autoComplete="email" required /></label>
      <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} minLength={8} required /></label>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="auth-submit" disabled={pending}>{pending ? 'Authenticating…' : mode === 'sign-in' ? 'Sign in securely' : 'Create secure account'}</button>
    </form>
    <div className="auth-divider"><span>or</span></div>
    <button className="demo-login" onClick={useDemo} disabled={pending}>Use demo analyst account <span>→</span></button>
    <p className="auth-note">A demo analyst account is provisioned automatically on first use.</p>
  </div>
}

export { DEMO_EMAIL, DEMO_PASSWORD }

export default AuthForm

export function AuthBrand() {
  return <div className="auth-brand"><div className="brand-mark"><span>✓</span></div><span>access<span>mend</span></span></div>
}

export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return <main className="auth-shell"><div className="auth-glow" /><section className="auth-layout"><div className="auth-copy"><AuthBrand /><p className="eyebrow">SECURITY OPERATIONS PLATFORM</p><h1>Prove every access decision.</h1><p>Identify policy gaps, approve minimal repairs, and verify that your security controls hold under pressure.</p><div className="auth-proof"><span>01</span><div><strong>Real sessions, real persistence</strong><small>Protected by Better Auth and Neon Postgres.</small></div></div><div className="auth-proof"><span>02</span><div><strong>Evidence-first workflows</strong><small>Turn authorization findings into accountable repairs.</small></div></div></div><div>{children}</div></section></main>
}
