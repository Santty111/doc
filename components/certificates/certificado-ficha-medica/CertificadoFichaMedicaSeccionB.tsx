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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CertificadoFichaMedicaSeccionB } from '@/lib/types/certificado-ficha-medica'
import { CERTIFICADO_FICHA_MEDICA_SECCION_B_DEFAULTS } from '@/lib/types/certificado-ficha-medica'

const schema = z.object({
  fecha_emision: z.string().min(1, 'Requerido'),
  evaluacion: z.enum(['ingreso', 'periodico', 'reintegro', 'retiro']),
})

type FormValues = z.infer<typeof schema>

interface CertificadoFichaMedicaSeccionBProps {
  defaultValues?: Partial<CertificadoFichaMedicaSeccionB>
  onPrevious: () => void
  onNext: (data: CertificadoFichaMedicaSeccionB) => void | Promise<void>
  disabled?: boolean
  isLastStep?: boolean
}

export function CertificadoFichaMedicaSeccionB({
  defaultValues,
  onPrevious,
  onNext,
  disabled = false,
  isLastStep = true,
}: CertificadoFichaMedicaSeccionBProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fecha_emision: defaultValues?.fecha_emision ?? CERTIFICADO_FICHA_MEDICA_SECCION_B_DEFAULTS.fecha_emision,
      evaluacion: defaultValues?.evaluacion ?? CERTIFICADO_FICHA_MEDICA_SECCION_B_DEFAULTS.evaluacion,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => onNext(v))} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>B. Datos Generales</CardTitle>
            <CardDescription>
              Fecha de emisión y tipo de evaluación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="fecha_emision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de emisión</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="evaluacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evaluación</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ingreso">INGRESO</SelectItem>
                      <SelectItem value="periodico">PERIÓDICO</SelectItem>
                      <SelectItem value="reintegro">REINTEGRO</SelectItem>
                      <SelectItem value="retiro">RETIRO</SelectItem>
                    </SelectContent>
                  </Select>
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
