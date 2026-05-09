import DOMPurify from 'dompurify'

/** Strip all HTML tags — safe to display in the UI */
export function sanitizeText(value: string): string {
  if (typeof window === 'undefined') {
    // Server-side: simple regex strip
    return value.replace(/<[^>]*>/g, '').trim()
  }
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim()
}

/** Only allow http/https URLs — blocks javascript: and data: URIs */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  try {
    const parsed = new URL(trimmed)
    if (!['http:', 'https:'].includes(parsed.protocol)) return ''
    return parsed.toString()
  } catch {
    return ''
  }
}

/** Strip anything that is not alphanumeric or underscore from a handle */
export function sanitizeHandle(handle: string): string {
  return handle.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 30).toLowerCase()
}