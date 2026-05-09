import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'
import Razorpay from 'razorpay'

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(req: NextRequest) {
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

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!
    })

    // Create an order for Rs 249
    const options = {
      amount: 249 * 100, // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${user._id}`,
    }

    const order = await razorpay.orders.create(options)
    
    if (!order) {
      return NextResponse.json({ error: 'Failed to create Razorpay order' }, { status: 500 })
    }

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency })
  } catch (error: any) {
    console.error('Create Order Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
