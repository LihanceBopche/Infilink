import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please add MONGODB_URI to your .env.local file')
}

// Global cache to prevent multiple connections in dev hot-reload
let cached = (global as any).mongoose_cache

if (!cached) {
  cached = (global as any).mongoose_cache = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
