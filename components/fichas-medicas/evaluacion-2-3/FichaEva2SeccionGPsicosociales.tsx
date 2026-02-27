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
import type { FichaEva2SeccionGPsicosociales as FichaEva2SeccionGPsicosocialesType } from '@/lib/types/ficha-medica-evaluacion-2'
import { FICHA_EVA2_SECCION_G_PSICOSOCIALES_DEFAULTS } from '@/lib/types/ficha-medica-evaluacion-2'
import {
  FACTORES_PSICOSOCIALES,
  type FactorPsicosocialKey,
} from '@/lib/constants/factores-riesgo-psicosociales'

const factorCamposSchema = z.object({
  campo1: z.string(),
  campo2: z.string(),
  campo3: z.string(),
  campo4: z.string(),
  campo5: z.string(),
  campo6: z.string(),
  campo7: z.string(),
})

const factoresPsicosocialesSchema = z.object({
  monotonia_trabajo: factorCamposSchema,
  sobrecarga_laboral: factorCamposSchema,
  minuciosidad_tarea: factorCamposSchema,
  alta_responsabilidad: factorCamposSchema,
  autonomia_toma_decisiones: factorCamposSchema,
  supervision_estilos_direccion_deficiente: factorCamposSchema,
  conflicto_rol: factorCamposSchema,
  falta_claridad_funciones: factorCamposSchema,
  incorrecta_distribucion_trabajo: factorCamposSchema,
  turnos_rotativos: factorCamposSchema,
  relaciones_interpersonales: factorCamposSchema,
  inestabilidad_laboral: factorCamposSchema,
  amenaza_delincuencial: factorCamposSchema,
  otros_psicosociales: factorCamposSchema,
})

const seccionGPsicosocialesSchema = z.object({
  label_otros: z.string(),
  factores: factoresPsicosocialesSchema,
})

type SeccionGPsicosocialesFormValues = z.infer<typeof seccionGPsicosocialesSchema>

function toFormValues(
  data: Partial<FichaEva2SeccionGPsicosocialesType> | undefined
): SeccionGPsicosocialesFormValues {
  const def = FICHA_EVA2_SECCION_G_PSICOSOCIALES_DEFAULTS
  const factores = { ...def.factores }
  if (!data?.factores) return { label_otros: data?.label_otros ?? def.label_otros ?? 'Otros', factores }
  for (const k of Object.keys(data.factores) as FactorPsicosocialKey[]) {
    if (factores[k]) {
      factores[k] = { ...def.factores[k], ...data.factores[k] }
    }
  }
  return { factores }
}

interface FichaEva2SeccionGPsicosocialesProps {
  defaultValues?: Partial<FichaEva2SeccionGPsicosocialesType>
  onNext: (data: FichaEva2SeccionGPsicosocialesType) => void | Promise<void>
  onPrevious?: () => void
  onPreviousWithData?: (data: Partial<FichaEva2SeccionGPsicosocialesType>) => void
  disabled?: boolean
  isFirstStep?: boolean
  isLastStep?: boolean
}

export function FichaEva2SeccionGPsicosociales({
  defaultValues,
  onNext,
  onPrevious,
  onPreviousWithData,
  disabled = false,
  isFirstStep = false,
  isLastStep = true,
}: FichaEva2SeccionGPsicosocialesProps) {
  const form = useForm<SeccionGPsicosocialesFormValues>({
    resolver: zodResolver(seccionGPsicosocialesSchema),
    defaultValues: toFormValues(defaultValues),
  })

  const handleSubmit = (values: SeccionGPsicosocialesFormValues) => {
    onNext({
      ...values,
      label_otros: values.label_otros || 'Otros',
    } as FichaEva2SeccionGPsicosocialesType)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              G. Factores de Riesgo del Trabajo Actual — PSICOSOCIAL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <p className="text-sm font-medium text-muted-foreground">
                Factores de riesgo psicosociales
              </p>
              {FACTORES_PSICOSOCIALES.map(({ key, label }) => (
                <div key={key} className="space-y-3">
                  {key === 'otros_psicosociales' ? (
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
                  form.getValues() as Partial<FichaEva2SeccionGPsicosocialesType>
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
