'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, ArrowLeft } from 'lucide-react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { FichaEva1SeccionB, TipoEvaluacionFicha } from '@/lib/types/ficha-medica-evaluacion-1'

const TIPO_EVALUACION_OPTIONS: { value: TipoEvaluacionFicha; label: string }[] = [
  { value: 'ingreso', label: 'Ingreso' },
  { value: 'periodico', label: 'Periódico' },
  { value: 'reintegro', label: 'Reintegro' },
  { value: 'retiro', label: 'Retiro' },
]

const seccionBSchema = z.object({
  puesto_trabajo_ciuo: z.string().min(1, 'Requerido'),
  fecha_atencion: z.string().min(1, 'Requerido'),
  fecha_ingreso_trabajo: z.string(),
  fecha_reintegro: z.string(),
  fecha_ultimo_dia_laboral: z.string(),
  descripcion_motivo: z.string(),
  tipo_evaluacion: z.enum(['ingreso', 'periodico', 'reintegro', 'retiro']),
  observacion: z.string(),
})

type SeccionBFormValues = z.infer<typeof seccionBSchema>

function toFormValues(data: Partial<FichaEva1SeccionB> | undefined): SeccionBFormValues {
  const def: SeccionBFormValues = {
    puesto_trabajo_ciuo: '',
    fecha_atencion: new Date().toISOString().split('T')[0],
    fecha_ingreso_trabajo: '',
    fecha_reintegro: '',
    fecha_ultimo_dia_laboral: '',
    descripcion_motivo: '',
    tipo_evaluacion: 'periodico',
    observacion: 'NINGUNA',
  }
  if (!data) return def
  return {
    puesto_trabajo_ciuo: data.puesto_trabajo_ciuo ?? def.puesto_trabajo_ciuo,
    fecha_atencion: data.fecha_atencion ?? def.fecha_atencion,
    fecha_ingreso_trabajo: data.fecha_ingreso_trabajo ?? def.fecha_ingreso_trabajo,
    fecha_reintegro: data.fecha_reintegro ?? def.fecha_reintegro,
    fecha_ultimo_dia_laboral: data.fecha_ultimo_dia_laboral ?? def.fecha_ultimo_dia_laboral,
    descripcion_motivo: data.descripcion_motivo ?? def.descripcion_motivo,
    tipo_evaluacion: data.tipo_evaluacion ?? def.tipo_evaluacion,
    observacion: data.observacion ?? def.observacion,
  }
}

interface FichaEva1SeccionBProps {
  defaultValues?: Partial<FichaEva1SeccionB>
  onNext: (data: FichaEva1SeccionB) => void | Promise<void>
  onPrevious: () => void
  disabled?: boolean
  /** Si false, muestra "Siguiente" en vez de "Guardar ficha" */
  isLastStep?: boolean
}

export function FichaEva1SeccionB({
  defaultValues,
  onNext,
  onPrevious,
  disabled = false,
  isLastStep = true,
}: FichaEva1SeccionBProps) {
  const form = useForm<SeccionBFormValues>({
    resolver: zodResolver(seccionBSchema),
    defaultValues: toFormValues(defaultValues),
  })

  const handleSubmit = (values: SeccionBFormValues) => {
    onNext({
      puesto_trabajo_ciuo: values.puesto_trabajo_ciuo,
      fecha_atencion: values.fecha_atencion,
      fecha_ingreso_trabajo: values.fecha_ingreso_trabajo,
      fecha_reintegro: values.fecha_reintegro,
      fecha_ultimo_dia_laboral: values.fecha_ultimo_dia_laboral,
      descripcion_motivo: values.descripcion_motivo,
      tipo_evaluacion: values.tipo_evaluacion,
      observacion: values.observacion,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>B. Motivo de Consulta</CardTitle>
            <CardDescription>
              Información del puesto de trabajo, fechas y tipo de evaluación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="puesto_trabajo_ciuo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Puesto de Trabajo CIUO</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: 815 OPERADOR DE MÁQUINA PARA FABRICAR PRODUCTOS TEXTILES"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fecha_atencion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Atención (aaaa/mm/dd)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="fecha_ingreso_trabajo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Ingreso al trabajo (aaaa/mm/dd)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fecha_reintegro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Reintegro (aaaa/mm/dd)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fecha_ultimo_dia_laboral"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha del Último día laboral/salida (aaaa/mm/dd)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descripcion_motivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción del Motivo de la Historia Clínica</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: APERTURA DE HISTORIA CLÍNICA OCUPACIONAL, REVISIÓN DE RESULTADOS Y CHEQUEO DE SALUD"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo_evaluacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Evaluación</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-wrap gap-6"
                    >
                      {TIPO_EVALUACION_OPTIONS.map((opt) => (
                        <div
                          key={opt.value}
                          className="flex items-center gap-2"
                        >
                          <RadioGroupItem value={opt.value} id={`tipo-${opt.value}`} />
                          <FormLabel
                            htmlFor={`tipo-${opt.value}`}
                            className="cursor-pointer font-normal"
                          >
                            {opt.label}
                          </FormLabel>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observación</FormLabel>
                  <FormControl>
                    <Input placeholder="NINGUNA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onPrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          <Button type="submit" disabled={disabled}>
            {disabled ? 'Guardando...' : isLastStep ? 'Guardar ficha' : 'Siguiente'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  )
}
