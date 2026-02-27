import mongoose from 'mongoose'

const medicalExamSchema = new mongoose.Schema(
  {
    worker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
    },
    exam_type: { type: String, required: true },
    exam_date: { type: Date, required: true },
    lab_name: { type: String, default: null },
    results: { type: String, default: null },
    file_url: { type: String, default: null },
    file_name: { type: String, default: null },
    consentimiento_informado_url: { type: String, default: null },
    consentimiento_informado_name: { type: String, default: null },
    observations: { type: String, default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
)

export const MedicalExam =
  mongoose.models.MedicalExam || mongoose.model('MedicalExam', medicalExamSchema)
