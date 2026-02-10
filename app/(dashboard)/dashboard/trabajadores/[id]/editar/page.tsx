import { connectDB } from '@/lib/db'
import { Worker, Company } from '@/lib/models'
import { notFound } from 'next/navigation'
import { WorkerForm } from '@/components/workers/worker-form'
import type { Worker as WorkerType, Company as CompanyType } from '@/lib/types'

function norm(d: { _id: unknown; [k: string]: unknown }) {
  return { ...d, id: String(d._id) }
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
  const workerNorm = norm(worker as { _id: unknown; [k: string]: unknown }) as WorkerType
  const companiesNorm: CompanyType[] = (
    companies as { _id: string; name: string; code?: string }[]
  ).map((c) => ({ id: c._id, name: c.name, code: c.code ?? '', created_at: '' }))

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
