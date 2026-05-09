'use client'
import type { LinkItem } from '@/types'

interface Props {
  link:     LinkItem
  onToggle: () => void
  onRemove: () => void
}

export function LinkCard({ link, onToggle, onRemove }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3.5 mb-2">
      <div className="flex items-center gap-2.5 mb-2">
        <span className="text-gray-300 text-sm cursor-grab select-none">⠿</span>
        <span className="flex-1 text-[13px] font-bold truncate">{link.title}</span>
        <button
          role="switch"
          aria-checked={link.enabled}
          aria-label={link.enabled ? 'Disable link' : 'Enable link'}
          onClick={onToggle}
          className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0
            ${link.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all
            ${link.enabled ? 'left-[18px]' : 'left-0.5'}`} />
        </button>
      </div>
      <p className="text-[11px] text-gray-400 mb-2.5 pl-5 truncate">{link.url}</p>
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <span className="text-[11px] text-gray-400">📊 {link.clicks} clicks</span>
        <button
          onClick={onRemove}
          className="text-[11px] text-gray-300 hover:text-red-500 transition-colors"
        >
          🗑 Remove
        </button>
      </div>
    </div>
  )
}