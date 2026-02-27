import mongoose from 'mongoose'

const workerSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    employee_code: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    primer_nombre: { type: String, default: '' },
    segundo_nombre: { type: String, default: '' },
    primer_apellido: { type: String, default: '' },
    segundo_apellido: { type: String, default: '' },
    birth_date: { type: Date, default: null },
    gender: { type: String, enum: ['M', 'F', 'Otro'], default: null },
    sexo: { type: String, enum: ['hombre', 'mujer'], default: null },
    grupo_sanguineo: { type: String, default: null },
    lateralidad: { type: String, enum: ['diestro', 'zurdo', 'ambidiestro'], default: null },
    puesto_trabajo_ciuo: { type: String, default: null },
    curp: { type: String, default: null },
    rfc: { type: String, default: null },
    nss: { type: String, default: null },
    phone: { type: String, default: null },
    email: { type: String, default: null },
    address: { type: String, default: null },
    department: { type: String, default: null },
    position: { type: String, default: null },
    hire_date: { type: Date, default: null },
    status: {
      type: String,
      enum: ['active', 'inactive', 'terminated'],
      default: 'active',
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
)

workerSchema.index({ company_id: 1, employee_code: 1 }, { unique: true })

const cachedWorkerModel = mongoose.models.Worker
const hasExtendedWorkerFields =
  !!cachedWorkerModel?.schema?.path('grupo_sanguineo') &&
  !!cachedWorkerModel?.schema?.path('lateralidad') &&
  !!cachedWorkerModel?.schema?.path('puesto_trabajo_ciuo')

if (cachedWorkerModel && !hasExtendedWorkerFields) {
  delete mongoose.models.Worker
}

export const Worker =
  mongoose.models.Worker || mongoose.model('Worker', workerSchema)
