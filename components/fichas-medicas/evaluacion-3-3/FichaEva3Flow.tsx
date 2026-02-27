'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createFichaMedicaEvaluacion3 } from '@/lib/actions'
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
import { FichaEva3SeccionH } from './FichaEva3SeccionH'
import { FichaEva3SeccionI } from './FichaEva3SeccionI'
import { FichaEva3SeccionJ } from './FichaEva3SeccionJ'
import { FichaEva3SeccionK } from './FichaEva3SeccionK'
import { FichaEva3SeccionL } from './FichaEva3SeccionL'
import { FichaEva3SeccionM } from './FichaEva3SeccionM'
import { FichaEva3SeccionN } from './FichaEva3SeccionN'
import { FichaEva3SeccionOP } from './FichaEva3SeccionOP'
import type {
  FichaEva3AntecedenteEmpleo,
  FichaEva3ActividadExtra,
  FichaEva3ResultadoExamen,
  FichaEva3Diagnostico,
} from '@/lib/types/ficha-medica-evaluacion-3'

type SeccionActual = 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O'
interface WorkerOption {
  id: string
  primer_nombre: string
  segundo_nombre: string
  primer_apellido: string
  segundo_apellido: string
}

type Step = 'WORKER' | SeccionActual

interface FichaEva3FlowProps {
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

export function FichaEva3Flow({ workers, defaultWorkerId }: FichaEva3FlowProps) {
  const initialWorkerId =
    defaultWorkerId && workers.some((worker) => worker.id === defaultWorkerId)
      ? defaultWorkerId
      : ''
  const router = useRouter()
  const [seccionActual, setSeccionActual] = useState<Step>(
    initialWorkerId ? 'H' : 'WORKER'
  )
  const [workerId, setWorkerId] = useState(initialWorkerId)
  const [seccionHAntecedentes, setSeccionHAntecedentes] = useState<
    FichaEva3AntecedenteEmpleo[] | null
  >(null)
  const [seccionIActividades, setSeccionIActividades] = useState<
    FichaEva3ActividadExtra[] | null
  >(null)
  const [seccionJResultados, setSeccionJResultados] = useState<
    FichaEva3ResultadoExamen[] | null
  >(null)
  const [seccionJObservaciones, setSeccionJObservaciones] = useState<string | null>(null)
  const [seccionKDiagnosticos, setSeccionKDiagnosticos] = useState<
    FichaEva3Diagnostico[] | null
  >(null)
  const [seccionLAptitud, setSeccionLAptitud] = useState<string | null>(null)
  const [seccionLObservaciones, setSeccionLObservaciones] = useState<string | null>(null)
  const [seccionMDescripcion, setSeccionMDescripcion] = useState<string | null>(null)
  const [seccionNData, setSeccionNData] = useState<{
    se_realiza_evaluacion?: boolean
    condicion_salud_relacionada_trabajo?: boolean
    observacion?: string
  } | null>(null)
  const [seccionONombres, setSeccionONombres] = useState<string | null>(null)
  const [seccionOCodigo, setSeccionOCodigo] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const labels: Record<Step, string> = {
    WORKER: 'Selección de trabajador',
    H: 'H. Actividad laboral / Incidentes / Accidentes / Enfermedades ocupacionales',
    I: 'I. Actividades extra laborales',
    J: 'J. Resultados de exámenes generales y específicos',
    K: 'K. Diagnóstico',
    L: 'L. Aptitud médica para el trabajo',
    M: 'M. Recomendaciones y/o tratamiento',
    N: 'N. Retiro (evaluación)',
    O: 'O. Datos del profesional / P. Firma del trabajador',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Ficha Médica - Evaluación Ocupacional 3-3
        </h1>
        <p className="text-muted-foreground">{labels[seccionActual]}</p>
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
              Selecciona el trabajador para vincular esta ficha.
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
                  if (!workerId) {
                    setError('Debes seleccionar un trabajador')
                    return
                  }
                  setError(null)
                  setSeccionActual('H')
                }}
              >
                Continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {seccionActual === 'H' && (
        <FichaEva3SeccionH
          defaultValues={{
            antecedentes: seccionHAntecedentes ?? undefined,
          }}
          isFirstStep={true}
          isLastStep={false}
          disabled={saving}
          onNext={(data) => {
            setSeccionHAntecedentes(data.antecedentes)
            setSeccionActual('I')
          }}
        />
      )}

