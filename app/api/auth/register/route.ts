import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'

const JWT_SECRET  = process.env.JWT_SECRET!
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d'

const signToken = (id: string) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES } as any)

// POST /api/auth/register
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, handle } = body

    if (!name || !email || !password || !handle) {
      return NextResponse.json(
        { error: 'All fields required: name, email, password, handle' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const cleanHandle = handle.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '')
    if (!cleanHandle) {
      return NextResponse.json({ error: 'Invalid handle' }, { status: 400 })
    }

    await connectDB()

    // Check for duplicates
    const existingEmail  = await User.findOne({ email: email.toLowerCase() })
    if (existingEmail) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const existingHandle = await User.findOne({ handle: cleanHandle })
    if (existingHandle) {
      return NextResponse.json({ error: 'Handle already taken — please choose another' }, { status: 409 })
    }

    // Create user (password is hashed by the pre-save hook)
    const user  = await User.create({ name, email: email.toLowerCase(), password, handle: cleanHandle, bio: '' })
    const token = signToken(String(user._id))

    return NextResponse.json(
      {
        token,
        user: {
          id:              user._id,
          name:            user.name,
          email:           user.email,
          handle:          user.handle,
          bio:             user.bio,
          plan:            user.plan,
          theme:           user.theme,
          redirectEnabled: user.redirectEnabled,
          redirectUrl:     user.redirectUrl,
        }
      },
      { status: 201 }
    )
  } catch (err: any) {
    // Log full error server-side so we can debug
    console.error('[REGISTER ERROR]', err)
    return NextResponse.json(
      { error: err?.message ?? 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
