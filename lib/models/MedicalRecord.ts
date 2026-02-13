import mongoose from 'mongoose'

const medicalRecordSchema = new mongoose.Schema(
  {
    worker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
    },
    record_date: { type: Date, required: true },
    medical_history: { type: String, default: null },
    family_history: { type: String, default: null },
    allergies: { type: String, default: null },
    current_medications: { type: String, default: null },
    blood_type: { type: String, default: null },
    height_cm: { type: Number, default: null },
    weight_kg: { type: Number, default: null },
    blood_pressure: { type: String, default: null },
    heart_rate: { type: Number, default: null },
    observations: { type: String, default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
)

export const MedicalRecord =
  mongoose.models.MedicalRecord ||
  mongoose.model('MedicalRecord', medicalRecordSchema)
