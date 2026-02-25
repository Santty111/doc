'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createFichaMedicaEvaluacion1 } from '@/lib/actions'
import { FichaEva1SeccionA } from './FichaEva1SeccionA'
import { FichaEva1SeccionB } from './FichaEva1SeccionB'
import { FichaEva1SeccionC } from './FichaEva1SeccionC'
import { FichaEva1SeccionD } from './FichaEva1SeccionD'
import { FichaEva1SeccionE } from './FichaEva1SeccionE'
import { FichaEva1SeccionF } from './FichaEva1SeccionF'
import type {
  FichaEva1SeccionA as FichaEva1SeccionAType,
  FichaEva1SeccionB as FichaEva1SeccionBType,
  FichaEva1SeccionC as FichaEva1SeccionCType,
  FichaEva1SeccionD as FichaEva1SeccionDType,
  FichaEva1SeccionE as FichaEva1SeccionEType,
  FichaEva1SeccionF as FichaEva1SeccionFType,
} from '@/lib/types/ficha-medica-evaluacion-1'

type SeccionActual = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

const SECCION_LABELS: Record<SeccionActual, string> = {
  A: 'A. Datos del Establecimiento - Datos del Usuario',
  B: 'B. Motivo de Consulta',
  C: 'C. Antecedentes Personales',
  D: 'D. Enfermedad o Problema Actual',
  E: 'E. Constantes Vitales y Antropometría',
  F: 'F. Examen Físico Regional',
}

export function FichaEva1Flow() {
  const router = useRouter()
  const [seccionActual, setSeccionActual] = useState<SeccionActual>('A')
  const [seccionA, setSeccionA] = useState<FichaEva1SeccionAType | null>(null)
  const [seccionB, setSeccionB] = useState<FichaEva1SeccionBType | null>(null)
  const [seccionC, setSeccionC] = useState<FichaEva1SeccionCType | null>(null)
  const [seccionD, setSeccionD] = useState<FichaEva1SeccionDType | null>(null)
  const [seccionE, setSeccionE] = useState<FichaEva1SeccionEType | null>(null)
  const [seccionF, setSeccionF] = useState<FichaEva1SeccionFType | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Ficha Médica - Evaluación Ocupacional 1-3
        </h1>
        <p className="text-muted-foreground">
          {SECCION_LABELS[seccionActual]}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {seccionActual === 'A' && (
        <FichaEva1SeccionA
          defaultValues={seccionA ?? undefined}
          onNext={(data) => {
            setSeccionA(data)
            setSeccionActual('B')
          }}
        />
      )}

      {seccionActual === 'B' && (
        <FichaEva1SeccionB
          defaultValues={seccionB ?? undefined}
          disabled={saving}
          isLastStep={false}
          onPrevious={() => setSeccionActual('A')}
          onNext={(data) => {
            setSeccionB(data)
            setSeccionActual('C')
          }}
        />
      )}

      {seccionActual === 'C' && (
        <FichaEva1SeccionC
          defaultValues={seccionC ?? undefined}
          disabled={saving}
          isLastStep={false}
          onPrevious={() => setSeccionActual('B')}
          onPreviousWithData={(data) => setSeccionC(data as FichaEva1SeccionCType)}
          onNext={(data: FichaEva1SeccionCType) => {
            setSeccionC(data)
            setSeccionActual('D')
          }}
        />
      )}

      {seccionActual === 'D' && (
        <FichaEva1SeccionD
          defaultValues={seccionD ?? undefined}
          disabled={saving}
          onPrevious={() => setSeccionActual('C')}
          onPreviousWithData={(data) => setSeccionD(prev => data ? { ...(prev ?? {}), ...data } as FichaEva1SeccionDType : prev)}
          onNext={(data) => {
            setSeccionD(data)
            setSeccionActual('E')
          }}
        />
      )}

      {seccionActual === 'E' && (
        <FichaEva1SeccionE
          defaultValues={seccionE ?? undefined}
          disabled={saving}
          isLastStep={false}
          onPrevious={() => setSeccionActual('D')}
          onPreviousWithData={(data) => setSeccionE(prev => data ? { ...(prev ?? {}), ...data } as FichaEva1SeccionEType : prev)}
          onNext={(data: FichaEva1SeccionEType) => {
            setSeccionE(data)
            setSeccionActual('F')
          }}
        />
      )}

      {seccionActual === 'F' && (
        <FichaEva1SeccionF
          defaultValues={seccionF ?? undefined}
          disabled={saving}
          onPrevious={() => setSeccionActual('E')}
          onPreviousWithData={(data) => setSeccionF(prev => data ? { ...(prev ?? {}), ...data } as FichaEva1SeccionFType : prev)}
          onNext={async (data: FichaEva1SeccionFType) => {
            setSeccionF(data)
            if (!seccionA || !seccionB || !seccionC || !seccionD || !seccionE) {
              setError('Faltan datos de secciones anteriores')
              return
            }
            setError(null)
            setSaving(true)
            try {
              const { id } = await createFichaMedicaEvaluacion1({
                seccionA,
                seccionB,
                seccionC,
                seccionD,
                seccionE,
                seccionF: data,
              })
              router.push(`/dashboard/fichas-medicas/evaluacion-1-3/${id}/imprimir?print=1`)
              router.refresh()
            } catch (err) {
              setError(
                err instanceof Error ? err.message : 'Error al guardar la ficha'
              )
            } finally {
              setSaving(false)
            }
          }}
        />
      )}
    </div>
  )
}
