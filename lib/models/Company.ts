import mongoose from 'mongoose'

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, default: '' },
  },
  { timestamps: true }
)

export const Company =
  mongoose.models.Company || mongoose.model('Company', companySchema)
