import { forwardRef, InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?:  string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className, ...props }, ref) => (
    <div className="mb-4">
      {label && (
        <label className="block text-[11px] font-bold uppercase tracking-[0.6px] text-gray-500 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={clsx(
          'w-full border rounded-2xl px-4 py-[13px] text-sm text-gray-900',
          'bg-white/80 backdrop-blur-md outline-none transition-all duration-300 placeholder:text-gray-400',
          'focus:ring-4 focus:bg-white',
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
            : 'border-gray-200 focus:border-purple-500 focus:ring-purple-500/10 hover:border-gray-300',
          className
        )}
        {...props}
      />
      {hint  && !error && <p className="text-[12px] text-gray-400 mt-1.5 ml-1">{hint}</p>}
      {error && <p className="text-[12px] text-red-500 mt-1.5 ml-1 font-medium">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
