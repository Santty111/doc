import mongoose from 'mongoose'

/**
 * Ficha Médica - Evaluación Ocupacional 3-3.
 * Sección H. Actividad Laboral / Incidentes / Accidentes / Enfermedades Ocupacionales.
 */
const fichaMedicaEvaluacion3Schema = new mongoose.Schema(
  {
    worker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: false,
    },
    worker_snapshot: { type: mongoose.Schema.Types.Mixed, required: false },
    seccionH: {
      antecedentes: { type: mongoose.Schema.Types.Mixed, required: false },
    },
    seccionI: {
      actividades: { type: mongoose.Schema.Types.Mixed, required: false },
    },
    seccionJ: {
      resultados: { type: mongoose.Schema.Types.Mixed, required: false },
      observaciones: { type: String, required: false },
    },
    seccionK: {
      diagnosticos: { type: mongoose.Schema.Types.Mixed, required: false },
    },
    seccionL: {
      aptitud: { type: String, required: false },
      observaciones: { type: String, required: false },
    },
    seccionM: {
      descripcion: { type: String, required: false },
    },
    seccionN: {
      se_realiza_evaluacion: { type: Boolean, required: false },
      condicion_salud_relacionada_trabajo: { type: Boolean, required: false },
      observacion: { type: String, required: false },
    },
    seccionO: {
      nombres_apellidos_profesional: { type: String, required: false },
      codigo_medico: { type: String, required: false },
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
)

export const FichaMedicaEvaluacion3 =
  mongoose.models.FichaMedicaEvaluacion3 ||
  mongoose.model('FichaMedicaEvaluacion3', fichaMedicaEvaluacion3Schema)
