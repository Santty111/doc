import { connectDB } from '@/lib/db'
import { Certificate, Worker } from '@/lib/models'
import { CertificatesTable } from '@/components/certificates/certificates-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

function norm(d: { _id: unknown; [k: string]: unknown }) {
  return { ...d, id: String(d._id) }
}

export default async function ConstanciasPage() {
  await connectDB()
  const [certificates, workers] = await Promise.all([
    Certificate.find()
      .sort({ issue_date: -1 })
      .populate({
        path: 'worker_id',
        select: 'first_name last_name employee_code',
        populate: { path: 'company_id', select: 'name' },
      })
      .lean(),
    Worker.find({ status: 'active' })
      .sort({ last_name: 1 })
      .select('first_name last_name employee_code')
      .lean(),
  ])

  const certsNorm = (
    certificates as {
      _id: unknown
      worker_id: {
        _id: string
        first_name: string
        last_name: string
        employee_code: string
        company_id?: { name: string }
      }
      [k: string]: unknown
    }[]
  ).map((c) => {
    const row = norm(c) as { id: string; worker?: { id: string; first_name: string; last_name: string; employee_code: string; company?: { name: string } }; [k: string]: unknown }
    const w = c.worker_id
    if (w) {
      row.worker = {
        id: String(w._id),
        first_name: w.first_name,
        last_name: w.last_name,
        employee_code: w.employee_code,
        company: w.company_id ? { name: w.company_id.name } : undefined,
      }
    }
    return row
  })

  const workersNorm = (
    workers as { _id: string; first_name: string; last_name: string; employee_code: string }[]
  ).map((w) => ({
    id: String(w._id),
    first_name: w.first_name,
    last_name: w.last_name,
    employee_code: w.employee_code,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Constancias de Aptitud
          </h1>
          <p className="text-muted-foreground">
            Gestión de constancias médicas y certificados de aptitud laboral
          </p>
        </div>
        <Link href="/dashboard/constancias/nueva">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Constancia
          </Button>
        </Link>
      </div>

      <CertificatesTable certificates={certsNorm} workers={workersNorm} />
    </div>
  )
}
