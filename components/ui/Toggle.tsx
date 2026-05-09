'use client'
interface ToggleProps {
  checked:      boolean
  onChange:     () => void
  label?:       string
  description?: string
}

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100/50 last:border-0 hover:bg-black/[0.02] -mx-4 px-4 rounded-xl transition-colors">
      {(label || description) && (
        <div className="pr-4">
          {label       && <p className="text-[14px] font-bold text-gray-900">{label}</p>}
          {description && <p className="text-[12px] text-gray-400 mt-0.5 leading-relaxed">{description}</p>}
        </div>
      )}
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative w-[44px] h-[24px] rounded-full transition-all duration-300 flex-shrink-0
          ${checked ? 'bg-gradient-to-r from-violet-500 to-purple-600 shadow-inner' : 'bg-gray-200 border border-gray-300 hover:bg-gray-300'}`}
      >
        <span
          className={`absolute top-[2.5px] w-[17px] h-[17px] rounded-full bg-white transition-all duration-300 shadow-sm
            ${checked ? 'left-[23.5px] shadow-purple-900/50 scale-110' : 'left-[2.5px]'}`}
        />
      </button>
    </div>
  )
}
