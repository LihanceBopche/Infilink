const BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('infilink_token')
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; status: number }> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  try {
    const res  = await fetch(`${BASE}${path}`, { cache: 'no-store', ...options, headers })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { error: json.error ?? 'Something went wrong', status: res.status }
    return { data: json as T, status: res.status }
  } catch {
    return { error: 'Network error — is the backend running?', status: 0 }
  }
}

export const api = {
  // ── Auth ──────────────────────────────────────────────────
  register: (body: object) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: object) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me:     () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // ── Links ─────────────────────────────────────────────────
  getLinks: () => request('/links'),
  addLink:  (body: object) =>
    request('/links', { method: 'POST', body: JSON.stringify(body) }),
  updateLink: (id: string, body: object) =>
    request(`/links/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteLink: (id: string) =>
    request(`/links/${id}`, { method: 'DELETE' }),
  reorderLinks: (order: { id: string; order: number }[]) =>
    request('/links/reorder', { method: 'PUT', body: JSON.stringify({ order }) }),

  // ── Profile ───────────────────────────────────────────────
  getProfile:    (handle: string) => request(`/profile/${handle}`),
  updateProfile: (body: object)   =>
    request('/profile', { method: 'PATCH', body: JSON.stringify(body) }),
  setRedirect: (body: any) =>
    request('/profile', { method: 'PATCH', body: JSON.stringify({ redirectEnabled: body.enabled, redirectUrl: body.url }) }),

  // ── Analytics ─────────────────────────────────────────────
  getAnalytics: () => request('/analytics'),
  recordPageView: (userId: string) => 
    request('/analytics', { method: 'POST', body: JSON.stringify({ userId, type: 'page_view' }) }),
  recordClick:  (userId: string, linkId: string) =>
    request('/analytics', { method: 'POST', body: JSON.stringify({ userId, linkId, type: 'link_click' }) }),

  // ── Subscribers ───────────────────────────────────────────
  getSubscribers: () => request('/subscribers'),
  subscribe: (userId: string, email: string) =>
    request('/subscribers', { method: 'POST', body: JSON.stringify({ userId, email }) }),

  // ── Payment ───────────────────────────────────────────────
  createPaymentOrder: () => request('/payment/create-order', { method: 'POST' }),
  verifyPayment: (body: object) =>
    request('/payment/verify', { method: 'POST', body: JSON.stringify(body) }),
}