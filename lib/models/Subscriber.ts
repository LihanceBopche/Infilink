import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISubscriber extends Document {
  userId: mongoose.Types.ObjectId
  email: string
  createdAt: Date
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    email:  { type: String, required: true, lowercase: true, trim: true },
  },
  { timestamps: true }
)

SubscriberSchema.index({ userId: 1, email: 1 }, { unique: true })

const Subscriber: Model<ISubscriber> =
  mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema)

export default Subscriber
