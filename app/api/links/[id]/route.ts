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

// PATCH /api/links/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const link = await Link.findOneAndUpdate({ _id: params.id, userId }, body, { new: true })
  if (!link) return NextResponse.json({ error: 'Link not found' }, { status: 404 })
  return NextResponse.json(link)
}

// DELETE /api/links/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  await Link.findOneAndDelete({ _id: params.id, userId })
  return NextResponse.json({ success: true })
}
