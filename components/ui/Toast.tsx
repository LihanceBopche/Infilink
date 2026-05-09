'use client'
export function Toast({ message }: { message: string | null }) {
  return (
    <div
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white
        px-5 py-2.5 rounded-full text-[13px] font-semibold z-[999] pointer-events-none
        transition-all duration-300 whitespace-nowrap
        ${message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
    >
      {message ?? ''}
    </div>
  )
}
