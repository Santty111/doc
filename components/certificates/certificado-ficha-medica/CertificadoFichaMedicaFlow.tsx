'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCertificadoFichaMedica } from '@/lib/actions'
import { CertificadoFichaMedicaSeccionA } from './CertificadoFichaMedicaSeccionA'
import { CertificadoFichaMedicaSeccionB } from './CertificadoFichaMedicaSeccionB'
import { CertificadoFichaMedicaSeccionC } from './CertificadoFichaMedicaSeccionC'
import { CertificadoFichaMedicaSeccionD } from './CertificadoFichaMedicaSeccionD'
import { CertificadoFichaMedicaSeccionE } from './CertificadoFichaMedicaSeccionE'
import type {
  CertificadoFichaMedicaSeccionA,
  CertificadoFichaMedicaSeccionB,
  CertificadoFichaMedicaSeccionC,
  CertificadoFichaMedicaSeccionD,
  CertificadoFichaMedicaSeccionE,
} from '@/lib/types/certificado-ficha-medica'

type SeccionActual = 'A' | 'B' | 'C' | 'D' | 'E'

const SECCION_LABELS: Record<SeccionActual, string> = {
  A: 'A. Datos del Establecimiento - Datos del Usuario',
  B: 'B. Datos Generales',
  C: 'C. Aptitud Médica para el Trabajo',
  D: 'D. Recomendaciones / Observaciones',
  E: 'E. Datos del Profesional - F. Firma del Usuario',
}

export function CertificadoFichaMedicaFlow() {
  const router = useRouter()
  const [seccionActual, setSeccionActual] = useState<SeccionActual>('A')
  const [seccionA, setSeccionA] = useState<CertificadoFichaMedicaSeccionA | null>(null)
  const [seccionB, setSeccionB] = useState<CertificadoFichaMedicaSeccionB | null>(null)
  const [seccionC, setSeccionC] = useState<CertificadoFichaMedicaSeccionC | null>(null)
  const [seccionD, setSeccionD] = useState<CertificadoFichaMedicaSeccionD | null>(null)
  const [seccionE, setSeccionE] = useState<CertificadoFichaMedicaSeccionE | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Certificado - Evaluación Médica Ocupacional
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
        <CertificadoFichaMedicaSeccionA
          defaultValues={seccionA ?? undefined}
          onNext={(data) => {
            setSeccionA(data)
            setSeccionActual('B')
          }}
        />
      )}

      {seccionActual === 'B' && (
        <CertificadoFichaMedicaSeccionB
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
        <CertificadoFichaMedicaSeccionC
          defaultValues={seccionC ?? undefined}
          disabled={saving}
          isLastStep={false}
          onPrevious={() => setSeccionActual('B')}
          onNext={(data) => {
            setSeccionC(data)
            setSeccionActual('D')
          }}
        />
      )}

      {seccionActual === 'D' && (
        <CertificadoFichaMedicaSeccionD
          defaultValues={seccionD ?? undefined}
          disabled={saving}
          isLastStep={false}
          onPrevious={() => setSeccionActual('C')}
          onNext={(data) => {
            setSeccionD(data)
            setSeccionActual('E')
          }}
        />
      )}

      {seccionActual === 'E' && (
        <CertificadoFichaMedicaSeccionE
          defaultValues={seccionE ?? undefined}
          disabled={saving}
          isLastStep={true}
          onPrevious={() => setSeccionActual('D')}
          onNext={async (data) => {
            setSeccionE(data)
            if (!seccionA || !seccionB || !seccionC || !seccionD) {
              setError('Faltan datos de secciones anteriores')
              return
            }
            setError(null)
            setSaving(true)
            try {
              const { id } = await createCertificadoFichaMedica({
                seccionA,
                seccionB,
                seccionC,
                seccionD,
                seccionE: data,
              })
              router.push(`/dashboard/fichas-medicas/certificado/${id}`)
              router.refresh()
            } catch (err) {
              setError(
                err instanceof Error ? err.message : 'Error al guardar el certificado'
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
