'use client'

import dynamic from 'next/dynamic'
import type { FichaMedicaEvaluacion3Document } from '@/lib/types/ficha-medica-evaluacion-3'

const FichaEva3PrintView = dynamic(
  () =>
    import('./FichaEva3PrintView').then((mod) => mod.FichaEva3PrintView),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse rounded-lg border bg-muted p-6">
        Cargando ficha...
      </div>
    ),
  }
)

interface FichaEva3PrintViewDynamicProps {
  data: FichaMedicaEvaluacion3Document
  autoPrint?: boolean
}

export function FichaEva3PrintViewDynamic({
  data,
  autoPrint = false,
}: FichaEva3PrintViewDynamicProps) {
  return <FichaEva3PrintView data={data} autoPrint={autoPrint} />
}
