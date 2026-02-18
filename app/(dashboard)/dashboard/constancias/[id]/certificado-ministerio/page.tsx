import { connectDB } from '@/lib/db'
import { Certificate as CertificateModel } from '@/lib/models'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText } from 'lucide-react'
import { toStr } from '@/lib/utils'
import { getMinistryFormDataByCertificate, getMinistryFormDataByWorker } from '@/lib/actions'
import { MinistryForm } from '@/components/ministry/MinistryForm'

export default async function CertificadoMinisterioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: certificateId } = await params
  await connectDB()

  const cert = await CertificateModel.findById(certificateId)
    .populate({ path: 'worker_id', populate: { path: 'company_id' } })
    .lean()

  if (!cert) notFound()

  const w = (cert as { worker_id?: Record<string, unknown> }).worker_id
  const workerId =
    w && typeof w === 'object' && '_id' in w ? toStr(w._id) : toStr((cert as { worker_id?: unknown }).worker_id)
  const company =
    w && typeof w === 'object' && typeof (w as { company_id?: Record<string, unknown> }).company_id === 'object'
      ? (w as { company_id: Record<string, unknown> }).company_id
      : null

  let initialData = await getMinistryFormDataByCertificate(certificateId)
  if (!initialData) initialData = await getMinistryFormDataByWorker(workerId)

  const workerPlain =
    w && typeof w === 'object'
      ? {
          first_name: String((w as { first_name?: string }).first_name ?? ''),
          last_name: String((w as { last_name?: string }).last_name ?? ''),
          gender: (w as { gender?: string }).gender ?? '',
          position: (w as { position?: string }).position ?? '',
          blood_type: (w as { blood_type?: string }).blood_type ?? null,
          birth_date: (w as { birth_date?: unknown }).birth_date ?? null,
          lateralidad: (w as { lateralidad?: string }).lateralidad ?? null,
        }
      : undefined

  const companyPlain =
    company && typeof company === 'object'
      ? {
          name: String((company as { name?: string }).name ?? ''),
          razon_social: (company as { razon_social?: string }).razon_social ?? null,
          ruc: (company as { ruc?: string }).ruc ?? null,
          ciiu: (company as { ciiu?: string }).ciiu ?? null,
          establecimiento: (company as { establecimiento?: string }).establecimiento ?? null,
        }
      : undefined

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/constancias/${certificateId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la constancia
            </Button>
          </Link>
          <Link href={`/dashboard/constancias/${certificateId}/certificado-ministerio/imprimir`}>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Imprimir Certificado (PDF)
            </Button>
          </Link>
        </div>
      </div>
      <h1 className="text-2xl font-bold">Certificado de Aptitud (Formato Ministerio)</h1>
      <p className="text-muted-foreground">
        Complete los campos. Al imprimir, el diseño replicará el formato oficial del Ministerio.
      </p>
      <MinistryForm
        initialData={initialData as Record<string, unknown> | null}
        worker={workerPlain}
        company={companyPlain}
        workerId={workerId}
        medicalRecordId={null}
        certificateId={certificateId}
      />
    </div>
  )
}
