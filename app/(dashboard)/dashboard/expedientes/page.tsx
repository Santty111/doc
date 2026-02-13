import { connectDB } from '@/lib/db'
import { MedicalRecord, Worker } from '@/lib/models'
import { MedicalRecordsTable } from '@/components/medical-records/medical-records-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { toStr, toDateStr } from '@/lib/utils'
import { getProfile } from '@/lib/auth-server'

function toPlainRecord(r: Record<string, unknown> & { worker_id?: { _id?: unknown; first_name?: string; last_name?: string; employee_code?: string; company_id?: { name: string } } }) {
  const w = r.worker_id
  const workerId =
    w && typeof w === 'object' && w !== null && '_id' in w
      ? toStr((w as { _id: unknown })._id)
      : toStr(r.worker_id)
  const worker =
    w && typeof w === 'object'
      ? {
          id: workerId,
          first_name: String((w as { first_name?: string }).first_name ?? ''),
          last_name: String((w as { last_name?: string }).last_name ?? ''),
          employee_code: String((w as { employee_code?: string }).employee_code ?? ''),
          company: (w as { company_id?: { name: string } }).company_id ? { name: (w as { company_id: { name: string } }).company_id.name } : undefined,
        }
      : undefined

  return {
    id: toStr(r._id),
    worker_id: workerId,
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
    worker,
  }
}

export default async function ExpedientesPage() {
  const profile = await getProfile()
  await connectDB()
  const workerFilter = profile?.company_id ? { company_id: profile.company_id } : {}
  const workerIds = profile?.company_id
    ? await Worker.find(workerFilter).distinct('_id')
    : null
  const recordFilter = workerIds !== null ? { worker_id: { $in: workerIds } } : {}
  const [records, workers] = await Promise.all([
    MedicalRecord.find(recordFilter)
      .sort({ record_date: -1 })
      .populate({
        path: 'worker_id',
        select: 'first_name last_name employee_code',
        populate: { path: 'company_id', select: 'name' },
      })
      .lean(),
    Worker.find({ ...workerFilter, status: 'active' })
      .sort({ last_name: 1 })
      .select('first_name last_name employee_code')
      .lean(),
  ])

  const recordsNorm = (records as Record<string, unknown>[]).map((r) => toPlainRecord(r as Parameters<typeof toPlainRecord>[0]))

  const workersNorm = (workers as Record<string, unknown>[]).map((w) => ({
    id: toStr(w._id),
    first_name: toStr(w.first_name),
    last_name: toStr(w.last_name),
    employee_code: toStr(w.employee_code),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Expedientes Médicos
          </h1>
          <p className="text-muted-foreground">
            Historia clínica y antecedentes médicos de los trabajadores
          </p>
        </div>
        <Link href="/dashboard/expedientes/nuevo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Expediente
          </Button>
        </Link>
      </div>

      <MedicalRecordsTable records={recordsNorm} workers={workersNorm} />
    </div>
  )
}
