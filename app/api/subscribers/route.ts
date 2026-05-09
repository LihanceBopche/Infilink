import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/db'
import Subscriber from '@/lib/models/Subscriber'

const JWT_SECRET = process.env.JWT_SECRET!

function getUserId(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  try {
    const d: any = jwt.verify(auth.split(' ')[1], JWT_SECRET)
    return d.id as string
  } catch { return null }
}

// GET /api/subscribers — fetch all subscribers for the logged-in user
export async function GET(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const subs = await Subscriber.find({ userId }).sort({ createdAt: -1 }).lean()
  return NextResponse.json(subs)
}

// POST /api/subscribers — add a new subscriber (used by public profile)
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { userId, email } = await req.json()
    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Upsert or just create, ignoring duplicate error if they already subscribed
    await Subscriber.updateOne(
      { userId, email: email.toLowerCase() },
      { $setOnInsert: { userId, email: email.toLowerCase() } },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
