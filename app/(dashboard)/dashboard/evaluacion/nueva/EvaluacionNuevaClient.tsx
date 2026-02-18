'use client'

import React, { useState } from 'react'
import { EvaluacionWizard } from '@/components/evaluacion-medica/EvaluacionWizard'
import { CertificadoOficialForm } from '@/components/evaluacion-medica/CertificadoOficialForm'
import { CertificadoOficialPrintView } from '@/components/evaluacion-medica/print/CertificadoOficialPrintView'
import {
  createEstadoCertificadoOficialVacio,
  certificadoDesdeFicha,
} from '@/lib/evaluacion-medica-state'
import type { FichaMedicaMSP, CertificadoAptitudOficial } from '@/lib/schema-medico-types'

export function EvaluacionNuevaClient() {
  const [fichaCompleta, setFichaCompleta] = useState(false)
  const [ficha, setFicha] = useState<FichaMedicaMSP | null>(null)
  const [certificado, setCertificado] = useState<CertificadoAptitudOficial>(
    createEstadoCertificadoOficialVacio
  )

  const handleWizardComplete = (fichaActual: FichaMedicaMSP) => {
    setFicha(fichaActual)
    setCertificado(certificadoDesdeFicha(fichaActual))
    setFichaCompleta(true)
  }

  if (!fichaCompleta) {
    return (
      <>
        <EvaluacionWizard onComplete={handleWizardComplete} />
      </>
    )
  }

  return (
    <>
      <div className="screen-only">
        <CertificadoOficialForm
          data={certificado}
          onChange={setCertificado}
          onImprimir={() => window.print()}
        />
      </div>
      <div className="print-only evaluacion-print hidden print:block">
        <CertificadoOficialPrintView data={certificado} embedded />
      </div>
    </>
  )
}
