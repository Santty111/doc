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
