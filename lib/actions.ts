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
  const doc = await CertificadoAptitudOficial.create({
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

export async function createFichaMedicaEvaluacion1(
  data: Record<string, unknown>
) {
  const userId = await getUserId()
  if (!userId) throw new Error('No autorizado')
  await connectDB()
  const doc = await FichaMedicaEvaluacion1.create({
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
  const doc = await FichaMedicaEvaluacion2.create({
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
  const doc = await FichaMedicaEvaluacion3.create({
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
  const doc = await CertificadoFichaMedica.create({
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
