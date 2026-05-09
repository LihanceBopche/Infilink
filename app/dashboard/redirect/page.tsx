'use client'
import { useState }    from 'react'
import { useForm }     from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { redirectSchema } from '@/lib/validators'
import { api }         from '@/lib/api'
import { useAuth }     from '@/hooks/useAuth'
import { useToast }    from '@/hooks/useToast'
import { Input }       from '@/components/ui/Input'
import { Toggle }      from '@/components/ui/Toggle'
import { Button }      from '@/components/ui/Button'
import { Toast }       from '@/components/ui/Toast'

export default function RedirectPage() {
  const { user }               = useAuth()
  const { message, showToast } = useToast()
  const [enabled, setEnabled]  = useState(user?.redirectEnabled ?? false)
  const [saving,  setSaving]   = useState(false)

  const { register, handleSubmit, formState: { errors } } =
    useForm({ resolver: zodResolver(redirectSchema), defaultValues: { url: user?.redirectUrl ?? '' } })

  const onSubmit = async (data: { url?: string }) => {
    if (enabled && !data.url) { showToast('URL required when redirect is on'); return }
    setSaving(true)
    const { error } = await api.setRedirect({ enabled, url: data.url ?? '' })
    setSaving(false)
    if (error) { showToast('Error: ' + error); return }
    showToast('Redirect saved!')
  }

  return (
    <>
      <h1 className="text-[17px] font-bold mb-4">Redirect Links</h1>

      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <p className="text-[13px] text-gray-500 mb-4 leading-relaxed">
          Temporarily send all visitors to one specific link — perfect for a product launch, sale, or announcement.
        </p>

        <Toggle
          checked={enabled}
          onChange={() => setEnabled((v) => !v)}
          label="Enable redirect"
          description="All visitors will be sent to one URL"
        />

        {enabled && user?.plan !== 'starter' ? (
          <div className="mt-4 bg-violet-50 rounded-2xl p-5 border border-violet-100 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="text-[15px] font-bold text-gray-900 mb-1">Redirect is a Starter Feature</h3>
            <p className="text-[13px] text-gray-500 mb-4 max-w-[280px] mx-auto">
              Upgrade to Starter to automatically redirect all your traffic to a specific URL.
            </p>
            <a href="/dashboard/settings" className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-5 text-sm rounded-lg transition-all shadow-sm">
              Upgrade to Starter
            </a>
          </div>
        ) : enabled && (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4">
            <Input
              label="Redirect to"
              type="url"
              placeholder="https://..."
              error={errors.url?.message}
              hint="Must start with https://"
              {...register('url')}
            />
            <Button type="submit" size="sm" loading={saving}>Save redirect</Button>
          </form>
        )}

        {!enabled && (
          <div className="mt-3">
            <Button
              size="sm"
              loading={saving}
              onClick={() =>
                api.setRedirect({ enabled: false, url: '' }).then(() => showToast('Redirect disabled'))
              }
            >
              Save
            </Button>
          </div>
        )}
      </div>

      <Toast message={message} />
    </>
  )
}