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

const seccionNSchema = z.object({
  se_realiza_evaluacion: z.boolean().optional(),
  condicion_salud_relacionada_trabajo: z.boolean().optional(),
  observacion: z.string(),
})

type SeccionNFormValues = z.infer<typeof seccionNSchema>

interface FichaEva3SeccionNProps {
  defaultValues?: {
    se_realiza_evaluacion?: boolean
    condicion_salud_relacionada_trabajo?: boolean
    observacion?: string
  }
  onNext: (data: {
    se_realiza_evaluacion: boolean | undefined
    condicion_salud_relacionada_trabajo: boolean | undefined
    observacion: string
  }) => void | Promise<void>
  onPrevious?: () => void
  disabled?: boolean
  isFirstStep?: boolean
  isLastStep?: boolean
}

function toRadioValue(v: boolean | undefined): string {
  if (v === true) return 'si'
  if (v === false) return 'no'
  return ''
}

function fromRadioValue(s: string): boolean | undefined {
  if (s === 'si') return true
  if (s === 'no') return false
  return undefined
}

export function FichaEva3SeccionN({
  defaultValues,
  onNext,
  onPrevious,
  disabled = false,
  isFirstStep = false,
  isLastStep = true,
}: FichaEva3SeccionNProps) {
  const form = useForm<SeccionNFormValues>({
    resolver: zodResolver(seccionNSchema),
    defaultValues: {
      se_realiza_evaluacion: defaultValues?.se_realiza_evaluacion,
      condicion_salud_relacionada_trabajo: defaultValues?.condicion_salud_relacionada_trabajo,
      observacion: defaultValues?.observacion ?? '',
    },
  })

  const handleSubmit = (values: SeccionNFormValues) => {
    onNext({
      se_realiza_evaluacion: values.se_realiza_evaluacion,
      condicion_salud_relacionada_trabajo: values.condicion_salud_relacionada_trabajo,
      observacion: values.observacion,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              N. RETIRO (evaluación)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="se_realiza_evaluacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SE REALIZA LA EVALUACIÓN</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(v) => field.onChange(fromRadioValue(v))}
                      value={toRadioValue(field.value)}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id="eval-si" />
                        <FormLabel htmlFor="eval-si" className="cursor-pointer">
                          SI
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="eval-no" />
                        <FormLabel htmlFor="eval-no" className="cursor-pointer">
                          NO
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condicion_salud_relacionada_trabajo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LA CONDICIÓN DE SALUD ESTÁ RELACIONADA CON EL TRABAJO</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(v) => field.onChange(fromRadioValue(v))}
                      value={toRadioValue(field.value)}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id="cond-si" />
                        <FormLabel htmlFor="cond-si" className="cursor-pointer">
                          SI
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="cond-no" />
                        <FormLabel htmlFor="cond-no" className="cursor-pointer">
                          NO
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
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
