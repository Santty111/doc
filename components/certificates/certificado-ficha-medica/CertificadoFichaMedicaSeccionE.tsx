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
import type { CertificadoFichaMedicaSeccionE } from '@/lib/types/certificado-ficha-medica'
import { CERTIFICADO_FICHA_MEDICA_SECCION_E_DEFAULTS } from '@/lib/types/certificado-ficha-medica'

const schema = z.object({
  nombre_apellido: z.string().min(1, 'Requerido'),
  codigo_medico: z.string().min(1, 'Requerido'),
})

type FormValues = z.infer<typeof schema>

interface CertificadoFichaMedicaSeccionEProps {
  defaultValues?: Partial<CertificadoFichaMedicaSeccionE>
  onPrevious: () => void
  onNext: (data: CertificadoFichaMedicaSeccionE) => void | Promise<void>
  disabled?: boolean
  isLastStep?: boolean
}

export function CertificadoFichaMedicaSeccionE({
  defaultValues,
  onPrevious,
  onNext,
  disabled = false,
  isLastStep = true,
}: CertificadoFichaMedicaSeccionEProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre_apellido: defaultValues?.nombre_apellido ?? CERTIFICADO_FICHA_MEDICA_SECCION_E_DEFAULTS.nombre_apellido,
      codigo_medico: defaultValues?.codigo_medico ?? CERTIFICADO_FICHA_MEDICA_SECCION_E_DEFAULTS.codigo_medico,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => onNext(v))} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>E. Datos del Profesional - F. Firma del Usuario</CardTitle>
            <CardDescription>
              Datos del profesional que emite el certificado. La firma del usuario se realizará en el documento impreso.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="nombre_apellido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre y apellido</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Dr. Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codigo_medico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código médico</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 12345" {...field} />
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
