import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/db'
import Analytics from '@/lib/models/Analytics'
import Link from '@/lib/models/Link'

const JWT_SECRET = process.env.JWT_SECRET!

function getUserId(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  try {
    const d: any = jwt.verify(auth.split(' ')[1], JWT_SECRET)
    return d.id as string
  } catch { return null }
}

// GET /api/analytics — returns aggregated dashboard analytics
export async function GET(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()

  // Get all links for this user
  const links = await Link.find({ userId }).sort({ order: 1 })

  // Get all events for this user
  const events = await Analytics.find({ userId }).lean()

  const totalViews  = events.filter(e => e.type === 'page_view').length
  const totalClicks = events.filter(e => e.type === 'link_click').length
  const ctr = totalViews > 0 ? `${((totalClicks / totalViews) * 100).toFixed(1)}%` : '0%'

  // Per-link stats
  const linkStats = links.map(link => {
    const clicks = events.filter(e => e.type === 'link_click' && String(e.linkId) === String(link._id)).length
    return { id: link._id, title: link.title, clicks, views: totalViews }
  })

  return NextResponse.json({ totalViews, totalClicks, ctr, links: linkStats })
}

// POST /api/analytics — record a page_view or link_click event
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { userId, linkId, type } = await req.json()
    if (!userId || !type) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    await Analytics.create({ userId, linkId: linkId || null, type })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
