import { connectDB } from '@/lib/db'
import { MedicalRecord as MedicalRecordModel } from '@/lib/models'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText } from 'lucide-react'
import { toStr } from '@/lib/utils'
import { getMinistryFormDataByMedicalRecord, getMinistryFormDataByWorker } from '@/lib/actions'
import { MinistryForm } from '@/components/ministry/MinistryForm'

export default async function FichaMinisterioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: recordId } = await params
  await connectDB()

  const record = await MedicalRecordModel.findById(recordId)
    .populate({ path: 'worker_id', populate: { path: 'company_id' } })
    .lean()

  if (!record) notFound()

  const w = (record as { worker_id?: Record<string, unknown> }).worker_id
  const workerId =
    w && typeof w === 'object' && '_id' in w ? toStr(w._id) : toStr((record as { worker_id?: unknown }).worker_id)
  const company =
    w && typeof w === 'object' && typeof (w as { company_id?: Record<string, unknown> }).company_id === 'object'
      ? (w as { company_id: Record<string, unknown> }).company_id
      : null

  let initialData = await getMinistryFormDataByMedicalRecord(recordId)
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
          <Link href={`/dashboard/expedientes/${recordId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al expediente
            </Button>
          </Link>
          <Link href={`/dashboard/expedientes/${recordId}/ficha-ministerio/imprimir`}>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Imprimir Fichas (PDF)
            </Button>
          </Link>
        </div>
      </div>
      <h1 className="text-2xl font-bold">Ficha Médica Ocupacional (Formato Ministerio)</h1>
      <p className="text-muted-foreground">
        Complete todos los campos. Al imprimir, el diseño replicará el formato oficial.
      </p>
      <MinistryForm
        initialData={initialData as Record<string, unknown> | null}
        worker={workerPlain}
        company={companyPlain}
        workerId={workerId}
        medicalRecordId={recordId}
        certificateId={null}
      />
    </div>
  )
}
