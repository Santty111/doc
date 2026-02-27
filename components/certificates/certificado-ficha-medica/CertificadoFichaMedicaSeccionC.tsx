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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CertificadoFichaMedicaSeccionC } from '@/lib/types/certificado-ficha-medica'
import { CERTIFICADO_FICHA_MEDICA_SECCION_C_DEFAULTS } from '@/lib/types/certificado-ficha-medica'

const APTITUD_OPTIONS: { value: CertificadoFichaMedicaSeccionC['concepto_aptitud']; label: string }[] = [
  { value: 'apto', label: 'APTO' },
  { value: 'apto_en_observacion', label: 'APTO EN OBSERVACIÓN' },
  { value: 'apto_con_limitaciones', label: 'APTO CON LIMITACIONES' },
  { value: 'no_apto', label: 'NO APTO' },
]

const schema = z.object({
  concepto_aptitud: z.enum(['apto', 'apto_en_observacion', 'apto_con_limitaciones', 'no_apto']),
  detalle_observaciones: z.string(),
})

type FormValues = z.infer<typeof schema>

interface CertificadoFichaMedicaSeccionCProps {
  defaultValues?: Partial<CertificadoFichaMedicaSeccionC>
  onPrevious: () => void
  onNext: (data: CertificadoFichaMedicaSeccionC) => void | Promise<void>
  disabled?: boolean
  isLastStep?: boolean
}

export function CertificadoFichaMedicaSeccionC({
  defaultValues,
  onPrevious,
  onNext,
  disabled = false,
  isLastStep = true,
}: CertificadoFichaMedicaSeccionCProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      concepto_aptitud: defaultValues?.concepto_aptitud ?? CERTIFICADO_FICHA_MEDICA_SECCION_C_DEFAULTS.concepto_aptitud,
      detalle_observaciones: defaultValues?.detalle_observaciones ?? CERTIFICADO_FICHA_MEDICA_SECCION_C_DEFAULTS.detalle_observaciones,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => onNext(v))} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>C. Aptitud Médica para el Trabajo</CardTitle>
            <CardDescription>
              Después de la valoración médica ocupacional se certifica que la persona en mención, es calificada como:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="concepto_aptitud"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aptitud</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {APTITUD_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="detalle_observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalle de observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalle las observaciones..."
                      className="min-h-[80px]"
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
          <Button type="button" variant="outline" onClick={onPrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          <Button type="submit" disabled={disabled}>
            {disabled ? 'Guardando...' : isLastStep ? 'Guardar certificado' : 'Siguiente'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  )
}
