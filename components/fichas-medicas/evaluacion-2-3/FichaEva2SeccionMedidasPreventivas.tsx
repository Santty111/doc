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
import type { FichaEva2MedidasPreventivas as FichaEva2MedidasPreventivasType } from '@/lib/types/ficha-medica-evaluacion-2'

const medidasPreventivasSchema = z.object({
  texto: z.string(),
})

type MedidasPreventivasFormValues = z.infer<typeof medidasPreventivasSchema>

interface FichaEva2SeccionMedidasPreventivasProps {
  defaultValues?: Partial<FichaEva2MedidasPreventivasType>
  onNext: (data: FichaEva2MedidasPreventivasType) => void | Promise<void>
  onPrevious?: () => void
  onPreviousWithData?: (data: Partial<FichaEva2MedidasPreventivasType>) => void
  disabled?: boolean
  isFirstStep?: boolean
  isLastStep?: boolean
}

export function FichaEva2SeccionMedidasPreventivas({
  defaultValues,
  onNext,
  onPrevious,
  onPreviousWithData,
  disabled = false,
  isFirstStep = false,
  isLastStep = true,
}: FichaEva2SeccionMedidasPreventivasProps) {
  const form = useForm<MedidasPreventivasFormValues>({
    resolver: zodResolver(medidasPreventivasSchema),
    defaultValues: {
      texto: defaultValues?.texto ?? '',
    },
  })

  const handleSubmit = (values: MedidasPreventivasFormValues) => {
    onNext(values as FichaEva2MedidasPreventivasType)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              MEDIDAS PREVENTIVAS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="texto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-muted-foreground">
                    Describa las medidas preventivas recomendadas según los factores de riesgo identificados
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Ingrese las medidas preventivas..."
                      rows={8}
                      className="resize-y min-h-[180px]"
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
              onClick={() => {
                onPreviousWithData?.(
                  form.getValues() as Partial<FichaEva2MedidasPreventivasType>
                )
                onPrevious()
              }}
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
