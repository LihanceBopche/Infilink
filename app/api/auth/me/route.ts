import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'

const JWT_SECRET = process.env.JWT_SECRET!

// GET /api/auth/me — returns the logged-in user's profile
export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    const token = auth.split(' ')[1]
    const decoded: any = jwt.verify(token, JWT_SECRET)

    await connectDB()
    const user = await User.findById(decoded.id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({
      id: user._id, name: user.name, email: user.email, handle: user.handle,
      bio: user.bio, plan: user.plan, theme: user.theme,
      redirectEnabled: user.redirectEnabled, redirectUrl: user.redirectUrl
    })
  } catch {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }
}
