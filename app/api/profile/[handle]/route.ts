import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'
import Link from '@/lib/models/Link'
import Analytics from '@/lib/models/Analytics'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: { handle: string } }) {
  try {
    await connectDB()
    const handle = params.handle.toLowerCase()

    const user = await User.findOne({ handle })
    if (!user) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get active links
    const links = await Link.find({ userId: user._id, isActive: true }).sort({ order: 1 })

    // Record page view analytics asynchronously
    Analytics.create({ userId: user._id, type: 'page_view' }).catch(console.error)

    return NextResponse.json({
      user: {
        id: String(user._id),
        name: user.name,
        handle: user.handle,
        bio: user.bio,
        theme: user.theme,
        redirectEnabled: user.redirectEnabled,
        redirectUrl: user.redirectUrl
      },
      links
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
