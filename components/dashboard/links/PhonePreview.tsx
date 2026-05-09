'use client'
import type { LinkItem, Theme } from '@/types'

const gradients: Record<Theme, string> = {
  dark:   'from-gray-900 to-gray-800',
  light:  'from-gray-100 to-white',
  purple: 'from-violet-500 to-purple-700',
  pink:   'from-pink-400 to-rose-500',
  mint:   'from-green-300 to-teal-400',
  sky:    'from-sky-400 to-blue-500',
  sunset: 'from-pink-400 to-yellow-400',
  night:  'from-indigo-900 to-blue-950',
}

interface Props {
  handle: string
  bio:    string
  links:  LinkItem[]
  theme:  Theme
}

export function PhonePreview({ handle, bio, links, theme }: Props) {
  const visible = links.filter((l) => l.enabled)
  const dark    = ['dark','purple','pink','sky','sunset','night'].includes(theme)

  return (
    <div className="w-[220px] mx-auto bg-gray-900 rounded-[36px] p-2.5 shadow-2xl">
      <div className={`rounded-[28px] overflow-hidden min-h-[420px] bg-gradient-to-b ${gradients[theme]}`}>
        <div className="flex flex-col items-center px-4 pt-6 pb-5">
          <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center
            text-lg font-bold mb-2
            ${dark
              ? 'bg-white/20 border-white/30 text-white'
              : 'bg-black/10 border-black/20 text-gray-700'}`}>
            {(handle || 'YP').slice(0, 2).toUpperCase()}
          </div>
          <p className={`text-[13px] font-bold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>
            @{handle || 'yourpage'}
          </p>
          {bio && (
            <p className={`text-[11px] text-center mb-3 leading-snug
              ${dark ? 'text-white/50' : 'text-gray-500'}`}>
              {bio}
            </p>
          )}
          <div className="w-full flex flex-col gap-2 mt-2">
            {visible.length === 0 ? (
              <p className="text-[11px] text-white/40 text-center mt-3">
                Your links appear here
              </p>
            ) : (
              visible.map((l) => (
                <div
                  key={l.id}
                  className={`w-full py-2.5 px-3.5 rounded-xl text-[12px] font-semibold text-center
                    ${dark
                      ? 'bg-white/15 border border-white/20 text-white backdrop-blur-sm'
                      : 'bg-black/8 border border-black/10 text-gray-900'}`}
                >
                  {l.title}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}