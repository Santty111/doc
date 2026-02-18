import { connectDB } from '@/lib/db'
import { Certificate as CertificateModel } from '@/lib/models'
import { notFound } from 'next/navigation'
import { toStr } from '@/lib/utils'
import { getMinistryFormDataByCertificate, getMinistryFormDataByWorker } from '@/lib/actions'
import { toMinistryPrintData } from '@/lib/ministry-utils'
import { MinistryCertificadoPrintView } from '@/components/ministry/MinistryCertificadoPrintView'

export default async function CertificadoMinisterioImprimirPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ print?: string }>
}) {
  const { id: certificateId } = await params
  const { print } = await searchParams
  await connectDB()

  const cert = await CertificateModel.findById(certificateId).select('worker_id').lean()
  if (!cert) notFound()

  const workerId = toStr((cert as { worker_id?: unknown }).worker_id)
  let raw = await getMinistryFormDataByCertificate(certificateId)
  if (!raw) raw = await getMinistryFormDataByWorker(workerId)

  const data = toMinistryPrintData(raw as Record<string, unknown>)
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            No hay datos guardados del formato Ministerio para esta constancia.
          </p>
          <a
            href={`/dashboard/constancias/${certificateId}/certificado-ministerio`}
            className="text-primary underline"
          >
            Completar formulario primero
          </a>
        </div>
      </div>
    )
  }

  return <MinistryCertificadoPrintView data={data} autoPrint={print === '1'} />
}
