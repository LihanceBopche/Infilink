'use client'
import { useState, useCallback, useEffect } from 'react'
import { api } from '@/lib/api'
import { sanitizeText, sanitizeUrl } from '@/lib/sanitize'
import type { LinkItem } from '@/types'

export function useLinks() {
  const [links,   setLinks]   = useState<LinkItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const fetchLinks = useCallback(async () => {
    setLoading(true)
    const { data, error } = await api.getLinks()
    if (data)  setLinks(data as LinkItem[])
    if (error) setError(error)
    setLoading(false)
  }, [])

  useEffect(() => { fetchLinks() }, [fetchLinks])

  const addLink = useCallback(async (title: string, url: string) => {
    const clean = { title: sanitizeText(title), url: sanitizeUrl(url) }
    const { data, error } = await api.addLink(clean)
    if (data) setLinks((prev) => [...prev, data as LinkItem])
    return { error: error ?? null }
  }, [])

  const toggleLink = useCallback(async (id: string) => {
    const link = links.find((l) => l.id === id)
    if (!link) return
    const { data } = await api.updateLink(id, { enabled: !link.enabled })
    if (data) setLinks((prev) => prev.map((l) => l.id === id ? data as LinkItem : l))
  }, [links])

  const removeLink = useCallback(async (id: string) => {
    await api.deleteLink(id)
    setLinks((prev) => prev.filter((l) => l.id !== id))
  }, [])

  return { links, loading, error, fetchLinks, addLink, toggleLink, removeLink }
}
