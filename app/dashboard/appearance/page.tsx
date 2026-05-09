'use client'
import { useState, useEffect } from 'react'
import { api }           from '@/lib/api'
import { useAuth }       from '@/hooks/useAuth'
import { useToast }      from '@/hooks/useToast'
import { useLinks }      from '@/hooks/useLinks'
import { Input }         from '@/components/ui/Input'
import { Button }        from '@/components/ui/Button'
import { Toast }         from '@/components/ui/Toast'
import { PhonePreview }  from '@/components/dashboard/links/PhonePreview'
import type { Theme }    from '@/types'

const THEMES: { id: Theme; label: string; style: string }[] = [
  { id: 'dark',   label: 'Dark',   style: 'bg-gray-900 text-white' },
  { id: 'light',  label: 'Light',  style: 'bg-white text-gray-900 border border-gray-200' },
  { id: 'purple', label: 'Purple', style: 'bg-gradient-to-br from-violet-500 to-purple-700 text-white' },
  { id: 'pink',   label: 'Pink',   style: 'bg-gradient-to-br from-pink-400 to-rose-500 text-white' },
  { id: 'mint',   label: 'Mint',   style: 'bg-gradient-to-br from-green-300 to-teal-400 text-gray-900' },
  { id: 'sky',    label: 'Sky',    style: 'bg-gradient-to-br from-sky-400 to-blue-500 text-white' },
  { id: 'sunset', label: 'Sunset', style: 'bg-gradient-to-br from-pink-400 to-yellow-400 text-gray-900' },
  { id: 'night',  label: 'Night',  style: 'bg-[#1a1a2e] text-purple-200' },
]

export default function AppearancePage() {
  const { user, refresh }      = useAuth()
  const { links }              = useLinks()
  const { message, showToast } = useToast()
  const [bio,   setBio]   = useState(user?.bio   ?? '')
  const [theme, setTheme] = useState<Theme>((user?.theme as Theme) ?? 'purple')
  const [saving, setSaving] = useState(false)
  
  // Track if changes are made
  const hasChanges = user && (bio !== (user.bio || '') || theme !== (user.theme || 'purple'))

  useEffect(() => {
    if (user) { setBio(user.bio || ''); setTheme((user.theme as Theme) ?? 'purple') }
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    const { error } = await api.updateProfile({ bio, theme })
    setSaving(false)
    if (error) {
      showToast('Failed — ' + error)
    } else {
      showToast('Appearance saved! 🎨')
      refresh()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start animate-in fade-in duration-500 pb-20">
      {/* Editor */}
      <div className="space-y-5">
        <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 blur-3xl rounded-full -z-10" />
          <h2 className="text-[20px] font-black text-gray-900 mb-5 tracking-tight">Profile Info</h2>
          <div className="space-y-4">
            <Input
              label="Display Name"
              value={user?.name ?? ''}
              readOnly
              className="bg-gray-50 cursor-not-allowed"
            />
            <div>
              <label className="text-[13px] font-extrabold text-gray-700 mb-1.5 block">Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                maxLength={160}
                placeholder="Tell visitors about yourself..."
                rows={3}
                className="w-full px-4 py-3 text-[14px] font-medium text-gray-800 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
              <p className="text-[11px] text-gray-400 mt-1 text-right">{bio.length}/160</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 md:p-8">
          <h2 className="text-[20px] font-black text-gray-900 mb-5 tracking-tight">Theme</h2>
          <div className="grid grid-cols-4 gap-3">
            {THEMES.map(t => {
              const isPremium = !['light', 'dark', 'purple'].includes(t.id)
              const locked = isPremium && user?.plan !== 'starter'
              return (
                <button
                  key={t.id}
                  onClick={() => !locked && setTheme(t.id)}
                  disabled={locked}
                  className={`relative h-14 rounded-2xl ${t.style} flex items-center justify-center text-[12px] font-extrabold transition-all duration-200 ${
                    theme === t.id
                      ? 'ring-2 ring-violet-500 scale-105 shadow-xl'
                      : locked 
                        ? 'opacity-40 cursor-not-allowed grayscale' 
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  {t.label}
                  {locked && <span className="absolute -top-2 -right-2 text-[14px]">🔒</span>}
                </button>
              )
            })}
          </div>
          {user?.plan !== 'starter' && (
            <div className="mt-6 bg-violet-50 rounded-2xl p-4 flex items-center justify-between border border-violet-100">
              <p className="text-[13px] text-violet-800 font-medium max-w-[200px]">
                Unlock all premium themes and custom branding.
              </p>
              <a href="/dashboard/settings" className="bg-violet-600 text-white px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm hover:bg-violet-700 transition-colors">
                Upgrade Now
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Phone Preview */}
      <div className="hidden lg:block sticky top-6">
        <PhonePreview links={links} handle={user?.handle ?? ''} bio={bio} theme={theme} />
      </div>

      {/* Floating Save Button */}
      {hasChanges && (
        <div className="fixed bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 lg:left-auto lg:right-10 lg:translate-x-0 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <Button 
            variant="black" 
            loading={saving} 
            onClick={handleSave} 
            className="shadow-2xl shadow-black/30 border border-white/20 px-8 py-3.5 text-[15px] font-black rounded-full"
          >
            Save Changes
          </Button>
        </div>
      )}

      <Toast message={message} />
    </div>
  )
}