import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ILink extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  url: string
  isActive: boolean
  order: number
  clicks: number
}

const LinkSchema = new Schema<ILink>(
  {
    userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title:    { type: String, required: true, trim: true, maxlength: 100 },
    url:      { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    order:    { type: Number, default: 0 },
    clicks:   { type: Number, default: 0 },
  },
  { timestamps: true }
)

const Link: Model<ILink> = mongoose.models.Link || mongoose.model<ILink>('Link', LinkSchema)
export default Link
