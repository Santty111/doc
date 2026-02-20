'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCertificadoAptitudOficial } from '@/lib/actions'
import { CertificadoPaso1SeccionA } from './CertificadoPaso1SeccionA'
import { CertificadoSeccionB } from './CertificadoSeccionB'
import { CertificadoSeccionC } from './CertificadoSeccionC'
import { CertificadoSeccionD } from './CertificadoSeccionD'
import { CertificadoSeccionE } from './CertificadoSeccionE'
import {
  CertificadoSeccionFinal,
  type CertificadoSeccionFinalData,
} from './CertificadoSeccionFinal'
import type {
  CertificadoAptitudSeccionA,
  CertificadoAptitudSeccionB,
  CertificadoAptitudSeccionC,
  CertificadoAptitudSeccionD,
  CertificadoAptitudSeccionE,
} from '@/lib/types/certificado-aptitud'

type SeccionActual = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

const SECCION_LABELS: Record<SeccionActual, string> = {
  A: 'A. Datos del establecimiento, empresa y usuario',
  B: 'B. Datos generales',
  C: 'C. Concepto para aptitud laboral',
  D: 'D. Condiciones de salud al momento del retiro',
  E: 'E. Recomendaciones',
  F: 'F y G. Datos del profesional y firma',
}

interface CertificadoAptitudFlowProps {
  defaultProfessionalName?: string
}

export function CertificadoAptitudFlow({
  defaultProfessionalName,
}: CertificadoAptitudFlowProps) {
  const router = useRouter()
  const [seccionActual, setSeccionActual] = useState<SeccionActual>('A')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [seccionA, setSeccionA] = useState<CertificadoAptitudSeccionA | null>(
    null
  )
  const [seccionB, setSeccionB] = useState<CertificadoAptitudSeccionB | null>(
    null
  )
  const [seccionC, setSeccionC] = useState<CertificadoAptitudSeccionC | null>(
    null
  )
  const [seccionD, setSeccionD] = useState<CertificadoAptitudSeccionD | null>(
    null
  )
  const [seccionE, setSeccionE] = useState<CertificadoAptitudSeccionE | null>(
    null
  )
  const [seccionFinal, setSeccionFinal] =
    useState<CertificadoSeccionFinalData | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Certificado de Aptitud Oficial
        </h1>
        <p className="text-muted-foreground">
          {SECCION_LABELS[seccionActual]}
        </p>
      </div>

      {seccionActual === 'A' && (
        <CertificadoPaso1SeccionA
          defaultValues={seccionA ?? undefined}
          onNext={(data) => {
            setSeccionA(data)
            setSeccionActual('B')
          }}
        />
      )}

      {seccionActual === 'B' && (
        <CertificadoSeccionB
          defaultValues={seccionB ?? undefined}
          onNext={(data) => {
            setSeccionB(data)
            setSeccionActual('C')
          }}
          onPrevious={() => setSeccionActual('A')}
        />
      )}

      {seccionActual === 'C' && (
        <CertificadoSeccionC
          defaultValues={seccionC ?? undefined}
          onNext={(data) => {
            setSeccionC(data)
            setSeccionActual('D')
          }}
          onPrevious={() => setSeccionActual('B')}
        />
      )}

      {seccionActual === 'D' && (
        <CertificadoSeccionD
          defaultValues={seccionD ?? undefined}
          onNext={(data) => {
            setSeccionD(data)
            setSeccionActual('E')
          }}
          onPrevious={() => setSeccionActual('C')}
        />
      )}

      {seccionActual === 'E' && (
        <CertificadoSeccionE
          defaultValues={seccionE ?? undefined}
          onNext={(data) => {
            setSeccionE(data)
            setSeccionActual('F')
          }}
          onPrevious={() => setSeccionActual('D')}
        />
      )}

      {seccionActual === 'F' && (
        <>
          {error && (
            <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}
          <CertificadoSeccionFinal
            evaluacion={seccionB?.evaluacion ?? 'ingreso'}
            defaultValues={seccionFinal ?? undefined}
            defaultProfessionalName={defaultProfessionalName}
            onNext={async (data) => {
              if (!seccionA || !seccionB || !seccionC || !seccionD || !seccionE) {
                setError('Faltan datos de secciones anteriores')
                return
              }
              setError(null)
              setSaving(true)
              try {
                const certificadoCompleto = {
                  seccionA,
                  seccionB,
                  seccionC,
                  seccionD,
                  seccionE,
                  seccionF: data.profesional,
                  seccionG: { firma_fisica: true },
                }
                const { id } = await createCertificadoAptitudOficial(
                  certificadoCompleto
                )
                router.push(
                  `/dashboard/certificado-aptitud-oficial/${id}/imprimir?print=1`
                )
                router.refresh()
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : 'Error al guardar'
                )
              } finally {
                setSaving(false)
              }
            }}
            onPrevious={() => setSeccionActual('E')}
            disabled={saving}
          />
        </>
      )}
    </div>
  )
}
