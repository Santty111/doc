'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCertificadoAptitudOficial } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
type Step = 'WORKER' | SeccionActual

interface WorkerOption {
  id: string
  primer_nombre: string
  segundo_nombre: string
  primer_apellido: string
  segundo_apellido: string
  sexo: 'hombre' | 'mujer' | null
  cargo_ocupacion: string | null
  institucion_sistema: string | null
}

const SECCION_LABELS: Record<Step, string> = {
  WORKER: 'Selección de trabajador',
  A: 'A. Datos del establecimiento, empresa y usuario',
  B: 'B. Datos generales',
  C: 'C. Concepto para aptitud laboral',
  D: 'D. Condiciones de salud al momento del retiro',
  E: 'E. Recomendaciones',
  F: 'F y G. Datos del profesional y firma',
}

interface CertificadoAptitudFlowProps {
  defaultProfessionalName?: string
  workers: WorkerOption[]
}

function getWorkerLabel(worker: WorkerOption) {
  return [
    worker.primer_apellido,
    worker.segundo_apellido,
    worker.primer_nombre,
    worker.segundo_nombre,
  ]
    .filter(Boolean)
    .join(' ')
}

function buildSeccionAFromWorker(worker: WorkerOption): CertificadoAptitudSeccionA {
  return {
    empresa: {
      institucion_nombre: worker.institucion_sistema ?? '',
      ruc: '',
      ciiu: '',
      establecimiento_salud: '',
      numero_historia_clinica: '',
      numero_archivo: '',
    },
    usuario: {
      primer_apellido: worker.primer_apellido || '',
      segundo_apellido: worker.segundo_apellido || '',
      primer_nombre: worker.primer_nombre || '',
      segundo_nombre: worker.segundo_nombre || '',
      sexo: worker.sexo === 'mujer' ? 'F' : 'M',
      cargo_ocupacion: worker.cargo_ocupacion || '',
    },
  }
}

export function CertificadoAptitudFlow({
  defaultProfessionalName,
  workers,
}: CertificadoAptitudFlowProps) {
  const router = useRouter()
  const [seccionActual, setSeccionActual] = useState<Step>('WORKER')
  const [workerId, setWorkerId] = useState('')
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
  const selectedWorker = workers.find((worker) => worker.id === workerId)

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

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {seccionActual === 'WORKER' && (
        <Card>
          <CardHeader>
            <CardTitle>Trabajador</CardTitle>
            <CardDescription>
              Selecciona el trabajador para autocompletar los datos base del certificado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={workerId} onValueChange={setWorkerId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un trabajador" />
              </SelectTrigger>
              <SelectContent>
                {workers.map((worker) => (
                  <SelectItem key={worker.id} value={worker.id}>
                    {getWorkerLabel(worker)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => {
                  if (!selectedWorker) {
                    setError('Debes seleccionar un trabajador')
                    return
                  }
                  setError(null)
                  setSeccionA(buildSeccionAFromWorker(selectedWorker))
                  setSeccionActual('A')
                }}
              >
                Continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                if (!workerId) {
                  setError('Debes seleccionar un trabajador')
                  return
                }
                const certificadoCompleto = {
                  worker_id: workerId,
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
