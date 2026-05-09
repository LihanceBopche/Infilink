'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

interface AnalyticsData {
  totalViews:  number
  totalClicks: number
  ctr:         string
  links:       { title: string; views: number; clicks: number }[]
}

export default function AnalyticsPage() {
  const { user }              = useAuth()
  const [data,    setData]    = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getAnalytics().then(({ data }) => {
      if (data) setData(data as AnalyticsData)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-[17px] font-bold mb-4">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
        {[
          { label: 'Total views',     value: data?.totalViews  ?? 0 },
          { label: 'Total clicks',    value: data?.totalClicks ?? 0 },
          { label: 'CTR',             value: data?.ctr         ?? '—' },
          { label: 'Unique visitors', value: '—' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-3.5">
            <p className="text-[11px] text-gray-400 mb-1">{s.label}</p>
            <p className="text-[22px] font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-50">
          <p className="text-[13px] font-bold">Link performance</p>
          <p className="text-[11px] text-gray-400">Last 30 days</p>
        </div>
        
        {user?.plan !== 'starter' ? (
          <div className="text-center py-12 px-6">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-[16px] font-bold text-gray-900 mb-1">Deep Analytics is a Starter Feature</h3>
            <p className="text-[13px] text-gray-500 mb-5 max-w-[280px] mx-auto">
              Upgrade to see exactly which links are performing best with detailed CTRs.
            </p>
            <Link href="/dashboard/settings">
              <button className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-5 text-sm rounded-lg transition-all">
                Upgrade to Starter
              </button>
            </Link>
          </div>
        ) : !data?.links?.length ? (
          <div className="text-center py-8">
            <p className="text-[13px] text-gray-500">Add links to see their analytics here.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                {['Link', 'Views', 'Clicks', 'CTR'].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold uppercase tracking-[.4px] text-gray-400 p-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.links.map((r, i) => {
                const ctr = r.views > 0 ? `${((r.clicks / r.views) * 100).toFixed(1)}%` : '—'
                return (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="p-3 font-medium">🔗 {r.title}</td>
                    <td className="p-3">{r.views}</td>
                    <td className="p-3 font-bold">{r.clicks}</td>
                    <td className="p-3">
                      <span className="bg-green-50 text-green-700 text-[11px] font-bold px-2 py-0.5 rounded-lg">
                        {ctr}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
