'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await login(email, password)
    setLoading(false)
    if ('error' in result && result.error) { setError(result.error); return }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex ambient-bg relative overflow-hidden">
      {/* Background blobs */}
      <div className="ambient-blob-1" />
      <div className="ambient-blob-2" />
      
      {/* Visual brand side */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 relative z-10 glass-accent border-r border-white/40">
        <div>
          <h1 className="text-[28px] font-black tracking-tight text-violet-900 drop-shadow-sm flex items-center gap-3">
             <div className="w-[40px] h-[40px] bg-gradient-to-br from-violet-600 to-purple-800 rounded-xl text-white flex items-center justify-center text-[18px] font-black shadow-lg shadow-purple-500/30">
               ∞
             </div>
             Infilink
          </h1>
        </div>
        <div className="max-w-[400px]">
          <h2 className="text-[42px] font-black leading-[1.1] mb-6 text-gray-900 tracking-tight">
            Welcome back to your audience.
          </h2>
          <p className="text-[16px] text-gray-600 font-medium leading-relaxed">
            Monitor your traffic, update your links, and grow your audience all from the most beautiful dashboard on the web.
          </p>
        </div>
        <p className="text-[13px] font-bold text-gray-400">© {new Date().getFullYear()} Infilink Technologies.</p>
      </div>

      {/* Auth side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-[440px] glass-card rounded-[32px] p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500 shadow-2xl shadow-purple-900/5">
           
          {/* Mobile logo */}
          <div className="lg:hidden w-[48px] h-[48px] bg-gradient-to-br from-violet-600 to-purple-800 rounded-2xl text-white flex items-center justify-center text-[22px] font-black shadow-lg shadow-purple-500/30 mb-8 mx-auto">
             ∞
          </div>

          <h2 className="text-[26px] md:text-[30px] font-black text-gray-900 mb-2 tracking-tight">Sign In</h2>
          <p className="text-[14px] text-gray-500 font-medium tracking-[0.2px] mb-8">Enter your details to access your dashboard.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <Input 
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
            <Input 
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-[13px] font-bold text-red-500">{error}</p>}

            <Button type="submit" variant="purple" full loading={loading} className="mt-4 py-4 text-[15px]">
              Login to Dashboard
            </Button>
          </form>

          <p className="text-center text-[13.5px] font-medium text-gray-500 mt-8">
            Don't have an account?{' '}
            <Link href="/signup" className="text-violet-700 font-extrabold hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
