import mongoose from 'mongoose'

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, default: '' },
    razon_social: { type: String, default: null },
    ruc: { type: String, default: null },
    ciiu: { type: String, default: null },
    establecimiento: { type: String, default: null },
  },
  { timestamps: true }
)

export const Company =
  mongoose.models.Company || mongoose.model('Company', companySchema)
