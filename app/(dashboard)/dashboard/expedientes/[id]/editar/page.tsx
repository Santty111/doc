import { connectDB } from '@/lib/db'
import { MedicalRecord as MedicalRecordModel, Worker } from '@/lib/models'
import { notFound } from 'next/navigation'
import { MedicalRecordForm } from '@/components/medical-records/medical-record-form'
import type { MedicalRecord } from '@/lib/types'
import { toStr, toDateStr } from '@/lib/utils'

function toPlainRecord(r: Record<string, unknown>): MedicalRecord {
  return {
    id: toStr(r._id),
    worker_id: toStr(r.worker_id),
    record_date: toDateStr(r.record_date) ?? toStr(r.record_date),
    medical_history: (r.medical_history as string) ?? null,
    family_history: (r.family_history as string) ?? null,
    allergies: (r.allergies as string) ?? null,
    current_medications: (r.current_medications as string) ?? null,
    blood_type: (r.blood_type as string) ?? null,
    height_cm: typeof r.height_cm === 'number' ? r.height_cm : null,
    weight_kg: typeof r.weight_kg === 'number' ? r.weight_kg : null,
    blood_pressure: (r.blood_pressure as string) ?? null,
    heart_rate: typeof r.heart_rate === 'number' ? r.heart_rate : null,
    observations: (r.observations as string) ?? null,
    created_at: toDateStr(r.createdAt) ?? toStr(r.createdAt),
    updated_at: toDateStr(r.updatedAt) ?? toStr(r.updatedAt),
    created_by: r.created_by ? toStr(r.created_by) : null,
  }
}

export default async function EditarExpedientePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await connectDB()

  const record = await MedicalRecordModel.findById(id).lean()
  if (!record) notFound()

  const workers = await Worker.find({ status: 'active' })
    .sort({ last_name: 1 })
    .select('first_name last_name employee_code')
    .populate('company_id', 'name')
    .lean()

  const recordPlain = toPlainRecord(record as Record<string, unknown>)
  const workersNorm = (workers as Record<string, unknown>[]).map((w) => ({
    id: toStr(w._id),
    first_name: toStr(w.first_name),
    last_name: toStr(w.last_name),
    employee_code: toStr(w.employee_code),
    company: (w.company_id && typeof w.company_id === 'object' && 'name' in w.company_id)
      ? { name: (w.company_id as { name: string }).name }
      : null,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Editar Expediente Médico</h1>
        <p className="text-muted-foreground">
          Modifique la historia clínica del trabajador
        </p>
      </div>

      <MedicalRecordForm workers={workersNorm} record={recordPlain} />
    </div>
  )
}
