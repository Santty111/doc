import { connectDB } from '@/lib/db'
import { FichaMedicaEvaluacion2 } from '@/lib/models'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { FichaMedicaEvaluacion2Document } from '@/lib/types/ficha-medica-evaluacion-2'
import { FichaEva2PrintViewDynamic } from '@/components/fichas-medicas/evaluacion-2-3/FichaEva2PrintViewDynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function FichaEva2DetailPage({ params }: PageProps) {
  const { id } = await params
  await connectDB()
  const doc = await FichaMedicaEvaluacion2.findById(id).lean()
  if (!doc) notFound()

  const docForView: FichaMedicaEvaluacion2Document = {
    _id: String(doc._id),
    worker_id: doc.worker_id ? String(doc.worker_id) : undefined,
    worker_snapshot: doc.worker_snapshot as FichaMedicaEvaluacion2Document['worker_snapshot'],
    seccionG: doc.seccionG as FichaMedicaEvaluacion2Document['seccionG'],
    created_at: doc.createdAt ? String(doc.createdAt) : undefined,
    updated_at: doc.updatedAt ? String(doc.updatedAt) : undefined,
  }

  const fisicos = docForView.seccionG?.fisicos

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/fichas-medicas/evaluacion-2-3">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          Evaluación Ocupacional 2-3 — Factores de Riesgo
        </h1>
      </div>

      <FichaEva2PrintViewDynamic data={docForView} />
    </div>
  )
}
