import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    full_name: { type: String, default: null },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'doctor', 'viewer'],
      default: 'viewer',
    },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
  },
  { timestamps: true }
)

userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password)
}

export const User = mongoose.models.User || mongoose.model('User', userSchema)

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}
