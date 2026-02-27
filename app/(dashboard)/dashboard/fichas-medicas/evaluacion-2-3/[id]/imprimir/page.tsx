import { connectDB } from '@/lib/db'
import { FichaMedicaEvaluacion2 } from '@/lib/models'
import { notFound } from 'next/navigation'
import type { FichaMedicaEvaluacion2Document } from '@/lib/types/ficha-medica-evaluacion-2'
import { FichaEva2PrintViewDynamic } from '@/components/fichas-medicas/evaluacion-2-3/FichaEva2PrintViewDynamic'

export const dynamic = 'force-dynamic'

export default async function FichaEva2ImprimirPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ print?: string }>
}) {
  const { id } = await params
  const { print } = await searchParams
  await connectDB()

  const doc = await FichaMedicaEvaluacion2.findById(id).lean()
  if (!doc) notFound()

  const docForView: FichaMedicaEvaluacion2Document = {
    _id: String(doc._id),
    seccionG: doc.seccionG as FichaMedicaEvaluacion2Document['seccionG'],
    created_at: doc.createdAt ? String(doc.createdAt) : undefined,
    updated_at: doc.updatedAt ? String(doc.updatedAt) : undefined,
  }

  return (
    <div className="min-h-screen bg-white p-6 print:p-0">
      <FichaEva2PrintViewDynamic data={docForView} autoPrint={print === '1'} />
    </div>
  )
}
