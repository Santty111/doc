'use client'

import dynamic from 'next/dynamic'
import type { FichaMedicaEvaluacion2Document } from '@/lib/types/ficha-medica-evaluacion-2'

const FichaEva2PrintView = dynamic(
  () =>
    import('./FichaEva2PrintView').then((mod) => mod.FichaEva2PrintView),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse rounded-lg border bg-muted p-6">
        Cargando ficha...
      </div>
    ),
  }
)

interface FichaEva2PrintViewDynamicProps {
  data: FichaMedicaEvaluacion2Document
  autoPrint?: boolean
}

export function FichaEva2PrintViewDynamic({
  data,
  autoPrint = false,
}: FichaEva2PrintViewDynamicProps) {
  return <FichaEva2PrintView data={data} autoPrint={autoPrint} />
}
