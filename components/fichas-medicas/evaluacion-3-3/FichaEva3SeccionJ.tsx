'use client'

import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import {
  EXAMENES_DEFAULT,
  type FichaEva3ResultadoExamen,
} from '@/lib/types/ficha-medica-evaluacion-3'

const resultadoSchema = z.object({
  nombre_examen: z.string(),
  fecha: z.string(),
  resultados: z.string(),
})

const seccionJSchema = z.object({
  resultados: z.array(resultadoSchema),
  observaciones: z.string(),
})

type SeccionJFormValues = z.infer<typeof seccionJSchema>

interface FichaEva3SeccionJProps {
  defaultValues?: {
    resultados?: FichaEva3ResultadoExamen[]
    observaciones?: string
  }
  onNext: (data: {
    resultados: FichaEva3ResultadoExamen[]
    observaciones: string
  }) => void | Promise<void>
  onPrevious?: () => void
  disabled?: boolean
  isFirstStep?: boolean
  isLastStep?: boolean
}

export function FichaEva3SeccionJ({
  defaultValues,
  onNext,
  onPrevious,
  disabled = false,
  isFirstStep = false,
  isLastStep = true,
}: FichaEva3SeccionJProps) {
  const initialResultados =
    defaultValues?.resultados?.length
      ? defaultValues.resultados
      : EXAMENES_DEFAULT

  const form = useForm<SeccionJFormValues>({
    resolver: zodResolver(seccionJSchema),
    defaultValues: {
      resultados: initialResultados,
      observaciones: defaultValues?.observaciones ?? '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'resultados',
  })

  const handleSubmit = (values: SeccionJFormValues) => {
    onNext({
      resultados: values.resultados,
      observaciones: values.observaciones,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              J. RESULTADOS DE EXÁMENES GENERALES Y ESPECÍFICOS DE ACUERDO AL
              RIESGO Y PUESTO DE TRABAJO (IMAGEN, LABORATORIO Y OTROS)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_2fr] gap-3 text-sm font-semibold text-foreground">
              <span>NOMBRE DEL EXAMEN</span>
              <span className="text-right">(FECHA) aaaa/mm/dd</span>
              <span>RESULTADOS</span>
            </div>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_2fr] gap-3 items-end"
              >
                <FormField
                  control={form.control}
                  name={`resultados.${index}.nombre_examen`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Nombre del examen</FormLabel>
                      <FormControl>
                        <Input {...f} placeholder="Nombre del examen" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`resultados.${index}.fecha`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Fecha</FormLabel>
                      <FormControl>
                        <Input {...f} placeholder="2024/01/15" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 items-end">
                  <FormField
                    control={form.control}
                    name={`resultados.${index}.resultados`}
                    render={({ field: f }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="sr-only">Resultados</FormLabel>
                        <FormControl>
                          <Input {...f} placeholder="Resultados" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  nombre_examen: '',
                  fecha: '',
                  resultados: '',
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Añadir examen
            </Button>

            <div className="pt-4">
              <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OBSERVACIONES</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        placeholder="Observaciones"
                        className="resize-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          {!isFirstStep && onPrevious ? (
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
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
