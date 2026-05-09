import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  handle: string
  bio: string
  plan: 'free' | 'starter'
  theme: string
  redirectEnabled: boolean
  redirectUrl: string
  matchPassword(password: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name:            { type: String, required: true, trim: true },
    email:           { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:        { type: String, required: true, minlength: 8, select: false },
    handle:          { type: String, required: true, unique: true, lowercase: true, trim: true },
    bio:             { type: String, default: '', maxlength: 160 },
    plan:            { type: String, enum: ['free', 'starter'], default: 'free' },
    theme:           { type: String, default: 'purple' },
    redirectEnabled: { type: Boolean, default: false },
    redirectUrl:     { type: String, default: '' },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

UserSchema.methods.matchPassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Always delete the cached model so the pre-save hook stays fresh after hot-reload
delete mongoose.models['User']
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema)
export default User
