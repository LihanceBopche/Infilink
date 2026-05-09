'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

export default function SignupPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [handle, setHandle] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await register({ name, email, password, handle })
    setLoading(false)
    if ('error' in result && result.error) { setError(result.error); return }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex ambient-bg relative overflow-hidden">
      <div className="ambient-blob-1" />
      <div className="ambient-blob-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[60vh] bg-violet-500/5 blur-[100px] rounded-full -z-10" />

      <div className="hidden lg:flex w-[45%] flex-col justify-center px-16 relative z-10 glass-accent border-r border-white/40">
        <h1 className="text-[28px] font-black tracking-tight text-violet-900 drop-shadow-sm flex items-center gap-3 absolute top-12 left-12">
            <div className="w-[40px] h-[40px] bg-gradient-to-br from-violet-600 to-purple-800 rounded-xl text-white flex items-center justify-center text-[18px] font-black shadow-lg shadow-purple-500/30">∞</div>
            Infilink
        </h1>
        <div className="max-w-[400px]">
          <h2 className="text-[44px] font-black leading-[1.1] mb-6 text-gray-900 tracking-tight">One link to rule them all.</h2>
          <p className="text-[17px] text-gray-600 font-medium leading-relaxed">Join thousands of creators who use Infilink to beautifully share their content, grow their audience, and track deep analytics.</p>
          <div className="mt-10 flex -space-x-3">
             <div className="w-12 h-12 rounded-full border-2 border-white bg-violet-200"></div>
             <div className="w-12 h-12 rounded-full border-2 border-white bg-pink-200"></div>
             <div className="w-12 h-12 rounded-full border-2 border-white bg-blue-200"></div>
             <div className="w-12 h-12 rounded-full border-2 border-white bg-white flex items-center justify-center text-xs font-bold shadow-sm">+9k</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-[450px] glass-card rounded-[32px] p-8 md:p-12 animate-in fade-in slide-in-from-right-8 duration-700 shadow-2xl shadow-purple-900/10">

          <div className="flex items-center gap-2 mb-8">
            <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-violet-600' : 'bg-gray-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-violet-600' : 'bg-gray-200'}`} />
          </div>

          <h2 className="text-[28px] md:text-[34px] font-black text-gray-900 mb-2 tracking-tight">
            {step === 1 ? 'Claim your link' : 'Create an account'}
          </h2>
          <p className="text-[14px] text-gray-500 font-medium tracking-[0.2px] mb-8">
            {step === 1 ? 'Choose an awesome handle for your public page.' : 'Just a few details to get your page live.'}
          </p>

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2) } : handleSignup} className="space-y-5">
            {step === 1 ? (
              <>
                <div className="relative">
                  <span className="absolute left-4 top-[35px] text-gray-400 font-bold select-none">infilink.in/</span>
                  <Input 
                    label="Your unique handle"
                    placeholder="myawesomepage"
                    className="pl-[95px] font-bold text-violet-900"
                    value={handle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHandle(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <Button type="submit" variant="purple" full className="mt-4 py-4 text-[15px]">Continue →</Button>
              </>
            ) : (
              <>
                <Input label="Full Name" placeholder="Alex Developer" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required autoFocus />
                <Input label="Email Address" type="email" placeholder="you@email.com" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
                <Input label="Password" type="password" placeholder="Min 8 characters" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
                {error && <p className="text-[13px] font-bold text-red-500">{error}</p>}
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button type="submit" variant="purple" full loading={loading}>Create Account</Button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-[13.5px] font-medium text-gray-500 mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-700 font-extrabold hover:underline">Log in instead</Link>
          </p>
        </div>
      </div>
    </div>
  )
}