import mongoose from 'mongoose'

/**
 * Documento completo del Certificado de Aptitud Oficial.
 * Almacena las secciones A-G como un único documento JSON.
 */
const certificadoAptitudOficialSchema = new mongoose.Schema(
  {
    seccionA: { type: mongoose.Schema.Types.Mixed, required: true },
    seccionB: { type: mongoose.Schema.Types.Mixed, required: true },
    seccionC: { type: mongoose.Schema.Types.Mixed, required: true },
    seccionD: { type: mongoose.Schema.Types.Mixed, required: true },
    seccionE: { type: mongoose.Schema.Types.Mixed, required: true },
    seccionF: { type: mongoose.Schema.Types.Mixed, required: true },
    seccionG: { type: mongoose.Schema.Types.Mixed, required: true },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
)

export const CertificadoAptitudOficial =
  mongoose.models.CertificadoAptitudOficial ||
  mongoose.model('CertificadoAptitudOficial', certificadoAptitudOficialSchema)
