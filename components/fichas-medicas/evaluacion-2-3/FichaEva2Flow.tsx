'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createFichaMedicaEvaluacion2 } from '@/lib/actions'
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
import { FichaEva2SeccionGFisicos } from './FichaEva2SeccionGFisicos'
import { FichaEva2SeccionGSeguridad } from './FichaEva2SeccionGSeguridad'
import { FichaEva2SeccionGQuimicos } from './FichaEva2SeccionGQuimicos'
import { FichaEva2SeccionGBiologicos } from './FichaEva2SeccionGBiologicos'
import { FichaEva2SeccionGErgonomicos } from './FichaEva2SeccionGErgonomicos'
import { FichaEva2SeccionGPsicosociales } from './FichaEva2SeccionGPsicosociales'
import { FichaEva2SeccionMedidasPreventivas } from './FichaEva2SeccionMedidasPreventivas'
import type { FichaEva2SeccionGFisicos as FichaEva2SeccionGFisicosType } from '@/lib/types/ficha-medica-evaluacion-2'
import type { FichaEva2SeccionGSeguridad as FichaEva2SeccionGSeguridadType } from '@/lib/types/ficha-medica-evaluacion-2'
import type { FichaEva2SeccionGQuimicos as FichaEva2SeccionGQuimicosType } from '@/lib/types/ficha-medica-evaluacion-2'
import type { FichaEva2SeccionGBiologicos as FichaEva2SeccionGBiologicosType } from '@/lib/types/ficha-medica-evaluacion-2'
import type { FichaEva2SeccionGErgonomicos as FichaEva2SeccionGErgonomicosType } from '@/lib/types/ficha-medica-evaluacion-2'
import type { FichaEva2SeccionGPsicosociales as FichaEva2SeccionGPsicosocialesType } from '@/lib/types/ficha-medica-evaluacion-2'
import type { FichaEva2MedidasPreventivas as FichaEva2MedidasPreventivasType } from '@/lib/types/ficha-medica-evaluacion-2'
import { FICHA_EVA2_SECCION_G_FISICOS_DEFAULTS } from '@/lib/types/ficha-medica-evaluacion-2'

type Step = 'fisicos' | 'seguridad' | 'quimicos' | 'biologicos' | 'ergonomicos' | 'psicosociales' | 'medidas_preventivas'
interface WorkerOption {
  id: string
  primer_nombre: string
  segundo_nombre: string
  primer_apellido: string
  segundo_apellido: string
  puesto_trabajo_ciuo: string | null
  cargo_ocupacion: string | null
}

type FlowStep = 'worker' | Step

const STEP_LABELS: Record<FlowStep, string> = {
  worker: 'Selección de trabajador',
  fisicos: 'G. Factores de Riesgo — FÍSICOS',
  seguridad: 'G. Factores de Riesgo — DE SEGURIDAD',
  quimicos: 'G. Factores de Riesgo — QUÍMICOS',
  biologicos: 'G. Factores de Riesgo — BIOLÓGICOS',
  ergonomicos: 'G. Factores de Riesgo — ERGONÓMICOS',
  psicosociales: 'G. Factores de Riesgo — PSICOSOCIAL',
  medidas_preventivas: 'Medidas preventivas',
}

