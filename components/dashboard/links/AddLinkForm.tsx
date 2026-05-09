'use client'
import { useState }       from 'react'
import { useForm }        from 'react-hook-form'
import { zodResolver }    from '@hookform/resolvers/zod'
import { linkSchema, LinkFormData } from '@/lib/validators'
import { Input }          from '@/components/ui/Input'
import { Button }         from '@/components/ui/Button'

interface Props {
  onAdd:    (title: string, url: string) => Promise<{ error?: string | null }>
  onCancel: () => void
}

export function AddLinkForm({ onAdd, onCancel }: Props) {
  const [saving, setSaving] = useState(false)
  const [apiErr, setApiErr] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } =
    useForm<LinkFormData>({ resolver: zodResolver(linkSchema) })

  const onSubmit = async (data: LinkFormData) => {
    setSaving(true)
    setApiErr(null)
    const { error } = await onAdd(data.title, data.url)
    setSaving(false)
    if (error) { setApiErr(error); return }
    reset()
  }

  return (
    <div className="bg-white border-[1.5px] border-gray-100 rounded-2xl p-4 mb-3">
      <p className="text-[13px] font-bold mb-3">New link</p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          placeholder="Title e.g. My Instagram"
          error={errors.title?.message}
          {...register('title')}
        />
        <Input
          type="url"
          placeholder="https://..."
          error={errors.url?.message}
          {...register('url')}
        />
        {apiErr && <p className="text-[11px] text-red-500 mb-2">{apiErr}</p>}
        <div className="flex gap-2 mt-1">
          <Button type="submit" size="sm" loading={saving}>Add link</Button>
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
