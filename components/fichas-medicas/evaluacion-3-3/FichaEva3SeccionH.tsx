'use client'

import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, Plus, Trash2 } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import {
  FICHA_EVA3_ANTECEDENTE_DEFAULT,
  type FichaEva3AntecedenteEmpleo,
} from '@/lib/types/ficha-medica-evaluacion-3'

const antecedenteSchema = z.object({
  centro_trabajo: z.string(),
  actividades_desempenadas: z.string(),
  trabajo_anterior: z.boolean(),
  trabajo_actual: z.boolean(),
  tiempo_trabajo: z.string(),
  incidente: z.boolean(),
  accidente: z.boolean(),
  enfermedad_profesional: z.boolean(),
  calificado_si: z.boolean(),
  calificado_no: z.boolean(),
  calificado_fecha: z.string(),
  calificado_especificar: z.string(),
  observaciones: z.string(),
})

const seccionHSchema = z.object({
  antecedentes: z.array(antecedenteSchema),
})

type SeccionHFormValues = z.infer<typeof seccionHSchema>

interface FichaEva3SeccionHProps {
  defaultValues?: { antecedentes?: FichaEva3AntecedenteEmpleo[] }
  onNext: (data: { antecedentes: FichaEva3AntecedenteEmpleo[] }) => void | Promise<void>
  disabled?: boolean
  isFirstStep?: boolean
  isLastStep?: boolean
}

export function FichaEva3SeccionH({
  defaultValues,
  onNext,
  disabled = false,
  isFirstStep = true,
  isLastStep = true,
}: FichaEva3SeccionHProps) {
  const initialAntecedentes =
    defaultValues?.antecedentes?.length
      ? defaultValues.antecedentes
      : [{ ...FICHA_EVA3_ANTECEDENTE_DEFAULT }]

  const form = useForm<SeccionHFormValues>({
    resolver: zodResolver(seccionHSchema),
    defaultValues: { antecedentes: initialAntecedentes },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'antecedentes',
  })

  const handleSubmit = (values: SeccionHFormValues) => {
    onNext({ antecedentes: values.antecedentes })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              H. ACTIVIDAD LABORAL / INCIDENTES / ACCIDENTES / ENFERMEDADES
              OCUPACIONALES
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Antecedentes de empleos anteriores y/o trabajo actual
            </p>
          </CardHeader>
          <CardContent className="space-y-4 overflow-x-auto">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-3 rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Registro {index + 1}</span>
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
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`antecedentes.${index}.centro_trabajo`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>Centro de trabajo</FormLabel>
                        <FormControl>
                          <Input {...f} placeholder="Centro de trabajo" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`antecedentes.${index}.actividades_desempenadas`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>Actividades que desempeñaba</FormLabel>
                        <FormControl>
                          <Input {...f} placeholder="Actividades" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  TRABAJO
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name={`antecedentes.${index}.trabajo_anterior`}
                    render={({ field: f }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={f.value}
                            onCheckedChange={f.onChange}
                          />
                        </FormControl>
                        <FormLabel>Trabajo anterior</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`antecedentes.${index}.trabajo_actual`}
                    render={({ field: f }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={f.value}
                            onCheckedChange={f.onChange}
                          />
                        </FormControl>
                        <FormLabel>Trabajo actual</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`antecedentes.${index}.tiempo_trabajo`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>Tiempo de trabajo</FormLabel>
                        <FormControl>
                          <Input {...f} placeholder="Ej: 2 años" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  De los Accidentes de Trabajo y las Enfermedades Profesionales
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name={`antecedentes.${index}.incidente`}
                    render={({ field: f }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={f.value}
                            onCheckedChange={f.onChange}
                          />
                        </FormControl>
                        <FormLabel>Incidente</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`antecedentes.${index}.accidente`}
                    render={({ field: f }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={f.value}
                            onCheckedChange={f.onChange}
                          />
                        </FormControl>
                        <FormLabel>Accidente</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`antecedentes.${index}.enfermedad_profesional`}
                    render={({ field: f }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={f.value}
                            onCheckedChange={f.onChange}
                          />
                        </FormControl>
                        <FormLabel>Enfermedad profesional</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  CALIFICADO POR INSTITUTO ECUATORIANO DE SEGURIDAD SOCIAL
                </p>
                <div className="grid gap-3 sm:grid-cols-4">
                  <FormField
                    control={form.control}
                    name={`antecedentes.${index}.calificado_si`}
                    render={({ field: f }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={f.value}
                            onCheckedChange={f.onChange}
                          />
                        </FormControl>
                        <FormLabel>Calificado SI (IESS)</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`antecedentes.${index}.calificado_no`}
                    render={({ field: f }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={f.value}
                            onCheckedChange={f.onChange}
                          />
                        </FormControl>
                        <FormLabel>Calificado NO (IESS)</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`antecedentes.${index}.calificado_fecha`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>Fecha (aaaa/mm/dd)</FormLabel>
                        <FormControl>
                          <Input {...f} placeholder="2024/01/15" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`antecedentes.${index}.calificado_especificar`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>Especificar</FormLabel>
                        <FormControl>
                          <Input {...f} placeholder="Detalles" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`antecedentes.${index}.observaciones`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Observaciones</FormLabel>
                      <FormControl>
                        <Textarea {...f} rows={2} placeholder="Observaciones" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ ...FICHA_EVA3_ANTECEDENTE_DEFAULT })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Añadir otro empleo
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={disabled}>
            {isLastStep ? 'Guardar ficha' : 'Siguiente'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  )
}