interface FichaEva2FlowProps {
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

export function FichaEva2Flow({ workers, defaultWorkerId }: FichaEva2FlowProps) {
  const initialWorkerId =
    defaultWorkerId && workers.some((worker) => worker.id === defaultWorkerId)
      ? defaultWorkerId
      : ''
  const initialWorker = workers.find((worker) => worker.id === initialWorkerId)
  const router = useRouter()
  const [step, setStep] = useState<FlowStep>(initialWorker ? 'fisicos' : 'worker')
  const [workerId, setWorkerId] = useState(initialWorkerId)
  const [seccionGFisicos, setSeccionGFisicos] =
    useState<FichaEva2SeccionGFisicosType | null>(
      initialWorker
        ? {
            ...FICHA_EVA2_SECCION_G_FISICOS_DEFAULTS,
            puesto_trabajo:
              initialWorker.puesto_trabajo_ciuo ||
              initialWorker.cargo_ocupacion ||
              '',
          }
        : null
    )
  const [seccionGSeguridad, setSeccionGSeguridad] =
    useState<FichaEva2SeccionGSeguridadType | null>(null)
  const [seccionGQuimicos, setSeccionGQuimicos] =
    useState<FichaEva2SeccionGQuimicosType | null>(null)
  const [seccionGBiologicos, setSeccionGBiologicos] =
    useState<FichaEva2SeccionGBiologicosType | null>(null)
  const [seccionGErgonomicos, setSeccionGErgonomicos] =
    useState<FichaEva2SeccionGErgonomicosType | null>(null)
  const [seccionGPsicosociales, setSeccionGPsicosociales] =
    useState<FichaEva2SeccionGPsicosocialesType | null>(null)
  const [medidasPreventivas, setMedidasPreventivas] =
    useState<FichaEva2MedidasPreventivasType | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const selectedWorker = workers.find((worker) => worker.id === workerId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Ficha Médica - Evaluación Ocupacional 2-3
        </h1>
        <p className="text-muted-foreground">{STEP_LABELS[step]}</p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {step === 'worker' && (
        <Card>
          <CardHeader>
            <CardTitle>Trabajador</CardTitle>
            <CardDescription>
              Selecciona el trabajador para vincular esta ficha y prellenar el puesto.
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
                  setSeccionGFisicos((prev) => prev ?? {
                    ...FICHA_EVA2_SECCION_G_FISICOS_DEFAULTS,
                    puesto_trabajo:
                      selectedWorker.puesto_trabajo_ciuo ||
                      selectedWorker.cargo_ocupacion ||
                      '',
                  })
                  setStep('fisicos')
                }}
              >
                Continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'fisicos' && (
        <FichaEva2SeccionGFisicos
          defaultValues={seccionGFisicos ?? undefined}
          isFirstStep={true}
          isLastStep={false}
          disabled={saving}
          onNext={(data: FichaEva2SeccionGFisicosType) => {
            setSeccionGFisicos(data)
            setStep('seguridad')
          }}
        />
      )}

      {step === 'seguridad' && (
        <FichaEva2SeccionGSeguridad
          defaultValues={seccionGSeguridad ?? undefined}
          isFirstStep={false}
          isLastStep={false}
          disabled={saving}
          onPrevious={() => setStep('fisicos')}
          onPreviousWithData={(data) => setSeccionGSeguridad((prev) => (data ? { ...prev, ...data } : prev))}
          onNext={(data: FichaEva2SeccionGSeguridadType) => {
            setSeccionGSeguridad(data)
            setStep('quimicos')
          }}
        />
      )}

      {step === 'quimicos' && (
        <FichaEva2SeccionGQuimicos
          defaultValues={seccionGQuimicos ?? undefined}
          isFirstStep={false}
          isLastStep={false}
          disabled={saving}
          onPrevious={() => setStep('seguridad')}
          onPreviousWithData={(data) => setSeccionGQuimicos((prev) => (data ? { ...prev, ...data } : prev))}
          onNext={(data: FichaEva2SeccionGQuimicosType) => {
            setSeccionGQuimicos(data)
            setStep('biologicos')
          }}
        />
      )}

      {step === 'biologicos' && (
        <FichaEva2SeccionGBiologicos
          defaultValues={seccionGBiologicos ?? undefined}
          isFirstStep={false}
          isLastStep={false}
          disabled={saving}
          onPrevious={() => setStep('quimicos')}
          onPreviousWithData={(data) => setSeccionGBiologicos((prev) => (data ? { ...prev, ...data } : prev))}
          onNext={(data: FichaEva2SeccionGBiologicosType) => {
            setSeccionGBiologicos(data)
            setStep('ergonomicos')
          }}
        />
      )}

      {step === 'ergonomicos' && (
        <FichaEva2SeccionGErgonomicos
          defaultValues={seccionGErgonomicos ?? undefined}
          isFirstStep={false}
          isLastStep={false}
          disabled={saving}
          onPrevious={() => setStep('biologicos')}
          onPreviousWithData={(data) => setSeccionGErgonomicos((prev) => (data ? { ...prev, ...data } : prev))}
          onNext={(data: FichaEva2SeccionGErgonomicosType) => {
            setSeccionGErgonomicos(data)
            setStep('psicosociales')
          }}
        />
      )}

      {step === 'psicosociales' && (
        <FichaEva2SeccionGPsicosociales
          defaultValues={seccionGPsicosociales ?? undefined}
          isFirstStep={false}
          isLastStep={false}
          disabled={saving}
          onPrevious={() => setStep('ergonomicos')}
          onPreviousWithData={(data) => setSeccionGPsicosociales((prev) => (data ? { ...prev, ...data } : prev))}
          onNext={(data: FichaEva2SeccionGPsicosocialesType) => {
            setSeccionGPsicosociales(data)
            setStep('medidas_preventivas')
          }}
        />
      )}

      {step === 'medidas_preventivas' && (
        <FichaEva2SeccionMedidasPreventivas
          defaultValues={medidasPreventivas ?? undefined}
          isFirstStep={false}
          isLastStep={true}
          disabled={saving}
          onPrevious={() => setStep('psicosociales')}
          onPreviousWithData={(data) => setMedidasPreventivas((prev) => (data ? { ...prev, ...data } : prev))}
          onNext={async (data: FichaEva2MedidasPreventivasType) => {
            setMedidasPreventivas(data)
            if (!seccionGFisicos || !seccionGSeguridad || !seccionGQuimicos || !seccionGBiologicos || !seccionGErgonomicos || !seccionGPsicosociales) {
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
              const { id } = await createFichaMedicaEvaluacion2({
                worker_id: workerId,
                seccionGFisicos,
                seccionGSeguridad,
                seccionGQuimicos,
                seccionGBiologicos,
                seccionGErgonomicos,
                seccionGPsicosociales,
                medidasPreventivas: data,
              })
              router.push(`/dashboard/fichas-medicas/evaluacion-2-3/${id}`)
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
