'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Loader2, Save } from 'lucide-react'

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
import type {
  CertificadoAptitudSeccionF,
  CertificadoAptitudEvaluacion,
} from '@/lib/types/certificado-aptitud'

const EVALUACION_CERTIFICACION: Record<
  CertificadoAptitudEvaluacion,
  string
> = {
  ingreso: 'el ingreso',
  periodico: 'la ejecución',
  reintegro: 'el reintegro',
  salida: 'el retiro',
}

const seccionFinalSchema = z.object({
  profesional: z.object({
    nombre_apellido: z.string().min(1, 'Requerido'),
    codigo: z.string().min(1, 'Requerido'),
  }),
})

type SeccionFinalFormValues = z.infer<typeof seccionFinalSchema>

export interface CertificadoSeccionFinalData {
  profesional: CertificadoAptitudSeccionF
}

interface CertificadoSeccionFinalProps {
  evaluacion: CertificadoAptitudEvaluacion
  defaultValues?: Partial<CertificadoSeccionFinalData>
  defaultProfessionalName?: string
  onNext: (data: CertificadoSeccionFinalData) => void | Promise<void>
  onPrevious?: () => void
  disabled?: boolean
}

export function CertificadoSeccionFinal({
  evaluacion,
  defaultValues,
  defaultProfessionalName,
  onNext,
  onPrevious,
  disabled = false,
}: CertificadoSeccionFinalProps) {
  const form = useForm<SeccionFinalFormValues>({
    resolver: zodResolver(seccionFinalSchema),
    defaultValues: {
      profesional: {
        nombre_apellido:
          defaultValues?.profesional?.nombre_apellido ??
          defaultProfessionalName ??
          '',
        codigo: defaultValues?.profesional?.codigo ?? '',
      },
    },
  })

  const handleSubmit = (values: SeccionFinalFormValues) => {
    onNext({
      profesional: values.profesional,
    })
  }

  const textoEvaluacion = EVALUACION_CERTIFICACION[evaluacion]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Párrafo de certificación */}
        <div className="rounded-lg border border-green-200 bg-green-50/50 p-4 dark:border-green-900/50 dark:bg-green-950/20">
          <p className="text-foreground text-sm">
            Con este documento certifico que el trabajador se ha sometido a la
            evaluación médica requerida para{' '}
            <span className="font-semibold">{textoEvaluacion}</span> al puesto
            laboral y se ha informado sobre los riesgos relacionados con el
            trabajo emitiendo recomendaciones relacionadas con su estado de
            salud.
          </p>
        </div>

        <p className="text-muted-foreground text-sm">
          La presente certificación se expide con base en la historia ocupacional
          del usuario (a), la cual tiene carácter de confidencial.
        </p>

        {/* Sección F: Datos del Profesional */}
        <Card>
          <CardHeader>
            <CardTitle>F. Datos del profesional de salud</CardTitle>
            <CardDescription>
              Información del profesional que emite el certificado
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="profesional.nombre_apellido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre y apellido</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: GORDILLO FLORES DENNYS PATRICIA"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profesional.codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: 1716753973"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Sección G: Firma del Usuario - Espacio para firma física */}
        <Card>
          <CardHeader>
            <CardTitle>G. Firma del usuario</CardTitle>
            <CardDescription>
              Espacio reservado para la firma física del trabajador al imprimir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="flex min-h-[120px] w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20"
              aria-label="Espacio para firma del usuario"
            >
              <span className="text-muted-foreground text-sm">
                Firma física del usuario
              </span>
            </div>
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
          <Button type="submit" disabled={disabled}>
            {disabled ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {disabled ? 'Guardando...' : 'Guardar certificado'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
