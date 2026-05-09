'use client'
import Link        from 'next/link'
import { useState } from 'react'
import { Button }   from '@/components/ui/Button'

const FREE_FEATURES = [
  { emoji: '🔗', title: 'Unlimited links' },
  { emoji: '📺', title: 'Social icons, videos & embeds' },
  { emoji: '📈', title: 'Essential analytics' },
  { emoji: '🔎', title: 'SEO optimized, high-converting design' },
  { emoji: '🤳', title: 'Unique QR code' },
]

const STARTER_FEATURES = [
  { emoji: '🎨', title: 'Custom themes',     desc: 'Custom color palettes and fresh themes to match your style' },
  { emoji: '💌', title: 'Own your audience', desc: 'Collect and manage your subscribers' },
  { emoji: '🔀', title: 'Redirect links',    desc: 'Temporarily send visitors to one key link, perfect for promos or launches' },
  { emoji: '📊', title: 'Analytics dashboard', desc: 'See which link got how many views and how many people clicked it' },
]

export default function LandingPage() {
  const [annual, setAnnual] = useState(false)
  const price = annual ? 174 : 249

  return (
    <div className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-[1000px] mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[17px] font-extrabold">
            <div className="w-[30px] h-[30px] bg-gray-900 rounded-lg text-white flex items-center justify-center text-[15px] font-black">
              ∞
            </div>
            Infilink
          </div>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign up free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="max-w-[1000px] mx-auto px-5 py-20 text-center">
        <h1 className="text-[clamp(36px,7vw,70px)] font-extrabold tracking-[-2px] leading-[1.05] mb-5">
          Your links.<br />
          <span className="text-violet-600">All in one place.</span>
        </h1>
        <p className="text-[clamp(15px,2vw,17px)] text-gray-500 max-w-[440px] mx-auto mb-8 leading-[1.75]">
          One link for your Instagram bio, WhatsApp status, and everywhere else.
        </p>
        <div className="flex gap-3 justify-center flex-wrap mb-4">
          <Link href="/signup">
            <Button size="lg">Get started for free</Button>
          </Link>
          <Link href="/dashboard" onClick={() => localStorage.removeItem('demo_logged_out')}>
            <Button variant="outline" size="lg">See demo →</Button>
          </Link>
        </div>
        <p className="text-[12px] text-gray-400">Free forever · No credit card needed</p>
      </div>

      {/* PRICING */}
      <div className="bg-gray-50 py-16 px-5">
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="text-[clamp(26px,4vw,38px)] font-extrabold tracking-[-1px] mb-2">
            Simple pricing.
          </h2>
          <p className="text-[15px] text-gray-500 mb-6">Start free. Upgrade when you're ready.</p>

          {/* Toggle */}
          <div className="inline-flex bg-gray-200 rounded-full p-1 gap-1 mb-8">
            {['Monthly', 'Annual'].map((t) => (
              <button
                key={t}
                onClick={() => setAnnual(t === 'Annual')}
                className={`px-5 py-1.5 rounded-full text-[13px] font-semibold transition-all
                  ${(t === 'Annual') === annual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
              >
                {t}
                {t === 'Annual' && (
                  <span className="ml-1.5 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-lg">
                    Save 30%
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-[1.5px] border-gray-200 rounded-2xl overflow-hidden text-left">

            {/* Free */}
            <div className="bg-white p-7">
              <p className="text-[21px] font-extrabold mb-1">Free</p>
              <p className="text-[13px] text-gray-400 mb-4">Get started with your own personal Infilink</p>
              <div className="h-px bg-gray-100 mb-4" />
              <p className="text-[42px] font-extrabold tracking-[-2px] mb-1">₹0</p>
              <p className="text-[12px] text-gray-400 mb-5">Free, forever</p>
              <Link href="/signup">
                <button className="w-full py-3 rounded-3xl border-[1.5px] border-gray-200 text-[14px] font-bold hover:border-gray-400 transition-colors mb-5">
                  Get started
                </button>
              </Link>
              <p className="text-[10px] font-bold uppercase tracking-[.7px] text-gray-400 mb-2.5">
                Key features
              </p>
              {FREE_FEATURES.map((f) => (
                <div key={f.title} className="flex items-center gap-2.5 mb-2.5">
                  <span className="text-[15px]">{f.emoji}</span>
                  <span className="text-[13px] font-bold">{f.title}</span>
                </div>
              ))}
            </div>

            {/* Starter */}
            <div className="bg-gray-900 p-7 text-white">
              <p className="text-[21px] font-extrabold mb-1">Starter</p>
              <p className="text-[13px] text-white/40 mb-4">For creators and brands, just getting started</p>
              <div className="h-px bg-white/10 mb-4" />
              <p className="text-[42px] font-extrabold tracking-[-2px] mb-1">₹{price}</p>
              <p className="text-[12px] text-white/30 mb-5">
                {annual ? `Billed annually (₹${price * 12}/yr)` : 'Billed monthly'}
              </p>
              <Link href="/signup">
                <button className="w-full py-3 rounded-3xl bg-white text-gray-900 text-[14px] font-bold hover:bg-gray-100 transition-colors mb-5">
                  Get started
                </button>
              </Link>
              <p className="text-[12px] font-bold text-white/50 mb-3">Everything in Free, plus:</p>
              <p className="text-[10px] font-bold uppercase tracking-[.7px] text-white/30 mb-2.5">
                Link in bio
              </p>
              {STARTER_FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-2.5 mb-3">
                  <span className="text-[15px] mt-0.5">{f.emoji}</span>
                  <div>
                    <p className="text-[13px] font-bold">{f.title}</p>
                    <p className="text-[11px] text-white/35 mt-0.5 leading-[1.5]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-4">All prices in INR · GST extra · Cancel anytime</p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-16 px-5 border-t border-gray-100">
        <h2 className="text-[clamp(22px,4vw,36px)] font-extrabold tracking-[-1px] mb-3">
          Start for free today.
        </h2>
        <p className="text-[14px] text-gray-500 mb-6">No credit card needed. Up and running in 2 minutes.</p>
        <Link href="/signup">
          <Button size="lg">Create my Infilink →</Button>
        </Link>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-6 px-5">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-[15px] font-extrabold">
            <div className="w-[26px] h-[26px] bg-gray-900 rounded-lg text-white flex items-center justify-center text-[12px] font-black">
              ∞
            </div>
            Infilink
          </div>
          <div className="flex gap-5">
            {['Terms', 'Privacy', 'Support'].map((l) => (
              <a key={l} href="#" className="text-[13px] text-gray-400 hover:text-gray-900">{l}</a>
            ))}
          </div>
          <p className="text-[12px] text-gray-300">© 2025 Infilink · Made in India 🇮🇳</p>
        </div>
      </footer>
    </div>
  )
}
