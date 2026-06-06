import { createFileRoute } from '@tanstack/react-router'

import { useState } from 'react'
import { authService } from '@/services/authService'
import { useRouter } from '@tanstack/react-router'
import {requireGuest} from "@/lib/routeGueard.ts";

export const Route = createFileRoute('/admin/login')({
  beforeLoad: ({ context }) => requireGuest(context.queryClient),
  component: AdminLogin,
})

function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const res = await authService.login(email)
    if (res.ok) {
      setStep('code')
    } else {
      setError('Failed to send code')
    }
    setLoading(false)
  }

  const handleVerify = async () => {
    setLoading(true)
    setError('')
    const res = await authService.verify(email, code)
    if (res.ok) {
      router.navigate({ to: '/admin/dashboard' })
    } else {
      setError('Invalid or expired code')
    }
    setLoading(false)
  }

  return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="w-full max-w-sm mx-4">

          {/* logo */}
          <div className="text-center mb-8">
            <div className="font-mono text-sm text-white/40 mb-1">safa@pnw:~$</div>
            <div className="text-white/20 font-mono text-xs">admin panel</div>
          </div>

          <div className="bg-[#161b22] border border-white/[0.06] rounded-xl p-6">

            {/* terminal bar */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/[0.06]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              <span className="text-white/20 font-mono text-xs ml-2">
              {step === 'email' ? 'request-access' : 'verify-code'}
            </span>
            </div>

            {step === 'email' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-white/40 font-mono text-xs mb-2 block">email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        placeholder="admin@mail.com"
                        className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-sm font-mono placeholder-white/20 outline-none focus:border-[#5bbf8a]/40 transition-colors"
                    />
                  </div>
                  {error && <p className="text-red-400/70 text-xs font-mono">{error}</p>}
                  <button
                      onClick={handleLogin}
                      disabled={loading || !email}
                      className="w-full py-2.5 rounded-lg bg-[#5bbf8a]/20 border border-[#5bbf8a]/30 text-[#5bbf8a] text-sm font-mono hover:bg-[#5bbf8a]/30 transition-colors disabled:opacity-40"
                  >
                    {loading ? 'sending...' : 'send code →'}
                  </button>
                </div>
            ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-white/40 font-mono text-xs mb-2 block">
                      code sent to {email}
                    </label>
                    <input
                        type="text"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleVerify()}
                        placeholder="000000"
                        maxLength={6}
                        className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-sm font-mono placeholder-white/20 outline-none focus:border-[#5bbf8a]/40 transition-colors tracking-widest text-center text-lg"
                    />
                  </div>
                  {error && <p className="text-red-400/70 text-xs font-mono">{error}</p>}
                  <button
                      onClick={handleVerify}
                      disabled={loading || code.length !== 6}
                      className="w-full py-2.5 rounded-lg bg-[#5bbf8a]/20 border border-[#5bbf8a]/30 text-[#5bbf8a] text-sm font-mono hover:bg-[#5bbf8a]/30 transition-colors disabled:opacity-40"
                  >
                    {loading ? 'verifying...' : 'verify →'}
                  </button>
                  <button
                      onClick={() => { setStep('email'); setCode(''); setError('') }}
                      className="w-full text-white/20 text-xs font-mono hover:text-white/40 transition-colors"
                  >
                    ← back
                  </button>
                </div>
            )}
          </div>
        </div>
      </div>
  )
}