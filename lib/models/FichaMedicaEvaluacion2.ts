import mongoose from 'mongoose'

/**
 * Ficha Médica - Evaluación Ocupacional 2-3.
 * Sección G. Factores de Riesgo del Trabajo Actual.
 */
const fichaMedicaEvaluacion2Schema = new mongoose.Schema(
  {
    seccionG: {
      fisicos: { type: mongoose.Schema.Types.Mixed, required: false },
      seguridad: { type: mongoose.Schema.Types.Mixed, required: false },
      quimicos: { type: mongoose.Schema.Types.Mixed, required: false },
      biologicos: { type: mongoose.Schema.Types.Mixed, required: false },
      ergonomicos: { type: mongoose.Schema.Types.Mixed, required: false },
      psicosociales: { type: mongoose.Schema.Types.Mixed, required: false },
      medidas_preventivas: { type: mongoose.Schema.Types.Mixed, required: false },
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
)

export const FichaMedicaEvaluacion2 =
  mongoose.models.FichaMedicaEvaluacion2 ||
  mongoose.model('FichaMedicaEvaluacion2', fichaMedicaEvaluacion2Schema)
