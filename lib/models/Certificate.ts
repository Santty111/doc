import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema(
  {
    worker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
    },
    certificate_type: {
      type: String,
      required: true,
      enum: ['ingreso', 'periodico', 'egreso', 'especial'],
    },
    issue_date: { type: Date, required: true },
    expiry_date: { type: Date, default: null },
    result: {
      type: String,
      required: true,
      enum: ['apto', 'apto_con_restricciones', 'no_apto', 'pendiente'],
    },
    restrictions: { type: String, default: null },
    recommendations: { type: String, default: null },
    doctor_name: { type: String, default: null },
    doctor_license: { type: String, default: null },
    observations: { type: String, default: null },
    pdf_url: { type: String, default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
)

export const Certificate =
  mongoose.models.Certificate ||
  mongoose.model('Certificate', certificateSchema)
