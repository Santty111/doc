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
import type { FichaEva2SeccionGBiologicos as FichaEva2SeccionGBiologicosType } from '@/lib/types/ficha-medica-evaluacion-2'
import { FICHA_EVA2_SECCION_G_BIOLOGICOS_DEFAULTS } from '@/lib/types/ficha-medica-evaluacion-2'
import {
  FACTORES_BIOLOGICOS,
  type FactorBiologicoKey,
} from '@/lib/constants/factores-riesgo-biologicos'

const factorCamposSchema = z.object({
  campo1: z.string(),
  campo2: z.string(),
  campo3: z.string(),
  campo4: z.string(),
  campo5: z.string(),
  campo6: z.string(),
  campo7: z.string(),
})

const factoresBiologicosSchema = z.object({
  virus: factorCamposSchema,
  hongos: factorCamposSchema,
  bacterias: factorCamposSchema,
  parasitos: factorCamposSchema,
  exposicion_vectores: factorCamposSchema,
  exposicion_animales_selvaticos: factorCamposSchema,
  otros_biologicos: factorCamposSchema,
})

const seccionGBiologicosSchema = z.object({
  label_otros: z.string(),
  factores: factoresBiologicosSchema,
})

type SeccionGBiologicosFormValues = z.infer<typeof seccionGBiologicosSchema>

function toFormValues(
  data: Partial<FichaEva2SeccionGBiologicosType> | undefined
): SeccionGBiologicosFormValues {
  const def = FICHA_EVA2_SECCION_G_BIOLOGICOS_DEFAULTS
  const factores = { ...def.factores }
  if (!data?.factores) return { label_otros: data?.label_otros ?? def.label_otros ?? 'Otros', factores }
  for (const k of Object.keys(data.factores) as FactorBiologicoKey[]) {
    if (factores[k]) {
      factores[k] = { ...def.factores[k], ...data.factores[k] }
    }
  }
  return {
    label_otros: data.label_otros ?? def.label_otros ?? 'Otros',
    factores,
  }
}

interface FichaEva2SeccionGBiologicosProps {
  defaultValues?: Partial<FichaEva2SeccionGBiologicosType>
  onNext: (data: FichaEva2SeccionGBiologicosType) => void | Promise<void>
  onPrevious?: () => void
  onPreviousWithData?: (data: Partial<FichaEva2SeccionGBiologicosType>) => void
  disabled?: boolean
  isFirstStep?: boolean
  isLastStep?: boolean
}

export function FichaEva2SeccionGBiologicos({
  defaultValues,
  onNext,
  onPrevious,
  onPreviousWithData,
  disabled = false,
  isFirstStep = false,
  isLastStep = true,
}: FichaEva2SeccionGBiologicosProps) {
  const form = useForm<SeccionGBiologicosFormValues>({
    resolver: zodResolver(seccionGBiologicosSchema),
    defaultValues: toFormValues(defaultValues),
  })

  const handleSubmit = (values: SeccionGBiologicosFormValues) => {
    onNext({
      ...values,
      label_otros: values.label_otros || 'Otros',
    } as FichaEva2SeccionGBiologicosType)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              G. Factores de Riesgo del Trabajo Actual — BIOLÓGICOS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <p className="text-sm font-medium text-muted-foreground">
                Factores de riesgo biológicos
              </p>
              {FACTORES_BIOLOGICOS.map(({ key, label }) => (
                <div key={key} className="space-y-3">
                  {key === 'otros_biologicos' ? (
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
                onPreviousWithData?.(
                  form.getValues() as Partial<FichaEva2SeccionGBiologicosType>
                )
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
