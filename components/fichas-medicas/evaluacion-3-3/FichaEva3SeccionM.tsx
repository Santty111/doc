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

const seccionMSchema = z.object({
  descripcion: z.string(),
})

type SeccionMFormValues = z.infer<typeof seccionMSchema>

interface FichaEva3SeccionMProps {
  defaultValues?: { descripcion?: string }
  onNext: (data: { descripcion: string }) => void | Promise<void>
  onPrevious?: () => void
  disabled?: boolean
  isFirstStep?: boolean
  isLastStep?: boolean
}

export function FichaEva3SeccionM({
  defaultValues,
  onNext,
  onPrevious,
  disabled = false,
  isFirstStep = false,
  isLastStep = true,
}: FichaEva3SeccionMProps) {
  const form = useForm<SeccionMFormValues>({
    resolver: zodResolver(seccionMSchema),
    defaultValues: {
      descripcion: defaultValues?.descripcion ?? '',
    },
  })

  const handleSubmit = (values: SeccionMFormValues) => {
    onNext({ descripcion: values.descripcion })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              M. RECOMENDACIONES Y/O TRATAMIENTO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={10}
                      placeholder="Recomendaciones y/o tratamiento..."
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
