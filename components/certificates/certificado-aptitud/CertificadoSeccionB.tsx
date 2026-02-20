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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { CertificadoAptitudSeccionB } from '@/lib/types/certificado-aptitud'

const EVALUACION_OPTIONS = [
  { value: 'ingreso' as const, label: 'Ingreso' },
  { value: 'periodico' as const, label: 'Periódico' },
  { value: 'reintegro' as const, label: 'Reintegro' },
  { value: 'salida' as const, label: 'Salida' },
] as const

function parseFechaToDdMmAaaa(isoDate: string) {
  if (!isoDate) {
    const d = new Date()
    return { dd: d.getDate(), mm: d.getMonth() + 1, aaaa: d.getFullYear() }
  }
  const [aaaa, mm, dd] = isoDate.split('T')[0].split('-').map(Number)
  return { dd, mm, aaaa }
}

function buildFechaFromDdMmAaaa(dd: number, mm: number, aaaa: number): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${aaaa}-${pad(mm)}-${pad(dd)}`
}

const seccionBSchema = z
  .object({
    dd: z.coerce.number().min(1, 'Día inválido').max(31, 'Día inválido'),
    mm: z.coerce.number().min(1, 'Mes inválido').max(12, 'Mes inválido'),
    aaaa: z.coerce.number().min(1900, 'Año inválido').max(2100, 'Año inválido'),
    evaluacion: z.enum(['ingreso', 'periodico', 'reintegro', 'salida']),
  })
  .refine(
    (data) => {
      const d = new Date(data.aaaa, data.mm - 1, data.dd)
      return (
        d.getDate() === data.dd &&
        d.getMonth() === data.mm - 1 &&
        d.getFullYear() === data.aaaa
      )
    },
    { message: 'Fecha inválida', path: ['dd'] }
  )

type SeccionBFormValues = z.infer<typeof seccionBSchema>

interface CertificadoSeccionBProps {
  defaultValues?: Partial<CertificadoAptitudSeccionB>
  onNext: (data: CertificadoAptitudSeccionB) => void
  onPrevious?: () => void
}

export function CertificadoSeccionB({
  defaultValues,
  onNext,
  onPrevious,
}: CertificadoSeccionBProps) {
  const parsed = defaultValues?.fecha_emision
    ? parseFechaToDdMmAaaa(defaultValues.fecha_emision)
    : parseFechaToDdMmAaaa('')

  const form = useForm<SeccionBFormValues>({
    resolver: zodResolver(seccionBSchema),
    defaultValues: {
      dd: defaultValues?.fecha_emision ? parsed.dd : new Date().getDate(),
      mm: defaultValues?.fecha_emision ? parsed.mm : new Date().getMonth() + 1,
      aaaa: defaultValues?.fecha_emision
        ? parsed.aaaa
        : new Date().getFullYear(),
      evaluacion: defaultValues?.evaluacion ?? 'ingreso',
    },
  })

  const handleSubmit = (values: SeccionBFormValues) => {
    onNext({
      fecha_emision: buildFechaFromDdMmAaaa(values.dd, values.mm, values.aaaa),
      evaluacion: values.evaluacion,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>B. Datos generales</CardTitle>
            <CardDescription>
              Fecha de emisión y tipo de evaluación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Fecha de emisión */}
            <div className="space-y-2">
              <FormLabel>Fecha de emisión</FormLabel>
              <div className="flex items-end gap-3">
                <FormField
                  control={form.control}
                  name="dd"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-col gap-1">
                          <Input
                            type="number"
                            min={1}
                            max={31}
                            placeholder="dd"
                            className="w-16 text-center"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : 0
                              )
                            }
                          />
                          <span className="text-muted-foreground text-center text-xs">
                            dd
                          </span>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mm"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-col gap-1">
                          <Input
                            type="number"
                            min={1}
                            max={12}
                            placeholder="mm"
                            className="w-16 text-center"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : 0
                              )
                            }
                          />
                          <span className="text-muted-foreground text-center text-xs">
                            mm
                          </span>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="aaaa"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-col gap-1">
                          <Input
                            type="number"
                            min={1900}
                            max={2100}
                            placeholder="aaaa"
                            className="w-20 text-center"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : 0
                              )
                            }
                          />
                          <span className="text-muted-foreground text-center text-xs">
                            aaaa
                          </span>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {(form.formState.errors.dd ||
                form.formState.errors.mm ||
                form.formState.errors.aaaa) && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.dd?.message ||
                    form.formState.errors.mm?.message ||
                    form.formState.errors.aaaa?.message}
                </p>
              )}
            </div>

            {/* Evaluación */}
            <FormField
              control={form.control}
              name="evaluacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evaluación</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-wrap gap-6"
                    >
                      {EVALUACION_OPTIONS.map((opt) => (
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