      {seccionActual === 'I' && (
        <FichaEva3SeccionI
          defaultValues={{
            actividades: seccionIActividades ?? undefined,
          }}
          isFirstStep={false}
          isLastStep={false}
          disabled={saving}
          onPrevious={() => setSeccionActual('H')}
          onNext={(data) => {
            setSeccionIActividades(data.actividades)
            setSeccionActual('J')
          }}
        />
      )}

      {seccionActual === 'J' && (
        <FichaEva3SeccionJ
          defaultValues={{
            resultados: seccionJResultados ?? undefined,
            observaciones: seccionJObservaciones ?? undefined,
          }}
          isFirstStep={false}
          isLastStep={false}
          disabled={saving}
          onPrevious={() => setSeccionActual('I')}
          onNext={(data) => {
            setSeccionJResultados(data.resultados)
            setSeccionJObservaciones(data.observaciones)
            setSeccionActual('K')
          }}
        />
      )}

      {seccionActual === 'K' && (
        <FichaEva3SeccionK
          defaultValues={{
            diagnosticos: seccionKDiagnosticos ?? undefined,
          }}
          isFirstStep={false}
          isLastStep={false}
          disabled={saving}
          onPrevious={() => setSeccionActual('J')}
          onNext={(data) => {
            setSeccionKDiagnosticos(data.diagnosticos)
            setSeccionActual('L')
          }}
        />
      )}

      {seccionActual === 'L' && (
        <FichaEva3SeccionL
          defaultValues={{
            aptitud: seccionLAptitud ?? undefined,
            observaciones: seccionLObservaciones ?? undefined,
          }}
          isFirstStep={false}
          isLastStep={false}
          disabled={saving}
          onPrevious={() => setSeccionActual('K')}
          onNext={(data) => {
            setSeccionLAptitud(data.aptitud)
            setSeccionLObservaciones(data.observaciones)
            setSeccionActual('M')
          }}
        />
      )}

      {seccionActual === 'M' && (
        <FichaEva3SeccionM
          defaultValues={{
            descripcion: seccionMDescripcion ?? undefined,
          }}
          isFirstStep={false}
          isLastStep={false}
          disabled={saving}
          onPrevious={() => setSeccionActual('L')}
          onNext={(data) => {
            setSeccionMDescripcion(data.descripcion)
            setSeccionActual('N')
          }}
        />
      )}

      {seccionActual === 'N' && (
        <FichaEva3SeccionN
          defaultValues={{
            se_realiza_evaluacion: seccionNData?.se_realiza_evaluacion,
            condicion_salud_relacionada_trabajo: seccionNData?.condicion_salud_relacionada_trabajo,
            observacion: seccionNData?.observacion ?? undefined,
          }}
          isFirstStep={false}
          isLastStep={false}
          disabled={saving}
          onPrevious={() => setSeccionActual('M')}
          onNext={(data) => {
            setSeccionNData(data)
            setSeccionActual('O')
          }}
        />
      )}

      {seccionActual === 'O' && (
        <FichaEva3SeccionOP
          defaultValues={{
            nombres_apellidos_profesional: seccionONombres ?? undefined,
            codigo_medico: seccionOCodigo ?? undefined,
          }}
          isFirstStep={false}
          isLastStep={true}
          disabled={saving}
          onPrevious={() => setSeccionActual('N')}
          onNext={async (data) => {
            setSeccionONombres(data.nombres_apellidos_profesional)
            setSeccionOCodigo(data.codigo_medico)
            setError(null)
            setSaving(true)
            try {
              if (!workerId) {
                setError('Debes seleccionar un trabajador')
                return
              }
              const { id } = await createFichaMedicaEvaluacion3({
                worker_id: workerId,
                seccionHAntecedentes: seccionHAntecedentes ?? [],
                seccionIActividades: seccionIActividades ?? [],
                seccionJResultados: seccionJResultados ?? [],
                seccionJObservaciones: seccionJObservaciones ?? '',
                seccionKDiagnosticos: seccionKDiagnosticos ?? [],
                seccionLAptitud: seccionLAptitud ?? '',
                seccionLObservaciones: seccionLObservaciones ?? '',
                seccionMDescripcion: seccionMDescripcion ?? '',
                seccionNSeRealizaEvaluacion: seccionNData?.se_realiza_evaluacion,
                seccionNCondicionSaludRelacionadaTrabajo: seccionNData?.condicion_salud_relacionada_trabajo,
                seccionNObservacion: seccionNData?.observacion ?? '',
                seccionONombresApellidos: data.nombres_apellidos_profesional,
                seccionOCodigoMedico: data.codigo_medico,
              })
              router.push(`/dashboard/fichas-medicas/evaluacion-3-3/${id}`)
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
