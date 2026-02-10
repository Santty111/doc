import { connectDB } from '@/lib/db'
import { Company } from '@/lib/models'
import { WorkerForm } from '@/components/workers/worker-form'
import type { Company as CompanyType } from '@/lib/types'

export default async function NuevoTrabajadorPage() {
  await connectDB()
  const companies = await Company.find().sort({ name: 1 }).lean()
  const normalized: CompanyType[] = (companies as { _id: string; name: string; code?: string }[]).map(
    (c) => ({ id: c._id, name: c.name, code: c.code ?? '', created_at: '' })
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nuevo Trabajador</h1>
        <p className="text-muted-foreground">
          Complete el formulario para registrar un nuevo trabajador
        </p>
      </div>

      <WorkerForm companies={normalized} />
    </div>
  )
}
