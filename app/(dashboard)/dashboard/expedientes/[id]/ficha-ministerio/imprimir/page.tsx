import { connectDB } from '@/lib/db'
import { MedicalRecord as MedicalRecordModel } from '@/lib/models'
import { notFound } from 'next/navigation'
import { toStr } from '@/lib/utils'
import { getMinistryFormDataByMedicalRecord, getMinistryFormDataByWorker } from '@/lib/actions'
import { toMinistryPrintData } from '@/lib/ministry-utils'
import { MinistryFichasPrintView } from '@/components/ministry/MinistryFichasPrintView'

export default async function FichaMinisterioImprimirPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ print?: string }>
}) {
  const { id: recordId } = await params
  const { print } = await searchParams
  await connectDB()

  const record = await MedicalRecordModel.findById(recordId).select('worker_id').lean()
  if (!record) notFound()

  const workerId = toStr((record as { worker_id?: unknown }).worker_id)
  let raw = await getMinistryFormDataByMedicalRecord(recordId)
  if (!raw) raw = await getMinistryFormDataByWorker(workerId)

  const data = toMinistryPrintData(raw as Record<string, unknown>)
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No hay datos guardados del formato Ministerio para este expediente.</p>
          <a href={`/dashboard/expedientes/${recordId}/ficha-ministerio`} className="text-primary underline">
            Completar formulario primero
          </a>
        </div>
      </div>
    )
  }

  return <MinistryFichasPrintView data={data} autoPrint={print === '1'} />
}
