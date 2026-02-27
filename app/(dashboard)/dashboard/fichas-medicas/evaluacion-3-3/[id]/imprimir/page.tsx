import { connectDB } from '@/lib/db'
import { FichaMedicaEvaluacion3 } from '@/lib/models'
import { notFound } from 'next/navigation'
import type { FichaMedicaEvaluacion3Document } from '@/lib/types/ficha-medica-evaluacion-3'
import { FichaEva3PrintViewDynamic } from '@/components/fichas-medicas/evaluacion-3-3/FichaEva3PrintViewDynamic'

export const dynamic = 'force-dynamic'

export default async function FichaEva3ImprimirPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ print?: string }>
}) {
  const { id } = await params
  const { print } = await searchParams
  await connectDB()

  const doc = await FichaMedicaEvaluacion3.findById(id).lean()
  if (!doc) notFound()

  const docForView: FichaMedicaEvaluacion3Document = {
    _id: String(doc._id),
    seccionH: doc.seccionH as FichaMedicaEvaluacion3Document['seccionH'],
    created_at: doc.createdAt ? String(doc.createdAt) : undefined,
    updated_at: doc.updatedAt ? String(doc.updatedAt) : undefined,
  }

  return (
    <div className="min-h-screen bg-white p-6 print:p-0">
      <FichaEva3PrintViewDynamic data={docForView} autoPrint={print === '1'} />
    </div>
  )
}
