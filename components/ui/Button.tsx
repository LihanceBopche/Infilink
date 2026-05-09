import { ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'

type Variant = 'black' | 'outline' | 'green' | 'purple' | 'glass' | 'white'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?:    Size
  full?:    boolean
  loading?: boolean
}

const variants: Record<Variant, string> = {
  black:   'bg-gray-900 border border-gray-900 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95',
  outline: 'bg-transparent border-[1.5px] border-gray-200 text-gray-900 hover:border-gray-900 hover:bg-gray-50 active:scale-95',
  green:   'bg-gradient-to-br from-emerald-400 to-green-500 border border-green-500/50 text-white shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 active:scale-95',
  purple:  'bg-gradient-to-br from-violet-500 to-purple-600 border border-violet-500/50 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:scale-95',
  glass:   'bg-white/50 backdrop-blur-md border border-white/60 text-gray-900 shadow-sm hover:bg-white/80 active:scale-95',
  white:   'bg-white text-violet-900 font-extrabold shadow-lg hover:bg-violet-50 hover:-translate-y-0.5 active:scale-95'
}
const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-5 py-[11px] text-[14px]',
  lg: 'px-8 py-[14px] text-[15px]',
}

export function Button({
  variant = 'black', size = 'md', full, loading,
  className, children, disabled, ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'relative inline-flex items-center justify-center rounded-full font-semibold overflow-hidden',
        'transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant], sizes[size],
        full && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Processing...
        </span>
      ) : children}
    </button>
  )
}
