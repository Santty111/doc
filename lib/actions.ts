'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import {
  Worker,
  MedicalRecord,
  Certificate,
  MedicalExam,
  CertificadoAptitudOficial,
  CertificadoFichaMedica,
  FichaMedicaEvaluacion1,
  FichaMedicaEvaluacion2,
  FichaMedicaEvaluacion3,
} from '@/lib/models'
import type { WorkerSnapshot } from '@/lib/types'

async function getUserId() {
  const session = await getServerSession(authOptions)
  return session?.user?.id ?? null
}

export async function createWorker(formData: Record<string, unknown>) {
  const userId = await getUserId()
  if (!userId) throw new Error('No autorizado')
  await connectDB()
  const data = {
    ...formData,
    company_id: formData.company_id,
    birth_date: formData.birth_date || null,
    hire_date: formData.hire_date || null,
    gender: formData.gender || null,
    created_by: userId,
  }
  await Worker.create(data)
  revalidatePath('/dashboard/trabajadores')
  revalidatePath('/dashboard')
}

export async function updateWorker(id: string, formData: Record<string, unknown>) {
  const userId = await getUserId()
  if (!userId) throw new Error('No autorizado')
  await connectDB()
  const data = {
    ...formData,
    birth_date: formData.birth_date || null,
    hire_date: formData.hire_date || null,
    gender: formData.gender || null,
  }
  await Worker.findByIdAndUpdate(id, data)
  revalidatePath('/dashboard/trabajadores')
  revalidatePath(`/dashboard/trabajadores/${id}`)
  revalidatePath('/dashboard')
}

export async function createMedicalRecord(formData: Record<string, unknown>) {
  const userId = await getUserId()
  if (!userId) throw new Error('No autorizado')
  await connectDB()
  await MedicalRecord.create({
    ...formData,
    created_by: userId,
  })
  revalidatePath('/dashboard/expedientes')
  revalidatePath('/dashboard')
}

export async function updateMedicalRecord(
  id: string,
  formData: Record<string, unknown>
) {
  const userId = await getUserId()
  if (!userId) throw new Error('No autorizado')
  await connectDB()
  await MedicalRecord.findByIdAndUpdate(id, formData)
  revalidatePath('/dashboard/expedientes')
  revalidatePath('/dashboard')
}

export async function createCertificate(formData: Record<string, unknown>) {
  const userId = await getUserId()
  if (!userId) throw new Error('No autorizado')
  await connectDB()
  await Certificate.create({
    ...formData,
    expiry_date: formData.expiry_date || null,
    created_by: userId,
  })
  revalidatePath('/dashboard/constancias')
  revalidatePath('/dashboard')
}

export async function updateCertificate(
  id: string,
  formData: Record<string, unknown>
) {
  const userId = await getUserId()
  if (!userId) throw new Error('No autorizado')
  await connectDB()
  await Certificate.findByIdAndUpdate(id, {
    ...formData,
    expiry_date: formData.expiry_date || null,
  })
  revalidatePath('/dashboard/constancias')
  revalidatePath('/dashboard')
}

export async function createMedicalExam(formData: Record<string, unknown>) {
  const userId = await getUserId()
  if (!userId) throw new Error('No autorizado')
  await connectDB()
  await MedicalExam.create({
    ...formData,
    created_by: userId,
  })
  revalidatePath('/dashboard/examenes')
  revalidatePath('/dashboard')
}

export async function updateMedicalExam(
  id: string,
  formData: Record<string, unknown>
) {
  const userId = await getUserId()
  if (!userId) throw new Error('No autorizado')
  await connectDB()
  await MedicalExam.findByIdAndUpdate(id, formData)
  revalidatePath('/dashboard/examenes')
  revalidatePath('/dashboard')
}

export async function createCertificadoAptitudOficial(
  data: Record<string, unknown>
) {
  const userId = await getUserId()
  if (!userId) throw new Error('No autorizado')
  await connectDB()
  const workerSnapshot = await resolveWorkerSnapshot(data.worker_id)
  const doc = await CertificadoAptitudOficial.create({
    worker_id: workerSnapshot.worker_id,
    worker_snapshot: workerSnapshot,
    seccionA: data.seccionA,
    seccionB: data.seccionB,
    seccionC: data.seccionC,
    seccionD: data.seccionD,
    seccionE: data.seccionE,
    seccionF: data.seccionF,
    seccionG: data.seccionG,
    created_by: userId,
  })
  revalidatePath('/dashboard/certificado-aptitud-oficial')
  revalidatePath('/dashboard')
  return { id: String(doc._id) }
}

