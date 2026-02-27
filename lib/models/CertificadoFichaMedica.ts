import mongoose from 'mongoose'

/**
 * Certificado de Evaluación Médica Ocupacional (de la ficha médica).
 * No confundir con CertificadoAptitudOficial.
 */
const certificadoFichaMedicaSchema = new mongoose.Schema(
  {
    worker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: false,
    },
    worker_snapshot: { type: mongoose.Schema.Types.Mixed, required: false },
    seccionA: { type: mongoose.Schema.Types.Mixed, required: true },
    seccionB: { type: mongoose.Schema.Types.Mixed, required: false },
    seccionC: { type: mongoose.Schema.Types.Mixed, required: false },
    seccionD: { type: mongoose.Schema.Types.Mixed, required: false },
    seccionE: { type: mongoose.Schema.Types.Mixed, required: false },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
)

export const CertificadoFichaMedica =
  mongoose.models.CertificadoFichaMedica ||
  mongoose.model('CertificadoFichaMedica', certificadoFichaMedicaSchema)
