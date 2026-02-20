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
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { CertificadoAptitudSeccionC } from '@/lib/types/certificado-aptitud'

const APTITUD_OPTIONS = [
  { value: 'apto' as const, label: 'Apto' },
  { value: 'apto_en_observacion' as const, label: 'Apto en observación' },
  { value: 'apto_con_limitaciones' as const, label: 'Apto con limitaciones' },
  { value: 'no_apto' as const, label: 'No apto' },
] as const

const seccionCSchema = z.object({
  concepto_aptitud: z.enum([
    'apto',
    'apto_en_observacion',
    'apto_con_limitaciones',
    'no_apto',
  ]),
  detalle_observaciones: z.string(),
})

type SeccionCFormValues = z.infer<typeof seccionCSchema>

interface CertificadoSeccionCProps {
  defaultValues?: Partial<CertificadoAptitudSeccionC>
  onNext: (data: CertificadoAptitudSeccionC) => void
  onPrevious?: () => void
}

export function CertificadoSeccionC({
  defaultValues,
  onNext,
  onPrevious,
}: CertificadoSeccionCProps) {
  const form = useForm<SeccionCFormValues>({
    resolver: zodResolver(seccionCSchema),
    defaultValues: {
      concepto_aptitud: defaultValues?.concepto_aptitud ?? 'apto_en_observacion',
      detalle_observaciones:
        defaultValues?.detalle_observaciones ?? '',
    },
  })

  const handleSubmit = (values: SeccionCFormValues) => {
    onNext({
      concepto_aptitud: values.concepto_aptitud,
      detalle_observaciones: values.detalle_observaciones,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>C. Concepto para aptitud laboral</CardTitle>
            <CardDescription>
              Calificación de aptitud tras la valoración médica ocupacional
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-sm">
              Después de la valoración médica ocupacional se certifica que la
              persona en mención, es calificada como:
            </p>

            {/* Opciones de aptitud */}
            <FormField
              control={form.control}
              name="concepto_aptitud"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid gap-3 sm:grid-cols-2"
                    >
                      {APTITUD_OPTIONS.map((opt) => (
                        <div
                          key={opt.value}
                          className="flex items-center gap-2"
                        >
                          <RadioGroupItem value={opt.value} id={opt.value} />
                          <FormLabel
                            htmlFor={opt.value}
                            className="cursor-pointer font-normal"
                          >
                            {opt.label}
                          </FormLabel>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Detalle de observaciones */}
            <FormField
              control={form.control}
              name="detalle_observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalle de observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: Una vez revisados los exámenes ocupacionales y realizada la anamnesis del paciente se decide concluir con certificado de aptitud favorable"
                      className="min-h-[120px] resize-y"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between">
          {onPrevious ? (
            <Button type="button" variant="outline" onClick={onPrevious}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
          ) : (
            <div />
          )}
          <Button type="submit">
            Siguiente
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  )
}
