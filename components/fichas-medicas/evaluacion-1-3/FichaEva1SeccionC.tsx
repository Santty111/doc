'use client'

import React from 'react'
import { useForm, useFieldArray, type Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, ArrowLeft, Plus, Trash2 } from 'lucide-react'

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
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import type { FichaEva1SeccionC, ConsumoSustanciaDetalle, ExamenRealizado } from '@/lib/types/ficha-medica-evaluacion-1'
import { FICHA_EVA1_SECCION_C_DEFAULTS } from '@/lib/types/ficha-medica-evaluacion-1'

const consumoSchema = z.object({
  tiempo_consumo_meses: z.preprocess((v) => (v === '' || v === undefined ? null : Number(v)), z.number().nullable()),
  ex_consumidor: z.boolean(),
  tiempo_abstinencia_meses: z.preprocess((v) => (v === '' || v === undefined ? null : Number(v)), z.number().nullable()),
  no_consume: z.boolean(),
})

const seccionCSchema = z.object({
  antecedentes_clinicos_quirurgicos: z.string(),
  antecedentes_familiares: z.string(),
  transfusiones_autoriza: z.enum(['si', 'no']),
  transfusiones_no_observacion: z.string(),
  tratamiento_hormonal: z.enum(['si', 'no']),
  tratamiento_hormonal_cual: z.string(),
  tratamiento_hormonal_no_observacion: z.string(),
  gineco_obstetricos: z.object({
    fecha_ultima_menstruacion: z.string(),
    gestas: z.preprocess((v) => (v === '' || v === undefined ? null : Number(v)), z.number().nullable()),
    partos: z.preprocess((v) => (v === '' || v === undefined ? null : Number(v)), z.number().nullable()),
    cesareas: z.preprocess((v) => (v === '' || v === undefined ? null : Number(v)), z.number().nullable()),
    abortos: z.preprocess((v) => (v === '' || v === undefined ? null : Number(v)), z.number().nullable()),
    metodo_planificacion: z.enum(['si', 'no', 'no_responde']),
    metodo_planificacion_cual: z.string(),
    examenes_realizados: z.string(),
    examenes_tiempo_anos: z.preprocess((v) => (v === '' || v === undefined ? null : Number(v)), z.number().nullable()),
    examenes_resultado: z.string(),
  }),
  reproductivos_masculinos: z.object({
    examenes: z.array(z.object({
      cual: z.string(),
      tiempo_anos: z.preprocess((v) => (v === '' || v === undefined ? null : Number(v)), z.number().nullable()),
    })),
    metodo_planificacion: z.enum(['si', 'no', 'no_responde']),
    metodo_planificacion_cual: z.string(),
  }),
  consumo: z.object({
    tabaco: consumoSchema,
    alcohol: consumoSchema,
    otras_cual: z.string(),
    otras: consumoSchema,
  }),
  estilo_vida: z.object({
    actividad_fisica_cual: z.string(),
    actividad_fisica_tiempo: z.string(),
    medicacion_habitual: z.string(),
  }),
  condicion_preexistente: z.object({
    cual: z.string(),
    cantidad: z.string(),
  }),
  observacion: z.string(),
})

type SeccionCFormValues = z.infer<typeof seccionCSchema>

function migrarReproductivosMasculinos(
  data: Partial<FichaEva1SeccionC['reproductivos_masculinos']> & {
    examenes_realizados?: string
    examenes_tiempo_anos?: number | null
  } | undefined,
  def: FichaEva1SeccionC['reproductivos_masculinos']
): FichaEva1SeccionC['reproductivos_masculinos'] {
  if (!data) return def
  if (data.examenes && data.examenes.length > 0) {
    return { ...def, ...data }
  }
  const oldCual = (data as { examenes_realizados?: string }).examenes_realizados
  const oldTiempo = (data as { examenes_tiempo_anos?: number | null }).examenes_tiempo_anos
  const examenes: ExamenRealizado[] =
    oldCual || oldTiempo != null
      ? [{ cual: oldCual ?? '', tiempo_anos: oldTiempo ?? null }]
      : [{ cual: '', tiempo_anos: null }]
  return { ...def, ...data, examenes }
}

