import { z } from 'zod'

// ── Reusable rules ──────────────────────────────────────────
const nameRule = z
  .string()
  .min(2,  'Name must be at least 2 characters')
  .max(60, 'Name too long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters')

const emailRule = z
  .string()
  .email('Enter a valid email address')
  .max(254, 'Email too long')

const passwordRule = z
  .string()
  .min(8,   'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')

const handleRule = z
  .string()
  .min(3,  'Handle must be at least 3 characters')
  .max(30, 'Handle too long')
  .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores allowed')

const urlRule = z
  .string()
  .url('Enter a valid URL (include https://)')
  .max(2048, 'URL too long')
  .optional()
  .or(z.literal(''))

const bioRule = z
  .string()
  .max(160, 'Bio must be under 160 characters')
  .optional()

// ── Step schemas ────────────────────────────────────────────
export const step1Schema = z.object({
  name:     nameRule,
  email:    emailRule,
  password: passwordRule,
})

export const step2Schema = z.object({
  handle:      handleRule,
  displayName: z.string().min(1, 'Display name required').max(60),
  bio:         bioRule,
})

export const step3Schema = z.object({
  instagram: urlRule,
  youtube:   urlRule,
  whatsapp: z
    .string()
    .regex(/^(\+91)?[6-9]\d{9}$/, 'Enter a valid Indian mobile number')
    .optional()
    .or(z.literal('')),
  website: urlRule,
})

export const step4Schema = z.object({
  plan: z.enum(['free', 'starter']),
})

// ── Link schema ─────────────────────────────────────────────
export const linkSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(50, 'Title too long')
    .regex(/^[^<>{}]*$/, 'Title contains invalid characters'),
  url: z
    .string()
    .url('Enter a valid URL (include https://)')
    .max(2048, 'URL too long')
    .refine(
      (u) => u.startsWith('https://') || u.startsWith('http://'),
      'URL must start with http:// or https://'
    ),
})

// ── Other schemas ────────────────────────────────────────────
export const loginSchema = z.object({
  email:    emailRule,
  password: z.string().min(1, 'Password required'),
})

export const redirectSchema = z.object({
  enabled: z.boolean(),
  url: z
    .string()
    .url('Enter a valid redirect URL')
    .refine((u) => u.startsWith('https://'), 'Must use HTTPS')
    .optional()
    .or(z.literal('')),
})

export const profileSchema = z.object({
  displayName: z.string().min(1).max(60).optional(),
  bio:         bioRule,
  theme:       z.string().max(20).optional(),
})

// ── Inferred types ───────────────────────────────────────────
export type Step1Data    = z.infer<typeof step1Schema>
export type Step2Data    = z.infer<typeof step2Schema>
export type Step3Data    = z.infer<typeof step3Schema>
export type Step4Data    = z.infer<typeof step4Schema>
export type LinkFormData = z.infer<typeof linkSchema>
export type LoginData    = z.infer<typeof loginSchema>
export type ProfileData  = z.infer<typeof profileSchema>