function toPlainObject(obj: unknown): unknown {
  if (obj == null) return obj
  try {
    return JSON.parse(JSON.stringify(obj))
  } catch {
    return obj
  }
}

function getDateOnly(value: unknown): string | null {
  if (!value) return null
  if (typeof value === 'string') return value.split('T')[0]
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().split('T')[0]
  }
  return null
}

function calcAgeFromDate(dateOnly: string | null): number | null {
  if (!dateOnly) return null
  const birth = new Date(dateOnly)
  if (Number.isNaN(birth.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const monthDiff = now.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1
  }
  return age >= 0 ? age : null
}

async function resolveWorkerSnapshot(workerIdRaw: unknown): Promise<WorkerSnapshot> {
  const workerId = typeof workerIdRaw === 'string' ? workerIdRaw : ''
  if (!workerId) {
    throw new Error('Debe seleccionar un trabajador')
  }

  const workerDoc = await Worker.findById(workerId).lean()
  if (!workerDoc) {
    throw new Error('Trabajador no encontrado')
  }

  const worker = workerDoc as Record<string, unknown>
  const firstNameLegacy = String(worker.first_name ?? '').trim()
  const lastNameLegacy = String(worker.last_name ?? '').trim()
  const firstNameParts = firstNameLegacy ? firstNameLegacy.split(/\s+/) : []
  const lastNameParts = lastNameLegacy ? lastNameLegacy.split(/\s+/) : []
  const fechaNacimiento = getDateOnly(worker.birth_date)
  const sexo =
    (worker.sexo as WorkerSnapshot['sexo']) ||
    (worker.gender === 'M' ? 'hombre' : worker.gender === 'F' ? 'mujer' : null)

  return {
    worker_id: workerId,
    primer_nombre: String(worker.primer_nombre ?? firstNameParts[0] ?? ''),
    segundo_nombre: String(worker.segundo_nombre ?? firstNameParts.slice(1).join(' ') ?? ''),
    primer_apellido: String(worker.primer_apellido ?? lastNameParts[0] ?? ''),
    segundo_apellido: String(worker.segundo_apellido ?? lastNameParts.slice(1).join(' ') ?? ''),
    sexo,
    fecha_nacimiento: fechaNacimiento,
    edad: calcAgeFromDate(fechaNacimiento),
    grupo_sanguineo:
      (worker.grupo_sanguineo as string | null) ??
      (worker.blood_type as string | null) ??
      null,
    lateralidad: (worker.lateralidad as WorkerSnapshot['lateralidad']) ?? null,
    cargo_ocupacion: (worker.position as string | null) ?? null,
    puesto_trabajo_ciuo: (worker.puesto_trabajo_ciuo as string | null) ?? null,
  }
}

export async function createFichaMedicaEvaluacion1(
  data: Record<string, unknown>
) {
  const userId = await getUserId()
  if (!userId) throw new Error('No autorizado')
  await connectDB()
  const workerSnapshot = await resolveWorkerSnapshot(data.worker_id)
  const doc = await FichaMedicaEvaluacion1.create({
    worker_id: workerSnapshot.worker_id,
    worker_snapshot: workerSnapshot,
    seccionA: toPlainObject(data.seccionA) ?? {},
    seccionB: data.seccionB != null ? toPlainObject(data.seccionB) : null,
    seccionC: data.seccionC != null ? toPlainObject(data.seccionC) : null,
    seccionD: data.seccionD != null ? toPlainObject(data.seccionD) : null,
    seccionE: data.seccionE != null ? toPlainObject(data.seccionE) : null,
    seccionF: data.seccionF != null ? toPlainObject(data.seccionF) : null,
    created_by: userId,
  })
  revalidatePath('/dashboard/fichas-medicas')
  revalidatePath('/dashboard/fichas-medicas/evaluacion-1-3')
  revalidatePath('/dashboard')
  return { id: String(doc._id) }
}

export async function createFichaMedicaEvaluacion2(
  data: Record<string, unknown>
) {
  const userId = await getUserId()
  if (!userId) throw new Error('No autorizado')
  await connectDB()
  const workerSnapshot = await resolveWorkerSnapshot(data.worker_id)
  const doc = await FichaMedicaEvaluacion2.create({
    worker_id: workerSnapshot.worker_id,
    worker_snapshot: workerSnapshot,
    seccionG: {
      fisicos: data.seccionGFisicos != null ? toPlainObject(data.seccionGFisicos) : null,
      seguridad: data.seccionGSeguridad != null ? toPlainObject(data.seccionGSeguridad) : null,
      quimicos: data.seccionGQuimicos != null ? toPlainObject(data.seccionGQuimicos) : null,
      biologicos: data.seccionGBiologicos != null ? toPlainObject(data.seccionGBiologicos) : null,
      ergonomicos: data.seccionGErgonomicos != null ? toPlainObject(data.seccionGErgonomicos) : null,
      psicosociales: data.seccionGPsicosociales != null ? toPlainObject(data.seccionGPsicosociales) : null,
      medidas_preventivas: data.medidasPreventivas != null ? toPlainObject(data.medidasPreventivas) : null,
    },
    created_by: userId,
  })
  revalidatePath('/dashboard/fichas-medicas')
  revalidatePath('/dashboard/fichas-medicas/evaluacion-2-3')
  revalidatePath('/dashboard')
  return { id: String(doc._id) }
}

export async function createFichaMedicaEvaluacion3(
  data: Record<string, unknown>
) {
  const userId = await getUserId()
  if (!userId) throw new Error('No autorizado')
  await connectDB()
  const workerSnapshot = await resolveWorkerSnapshot(data.worker_id)
  const doc = await FichaMedicaEvaluacion3.create({
    worker_id: workerSnapshot.worker_id,
    worker_snapshot: workerSnapshot,
    seccionH: {
      antecedentes: data.seccionHAntecedentes != null ? toPlainObject(data.seccionHAntecedentes) : [],
    },
    seccionI: {
      actividades: data.seccionIActividades != null ? toPlainObject(data.seccionIActividades) : [],
    },
    seccionJ: {
      resultados: data.seccionJResultados != null ? toPlainObject(data.seccionJResultados) : [],
      observaciones: (data.seccionJObservaciones as string) ?? '',
    },
    seccionK: {
      diagnosticos: data.seccionKDiagnosticos != null ? toPlainObject(data.seccionKDiagnosticos) : [],
    },
    seccionL: {
      aptitud: (data.seccionLAptitud as string) ?? '',
      observaciones: (data.seccionLObservaciones as string) ?? '',
    },
    seccionM: {
      descripcion: (data.seccionMDescripcion as string) ?? '',
    },
    seccionN: {
      se_realiza_evaluacion: data.seccionNSeRealizaEvaluacion as boolean | undefined,
      condicion_salud_relacionada_trabajo: data.seccionNCondicionSaludRelacionadaTrabajo as boolean | undefined,
      observacion: (data.seccionNObservacion as string) ?? '',
    },
    seccionO: {
      nombres_apellidos_profesional: (data.seccionONombresApellidos as string) ?? '',
      codigo_medico: (data.seccionOCodigoMedico as string) ?? '',
    },
    created_by: userId,
  })
  revalidatePath('/dashboard/fichas-medicas')
  revalidatePath('/dashboard/fichas-medicas/evaluacion-3-3')
  revalidatePath('/dashboard')
  return { id: String(doc._id) }
}

export async function createCertificadoFichaMedica(
  data: Record<string, unknown>
) {
  const userId = await getUserId()
  if (!userId) throw new Error('No autorizado')
  await connectDB()
  const workerSnapshot = await resolveWorkerSnapshot(data.worker_id)
  const doc = await CertificadoFichaMedica.create({
    worker_id: workerSnapshot.worker_id,
    worker_snapshot: workerSnapshot,
    seccionA: toPlainObject(data.seccionA) ?? {},
    seccionB: toPlainObject(data.seccionB) ?? {},
    seccionC: toPlainObject(data.seccionC) ?? {},
    seccionD: toPlainObject(data.seccionD) ?? {},
    seccionE: toPlainObject(data.seccionE) ?? {},
    created_by: userId,
  })
  revalidatePath('/dashboard/fichas-medicas')
  revalidatePath('/dashboard/fichas-medicas/certificado')
  revalidatePath('/dashboard')
  return { id: String(doc._id) }
}
