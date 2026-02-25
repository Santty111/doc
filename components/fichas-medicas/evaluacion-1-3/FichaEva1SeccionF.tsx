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
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import type { FichaEva1SeccionF } from '@/lib/types/ficha-medica-evaluacion-1'
import { FICHA_EVA1_SECCION_F_DEFAULTS } from '@/lib/types/ficha-medica-evaluacion-1'
import { REGIONES_EXAMEN_FISICO_CONFIG } from '@/lib/constants/examen-fisico-regional'

const regionesSchema = z.object({
  piel: z.object({ cicatrices: z.boolean(), piel_faneras: z.boolean() }),
  ojos: z.object({
    parpados: z.boolean(),
    conjuntivas: z.boolean(),
    pupilas: z.boolean(),
    cornea: z.boolean(),
    motilidad: z.boolean(),
  }),
  oido: z.object({
    canal_auditivo_externo: z.boolean(),
    pabellon: z.boolean(),
    timpanos: z.boolean(),
  }),
  orofaringe: z.object({
    labios: z.boolean(),
    lengua: z.boolean(),
    faringe: z.boolean(),
    amigdalas: z.boolean(),
    dentadura: z.boolean(),
  }),
  nariz: z.object({
    tabique: z.boolean(),
    cornetes: z.boolean(),
    mucosas: z.boolean(),
    senos: z.boolean(),
  }),
  cuello: z.object({ tiroides_masas: z.boolean(), movilidad: z.boolean() }),
  torax_mamas: z.object({ mamas: z.boolean() }),
  torax: z.object({
    pulmones: z.boolean(),
    corazon: z.boolean(),
    parrilla_costal: z.boolean(),
  }),
  abdomen: z.object({
    visceras: z.boolean(),
    pared_abdominal: z.boolean(),
  }),
  columna: z.object({
    flexibilidad: z.boolean(),
    desviacion: z.boolean(),
    dolor: z.boolean(),
  }),
  pelvis: z.object({ pelvis: z.boolean(), genitales: z.boolean() }),
  extremidades: z.object({
    vascular: z.boolean(),
    miembros_superiores: z.boolean(),
    miembros_inferiores: z.boolean(),
  }),
  neurologico: z.object({
    fuerza: z.boolean(),
    sensibilidad: z.boolean(),
    marcha: z.boolean(),
    reflejos: z.boolean(),
  }),
})

const seccionFSchema = z.object({
  regiones: regionesSchema,
  descripcion_patologias: z.string(),
  observacion: z.string(),
})

type SeccionFFormValues = z.infer<typeof seccionFSchema>

function toFormValues(data: Partial<FichaEva1SeccionF> | undefined): SeccionFFormValues {
  const def = FICHA_EVA1_SECCION_F_DEFAULTS
  if (!data?.regiones) return def
  const regiones = {} as SeccionFFormValues['regiones']
  for (const k of Object.keys(def.regiones) as (keyof typeof def.regiones)[]) {
    regiones[k] = { ...def.regiones[k], ...(data.regiones?.[k] ?? {}) }
  }
  return {
    regiones,
    descripcion_patologias: data.descripcion_patologias ?? def.descripcion_patologias,
    observacion: data.observacion ?? def.observacion,
  }
}

interface FichaEva1SeccionFProps {
  defaultValues?: Partial<FichaEva1SeccionF>
  onNext: (data: FichaEva1SeccionF) => void | Promise<void>
  onPrevious: () => void
  onPreviousWithData?: (data: Partial<FichaEva1SeccionF>) => void
  disabled?: boolean
}

export function FichaEva1SeccionF({
  defaultValues,
  onNext,
  onPrevious,
  onPreviousWithData,
  disabled = false,
}: FichaEva1SeccionFProps) {
  const form = useForm<SeccionFFormValues>({
    resolver: zodResolver(seccionFSchema),
    defaultValues: toFormValues(defaultValues),
  })

  const handleSubmit = (values: SeccionFFormValues) => {
    onNext(values as FichaEva1SeccionF)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>F. Examen Físico Regional</CardTitle>
            <p className="text-sm text-muted-foreground">
              Si existe evidencia de patología marcar con &quot;X&quot; y describir en la siguiente
              sección colocando el numeral.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="w-16 px-3 py-2 text-center font-medium">Nº</th>
                    <th className="w-12 px-2 py-2 text-center font-medium">Letra</th>
                    <th className="px-4 py-2 text-left font-medium">REGIONES</th>
                    <th className="w-24 px-4 py-2 text-center font-medium">Patología</th>
                  </tr>
                </thead>
                <tbody>
                  {REGIONES_EXAMEN_FISICO_CONFIG.map(({ key: regionKey, numero, nombre, items }) =>
                    items.map((item) => (
                      <tr key={`${regionKey}-${String(item.key)}`} className="border-b">
                        <td className="px-3 py-2 text-center font-medium">
                          {numero}
                        </td>
                        <td className="px-2 py-2 text-center font-medium">
                          {item.letra}.
                        </td>
                        <td className="px-4 py-2">
                          {nombre} — {item.descripcion}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <FormField
                            control={form.control}
                            name={`regiones.${regionKey}.${item.key}`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-label={`Patología ${numero}${item.letra} ${item.descripcion}`}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div>
              <FormField
                control={form.control}
                name="descripcion_patologias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción de patologías (indicar numeral)</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        placeholder="Describir hallazgos patológicos según el numeral..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observación</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Observaciones generales..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
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
            {disabled ? 'Guardando...' : 'Guardar ficha'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  )
}