function migrarConsumo(
  data: Partial<ConsumoSustanciaDetalle> & { tiempo_consumo?: string; tiempo_abstinencia?: string } | undefined,
  def: ConsumoSustanciaDetalle
): ConsumoSustanciaDetalle {
  if (!data) return def
  const parseNum = (v: unknown): number | null => {
    if (v == null || v === '') return null
    if (typeof v === 'number') return v
    const n = parseInt(String(v), 10)
    return Number.isNaN(n) ? null : n
  }
  return {
    tiempo_consumo_meses: data.tiempo_consumo_meses ?? parseNum(data.tiempo_consumo) ?? def.tiempo_consumo_meses,
    ex_consumidor: data.ex_consumidor ?? def.ex_consumidor,
    tiempo_abstinencia_meses: data.tiempo_abstinencia_meses ?? parseNum(data.tiempo_abstinencia) ?? def.tiempo_abstinencia_meses,
    no_consume: data.no_consume ?? def.no_consume,
  }
}

function toFormValues(data: Partial<FichaEva1SeccionC> | undefined): SeccionCFormValues {
  const def = FICHA_EVA1_SECCION_C_DEFAULTS
  if (!data) return def as SeccionCFormValues
  return {
    antecedentes_clinicos_quirurgicos: data.antecedentes_clinicos_quirurgicos ?? def.antecedentes_clinicos_quirurgicos,
    antecedentes_familiares: data.antecedentes_familiares ?? def.antecedentes_familiares,
    transfusiones_autoriza: data.transfusiones_autoriza ?? def.transfusiones_autoriza,
    transfusiones_no_observacion: data.transfusiones_no_observacion ?? def.transfusiones_no_observacion,
    tratamiento_hormonal: data.tratamiento_hormonal ?? def.tratamiento_hormonal,
    tratamiento_hormonal_cual: data.tratamiento_hormonal_cual ?? def.tratamiento_hormonal_cual,
    tratamiento_hormonal_no_observacion: data.tratamiento_hormonal_no_observacion ?? def.tratamiento_hormonal_no_observacion,
    gineco_obstetricos: {
      ...def.gineco_obstetricos,
      ...data.gineco_obstetricos,
      examenes_tiempo_anos: data.gineco_obstetricos?.examenes_tiempo_anos ?? (data.gineco_obstetricos as { examenes_tiempo_meses?: number })?.examenes_tiempo_meses ?? def.gineco_obstetricos.examenes_tiempo_anos,
    },
    reproductivos_masculinos: migrarReproductivosMasculinos(data.reproductivos_masculinos, def.reproductivos_masculinos),
    consumo: {
      tabaco: migrarConsumo(data.consumo?.tabaco, def.consumo.tabaco),
      alcohol: migrarConsumo(data.consumo?.alcohol, def.consumo.alcohol),
      otras_cual: data.consumo?.otras_cual ?? def.consumo.otras_cual,
      otras: migrarConsumo(data.consumo?.otras, def.consumo.otras),
    },
    estilo_vida: { ...def.estilo_vida, ...data.estilo_vida },
    condicion_preexistente: { ...def.condicion_preexistente, ...data.condicion_preexistente },
    observacion: data.observacion ?? def.observacion,
  } as SeccionCFormValues
}

interface FichaEva1SeccionCProps {
  defaultValues?: Partial<FichaEva1SeccionC>
  onNext: (data: FichaEva1SeccionC) => void | Promise<void>
  onPrevious: () => void
  /** Opcional: si se provee, se llama con los valores actuales al hacer clic en Anterior (para preservar datos) */
  onPreviousWithData?: (data: Partial<FichaEva1SeccionC>) => void
  disabled?: boolean
  /** Si false, muestra "Siguiente" en vez de "Guardar ficha" */
  isLastStep?: boolean
}

