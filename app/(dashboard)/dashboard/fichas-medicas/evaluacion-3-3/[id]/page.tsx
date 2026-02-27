import { connectDB } from '@/lib/db'
import { FichaMedicaEvaluacion3 } from '@/lib/models'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { FichaMedicaEvaluacion3Document } from '@/lib/types/ficha-medica-evaluacion-3'
import { FichaEva3PrintViewDynamic } from '@/components/fichas-medicas/evaluacion-3-3/FichaEva3PrintViewDynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function FichaEva3DetailPage({ params }: PageProps) {
  const { id } = await params
  await connectDB()
  const doc = await FichaMedicaEvaluacion3.findById(id).lean()
  if (!doc) notFound()

  const docForView: FichaMedicaEvaluacion3Document = {
    _id: String(doc._id),
    worker_id: doc.worker_id ? String(doc.worker_id) : undefined,
    worker_snapshot: doc.worker_snapshot as FichaMedicaEvaluacion3Document['worker_snapshot'],
    seccionH: doc.seccionH as FichaMedicaEvaluacion3Document['seccionH'],
    seccionI: doc.seccionI as FichaMedicaEvaluacion3Document['seccionI'],
    seccionJ: doc.seccionJ as FichaMedicaEvaluacion3Document['seccionJ'],
    seccionK: doc.seccionK as FichaMedicaEvaluacion3Document['seccionK'],
    seccionL: doc.seccionL as FichaMedicaEvaluacion3Document['seccionL'],
    seccionM: doc.seccionM as FichaMedicaEvaluacion3Document['seccionM'],
    seccionN: doc.seccionN as FichaMedicaEvaluacion3Document['seccionN'],
    seccionO: doc.seccionO as FichaMedicaEvaluacion3Document['seccionO'],
    created_at: doc.createdAt ? String(doc.createdAt) : undefined,
    updated_at: doc.updatedAt ? String(doc.updatedAt) : undefined,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/fichas-medicas/evaluacion-3-3">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          Evaluación Ocupacional 3-3 — Actividad Laboral / Incidentes / Accidentes
        </h1>
      </div>

      <FichaEva3PrintViewDynamic data={docForView} />
    </div>
  )
}
