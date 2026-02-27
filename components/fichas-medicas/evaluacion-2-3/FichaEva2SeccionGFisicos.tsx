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
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { FichaEva2SeccionGFisicos as FichaEva2SeccionGFisicosType } from '@/lib/types/ficha-medica-evaluacion-2'
import { FICHA_EVA2_SECCION_G_FISICOS_DEFAULTS } from '@/lib/types/ficha-medica-evaluacion-2'
import { FACTORES_FISICOS, type FactorFisicoKey } from '@/lib/constants/factores-riesgo-fisicos'

const factorCamposSchema = z.object({
  campo1: z.string(),
  campo2: z.string(),
  campo3: z.string(),
  campo4: z.string(),
  campo5: z.string(),
  campo6: z.string(),
  campo7: z.string(),
})

const factoresSchema = z.object({
  temperaturas_altas: factorCamposSchema,
  temperaturas_bajas: factorCamposSchema,
  radiacion_ionizante: factorCamposSchema,
  radiacion_no_ionizante: factorCamposSchema,
  ruido: factorCamposSchema,
  vibracion: factorCamposSchema,
  iluminacion: factorCamposSchema,
  ventilacion: factorCamposSchema,
  fluido_electrico: factorCamposSchema,
  otros: factorCamposSchema,
})

const seccionGFisicosSchema = z.object({
  puesto_trabajo: z.string(),
  actividades_importantes: z.string(),
  label_otros: z.string(),
  factores: factoresSchema,
})

type SeccionGFisicosFormValues = z.infer<typeof seccionGFisicosSchema>

function toFormValues(
  data: Partial<FichaEva2SeccionGFisicosType> | undefined
): SeccionGFisicosFormValues {
  const def = FICHA_EVA2_SECCION_G_FISICOS_DEFAULTS
  if (!data) return def
  const factores = { ...def.factores }
  if (data.factores) {
    for (const k of Object.keys(data.factores) as FactorFisicoKey[]) {
      if (factores[k]) {
        factores[k] = { ...def.factores[k], ...data.factores[k] }
      }
    }
  }
  return {
    puesto_trabajo: data.puesto_trabajo ?? def.puesto_trabajo,
    actividades_importantes: data.actividades_importantes ?? def.actividades_importantes,
    label_otros: data.label_otros ?? def.label_otros ?? 'Otros',
    factores,
  }
}

interface FichaEva2SeccionGFisicosProps {
  defaultValues?: Partial<FichaEva2SeccionGFisicosType>
  onNext: (data: FichaEva2SeccionGFisicosType) => void | Promise<void>
  onPrevious?: () => void
  onPreviousWithData?: (data: Partial<FichaEva2SeccionGFisicosType>) => void
  disabled?: boolean
  isFirstStep?: boolean
  /** Si false, muestra "Siguiente" en vez de "Guardar ficha" */
  isLastStep?: boolean
}

export function FichaEva2SeccionGFisicos({
  defaultValues,
  onNext,
  onPrevious,
  onPreviousWithData,
  disabled = false,
  isFirstStep = true,
  isLastStep = false,
}: FichaEva2SeccionGFisicosProps) {
  const form = useForm<SeccionGFisicosFormValues>({
    resolver: zodResolver(seccionGFisicosSchema),
    defaultValues: toFormValues(defaultValues),
  })

  const handleSubmit = (values: SeccionGFisicosFormValues) => {
    onNext({
      ...values,
      actividades_importantes: '',
      label_otros: values.label_otros || 'Otros',
    } as FichaEva2SeccionGFisicosType)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              G. Factores de Riesgo del Trabajo Actual — FÍSICOS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="puesto_trabajo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Puesto de trabajo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Puesto según CIUO" />
                  </FormControl>
                </FormItem>
              )}
            />
            <p className="text-sm font-medium text-muted-foreground">
              Actividades importantes dentro de la jornada laboral
            </p>

            <div className="space-y-6">
              <p className="text-sm font-medium text-muted-foreground">
                Factores de riesgo físicos
              </p>
              {FACTORES_FISICOS.map(({ key, label }) => (
                <div key={key} className="space-y-3">
                  {key === 'otros' ? (
                    <FormField
                      control={form.control}
                      name="label_otros"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Otros (especifique si aplica)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Otros" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormLabel className="text-base">{label}</FormLabel>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
                    {([1, 2, 3, 4, 5, 6, 7] as const).map((n) => (
                      <FormField
                        key={n}
                        control={form.control}
                        name={`factores.${key}.campo${n}` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">
                              Campo {n}
                            </FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          {!isFirstStep && onPrevious ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onPreviousWithData?.(form.getValues() as Partial<FichaEva2SeccionGFisicosType>)
                onPrevious()
              }}
              disabled={disabled}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
          ) : (
            <div />
          )}
          <Button type="submit" disabled={disabled}>
            {isLastStep ? 'Guardar ficha' : 'Siguiente'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  )
}
