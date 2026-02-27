'use client'

import dynamic from 'next/dynamic'
import type { CertificadoFichaMedicaDocument } from '@/lib/types/certificado-ficha-medica'

const CertificadoFichaMedicaPrintView = dynamic(
  () =>
    import('./CertificadoFichaMedicaPrintView').then(
      (mod) => mod.CertificadoFichaMedicaPrintView
    ),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse rounded-lg border bg-muted p-6">
        Cargando certificado...
      </div>
    ),
  }
)

interface CertificadoFichaMedicaPrintViewDynamicProps {
  data: CertificadoFichaMedicaDocument
  autoPrint?: boolean
}

export function CertificadoFichaMedicaPrintViewDynamic({
  data,
  autoPrint = false,
}: CertificadoFichaMedicaPrintViewDynamicProps) {
  return (
    <CertificadoFichaMedicaPrintView data={data} autoPrint={autoPrint} />
  )
}
