'use client'
import Link             from 'next/link'
import { usePathname }  from 'next/navigation'
import { useRouter }    from 'next/navigation'
import { useEffect }    from 'react'
import { useAuth }      from '@/hooks/useAuth'

const NAV = [
  { href: '/dashboard',             icon: '◉',  label: 'Overview'     },
  { href: '/dashboard/links',       icon: '🔗', label: 'My Links'     },
  { href: '/dashboard/analytics',   icon: '📈', label: 'Analytics'    },
  { href: '/dashboard/subscribers', icon: '💌', label: 'Subscribers'  },
  { href: '/dashboard/redirect',    icon: '🔀', label: 'Redirect'     },
  { href: '/dashboard/appearance',  icon: '🎨', label: 'Appearance'   },
  { href: '/dashboard/settings',    icon: '⚙',  label: 'Settings'     },
]

const MOB_NAV = [
  { href: '/dashboard',            icon: '◉',  label: 'Home'      },
  { href: '/dashboard/links',      icon: '🔗', label: 'Links'     },
  { href: '/dashboard/analytics',  icon: '📈', label: 'Analytics' },
  { href: '/dashboard/appearance', icon: '🎨', label: 'Look'      },
  { href: '/dashboard/settings',   icon: '⚙',  label: 'Settings'  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const { user, loading, logout } = useAuth()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ambient-bg">
        <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen ambient-bg z-0 flex flex-col font-sans">
      
      {/* Ambient background animations */}
      <div className="ambient-blob-1" />
      <div className="ambient-blob-2" />

      {/* Topbar */}
      <header className="glass border-b h-[60px] flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2.5 text-[16px] font-extrabold tracking-tight">
          <div className="w-[30px] h-[30px] bg-gradient-to-br from-violet-600 to-purple-800 rounded-lg text-white flex items-center justify-center text-[13px] font-black shadow-lg shadow-purple-500/30">
            ∞
          </div>
          Infilink
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href={`/${user?.handle}`} 
            target="_blank"
            className="text-[12.5px] font-semibold text-violet-600 hidden md:block bg-violet-50 hover:bg-violet-100 px-4 py-1.5 rounded-full transition-colors border border-violet-100 cursor-pointer"
          >
            infilink.in/{user?.handle} ↗
          </Link>
          <button
            onClick={logout}
            className="text-[12px] font-bold text-gray-600 hover:text-gray-900 border border-gray-200/60 bg-white/50 hover:bg-white rounded-full px-4 py-1.5 transition-all shadow-sm active:scale-95"
          >
            Log out
          </button>
          <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-gray-800 to-black text-white text-[11px] font-extrabold flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform">
            {user?.name?.slice(0, 2).toUpperCase() ?? 'ME'}
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-[1400px] w-full mx-auto relative">

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-[220px] flex-col p-4 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto">
          <div className="flex flex-col gap-1">
            {NAV.map((item, i) => {
              const active = pathname === item.href
              return (
                <div key={item.href}>
                  {i === 6 && <div className="h-px bg-gray-200/50 my-2" />}
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-bold transition-all relative overflow-hidden group
                      ${active
                        ? 'bg-white text-violet-700 shadow-sm border border-gray-100/50'
                        : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'}`}
                  >
                    {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500 rounded-r-full" />}
                    <span className={`text-[16px] w-[22px] flex justify-center transition-transform ${active ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-110 opacity-70'}`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </div>
              )
            })}
          </div>
        </aside>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-8 pb-24 md:pb-8 w-full">
          <div className="max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t-white/60 z-40 pb-safe">
        <div className="flex justify-around py-3 px-2">
          {MOB_NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 min-w-[50px] relative group"
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
                  ${active ? 'bg-violet-100 text-violet-700 shadow-sm scale-110' : 'text-gray-500 group-hover:bg-white/50'}`}>
                  <span className="text-[20px]">{item.icon}</span>
                </div>
                <span className={`text-[10px] uppercase tracking-[0.5px] font-extrabold transition-colors mt-0.5
                  ${active ? 'text-violet-700' : 'text-gray-400'}`}>
                  {item.label}
                </span>
                {active && <div className="absolute -bottom-[10px] w-1 h-1 rounded-full bg-violet-600" />}
              </Link>
            )
          })}
        </div>
      </nav>

    </div>
  )
}