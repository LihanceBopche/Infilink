'use client'
import { useState }       from 'react'
import { useLinks }       from '@/hooks/useLinks'
import { useAuth }        from '@/hooks/useAuth'
import { useToast }       from '@/hooks/useToast'
import { AddLinkForm }    from '@/components/dashboard/links/AddLinkForm'
import { LinkCard }       from '@/components/dashboard/links/LinkCard'
import { PhonePreview }   from '@/components/dashboard/links/PhonePreview'
import { Toast }          from '@/components/ui/Toast'
import { Button }         from '@/components/ui/Button'
import type { Theme }     from '@/types'

export default function LinksPage() {
  const { user }                                    = useAuth()
  const { links, addLink, toggleLink, removeLink }  = useLinks()
  const { message, showToast }                      = useToast()
  const [showForm, setShowForm]                     = useState(false)
  const theme = (user?.theme ?? 'purple') as Theme

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start animate-in fade-in zoom-in-95 duration-500">
        {/* Left: Editor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-[22px] font-extrabold text-gray-900 tracking-tight">Your Links</h1>
          </div>

          {/* Profile bar */}
          <div className="glass-card flex items-center gap-4 p-5 rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-100 to-purple-50 flex items-center justify-center text-lg font-black text-violet-700 flex-shrink-0 shadow-sm border border-violet-200 group-hover:scale-105 transition-transform">
              {(user?.handle ?? 'YP').slice(0, 2).toUpperCase()}
            </div>
            <div className="relative z-10">
              <p className="text-[16px] font-extrabold text-gray-900 mb-0.5">@{user?.handle ?? 'yourpage'}</p>
              <p className="text-[13.5px] text-gray-500 font-medium">{user?.bio || 'Add bio in Appearance'}</p>
            </div>
          </div>

          {/* Add button */}
          <button
            onClick={() => setShowForm((v) => !v)}
            className="w-full py-4 bg-gradient-to-br from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-extrabold text-[15px] rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <span className="mr-2 text-lg leading-none">+</span> Add New Link
          </button>

          {showForm && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <AddLinkForm
                onAdd={async (t, u) => {
                  const res = await addLink(t, u)
                  if (!res.error) setShowForm(false)
                  return res
                }}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {links.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-3xl border-dashed border-2 border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto shadow-sm">🔗</div>
              <p className="text-[16px] font-extrabold text-gray-900 mb-1.5">No links yet</p>
              <p className="text-[14px] text-gray-500 max-w-sm mx-auto">Click <span className="font-bold text-violet-600">"+ Add New Link"</span> to add your Instagram, YouTube or any link.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {links.map((l) => (
                <div key={l.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <LinkCard
                    link={l}
                    onToggle={() => toggleLink(l.id)}
                    onRemove={() => removeLink(l.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Phone preview (desktop only) */}
        <div className="hidden lg:block sticky top-[92px]">
          <div className="bg-white/40 backdrop-blur-3xl rounded-[40px] p-4 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <p className="text-[11px] font-black text-violet-400 text-center uppercase tracking-[1px] mb-3">
              Live preview
            </p>
            <PhonePreview
              handle={user?.handle ?? 'yourpage'}
              bio={user?.bio ?? ''}
              links={links}
              theme={theme}
            />
            <div className="text-center mt-5">
              <p className="text-[12px] font-bold text-gray-500 tracking-tight mb-2">infilink.in/{user?.handle}</p>
              <Button variant="glass" size="sm" onClick={() => showToast('Link copied!')} className="font-bold text-violet-700 border-violet-200 bg-white">
                Copy unique link
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Toast message={message} />
    </>
  )
}