function ExamenesRealizadosFieldArray({
  control,
  name,
}: {
  control: Control<SeccionCFormValues>
  name: 'reproductivos_masculinos.examenes'
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FormLabel>Exámenes realizados ¿Cuál?</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ cual: '', tiempo_anos: null })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Añadir examen
        </Button>
      </div>
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-wrap items-end gap-3 rounded-lg border p-3"
          >
            <FormField
              control={control}
              name={`${name}.${index}.cual`}
              render={({ field: f }) => (
                <FormItem className="flex-1 min-w-[200px]">
                  <FormLabel className="text-xs">¿Cuál?</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: PSA, ecografía..." {...f} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`${name}.${index}.tiempo_anos`}
              render={({ field: f }) => (
                <FormItem className="w-28">
                  <FormLabel className="text-xs">Tiempo (años)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...f}
                      value={f.value ?? ''}
                      onChange={(e) =>
                        f.onChange(
                          e.target.value === ''
                            ? null
                            : parseInt(e.target.value, 10)
                        )
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              className="shrink-0 text-destructive hover:bg-destructive/10"
              disabled={fields.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConsumoSustanciaRow({
  control,
  name,
  label,
}: {
  control: Control<SeccionCFormValues>
  name: `consumo.${'tabaco' | 'alcohol' | 'otras'}`
  label: string
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="font-medium text-muted-foreground">{label}</div>
      <FormField
        control={control}
        name={`${name}.tiempo_consumo_meses`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Tiempo de consumo (meses)</FormLabel>
            <FormControl>
              <Input type="number" min={0} placeholder="Ej: 24" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value, 10))} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${name}.ex_consumidor`}
        render={({ field }) => (
          <FormItem className="flex flex-row items-end gap-2 pt-8">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="!mt-0 cursor-pointer font-normal">Ex consumidor</FormLabel>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${name}.tiempo_abstinencia_meses`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Abstinencia (meses)</FormLabel>
            <FormControl>
              <Input type="number" min={0} placeholder="Ej: 12" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value, 10))} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${name}.no_consume`}
        render={({ field }) => (
          <FormItem className="flex flex-row items-end gap-2 pt-8">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="!mt-0 cursor-pointer font-normal">No consume</FormLabel>
          </FormItem>
        )}
      />
    </div>
  )
}

export function FichaEva1SeccionC({
  defaultValues,
  onNext,
  onPrevious,
  onPreviousWithData,
  disabled = false,
  isLastStep = true,
}: FichaEva1SeccionCProps) {
  const form = useForm<SeccionCFormValues>({
    resolver: zodResolver(seccionCSchema),
    defaultValues: toFormValues(defaultValues),
  })

  const handleSubmit = (values: SeccionCFormValues) => {
    const examenesFiltrados = values.reproductivos_masculinos.examenes.filter(
      (e) => e.cual.trim() || e.tiempo_anos != null
    )
    onNext({
      ...values,
      reproductivos_masculinos: {
        ...values.reproductivos_masculinos,
        examenes: examenesFiltrados,
      },
    } as FichaEva1SeccionC)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Antecedentes clínicos y quirúrgicos</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="antecedentes_clinicos_quirurgicos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Describir antecedentes..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Antecedentes familiares</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="antecedentes_familiares"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Describir antecedentes..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Condiciones médicas especiales</CardTitle>
            <CardDescription>
              Condición especial para las atenciones de urgencia, emergencia y tratamiento médico (referido por el paciente)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="transfusiones_autoriza"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>En caso de requerir transfusiones, ¿autoriza?</FormLabel>
                  <div className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-6"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="si" id="trans-si" />
                          <FormLabel htmlFor="trans-si" className="cursor-pointer font-normal">Sí</FormLabel>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="trans-no" />
                          <FormLabel htmlFor="trans-no" className="cursor-pointer font-normal">No</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    {field.value === 'no' && (
                      <FormField
                        control={form.control}
                        name="transfusiones_no_observacion"
                        render={({ field: f2 }) => (
                          <FormItem>
                            <FormLabel>Observación (describir rechazo o condiciones)</FormLabel>
                            <FormControl>
                              <Input placeholder="Especificar..." {...f2} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tratamiento_hormonal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Se encuentra bajo algún tratamiento hormonal?</FormLabel>
                  <div className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-6"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="si" id="horm-si" />
                          <FormLabel htmlFor="horm-si" className="cursor-pointer font-normal">Sí</FormLabel>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="horm-no" />
                          <FormLabel htmlFor="horm-no" className="cursor-pointer font-normal">No</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    {field.value === 'si' && (
                      <FormField
                        control={form.control}
                        name="tratamiento_hormonal_cual"
                        render={({ field: f2 }) => (
                          <FormItem>
                            <FormLabel>¿Cuál describir?</FormLabel>
                            <FormControl>
                              <Input placeholder="Describir tratamiento..." {...f2} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                    {field.value === 'no' && (
                      <FormField
                        control={form.control}
                        name="tratamiento_hormonal_no_observacion"
                        render={({ field: f2 }) => (
                          <FormItem>
                            <FormLabel>Observación (opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Especificar..." {...f2} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Antecedentes gineco obstétricos</CardTitle>
            <CardDescription>
              Se completa cuando aplica (paciente mujer)
            </CardDescription>
          </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <FormField
                  control={form.control}
                  name="gineco_obstetricos.fecha_ultima_menstruacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha última menstruación</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gineco_obstetricos.gestas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gestas</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value, 10))} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gineco_obstetricos.partos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partos</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value, 10))} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gineco_obstetricos.cesareas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cesáreas</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value, 10))} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gineco_obstetricos.abortos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Abortos</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value, 10))} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-3">
                <FormLabel>Método de planificación familiar</FormLabel>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <FormField
                    control={form.control}
                    name="gineco_obstetricos.metodo_planificacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="si" id="mpf-si" />
                              <FormLabel htmlFor="mpf-si" className="cursor-pointer font-normal">Si</FormLabel>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="no" id="mpf-no" />
                              <FormLabel htmlFor="mpf-no" className="cursor-pointer font-normal">No</FormLabel>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="no_responde" id="mpf-nr" />
                              <FormLabel htmlFor="mpf-nr" className="cursor-pointer font-normal">No responde</FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gineco_obstetricos.metodo_planificacion_cual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>¿Cuál?</FormLabel>
                        <FormControl>
                          <Input placeholder="Escribir método..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="gineco_obstetricos.examenes_realizados"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exámenes realizados ¿Cuál?</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gineco_obstetricos.examenes_tiempo_anos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiempo (años)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value, 10))} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="gineco_obstetricos.examenes_resultado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resultado (si interfiere con actividad laboral y previa autorización del titular)</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Antecedentes reproductivos masculinos</CardTitle>
            <CardDescription>
              Se completa cuando aplica (paciente hombre)
            </CardDescription>
          </CardHeader>
            <CardContent className="space-y-4">
              <ExamenesRealizadosFieldArray control={form.control} name="reproductivos_masculinos.examenes" />
              <p className="text-xs text-muted-foreground">
                Registrar resultado únicamente si interfiere con la actividad laboral y previa autorización del titular
              </p>
              <div className="space-y-3">
                <FormLabel>Método de planificación familiar</FormLabel>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <FormField
                    control={form.control}
                    name="reproductivos_masculinos.metodo_planificacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="si" id="mpm-si" />
                              <FormLabel htmlFor="mpm-si" className="cursor-pointer font-normal">Si</FormLabel>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="no" id="mpm-no" />
                              <FormLabel htmlFor="mpm-no" className="cursor-pointer font-normal">No</FormLabel>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="no_responde" id="mpm-nr" />
                              <FormLabel htmlFor="mpm-nr" className="cursor-pointer font-normal">No responde</FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reproductivos_masculinos.metodo_planificacion_cual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>¿Cuál?</FormLabel>
                        <FormControl>
                          <Input placeholder="Escribir método..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consumo de sustancias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ConsumoSustanciaRow control={form.control} name="consumo.tabaco" label="Tabaco" />
            <ConsumoSustanciaRow control={form.control} name="consumo.alcohol" label="Alcohol" />
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="consumo.otras_cual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Otras sustancias ¿Cuál?</FormLabel>
                    <FormControl>
                      <Input placeholder="Especificar..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <ConsumoSustanciaRow control={form.control} name="consumo.otras" label="Otras" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estilo de vida</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="estilo_vida.actividad_fisica_cual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actividad física ¿Cuál?</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: caminata, gimnasio" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estilo_vida.actividad_fisica_tiempo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiempo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 3 veces/semana" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="estilo_vida.medicacion_habitual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicación habitual</FormLabel>
                  <FormControl>
                    <Input placeholder="Especificar medicamentos..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Condición preexistente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="condicion_preexistente.cual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Cuál?</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="condicion_preexistente.cantidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Observación</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="observacion"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea rows={3} placeholder="Notas adicionales..." {...field} />
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
              onPreviousWithData?.(form.getValues() as Partial<FichaEva1SeccionC>)
              onPrevious()
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          <Button type="submit" disabled={disabled}>
            {disabled ? 'Guardando...' : isLastStep ? 'Guardar ficha' : 'Siguiente'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  )
}
