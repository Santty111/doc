import mongoose from 'mongoose'

/**
 * Ficha Médica - Evaluación Ocupacional 1-3.
 * Almacena las secciones (A, B, C...) como documento JSON.
 */
const fichaMedicaEvaluacion1Schema = new mongoose.Schema(
  {
    seccionA: { type: mongoose.Schema.Types.Mixed, required: true },
    seccionB: { type: mongoose.Schema.Types.Mixed, required: false },
    seccionC: { type: mongoose.Schema.Types.Mixed, required: false },
    seccionD: { type: mongoose.Schema.Types.Mixed, required: false },
    seccionE: { type: mongoose.Schema.Types.Mixed, required: false },
    seccionF: { type: mongoose.Schema.Types.Mixed, required: false },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
)

export const FichaMedicaEvaluacion1 =
  mongoose.models.FichaMedicaEvaluacion1 ||
  mongoose.model('FichaMedicaEvaluacion1', fichaMedicaEvaluacion1Schema)
