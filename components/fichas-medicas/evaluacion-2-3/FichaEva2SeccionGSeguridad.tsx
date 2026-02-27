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
import type { FichaEva2SeccionGSeguridad as FichaEva2SeccionGSeguridadType } from '@/lib/types/ficha-medica-evaluacion-2'
import { FICHA_EVA2_SECCION_G_SEGURIDAD_DEFAULTS } from '@/lib/types/ficha-medica-evaluacion-2'
import {
  FACTORES_SEGURIDAD,
  type FactorSeguridadKey,
} from '@/lib/constants/factores-riesgo-seguridad'

const factorCamposSchema = z.object({
  campo1: z.string(),
  campo2: z.string(),
  campo3: z.string(),
  campo4: z.string(),
  campo5: z.string(),
  campo6: z.string(),
  campo7: z.string(),
})

const factoresSeguridadSchema = z.object({
  falta_senalizacion_aseo_desorden: factorCamposSchema,
  atrapamiento_maquinas_superficies: factorCamposSchema,
  atrapamiento_objetos: factorCamposSchema,
  caida_objetos: factorCamposSchema,
  caidas_mismo_nivel: factorCamposSchema,
  caidas_diferente_nivel: factorCamposSchema,
  pinchazos: factorCamposSchema,
  cortes: factorCamposSchema,
  choques_colision_vehicular: factorCamposSchema,
  atropellamientos_vehiculos: factorCamposSchema,
  proyeccion_fluidos: factorCamposSchema,
  proyeccion_particulas_fragmentos: factorCamposSchema,
  contacto_superficies_trabajo: factorCamposSchema,
  contacto_electrico: factorCamposSchema,
  otros_seguridad: factorCamposSchema,
})

const seccionGSeguridadSchema = z.object({
  label_otros: z.string(),
  factores: factoresSeguridadSchema,
})

type SeccionGSeguridadFormValues = z.infer<typeof seccionGSeguridadSchema>

function toFormValues(
  data: Partial<FichaEva2SeccionGSeguridadType> | undefined
): SeccionGSeguridadFormValues {
  const def = FICHA_EVA2_SECCION_G_SEGURIDAD_DEFAULTS
  const factores = { ...def.factores }
  if (!data?.factores) return { label_otros: data?.label_otros ?? def.label_otros ?? 'Otros', factores }
  for (const k of Object.keys(data.factores) as FactorSeguridadKey[]) {
    if (factores[k]) {
      factores[k] = { ...def.factores[k], ...data.factores[k] }
    }
  }
  return {
    label_otros: data.label_otros ?? def.label_otros ?? 'Otros',
    factores,
  }
}

interface FichaEva2SeccionGSeguridadProps {
  defaultValues?: Partial<FichaEva2SeccionGSeguridadType>
  onNext: (data: FichaEva2SeccionGSeguridadType) => void | Promise<void>
  onPrevious?: () => void
  onPreviousWithData?: (data: Partial<FichaEva2SeccionGSeguridadType>) => void
  disabled?: boolean
  isFirstStep?: boolean
  isLastStep?: boolean
}

const CATEGORIAS_ORDER = ['LOCATIVOS', 'MECÁNICOS', 'ELÉCTRICOS', 'OTROS'] as const

export function FichaEva2SeccionGSeguridad({
  defaultValues,
  onNext,
  onPrevious,
  onPreviousWithData,
  disabled = false,
  isFirstStep = false,
  isLastStep = true,
}: FichaEva2SeccionGSeguridadProps) {
  const form = useForm<SeccionGSeguridadFormValues>({
    resolver: zodResolver(seccionGSeguridadSchema),
    defaultValues: toFormValues(defaultValues),
  })

  const handleSubmit = (values: SeccionGSeguridadFormValues) => {
    onNext({
      ...values,
      label_otros: values.label_otros || 'Otros',
    } as FichaEva2SeccionGSeguridadType)
  }

  const factoresPorCategoria = CATEGORIAS_ORDER.map((cat) => ({
    categoria: cat,
    items: FACTORES_SEGURIDAD.filter((f) => f.categoria === cat),
  }))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              G. Factores de Riesgo del Trabajo Actual — DE SEGURIDAD
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {factoresPorCategoria.map(
              ({ categoria, items }) =>
                items.length > 0 && (
                  <div key={categoria} className="space-y-4">
                    <p className="text-sm font-semibold text-muted-foreground">
                      {categoria}
                    </p>
                    {items.map(({ key, label }) => (
                      <div key={key} className="space-y-3">
                        {key === 'otros_seguridad' ? (
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
                )
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          {!isFirstStep && onPrevious ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onPreviousWithData?.(
                  form.getValues() as Partial<FichaEva2SeccionGSeguridadType>
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
