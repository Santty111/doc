import { connectDB } from '@/lib/db'
import { FichaMedicaEvaluacion1 } from '@/lib/models'
import { notFound } from 'next/navigation'
import { FichaEva1PrintView } from '@/components/fichas-medicas/evaluacion-1-3/FichaEva1PrintView'
import type { FichaMedicaEvaluacion1Document } from '@/lib/types/ficha-medica-evaluacion-1'

export const dynamic = 'force-dynamic'

export default async function FichaEva1ImprimirPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ print?: string }>
}) {
  const { id } = await params
  const { print } = await searchParams
  await connectDB()

  const doc = await FichaMedicaEvaluacion1.findById(id).lean()
  if (!doc) notFound()

  const raw = doc as Record<string, unknown>
  const data = {
    seccionA: raw.seccionA ?? {},
    seccionB: raw.seccionB ?? {},
    seccionC: raw.seccionC ?? {},
    seccionD: raw.seccionD ?? {},
    seccionE: raw.seccionE ?? {},
    seccionF: raw.seccionF ?? {},
  } as FichaMedicaEvaluacion1Document

  return (
    <FichaEva1PrintView
      id={id}
      data={data}
      autoPrint={print === '1'}
    />
  )
}
