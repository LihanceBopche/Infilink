'use client'
import { useState, useCallback, useEffect } from 'react'
import { api } from '@/lib/api'

export interface UserProfile {
  id: string
  email: string
  handle: string
  name: string
  bio: string
  theme: string
  plan: string
  redirectEnabled?: boolean
  redirectUrl?: string
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // On mount: restore session from saved JWT token
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('infilink_token') : null
    if (!token) { setLoading(false); return }

    api.me().then(({ data, error }) => {
      if (data && !error) setUser(data as UserProfile)
      else localStorage.removeItem('infilink_token') // bad token, clear it
      setLoading(false)
    })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await api.login({ email, password })
    if (error || !data) return { error: error ?? 'Login failed' }
    const d = data as { token: string; user: UserProfile }
    localStorage.setItem('infilink_token', d.token)
    setUser(d.user)
    return { success: true }
  }, [])

  const register = useCallback(async (body: object) => {
    const { data, error } = await api.register(body)
    if (error || !data) return { error: error ?? 'Registration failed' }
    const d = data as { token: string; user: UserProfile }
    localStorage.setItem('infilink_token', d.token)
    setUser(d.user)
    return { success: true }
  }, [])

  const logout = useCallback(async () => {
    localStorage.removeItem('infilink_token')
    setUser(null)
  }, [])

  const refresh = useCallback(async () => {
    const { data, error } = await api.me()
    if (data && !error) setUser(data as UserProfile)
  }, [])

  return { user, loading, login, register, logout, refresh }
}
