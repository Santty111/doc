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
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { FichaEva1SeccionD } from '@/lib/types/ficha-medica-evaluacion-1'

const seccionDSchema = z.object({
  descripcion: z.string(),
})

type SeccionDFormValues = z.infer<typeof seccionDSchema>

interface FichaEva1SeccionDProps {
  defaultValues?: Partial<FichaEva1SeccionD>
  onNext: (data: FichaEva1SeccionD) => void | Promise<void>
  onPrevious: () => void
  onPreviousWithData?: (data: Partial<FichaEva1SeccionD>) => void
  disabled?: boolean
}

export function FichaEva1SeccionD({
  defaultValues,
  onNext,
  onPrevious,
  onPreviousWithData,
  disabled = false,
}: FichaEva1SeccionDProps) {
  const form = useForm<SeccionDFormValues>({
    resolver: zodResolver(seccionDSchema),
    defaultValues: {
      descripcion: defaultValues?.descripcion ?? '',
    },
  })

  const handleSubmit = (values: SeccionDFormValues) => {
    onNext({ descripcion: values.descripcion })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>D. Enfermedad o Problema Actual</CardTitle>
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
                      rows={6}
                      placeholder="Describir la enfermedad o problema actual..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onPreviousWithData?.(form.getValues())
              onPrevious()
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          <Button type="submit" disabled={disabled}>
            {disabled ? 'Guardando...' : 'Siguiente'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  )
}
