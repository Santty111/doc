'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCertificadoFichaMedica } from '@/lib/actions'
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
interface WorkerOption {
  id: string
  primer_nombre: string
  segundo_nombre: string
  primer_apellido: string
  segundo_apellido: string
  sexo: 'hombre' | 'mujer' | null
  puesto_trabajo_ciuo: string | null
  institucion_sistema: string | null
}

type Step = 'WORKER' | SeccionActual

const SECCION_LABELS: Record<Step, string> = {
  WORKER: 'Selección de trabajador',
  A: 'A. Datos del Establecimiento - Datos del Usuario',
  B: 'B. Datos Generales',
  C: 'C. Aptitud Médica para el Trabajo',
  D: 'D. Recomendaciones / Observaciones',
  E: 'E. Datos del Profesional - F. Firma del Usuario',
}

interface CertificadoFichaMedicaFlowProps {
  workers: WorkerOption[]
  defaultWorkerId?: string
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

function buildSeccionAFromWorker(worker: WorkerOption): CertificadoFichaMedicaSeccionA {
  return {
    establecimiento: {
      institucion_sistema: worker.institucion_sistema ?? '',
      ruc: '',
      ciiu: '',
      establecimiento_centro_trabajo: '',
      numero_formulario: '',
      numero_archivo: '',
    },
    usuario: {
      primer_apellido: worker.primer_apellido || '',
      segundo_apellido: worker.segundo_apellido || '',
      primer_nombre: worker.primer_nombre || '',
      segundo_nombre: worker.segundo_nombre || '',
      sexo: worker.sexo === 'mujer' ? 'F' : 'M',
      puesto_trabajo_ciuo: worker.puesto_trabajo_ciuo || '',
    },
  }
}

export function CertificadoFichaMedicaFlow({
  workers,
  defaultWorkerId,
}: CertificadoFichaMedicaFlowProps) {
  const initialWorkerId =
    defaultWorkerId && workers.some((worker) => worker.id === defaultWorkerId)
      ? defaultWorkerId
      : ''
  const initialWorker = workers.find((worker) => worker.id === initialWorkerId)
  const router = useRouter()
  const [seccionActual, setSeccionActual] = useState<Step>(
    initialWorker ? 'A' : 'WORKER'
  )
  const [workerId, setWorkerId] = useState(initialWorkerId)
  const [seccionA, setSeccionA] = useState<CertificadoFichaMedicaSeccionA | null>(
    initialWorker ? buildSeccionAFromWorker(initialWorker) : null
  )
  const [seccionB, setSeccionB] = useState<CertificadoFichaMedicaSeccionB | null>(null)
  const [seccionC, setSeccionC] = useState<CertificadoFichaMedicaSeccionC | null>(null)
  const [seccionD, setSeccionD] = useState<CertificadoFichaMedicaSeccionD | null>(null)
  const [seccionE, setSeccionE] = useState<CertificadoFichaMedicaSeccionE | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedWorker = workers.find((worker) => worker.id === workerId)

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
              if (!workerId) {
                setError('Debes seleccionar un trabajador')
                return
              }
              const { id } = await createCertificadoFichaMedica({
                worker_id: workerId,
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
