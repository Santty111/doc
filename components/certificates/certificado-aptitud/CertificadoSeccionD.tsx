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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { CertificadoAptitudSeccionD } from '@/lib/types/certificado-aptitud'

const SALUD_RETIRO_OPTIONS = [
  { value: 'satisfactorio' as const, label: 'Satisfactorio' },
  { value: 'no_satisfactorio' as const, label: 'No satisfactorio' },
] as const

const seccionDSchema = z.object({
  condiciones_salud_retiro: z.enum(['satisfactorio', 'no_satisfactorio']),
  observaciones_salud_retiro: z.string(),
})

type SeccionDFormValues = z.infer<typeof seccionDSchema>

interface CertificadoSeccionDProps {
  defaultValues?: Partial<CertificadoAptitudSeccionD>
  onNext: (data: CertificadoAptitudSeccionD) => void
  onPrevious?: () => void
}

export function CertificadoSeccionD({
  defaultValues,
  onNext,
  onPrevious,
}: CertificadoSeccionDProps) {
  const form = useForm<SeccionDFormValues>({
    resolver: zodResolver(seccionDSchema),
    defaultValues: {
      condiciones_salud_retiro:
        defaultValues?.condiciones_salud_retiro ?? 'satisfactorio',
      observaciones_salud_retiro:
        defaultValues?.observaciones_salud_retiro ?? '',
    },
  })

  const handleSubmit = (values: SeccionDFormValues) => {
    onNext({
      condiciones_salud_retiro: values.condiciones_salud_retiro,
      observaciones_salud_retiro: values.observaciones_salud_retiro,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>D. Condiciones de salud al momento del retiro</CardTitle>
            <CardDescription>
              Certificación de las condiciones de salud al momento del retiro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-sm">
              Después de la valoración médica ocupacional se certifica las
              condiciones de salud al momento del retiro:
            </p>

            {/* Opciones satisfactorio / no satisfactorio */}
            <FormField
              control={form.control}
              name="condiciones_salud_retiro"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-wrap gap-6"
                    >
                      {SALUD_RETIRO_OPTIONS.map((opt) => (
                        <div
                          key={opt.value}
                          className="flex items-center gap-2"
                        >
                          <RadioGroupItem value={opt.value} id={opt.value} />
                          <FormLabel
                            htmlFor={opt.value}
                            className="cursor-pointer font-normal"
                          >
                            {opt.label}
                          </FormLabel>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Observaciones */}
            <FormField
              control={form.control}
              name="observaciones_salud_retiro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Observaciones relacionadas con las condiciones de salud al
                    momento del retiro
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describa las observaciones relacionadas con las condiciones de salud al momento del retiro..."
                      className="min-h-[120px] resize-y"
                      rows={4}
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
