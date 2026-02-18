import mongoose from 'mongoose'

const revisionSistemaSchema = new mongoose.Schema(
  {
    estado: { type: String, enum: ['normal', 'anormal'], default: 'normal' },
    observacion: { type: String, default: '' },
  },
  { _id: false }
)

const antecedenteLaboralSchema = new mongoose.Schema(
  {
    empresa: { type: String, default: '' },
    puesto: { type: String, default: '' },
    tiempo: { type: String, default: '' },
    riesgos: { type: String, default: '' },
  },
  { _id: false }
)

const accidenteEnfermedadSchema = new mongoose.Schema(
  {
    tipo: { type: String, default: '' },
    fecha: { type: String, default: '' },
    observaciones: { type: String, default: '' },
  },
  { _id: false }
)

const ministryFormDataSchema = new mongoose.Schema(
  {
    worker_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    medical_record_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalRecord', default: null },
    certificate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate', default: null },

    // A. CABECERA
    empresa_razon_social: { type: String, default: '' },
    empresa_ruc: { type: String, default: '' },
    empresa_ciiu: { type: String, default: '' },
    empresa_establecimiento: { type: String, default: '' },
    nro_historia_clinica: { type: String, default: '' },
    nro_archivo: { type: String, default: '' },

    usuario_apellidos: { type: String, default: '' },
    usuario_nombres: { type: String, default: '' },
    usuario_sexo: { type: String, default: '' },
    usuario_cargo: { type: String, default: '' },
    usuario_grupo_sanguineo: { type: String, default: '' },
    usuario_fecha_nacimiento: { type: Date, default: null },
    usuario_edad: { type: Number, default: null },
    usuario_lateralidad: { type: String, default: '' },

    grupos_prioritarios_embarazo: { type: Boolean, default: false },
    grupos_prioritarios_discapacidad: { type: Boolean, default: false },
    grupos_prioritarios_catastrofica: { type: Boolean, default: false },
    grupos_prioritarios_lactancia: { type: Boolean, default: false },
    grupos_prioritarios_adulto_mayor: { type: Boolean, default: false },

    // B. REVISIÓN POR SISTEMAS (Ficha 1-3)
    revision_ojos: { type: revisionSistemaSchema, default: () => ({}) },
    revision_oidos: { type: revisionSistemaSchema, default: () => ({}) },
    revision_oro_faringe: { type: revisionSistemaSchema, default: () => ({}) },
    revision_cuello: { type: revisionSistemaSchema, default: () => ({}) },
    revision_torax: { type: revisionSistemaSchema, default: () => ({}) },
    revision_abdomen: { type: revisionSistemaSchema, default: () => ({}) },
    revision_columna: { type: revisionSistemaSchema, default: () => ({}) },
    revision_extremidades: { type: revisionSistemaSchema, default: () => ({}) },
    revision_neurologico: { type: revisionSistemaSchema, default: () => ({}) },

    // C. FACTORES DE RIESGO (texto libre por categoría)
    riesgo_fisicos: { type: String, default: '' },
    riesgo_mecanicos: { type: String, default: '' },
    riesgo_quimicos: { type: String, default: '' },
    riesgo_biologicos: { type: String, default: '' },
    riesgo_ergonomicos: { type: String, default: '' },
    riesgo_psicosociales: { type: String, default: '' },

    // D. ANTECEDENTES Y CERTIFICADO
    antecedentes_laborales: [antecedenteLaboralSchema],
    accidentes_enfermedades: [accidenteEnfermedadSchema],

    concepto_aptitud: {
      type: String,
      enum: ['apto', 'apto_observacion', 'apto_limitaciones', 'no_apto'],
      default: null,
    },
    recomendaciones: { type: String, default: '' },

    firma_profesional_nombre: { type: String, default: '' },
    firma_profesional_codigo: { type: String, default: '' },
    firma_trabajador: { type: Boolean, default: false },

    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
)

ministryFormDataSchema.index({ worker_id: 1 })
ministryFormDataSchema.index({ certificate_id: 1 })
ministryFormDataSchema.index({ medical_record_id: 1 })

export const MinistryFormData =
  mongoose.models.MinistryFormData ||
  mongoose.model('MinistryFormData', ministryFormDataSchema)
