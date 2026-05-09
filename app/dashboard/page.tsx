'use client'
import Link           from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth }    from '@/hooks/useAuth'
import { useLinks }   from '@/hooks/useLinks'
import { useToast }   from '@/hooks/useToast'
import { Toast }      from '@/components/ui/Toast'
import { api }        from '@/lib/api'

interface AnalyticsData {
  totalViews:  number
  totalClicks: number
  ctr:         string
}

export default function OverviewPage() {
  const { user }               = useAuth()
  const { links }              = useLinks()
  const { message, showToast } = useToast()

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [subsCount, setSubsCount] = useState<number>(0)
  const [statsLoading, setStatsLoading] = useState(true)

  // Fetch analytics + subscriber count on mount and every 30s for live feel
  useEffect(() => {
    async function fetchStats() {
      const [analyticsRes, subsRes] = await Promise.all([
        api.getAnalytics(),
        api.getSubscribers(),
      ])
      if (analyticsRes.data) setAnalytics(analyticsRes.data as AnalyticsData)
      if (Array.isArray(subsRes.data)) setSubsCount((subsRes.data as any[]).length)
      setStatsLoading(false)
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30_000)
    return () => clearInterval(interval)
  }, [])

  const copyLink = () => {
    const domain = typeof window !== 'undefined' ? window.location.host : 'infilink.in'
    navigator.clipboard.writeText(`https://${domain}/${user?.handle ?? ''}`)
    showToast('Link copied!')
  }

  const statCards = [
    {
      label: 'Page Views',
      value: statsLoading ? '...' : String(analytics?.totalViews ?? 0),
      icon: '👁️',
      color: 'from-blue-500/10 to-transparent',
    },
    {
      label: 'Link Clicks',
      value: statsLoading ? '...' : String(analytics?.totalClicks ?? 0),
      icon: '👆',
      color: 'from-purple-500/10 to-transparent',
    },
    {
      label: 'Subscribers',
      value: statsLoading ? '...' : String(subsCount),
      icon: '💌',
      color: 'from-pink-500/10 to-transparent',
    },
    {
      label: 'Avg CTR',
      value: statsLoading ? '...' : (analytics?.ctr ?? '—'),
      icon: '📈',
      color: 'from-green-500/10 to-transparent',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-600 rounded-3xl p-8 text-white shadow-xl shadow-purple-500/20 group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3 group-hover:scale-110 transition-transform duration-700" />
        
        <div className="relative z-10">
          <h2 className="text-[26px] md:text-[32px] font-extrabold mb-1.5 tracking-tight drop-shadow-md">
            Welcome to Infilink 👋
          </h2>
          <p className="text-[14px] md:text-[15px] font-medium text-purple-100 mb-6 max-w-md">
            Your personal page is live! Share your unique link across your social media profiles to start growing your audience.
          </p>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 pl-5
            flex items-center justify-between gap-4 flex-wrap max-w-[600px] shadow-inner">
            <span className="text-[14px] md:text-[15px] font-bold tracking-tight">infilink.in/{user?.handle ?? 'yourpage'}</span>
            <div className="flex gap-2.5 w-full sm:w-auto mt-2 sm:mt-0">
              <button onClick={copyLink}
                className="flex-1 sm:flex-none bg-white text-violet-900 text-[13px] font-extrabold px-5 py-2.5 rounded-xl hover:bg-violet-50 transition-colors shadow-sm active:scale-95">
                Copy Link
              </button>
              <Link
                href={`/${user?.handle}`}
                target="_blank"
                className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 border border-white/30 text-white text-[13px] font-bold px-5 py-2.5 rounded-xl transition-colors active:scale-95 text-center">
                View Page ↗
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[16px] font-extrabold text-gray-900">Lifetime Analytics</h3>
          <span className="flex items-center gap-1.5 text-[12px] font-bold text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Live
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {statCards.map((s, i) => (
            <div key={s.label} 
              className="glass-card rounded-3xl p-5 relative overflow-hidden group cursor-pointer"
              style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`absolute -inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[18px] mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-gray-100">
                  {s.icon}
                </div>
                <p className={`text-[28px] md:text-[34px] font-black text-gray-900 leading-none tracking-tight mb-1 transition-all duration-300 ${statsLoading ? 'opacity-30 animate-pulse' : ''}`}>
                  {s.value}
                </p>
                <p className="text-[13px] font-bold text-gray-500 uppercase tracking-[0.5px]">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Setup checklist */}
      <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 blur-3xl rounded-full -z-10" />
        
        <div className="flex items-end justify-between mb-6">
          <div>
            <h3 className="text-[18px] font-extrabold text-gray-900 mb-1">Setup Guide</h3>
            <p className="text-[13px] text-gray-500 font-medium tracking-[0.2px]">Complete these steps to get the most out of your page.</p>
          </div>
          <div className="text-right">
            <span className="text-[24px] font-black text-violet-600">{1 + (links.length > 0 ? 1 : 0)}</span>
            <span className="text-[14px] font-bold text-gray-400">/4</span>
          </div>
        </div>

        <div className="space-y-1">
          {[
            { done: true,             text: 'Create your account', desc: 'You claimed your unique handle.', action: null,              href: null                    },
            { done: links.length > 0, text: 'Add your first link', desc: 'Direct visitors to your content.', action: 'Add links →',     href: '/dashboard/links'      },
            { done: false,            text: 'Customize appearance', desc: 'Pick a beautiful theme and add a bio.',  action: 'Choose theme →',  href: '/dashboard/appearance' },
            { done: false,            text: 'Share your page',     desc: 'Put your link in your Instagram bio.', action: 'Copy link →',     href: null                    },
          ].map((item, i) => (
            <div key={item.text}
              className="flex items-center gap-4 py-4 px-3 rounded-2xl hover:bg-gray-50/50 transition-colors group">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] flex-shrink-0 shadow-sm border transition-all duration-300
                ${item.done
                  ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white border-green-500/50 group-hover:scale-110 shadow-green-500/20'
                  : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                {item.done ? '✓' : i + 1}
              </div>
              <div className="flex-1">
                <p className={`text-[15px] font-bold ${item.done ? 'text-gray-900' : 'text-gray-800'}`}>{item.text}</p>
                <p className="text-[13px] text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              
              <div className="flex-shrink-0">
                {item.done
                  ? <span className="inline-flex py-1.5 px-3 rounded-lg text-[12px] font-bold text-green-700 bg-green-50 border border-green-100">
                      Completed
                    </span>
                  : item.href
                    ? <Link href={item.href}
                        className="inline-flex py-1.5 px-4 rounded-xl text-[13px] font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 hover:text-violet-800 border border-violet-100 transition-colors shadow-sm active:scale-95">
                        {item.action}
                      </Link>
                    : <button onClick={copyLink}
                        className="inline-flex py-1.5 px-4 rounded-xl text-[13px] font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 hover:text-violet-800 border border-violet-100 transition-colors shadow-sm active:scale-95">
                        {item.action}
                      </button>
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      <Toast message={message} />
    </div>
  )
}