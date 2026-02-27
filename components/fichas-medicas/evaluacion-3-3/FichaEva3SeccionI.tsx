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
import {
  FICHA_EVA3_ACTIVIDAD_DEFAULT,
  type FichaEva3ActividadExtra,
} from '@/lib/types/ficha-medica-evaluacion-3'

const actividadSchema = z.object({
  tipo_actividad: z.string(),
  fecha: z.string(),
})

const seccionISchema = z.object({
  actividades: z.array(actividadSchema),
})

type SeccionIFormValues = z.infer<typeof seccionISchema>

interface FichaEva3SeccionIProps {
  defaultValues?: { actividades?: FichaEva3ActividadExtra[] }
  onNext: (data: { actividades: FichaEva3ActividadExtra[] }) => void | Promise<void>
  onPrevious?: () => void
  disabled?: boolean
  isFirstStep?: boolean
  isLastStep?: boolean
}

export function FichaEva3SeccionI({
  defaultValues,
  onNext,
  onPrevious,
  disabled = false,
  isFirstStep = false,
  isLastStep = true,
}: FichaEva3SeccionIProps) {
  const initialActividades =
    defaultValues?.actividades?.length
      ? defaultValues.actividades
      : [{ ...FICHA_EVA3_ACTIVIDAD_DEFAULT }]

  const form = useForm<SeccionIFormValues>({
    resolver: zodResolver(seccionISchema),
    defaultValues: { actividades: initialActividades },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'actividades',
  })

  const handleSubmit = (values: SeccionIFormValues) => {
    onNext({ actividades: values.actividades })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              I. ACTIVIDADES EXTRA LABORALES
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Tipo de actividad y fecha
            </p>
          </CardHeader>
          <CardContent className="space-y-4 overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-3 text-sm font-semibold text-foreground">
              <span>TIPO DE ACTIVIDAD</span>
              <span className="text-right">(FECHA) aaaa/mm/dd</span>
            </div>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-3 items-end"
              >
                <FormField
                  control={form.control}
                  name={`actividades.${index}.tipo_actividad`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="sr-only">
                        Tipo de actividad
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...f}
                          placeholder="Descripción"
                          className="flex-1"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 items-end">
                  <FormField
                    control={form.control}
                    name={`actividades.${index}.fecha`}
                    render={({ field: f }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="sr-only">Fecha</FormLabel>
                        <FormControl>
                          <Input {...f} placeholder="2024/01/15" />
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
              onClick={() => append({ ...FICHA_EVA3_ACTIVIDAD_DEFAULT })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Añadir actividad
            </Button>
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
