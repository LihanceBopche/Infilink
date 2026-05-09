'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { api } from '@/lib/api'

interface ProfileData {
  user: {
    id: string
    name: string
    handle: string
    bio: string
    theme: string
    redirectEnabled: boolean
    redirectUrl: string
  }
  links: {
    _id: string
    title: string
    url: string
    clicks: number
  }[]
}

export default function PublicProfilePage({ params }: { params: { handle: string } }) {
  const handle = params.handle
  const [data, setData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [subscribing, setSubscribing] = useState(false)
  
  const viewedRef = useRef(false)

  useEffect(() => {
    async function load() {
      const res = await api.getProfile(handle)
      if (res.error) {
        setError(res.error)
      } else if (res.data) {
        const profile = res.data as ProfileData
        if (profile.user.redirectEnabled && profile.user.redirectUrl) {
          window.location.href = profile.user.redirectUrl
        } else {
          setData(profile)
          
          // Unique visitor tracking — only count once per handle per 24 hours per browser
          if (!viewedRef.current) {
            viewedRef.current = true
            const storageKey = `viewed_${profile.user.handle}`
            const lastViewed = localStorage.getItem(storageKey)
            const now = Date.now()
            const ONE_DAY = 24 * 60 * 60 * 1000

            if (!lastViewed || now - parseInt(lastViewed) > ONE_DAY) {
              localStorage.setItem(storageKey, String(now))
              api.recordPageView(profile.user.id).catch(console.error)
            }
          }
        }
      }
      setLoading(false)
    }
    load()
  }, [handle])

  const handleLinkClick = async (linkId: string, url: string) => {
    if (data?.user?.id) {
      api.recordClick(data.user.id, linkId).catch(console.error)
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !data?.user?.id) return
    setSubscribing(true)
    const res = await api.subscribe(data.user.id, email)
    setSubscribing(false)
    if (!res.error) {
      setSubscribed(true)
      setEmail('')
    }
  }

  // Theme configurations for public profiles
  const themes: Record<string, string> = {
    dark: 'bg-gray-900 text-white',
    light: 'bg-gray-100 text-gray-900',
    purple: 'bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-600',
    pink: 'bg-gradient-to-br from-pink-400 to-rose-500',
    mint: 'bg-gradient-to-br from-green-300 to-teal-400',
    sky: 'bg-gradient-to-br from-sky-400 to-blue-500',
    sunset: 'bg-gradient-to-br from-pink-400 to-yellow-400',
    night: 'bg-indigo-950 text-purple-200',
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h1 className="text-3xl font-black text-gray-900 mb-2">404</h1>
        <p className="text-gray-500 font-medium mb-6">This page doesn't exist.</p>
        <Link href="/" className="bg-violet-600 text-white px-6 py-2.5 rounded-full font-bold">
          Create yours for free
        </Link>
      </div>
    )
  }

  const bgClass = themes[data.user.theme] || themes['purple']
  const dark = ['dark','purple','pink','sky','sunset','night'].includes(data.user.theme)

  return (
    <div className={`min-h-screen ${bgClass} py-16 px-4 flex flex-col items-center justify-between font-sans relative overflow-hidden transition-colors duration-700`}>
      
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-black/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Profile Card */}
      <main className="w-full max-w-[500px] z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className={`w-[110px] h-[110px] mx-auto rounded-[38px] flex items-center justify-center text-[44px] font-black mb-6 rotate-3 hover:rotate-0 transition-all duration-500 cursor-pointer shadow-2xl hover:shadow-3xl hover:scale-105
            ${dark ? 'bg-white/15 text-white border border-white/30 backdrop-blur-md' : 'bg-white/60 text-gray-900 border border-black/10 backdrop-blur-md shadow-black/5'}`}>
            {data.user.name.slice(0, 2).toUpperCase()}
          </div>
          
          <h1 className={`text-[30px] md:text-[36px] font-black tracking-tight drop-shadow-sm mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
            {data.user.name}
          </h1>
          <p className={`text-[16px] font-semibold max-w-sm mx-auto leading-relaxed px-4 ${dark ? 'text-white/80' : 'text-gray-700'}`}>
            {data.user.bio}
          </p>
        </div>

        {/* Links Section */}
        <div className="space-y-4">
          {data.links.length === 0 ? (
            <div className={`text-center py-10 rounded-3xl backdrop-blur-md border ${dark ? 'bg-white/5 border-white/10 text-white/50' : 'bg-black/5 border-black/5 text-gray-500'}`}>
              <p className="font-semibold">No links added yet.</p>
            </div>
          ) : (
            data.links.map((link, i) => (
              <button 
                key={link._id} 
                onClick={() => handleLinkClick(link._id, link.url)}
                className={`w-full block rounded-[28px] p-[22px] text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group overflow-hidden relative shadow-lg hover:shadow-xl
                  ${dark ? 'bg-white/15 border border-white/20 text-white backdrop-blur-md hover:bg-white/25' : 'bg-white/80 border border-white text-gray-900 backdrop-blur-md hover:bg-white shadow-black/5'}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <p className="text-[17px] font-extrabold tracking-tight relative z-10 flex items-center justify-center gap-2">
                  {link.title}
                </p>
              </button>
            ))
          )}
        </div>
        
        {/* Subscriber Form */}
        <div className={`mt-10 p-6 rounded-[32px] text-center shadow-xl backdrop-blur-md border transition-all duration-500
          ${dark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-white shadow-black/5'}`}>
          <h3 className={`text-[18px] font-black tracking-tight mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
            Subscribe to my newsletter
          </h3>
          <p className={`text-[14px] font-medium mb-5 px-4 ${dark ? 'text-white/70' : 'text-gray-600'}`}>
            Get the latest updates directly in your inbox. No spam.
          </p>
          
          {subscribed ? (
            <div className="bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30 rounded-2xl py-3 px-4 font-bold text-[14px] animate-in fade-in zoom-in duration-500">
              Thanks for subscribing! 🎉
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-[400px] mx-auto relative z-20">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`flex-1 rounded-2xl px-5 py-3.5 text-[15px] font-medium outline-none border transition-all duration-300 focus:ring-2 focus:ring-violet-500
                  ${dark ? 'bg-black/20 border-white/10 text-white placeholder-white/40 focus:bg-black/40' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'}`}
              />
              <button 
                type="submit" 
                disabled={subscribing}
                className="bg-violet-600 hover:bg-violet-700 disabled:opacity-70 text-white font-extrabold px-6 py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-violet-600/30 whitespace-nowrap"
              >
                {subscribing ? 'Wait...' : 'Subscribe'}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="mt-20 z-10 animate-in fade-in duration-1000 delay-500">
        <Link 
          href="/" 
          className={`backdrop-blur-xl border px-6 py-3 rounded-full text-[14px] font-extrabold tracking-wide transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2.5
            ${dark ? 'bg-black/30 hover:bg-black/50 border-white/10 text-white' : 'bg-white/80 hover:bg-white border-white text-gray-900 shadow-black/5'}`}
        >
          <span className="text-[18px]">∞</span> Create your Infilink
        </Link>
      </footer>
    </div>
  )
}
