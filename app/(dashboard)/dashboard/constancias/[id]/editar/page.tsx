import { connectDB } from '@/lib/db'
import { Certificate as CertificateModel, Worker } from '@/lib/models'
import { notFound } from 'next/navigation'
import { CertificateForm } from '@/components/certificates/certificate-form'
import type { Certificate } from '@/lib/types'
import { toStr, toDateStr } from '@/lib/utils'

function toPlainCertificate(c: Record<string, unknown>): Certificate {
  return {
    id: toStr(c._id),
    worker_id: toStr(c.worker_id),
    certificate_type: c.certificate_type as Certificate['certificate_type'],
    issue_date: toDateStr(c.issue_date) ?? toStr(c.issue_date),
    expiry_date: c.expiry_date ? toDateStr(c.expiry_date) ?? toStr(c.expiry_date) : null,
    result: c.result as Certificate['result'],
    restrictions: (c.restrictions as string) ?? null,
    recommendations: (c.recommendations as string) ?? null,
    doctor_name: (c.doctor_name as string) ?? null,
    doctor_license: (c.doctor_license as string) ?? null,
    observations: (c.observations as string) ?? null,
    pdf_url: (c.pdf_url as string) ?? null,
    created_at: toDateStr(c.createdAt) ?? toStr(c.createdAt),
    updated_at: toDateStr(c.updatedAt) ?? toStr(c.updatedAt),
    created_by: c.created_by ? toStr(c.created_by) : null,
  }
}

export default async function EditarConstanciaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await connectDB()

  const cert = await CertificateModel.findById(id).lean()
  if (!cert) notFound()

  const workers = await Worker.find({ status: 'active' })
    .sort({ last_name: 1 })
    .select('first_name last_name employee_code')
    .populate('company_id', 'name')
    .lean()

  const certPlain = toPlainCertificate(cert as Record<string, unknown>)
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
        <h1 className="text-2xl font-bold text-foreground">Editar Constancia de Aptitud</h1>
        <p className="text-muted-foreground">
          Modifique los datos de la constancia médica
        </p>
      </div>

      <CertificateForm workers={workersNorm} certificate={certPlain} />
    </div>
  )
}
