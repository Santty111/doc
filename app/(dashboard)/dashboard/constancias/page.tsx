import { connectDB } from '@/lib/db'
import { Certificate, Worker } from '@/lib/models'
import { CertificatesTable } from '@/components/certificates/certificates-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { toStr, toDateStr } from '@/lib/utils'
import { getProfile } from '@/lib/auth-server'

function toPlainCertificate(c: Record<string, unknown> & { worker_id?: { _id?: unknown; first_name?: string; last_name?: string; employee_code?: string; company_id?: { name: string } } }) {
  const w = c.worker_id
  const workerId =
    w && typeof w === 'object' && w !== null && '_id' in w
      ? toStr((w as { _id: unknown })._id)
      : toStr(c.worker_id)
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
    id: toStr(c._id),
    worker_id: workerId,
    certificate_type: c.certificate_type as 'ingreso' | 'periodico' | 'egreso' | 'especial',
    issue_date: toDateStr(c.issue_date) ?? toStr(c.issue_date),
    expiry_date: c.expiry_date ? toDateStr(c.expiry_date) ?? toStr(c.expiry_date) : null,
    result: c.result as 'apto' | 'apto_con_restricciones' | 'no_apto' | 'pendiente',
    restrictions: (c.restrictions as string) ?? null,
    recommendations: (c.recommendations as string) ?? null,
    doctor_name: (c.doctor_name as string) ?? null,
    doctor_license: (c.doctor_license as string) ?? null,
    observations: (c.observations as string) ?? null,
    pdf_url: (c.pdf_url as string) ?? null,
    created_at: toDateStr(c.createdAt) ?? toStr(c.createdAt),
    updated_at: toDateStr(c.updatedAt) ?? toStr(c.updatedAt),
    created_by: c.created_by ? toStr(c.created_by) : null,
    worker,
  }
}

export default async function ConstanciasPage() {
  const profile = await getProfile()
  await connectDB()
  const workerFilter = profile?.company_id ? { company_id: profile.company_id } : {}
  const workerIds = profile?.company_id
    ? await Worker.find(workerFilter).distinct('_id')
    : null
  const certFilter = workerIds !== null ? { worker_id: { $in: workerIds } } : {}
  const [certificates, workers] = await Promise.all([
    Certificate.find(certFilter)
      .sort({ issue_date: -1 })
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

  const certsNorm = (certificates as Record<string, unknown>[]).map((c) =>
    toPlainCertificate(c as Parameters<typeof toPlainCertificate>[0])
  )

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
