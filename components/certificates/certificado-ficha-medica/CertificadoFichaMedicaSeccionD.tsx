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
import type { CertificadoFichaMedicaSeccionD } from '@/lib/types/certificado-ficha-medica'
import { CERTIFICADO_FICHA_MEDICA_SECCION_D_DEFAULTS } from '@/lib/types/certificado-ficha-medica'

const schema = z.object({
  descripcion: z.string(),
  observacion: z.string(),
})

type FormValues = z.infer<typeof schema>

interface CertificadoFichaMedicaSeccionDProps {
  defaultValues?: Partial<CertificadoFichaMedicaSeccionD>
  onPrevious: () => void
  onNext: (data: CertificadoFichaMedicaSeccionD) => void | Promise<void>
  disabled?: boolean
  isLastStep?: boolean
}

export function CertificadoFichaMedicaSeccionD({
  defaultValues,
  onPrevious,
  onNext,
  disabled = false,
  isLastStep = true,
}: CertificadoFichaMedicaSeccionDProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      descripcion: defaultValues?.descripcion ?? CERTIFICADO_FICHA_MEDICA_SECCION_D_DEFAULTS.descripcion,
      observacion: defaultValues?.observacion ?? CERTIFICADO_FICHA_MEDICA_SECCION_D_DEFAULTS.observacion,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => onNext(v))} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>D. Recomendaciones / Observaciones</CardTitle>
            <CardDescription>
              Descripción y observaciones del certificado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Recomendaciones o descripción..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="observacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observación</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observaciones adicionales..."
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
