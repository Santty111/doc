'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createFichaMedicaEvaluacion1 } from '@/lib/actions'
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
import { FICHA_EVA1_SECCION_B_DEFAULTS } from '@/lib/types/ficha-medica-evaluacion-1'

type SeccionActual = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
interface WorkerOption {
  id: string
  primer_nombre: string
  segundo_nombre: string
  primer_apellido: string
  segundo_apellido: string
  sexo: 'hombre' | 'mujer' | null
  fecha_nacimiento: string | null
  edad: number | null
  grupo_sanguineo: string | null
  lateralidad: 'diestro' | 'zurdo' | 'ambidiestro' | null
  cargo_ocupacion: string | null
  puesto_trabajo_ciuo: string | null
  institucion_sistema: string | null
}

type Step = 'WORKER' | SeccionActual

const SECCION_LABELS: Record<Step, string> = {
  WORKER: 'Selección de trabajador',
  A: 'A. Datos del Establecimiento - Datos del Usuario',
  B: 'B. Motivo de Consulta',
  C: 'C. Antecedentes Personales',
  D: 'D. Enfermedad o Problema Actual',
  E: 'E. Constantes Vitales y Antropometría',
  F: 'F. Examen Físico Regional',
}

interface FichaEva1FlowProps {
  workers: WorkerOption[]
  defaultWorkerId?: string
}

function buildWorkerDisplayName(worker: WorkerOption) {
  return [
    worker.primer_apellido,
    worker.segundo_apellido,
    worker.primer_nombre,
    worker.segundo_nombre,
  ]
    .filter(Boolean)
    .join(' ')
}

function buildSeccionAFromWorker(worker: WorkerOption): FichaEva1SeccionAType {
  return {
    establecimiento: {
      institucion_sistema: worker.institucion_sistema ?? '',
      ruc: '',
      ciiu: '',
      establecimiento_centro_trabajo: '',
      numero_historia_clinica: '',
      numero_archivo: '',
    },
    usuario: {
      primer_apellido: worker.primer_apellido || '',
      segundo_apellido: worker.segundo_apellido || '',
      primer_nombre: worker.primer_nombre || '',
      segundo_nombre: worker.segundo_nombre || '',
    },
    atencion_prioritaria: {
      embarazada: false,
      persona_discapacidad: false,
      enfermedad_catastrofica: false,
      lactancia: false,
      adulto_mayor: false,
    },
    sexo: worker.sexo ?? 'hombre',
    fecha_nacimiento: worker.fecha_nacimiento ?? '',
    edad: worker.edad,
    grupo_sanguineo: worker.grupo_sanguineo ?? '',
    lateralidad: worker.lateralidad ?? 'diestro',
  }
}

function buildSeccionBFromWorker(worker: WorkerOption): FichaEva1SeccionBType {
  return {
    ...FICHA_EVA1_SECCION_B_DEFAULTS,
    puesto_trabajo_ciuo: worker.puesto_trabajo_ciuo ?? '',
  }
}

export function FichaEva1Flow({ workers, defaultWorkerId }: FichaEva1FlowProps) {
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
  const [seccionA, setSeccionA] = useState<FichaEva1SeccionAType | null>(
    initialWorker ? buildSeccionAFromWorker(initialWorker) : null
  )
  const [seccionB, setSeccionB] = useState<FichaEva1SeccionBType | null>(
    initialWorker ? buildSeccionBFromWorker(initialWorker) : null
  )
  const [seccionC, setSeccionC] = useState<FichaEva1SeccionCType | null>(null)
  const [seccionD, setSeccionD] = useState<FichaEva1SeccionDType | null>(null)
  const [seccionE, setSeccionE] = useState<FichaEva1SeccionEType | null>(null)
  const [seccionF, setSeccionF] = useState<FichaEva1SeccionFType | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedWorker = workers.find((worker) => worker.id === workerId)

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

      {seccionActual === 'WORKER' && (
        <Card>
          <CardHeader>
            <CardTitle>Trabajador</CardTitle>
            <CardDescription>
              Selecciona el trabajador para autocompletar los datos base de la ficha.
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
                    {buildWorkerDisplayName(worker)}
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
                  setSeccionB(buildSeccionBFromWorker(selectedWorker))
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
              if (!workerId) {
                setError('Debes seleccionar un trabajador')
                return
              }
              const { id } = await createFichaMedicaEvaluacion1({
                worker_id: workerId,
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
