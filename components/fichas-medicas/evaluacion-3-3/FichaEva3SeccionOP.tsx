'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, ArrowRight } from 'lucide-react'
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

const seccionOPSchema = z.object({
  nombres_apellidos_profesional: z.string(),
  codigo_medico: z.string(),
})

type SeccionOPFormValues = z.infer<typeof seccionOPSchema>

interface FichaEva3SeccionOPProps {
  defaultValues?: {
    nombres_apellidos_profesional?: string
    codigo_medico?: string
  }
  onNext: (data: {
    nombres_apellidos_profesional: string
    codigo_medico: string
  }) => void | Promise<void>
  onPrevious?: () => void
  disabled?: boolean
  isFirstStep?: boolean
  isLastStep?: boolean
}

export function FichaEva3SeccionOP({
  defaultValues,
  onNext,
  onPrevious,
  disabled = false,
  isFirstStep = false,
  isLastStep = true,
}: FichaEva3SeccionOPProps) {
  const form = useForm<SeccionOPFormValues>({
    resolver: zodResolver(seccionOPSchema),
    defaultValues: {
      nombres_apellidos_profesional: defaultValues?.nombres_apellidos_profesional ?? '',
      codigo_medico: defaultValues?.codigo_medico ?? '',
    },
  })

  const handleSubmit = (values: SeccionOPFormValues) => {
    onNext({
      nombres_apellidos_profesional: values.nombres_apellidos_profesional,
      codigo_medico: values.codigo_medico,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              O. DATOS DEL PROFESIONAL / P. FIRMA DEL TRABAJADOR
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Complete los datos del profesional. La firma del trabajador se realizará en el documento impreso.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="nombres_apellidos_profesional"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NOMBRES Y APELLIDOS DEL PROFESIONAL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: Dennys Gordillo Flores" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codigo_medico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CÓDIGO MÉDICO</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: 1716753973" />
                  </FormControl>
                </FormItem>
              )}
            />
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
