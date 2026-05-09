export type Plan  = 'free' | 'starter'
export type Theme = 'dark' | 'light' | 'purple' | 'pink' | 'mint' | 'sky' | 'sunset' | 'night'

export interface LinkItem {
  id:      string
  title:   string
  url:     string
  enabled: boolean
  clicks:  number
  views:   number
  order:   number
}

export interface UserProfile {
  id:              string
  name:            string
  email:           string
  handle:          string
  displayName:     string
  bio:             string
  plan:            Plan
  theme:           Theme
  redirectEnabled: boolean
  redirectUrl:     string
}

export interface ApiResponse<T> {
  data?:   T
  error?:  string
  errors?: { field: string; message: string }[]
}