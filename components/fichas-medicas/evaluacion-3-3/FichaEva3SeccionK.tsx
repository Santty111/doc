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
import { Checkbox } from '@/components/ui/checkbox'
import {
  FICHA_EVA3_DIAGNOSTICO_DEFAULT,
  type FichaEva3Diagnostico,
} from '@/lib/types/ficha-medica-evaluacion-3'

const diagnosticoSchema = z.object({
  cie10: z.string(),
  descripcion: z.string(),
  presuntivo: z.boolean(),
  definitivo: z.boolean(),
})

const seccionKSchema = z.object({
  diagnosticos: z.array(diagnosticoSchema),
})

type SeccionKFormValues = z.infer<typeof seccionKSchema>

const INITIAL_DIAGNOSTICOS: FichaEva3Diagnostico[] = Array(6).fill(null).map(() => ({
  ...FICHA_EVA3_DIAGNOSTICO_DEFAULT,
}))

interface FichaEva3SeccionKProps {
  defaultValues?: { diagnosticos?: FichaEva3Diagnostico[] }
  onNext: (data: { diagnosticos: FichaEva3Diagnostico[] }) => void | Promise<void>
  onPrevious?: () => void
  disabled?: boolean
  isFirstStep?: boolean
  isLastStep?: boolean
}

export function FichaEva3SeccionK({
  defaultValues,
  onNext,
  onPrevious,
  disabled = false,
  isFirstStep = false,
  isLastStep = true,
}: FichaEva3SeccionKProps) {
  const initialDiagnosticos =
    defaultValues?.diagnosticos?.length
      ? defaultValues.diagnosticos
      : INITIAL_DIAGNOSTICOS

  const form = useForm<SeccionKFormValues>({
    resolver: zodResolver(seccionKSchema),
    defaultValues: { diagnosticos: initialDiagnosticos },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'diagnosticos',
  })

  const handleSubmit = (values: SeccionKFormValues) => {
    onNext({ diagnosticos: values.diagnosticos })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-lg">K. DIAGNÓSTICO</CardTitle>
              <span className="text-sm text-muted-foreground">
                PRE: PRESUNTIVO &nbsp; DEF: DEFINITIVO
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 overflow-x-auto">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_60px_60px] gap-3 text-sm font-semibold text-foreground items-center">
              <span>CIE-10</span>
              <span>Descripción</span>
              <span className="text-center">PRE</span>
              <span className="text-center">DEF</span>
            </div>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-[40px_minmax(0,1fr)_minmax(0,2fr)_60px_60px] gap-3 items-center"
              >
                <span className="text-sm text-muted-foreground">{index + 1}</span>
                <FormField
                  control={form.control}
                  name={`diagnosticos.${index}.cie10`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="sr-only">CIE-10</FormLabel>
                      <FormControl>
                        <Input {...f} placeholder="Código" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`diagnosticos.${index}.descripcion`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Descripción</FormLabel>
                      <FormControl>
                        <Input {...f} placeholder="Descripción del diagnóstico" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`diagnosticos.${index}.presuntivo`}
                  render={({ field: f }) => (
                    <FormItem className="flex justify-center">
                      <FormControl>
                        <Checkbox
                          checked={f.value}
                          onCheckedChange={f.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`diagnosticos.${index}.definitivo`}
                  render={({ field: f }) => (
                    <FormItem className="flex justify-center">
                      <FormControl>
                        <Checkbox
                          checked={f.value}
                          onCheckedChange={f.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ ...FICHA_EVA3_DIAGNOSTICO_DEFAULT })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Añadir diagnóstico
              </Button>
              {fields.length > 6 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(fields.length - 1)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Quitar último
                </Button>
              )}
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
