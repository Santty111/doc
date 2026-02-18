'use client'

import React, { useState, useCallback, Suspense, lazy } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { FichaMedicaMSP } from '@/lib/schema-medico-types'
import { createEstadoFichaVacio } from '@/lib/evaluacion-medica-state'
import { FichaPaso1Identificacion } from '@/components/evaluacion-medica/steps/FichaPaso1Identificacion'

// Lazy load pasos pesados: solo se cargan cuando el usuario navega a ese paso
const FichaPaso2Riesgos = lazy(
  () => import('@/components/evaluacion-medica/steps/FichaPaso2Riesgos').then((m) => ({ default: m.FichaPaso2Riesgos }))
)
const FichaPaso3HistoriaDiagnostico = lazy(
  () => import('@/components/evaluacion-medica/steps/FichaPaso3HistoriaDiagnostico').then((m) => ({ default: m.FichaPaso3HistoriaDiagnostico }))
)
const FichaPaso4CertificadoInterno = lazy(
  () => import('@/components/evaluacion-medica/steps/FichaPaso4CertificadoInterno').then((m) => ({ default: m.FichaPaso4CertificadoInterno }))
)

const PASOS = [
  'Identificación y examen',
  'Riesgos laborales',
  'Historia y diagnóstico',
  'Certificado interno',
] as const

export function EvaluacionWizard({
  workerId,
  initialFicha,
  onComplete,
}: {
  workerId?: string
  initialFicha?: FichaMedicaMSP | null
  onComplete?: (ficha: FichaMedicaMSP) => void
}) {
  const [step, setStep] = useState(0)
  const [ficha, setFicha] = useState<FichaMedicaMSP>(
    () => initialFicha ?? createEstadoFichaVacio()
  )

  const updateFicha = useCallback(
    (patch: Partial<FichaMedicaMSP> | ((prev: FichaMedicaMSP) => FichaMedicaMSP)) => {
      setFicha((prev) => (typeof patch === 'function' ? patch(prev) : { ...prev, ...patch }))
    },
    []
  )

  // Handlers estables por paso: evitan re-renders en cascada de los steps memoizados
  const onChangePag1 = useCallback(
    (pag1: FichaMedicaMSP['pagina_1_identificacion_y_examen']) => {
      updateFicha({ pagina_1_identificacion_y_examen: pag1 })
    },
    [updateFicha]
  )
  const onChangePag2 = useCallback(
    (pag2: FichaMedicaMSP['pagina_2_riesgos_laborales']) => {
      updateFicha({ pagina_2_riesgos_laborales: pag2 })
    },
    [updateFicha]
  )
  const onChangePag3 = useCallback(
    (pag3: FichaMedicaMSP['pagina_3_historia_y_diagnostico']) => {
      updateFicha({ pagina_3_historia_y_diagnostico: pag3 })
    },
    [updateFicha]
  )
  const onChangePag4 = useCallback(
    (pag4: FichaMedicaMSP['pagina_4_certificado']) => {
      updateFicha({ pagina_4_certificado: pag4 })
    },
    [updateFicha]
  )

  const canNext = step < PASOS.length - 1
  const canPrev = step > 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Evaluación Médica Ocupacional</CardTitle>
          <p className="text-sm text-muted-foreground">
            Paso {step + 1} de {PASOS.length}: {PASOS[step]}
          </p>
          <div className="flex gap-2 pt-2">
            {PASOS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i)}
                className={`h-2 flex-1 rounded ${
                  i === step ? 'bg-primary' : i < step ? 'bg-primary/50' : 'bg-muted'
                }`}
                aria-label={`Ir a paso ${i + 1}`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {step === 0 && (
            <FichaPaso1Identificacion
              data={ficha.pagina_1_identificacion_y_examen}
              onChange={onChangePag1}
            />
          )}
          {step === 1 && (
            <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Cargando riesgos laborales...</div>}>
              <FichaPaso2Riesgos
                data={ficha.pagina_2_riesgos_laborales}
                onChange={onChangePag2}
              />
            </Suspense>
          )}
          {step === 2 && (
            <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Cargando historia y diagnóstico...</div>}>
              <FichaPaso3HistoriaDiagnostico
                data={ficha.pagina_3_historia_y_diagnostico}
                onChange={onChangePag3}
              />
            </Suspense>
          )}
          {step === 3 && (
            <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Cargando certificado...</div>}>
              <FichaPaso4CertificadoInterno
                data={ficha.pagina_4_certificado}
                onChange={onChangePag4}
              />
            </Suspense>
          )}

          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={!canPrev}
              onClick={() => setStep((s) => s - 1)}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
            {canNext ? (
              <Button type="button" onClick={() => setStep((s) => s + 1)}>
                Siguiente
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => onComplete?.(ficha)}
              >
                Finalizar ficha
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
