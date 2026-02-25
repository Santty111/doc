'use client'

import React, { useEffect } from 'react'
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
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { FichaEva1SeccionE } from '@/lib/types/ficha-medica-evaluacion-1'
import { FICHA_EVA1_SECCION_E_DEFAULTS } from '@/lib/types/ficha-medica-evaluacion-1'

const numSchema = z.preprocess(
  (v) => (v === '' || v === undefined ? null : Number(v)),
  z.number().nullable()
)

const seccionESchema = z.object({
  temperatura: numSchema,
  presion_arterial: z.string(),
  frecuencia_cardiaca: numSchema,
  frecuencia_respiratoria: numSchema,
  saturacion_oxigeno: numSchema,
  peso: numSchema,
  talla: numSchema,
  imc: numSchema,
  perimetro_abdominal: numSchema,
})

type SeccionEFormValues = z.infer<typeof seccionESchema>

function toFormValues(data: Partial<FichaEva1SeccionE> | undefined): SeccionEFormValues {
  const def = FICHA_EVA1_SECCION_E_DEFAULTS
  if (!data) return def
  return { ...def, ...data }
}

interface FichaEva1SeccionEProps {
  defaultValues?: Partial<FichaEva1SeccionE>
  onNext: (data: FichaEva1SeccionE) => void | Promise<void>
  onPrevious: () => void
  onPreviousWithData?: (data: Partial<FichaEva1SeccionE>) => void
  disabled?: boolean
  /** Si false, muestra "Siguiente" en vez de "Guardar ficha" */
  isLastStep?: boolean
}

function calcIMC(peso: number | null, talla: number | null): number | null {
  if (peso == null || talla == null || talla <= 0) return null
  const tallaM = talla / 100
  const imc = peso / (tallaM * tallaM)
  return Math.round(imc * 10) / 10
}

export function FichaEva1SeccionE({
  defaultValues,
  onNext,
  onPrevious,
  onPreviousWithData,
  disabled = false,
  isLastStep = true,
}: FichaEva1SeccionEProps) {
  const form = useForm<SeccionEFormValues>({
    resolver: zodResolver(seccionESchema),
    defaultValues: toFormValues(defaultValues),
  })

  const peso = form.watch('peso')
  const talla = form.watch('talla')

  useEffect(() => {
    const imc = calcIMC(peso, talla)
    if (imc != null) {
      form.setValue('imc', imc)
    }
  }, [peso, talla])

  const handleSubmit = (values: SeccionEFormValues) => {
    onNext(values as FichaEva1SeccionE)
  }

  const numField = (name: keyof SeccionEFormValues, label: string, placeholder: string, unit?: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{unit ? ` (${unit})` : ''}</FormLabel>
          <FormControl>
            <Input
              type="number"
              step={name === 'temperatura' || name === 'imc' ? 0.1 : 1}
              min={0}
              placeholder={placeholder}
              {...field}
              value={field.value ?? ''}
              onChange={(e) => {
                const v = e.target.value
                field.onChange(v === '' ? null : parseFloat(v) || null)
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>E. Constantes Vitales y Antropometría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {numField('temperatura', 'Temperatura', 'Ej: 36.5', '°C')}
              <FormField
                control={form.control}
                name="presion_arterial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presión arterial (mmHg)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 120/80" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {numField('frecuencia_cardiaca', 'Frecuencia cardíaca', 'Ej: 72', 'Lat/min')}
              {numField('frecuencia_respiratoria', 'Frecuencia respiratoria', 'Ej: 16', 'fr/min')}
              {numField('saturacion_oxigeno', 'Saturación de oxígeno', 'Ej: 98', 'O2%')}
              {numField('peso', 'Peso', 'Ej: 70', 'Kg')}
              {numField('talla', 'Talla', 'Ej: 170', 'cm')}
              {numField('imc', 'Índice de masa corporal', 'Se calcula automático', 'kg/m²')}
              {numField('perimetro_abdominal', 'Perímetro abdominal', 'Ej: 85', 'cm')}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onPreviousWithData?.(form.getValues())
              onPrevious()
            }}
          >
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
