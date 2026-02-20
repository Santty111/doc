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
import type { CertificadoAptitudSeccionE } from '@/lib/types/certificado-aptitud'

const seccionESchema = z.object({
  recomendaciones: z.string(),
})

type SeccionEFormValues = z.infer<typeof seccionESchema>

interface CertificadoSeccionEProps {
  defaultValues?: Partial<CertificadoAptitudSeccionE>
  onNext: (data: CertificadoAptitudSeccionE) => void
  onPrevious?: () => void
}

const PLACEHOLDER =
  'Ej: Hacer ejercicio todos los días unos 20 minutos, evitar el consumo de drogas, tabaco y alcohol, tener una dieta equilibrada, controles médicos, cumplir con el carnet de vacunación, mejorar la ergonomía, realizar pausas activas, ocupar equipos de protección personal, lavado de manos'

export function CertificadoSeccionE({
  defaultValues,
  onNext,
  onPrevious,
}: CertificadoSeccionEProps) {
  const form = useForm<SeccionEFormValues>({
    resolver: zodResolver(seccionESchema),
    defaultValues: {
      recomendaciones: defaultValues?.recomendaciones ?? '',
    },
  })

  const handleSubmit = (values: SeccionEFormValues) => {
    onNext({
      recomendaciones: values.recomendaciones,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>E. Recomendaciones</CardTitle>
            <CardDescription>
              Recomendaciones de salud y seguridad para el trabajador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="recomendaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recomendaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={PLACEHOLDER}
                      className="min-h-[160px] resize-y"
                      rows={6}
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
