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
import type { FichaEva2SeccionGQuimicos as FichaEva2SeccionGQuimicosType } from '@/lib/types/ficha-medica-evaluacion-2'
import { FICHA_EVA2_SECCION_G_QUIMICOS_DEFAULTS } from '@/lib/types/ficha-medica-evaluacion-2'
import {
  FACTORES_QUIMICOS,
  type FactorQuimicoKey,
} from '@/lib/constants/factores-riesgo-quimicos'

const factorCamposSchema = z.object({
  campo1: z.string(),
  campo2: z.string(),
  campo3: z.string(),
  campo4: z.string(),
  campo5: z.string(),
  campo6: z.string(),
  campo7: z.string(),
})

const factoresQuimicosSchema = z.object({
  polvos: factorCamposSchema,
  solidos: factorCamposSchema,
  humos: factorCamposSchema,
  liquidos: factorCamposSchema,
  vapores: factorCamposSchema,
  aerosoles: factorCamposSchema,
  nieblinas: factorCamposSchema,
  gaseosos: factorCamposSchema,
  otros_quimicos: factorCamposSchema,
})

const seccionGQuimicosSchema = z.object({
  factores: factoresQuimicosSchema,
})

type SeccionGQuimicosFormValues = z.infer<typeof seccionGQuimicosSchema>

function toFormValues(
  data: Partial<FichaEva2SeccionGQuimicosType> | undefined
): SeccionGQuimicosFormValues {
  const def = FICHA_EVA2_SECCION_G_QUIMICOS_DEFAULTS
  const factores = { ...def.factores }
  if (!data?.factores) return { label_otros: data?.label_otros ?? def.label_otros ?? 'Otros', factores }
  for (const k of Object.keys(data.factores) as FactorQuimicoKey[]) {
    if (factores[k]) {
      factores[k] = { ...def.factores[k], ...data.factores[k] }
    }
  }
  return {
    label_otros: data.label_otros ?? def.label_otros ?? 'Otros',
    factores,
  }
}

interface FichaEva2SeccionGQuimicosProps {
  defaultValues?: Partial<FichaEva2SeccionGQuimicosType>
  onNext: (data: FichaEva2SeccionGQuimicosType) => void | Promise<void>
  onPrevious?: () => void
  onPreviousWithData?: (data: Partial<FichaEva2SeccionGQuimicosType>) => void
  disabled?: boolean
  isFirstStep?: boolean
  isLastStep?: boolean
}

export function FichaEva2SeccionGQuimicos({
  defaultValues,
  onNext,
  onPrevious,
  onPreviousWithData,
  disabled = false,
  isFirstStep = false,
  isLastStep = true,
}: FichaEva2SeccionGQuimicosProps) {
  const form = useForm<SeccionGQuimicosFormValues>({
    resolver: zodResolver(seccionGQuimicosSchema),
    defaultValues: toFormValues(defaultValues),
  })

  const handleSubmit = (values: SeccionGQuimicosFormValues) => {
    onNext({
      ...values,
      label_otros: values.label_otros || 'Otros',
    } as FichaEva2SeccionGQuimicosType)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              G. Factores de Riesgo del Trabajo Actual — QUÍMICOS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <p className="text-sm font-medium text-muted-foreground">
                Factores de riesgo químicos
              </p>
              {FACTORES_QUIMICOS.map(({ key, label }) => (
                <div key={key} className="space-y-3">
                  {key === 'otros_quimicos' ? (
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
                  form.getValues() as Partial<FichaEva2SeccionGQuimicosType>
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
