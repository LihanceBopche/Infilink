import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAnalyticsEvent extends Document {
  linkId?: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  type: 'page_view' | 'link_click'
  createdAt: Date
}

const AnalyticsSchema = new Schema<IAnalyticsEvent>(
  {
    linkId: { type: Schema.Types.ObjectId, ref: 'Link', default: null },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type:   { type: String, enum: ['page_view', 'link_click'], required: true },
  },
  { timestamps: true }
)

// Index for fast dashboard aggregation
AnalyticsSchema.index({ userId: 1, createdAt: -1 })

const Analytics: Model<IAnalyticsEvent> =
  mongoose.models.Analytics || mongoose.model<IAnalyticsEvent>('Analytics', AnalyticsSchema)

export default Analytics
