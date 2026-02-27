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
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { AptitudMedica } from '@/lib/types/ficha-medica-evaluacion-3'

const APTITUD_OPTIONS: { value: AptitudMedica; label: string }[] = [
  { value: 'apto', label: 'APTO' },
  { value: 'apto_observacion', label: 'APTO EN OBSERVACIÓN' },
  { value: 'apto_limitaciones', label: 'APTO CON LIMITACIONES' },
  { value: 'no_apto', label: 'NO APTO' },
]

const seccionLSchema = z.object({
  aptitud: z.string(),
  observaciones: z.string(),
})

type SeccionLFormValues = z.infer<typeof seccionLSchema>

interface FichaEva3SeccionLProps {
  defaultValues?: {
    aptitud?: string
    observaciones?: string
  }
  onNext: (data: { aptitud: string; observaciones: string }) => void | Promise<void>
  onPrevious?: () => void
  disabled?: boolean
  isFirstStep?: boolean
  isLastStep?: boolean
}

export function FichaEva3SeccionL({
  defaultValues,
  onNext,
  onPrevious,
  disabled = false,
  isFirstStep = false,
  isLastStep = true,
}: FichaEva3SeccionLProps) {
  const form = useForm<SeccionLFormValues>({
    resolver: zodResolver(seccionLSchema),
    defaultValues: {
      aptitud: (defaultValues?.aptitud as AptitudMedica) ?? '',
      observaciones: defaultValues?.observaciones ?? '',
    },
  })

  const handleSubmit = (values: SeccionLFormValues) => {
    onNext({
      aptitud: values.aptitud || '',
      observaciones: values.observaciones,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              L. APTITUD MÉDICA PARA EL TRABAJO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="aptitud"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seleccione la aptitud</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                    >
                      {APTITUD_OPTIONS.map((opt) => (
                        <div
                          key={opt.value}
                          className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50"
                        >
                          <RadioGroupItem value={opt.value} id={opt.value} />
                          <FormLabel
                            htmlFor={opt.value}
                            className="flex-1 cursor-pointer text-sm font-medium"
                          >
                            {opt.label}
                          </FormLabel>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OBSERVACIONES</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={5}
                      placeholder="Observaciones"
                      className="resize-none"
                    />
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
