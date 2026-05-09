'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

interface Subscriber { _id: string; email: string; createdAt: string }

export default function SubscribersPage() {
  const { user }              = useAuth()
  const [subs,    setSubs]    = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.plan === 'starter') {
      api.getSubscribers().then(({ data }) => {
        if (data) setSubs(data as Subscriber[])
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [user])

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Subscribers</h1>
        {user?.plan === 'starter' && (
          <span className="text-[13px] font-extrabold bg-violet-100 text-violet-700 px-3 py-1 rounded-full">
            {subs.length} total
          </span>
        )}
      </div>

      {user?.plan !== 'starter' ? (
        <div className="glass-card rounded-3xl p-10 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-3xl mb-4">
            🔒
          </div>
          <h2 className="text-[20px] font-black text-gray-900 mb-2 tracking-tight">Subscribers are a Starter Feature</h2>
          <p className="text-[14px] text-gray-500 max-w-sm mx-auto mb-6">
            Upgrade to the Starter plan to start collecting emails and owning your audience directly on Infilink.
          </p>
          <Link href="/dashboard/settings">
            <button className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md">
              Upgrade to Starter
            </button>
          </Link>
        </div>
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : subs.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="text-5xl mb-4">📬</div>
              <h3 className="text-[18px] font-black text-gray-900 mb-2">No subscribers yet</h3>
              <p className="text-[14px] text-gray-500 font-medium">
                Share your Infilink page to start collecting them!
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">#</th>
                  <th className="text-left px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Email</th>
                  <th className="text-left px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Joined</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((sub, i) => (
                  <tr key={sub._id} className="border-b border-gray-50 last:border-0 hover:bg-violet-50/30 transition-colors">
                    <td className="px-6 py-4 text-[13px] text-gray-400 font-bold">{i + 1}</td>
                    <td className="px-6 py-4 text-[14px] font-extrabold text-gray-900">📧 {sub.email}</td>
                    <td className="px-6 py-4 text-[13px] text-gray-500 font-medium">
                      {new Date(sub.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
