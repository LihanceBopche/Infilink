import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/db'
import Link from '@/lib/models/Link'

const JWT_SECRET = process.env.JWT_SECRET!

function getUserId(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  try {
    const decoded: any = jwt.verify(auth.split(' ')[1], JWT_SECRET)
    return decoded.id as string
  } catch { return null }
}

// GET /api/links
export async function GET(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const links = await Link.find({ userId }).sort({ order: 1 })
  return NextResponse.json(links)
}

// POST /api/links
export async function POST(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { title, url } = await req.json()
  if (!title || !url) return NextResponse.json({ error: 'Title and URL required' }, { status: 400 })
  const count = await Link.countDocuments({ userId })
  const link = await Link.create({ userId, title, url, order: count })
  return NextResponse.json(link, { status: 201 })
}
