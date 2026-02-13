import { connectDB } from '@/lib/db'
import { Worker, Company } from '@/lib/models'
import { notFound } from 'next/navigation'
import { WorkerForm } from '@/components/workers/worker-form'
import type { Worker as WorkerType, Company as CompanyType } from '@/lib/types'
import { toStr, toDateStr } from '@/lib/utils'

function toPlainWorker(w: Record<string, unknown>): WorkerType {
  const birth = toDateStr(w.birth_date)
  const hire = toDateStr(w.hire_date)
  return {
    id: toStr(w._id),
    company_id: toStr(w.company_id),
    employee_code: toStr(w.employee_code),
    first_name: toStr(w.first_name),
    last_name: toStr(w.last_name),
    birth_date: birth ? birth.split('T')[0] : null,
    gender: (w.gender as WorkerType['gender']) || null,
    curp: (w.curp as string) || null,
    rfc: (w.rfc as string) || null,
    nss: (w.nss as string) || null,
    phone: (w.phone as string) || null,
    email: (w.email as string) || null,
    address: (w.address as string) || null,
    department: (w.department as string) || null,
    position: (w.position as string) || null,
    hire_date: hire ? hire.split('T')[0] : null,
    status: (w.status as WorkerType['status']) || 'active',
    created_at: toDateStr(w.createdAt) ?? toStr(w.createdAt),
    updated_at: toDateStr(w.updatedAt) ?? toStr(w.updatedAt),
    created_by: w.created_by ? toStr(w.created_by) : null,
  }
}

export default async function EditarTrabajadorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await connectDB()

  const worker = await Worker.findById(id).lean()
  if (!worker) notFound()

  const companies = await Company.find().sort({ name: 1 }).lean()
  const workerNorm = toPlainWorker(worker as Record<string, unknown>)
  const companiesNorm: CompanyType[] = (
    companies as { _id: unknown; name: string; code?: string }[]
  ).map((c) => ({ id: String(c._id), name: c.name, code: c.code ?? '', created_at: '' }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Editar Trabajador</h1>
        <p className="text-muted-foreground">
          {workerNorm.first_name} {workerNorm.last_name} - {workerNorm.employee_code}
        </p>
      </div>

      <WorkerForm companies={companiesNorm} worker={workerNorm} />
    </div>
  )
}
