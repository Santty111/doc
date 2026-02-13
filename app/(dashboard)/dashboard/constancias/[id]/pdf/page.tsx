import { connectDB } from '@/lib/db'
import { Certificate as CertificateModel } from '@/lib/models'
import { notFound } from 'next/navigation'
import { toStr, toDateStr } from '@/lib/utils'
import { CERTIFICATE_TYPE_LABELS, CERTIFICATE_RESULT_LABELS } from '@/lib/types'
import { ConstanciaPrintView } from '@/components/certificates/constancia-print-view'

export default async function ConstanciaPdfPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ print?: string }>
}) {
  const { id } = await params
  const { print } = await searchParams
  await connectDB()

  const cert = await CertificateModel.findById(id)
    .populate({
      path: 'worker_id',
      select: 'first_name last_name employee_code',
      populate: { path: 'company_id', select: 'name' },
    })
    .lean()

  if (!cert) notFound()

  const w = (cert as { worker_id?: { _id?: unknown; first_name?: string; last_name?: string; employee_code?: string; company_id?: { name: string } } }).worker_id
  const workerId = w && typeof w === 'object' && '_id' in w ? toStr((w as { _id: unknown })._id) : toStr((cert as { worker_id?: unknown }).worker_id)

  const plain = {
    id: toStr((cert as { _id: unknown })._id),
    worker_id: workerId,
    certificate_type: (cert as { certificate_type: string }).certificate_type,
    issue_date: toDateStr((cert as { issue_date: unknown }).issue_date) ?? '',
    expiry_date: (cert as { expiry_date?: unknown }).expiry_date ? toDateStr((cert as { expiry_date: unknown }).expiry_date) ?? null : null,
    result: (cert as { result: string }).result,
    restrictions: (cert as { restrictions?: string }).restrictions ?? null,
    recommendations: (cert as { recommendations?: string }).recommendations ?? null,
    doctor_name: (cert as { doctor_name?: string }).doctor_name ?? null,
    doctor_license: (cert as { doctor_license?: string }).doctor_license ?? null,
    observations: (cert as { observations?: string }).observations ?? null,
  }

  const workerName =
    w && typeof w === 'object'
      ? `${(w as { first_name?: string }).first_name ?? ''} ${(w as { last_name?: string }).last_name ?? ''}`.trim()
      : ''
  const employeeCode = w && typeof w === 'object' ? (w as { employee_code?: string }).employee_code ?? '' : ''
  const companyName = w && typeof w === 'object' && (w as { company_id?: { name: string } }).company_id
    ? (w as { company_id: { name: string } }).company_id.name
    : ''

  const typeLabel = CERTIFICATE_TYPE_LABELS[plain.certificate_type as keyof typeof CERTIFICATE_TYPE_LABELS] ?? plain.certificate_type
  const resultLabel = CERTIFICATE_RESULT_LABELS[plain.result as keyof typeof CERTIFICATE_RESULT_LABELS] ?? plain.result

  return (
    <ConstanciaPrintView
      certificate={{
        ...plain,
        workerName,
        employeeCode,
        companyName,
        typeLabel,
        resultLabel,
      }}
      autoPrint={print === '1'}
    />
  )
}
