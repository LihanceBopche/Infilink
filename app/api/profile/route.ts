import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'

const JWT_SECRET = process.env.JWT_SECRET!

function getUserId(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  try {
    const decoded: any = jwt.verify(auth.split(' ')[1], JWT_SECRET)
    return decoded.id as string
  } catch { return null }
}

// GET /api/profile — get my profile
export async function GET(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const user = await User.findById(userId)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  return NextResponse.json({
    id: user._id, name: user.name, email: user.email, handle: user.handle,
    bio: user.bio, plan: user.plan, theme: user.theme,
    redirectEnabled: user.redirectEnabled, redirectUrl: user.redirectUrl
  })
}

// PATCH /api/profile — update name, bio, theme, redirect
export async function PATCH(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { name, bio, theme, redirectEnabled, redirectUrl } = await req.json()
  const user = await User.findByIdAndUpdate(
    userId,
    { name, bio, theme, redirectEnabled, redirectUrl },
    { new: true, runValidators: true }
  )
  return NextResponse.json({ id: user!._id, name: user!.name, bio: user!.bio, theme: user!.theme, redirectEnabled: user!.redirectEnabled, redirectUrl: user!.redirectUrl })
}
