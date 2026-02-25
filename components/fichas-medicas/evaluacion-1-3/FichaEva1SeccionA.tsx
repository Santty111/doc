'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight } from 'lucide-react'

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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type {
  FichaEva1SeccionA,
  AtencionPrioritaria,
} from '@/lib/types/ficha-medica-evaluacion-1'

const seccionASchema = z.object({
  establecimiento: z.object({
    institucion_sistema: z.string().min(1, 'Requerido'),
    ruc: z.string().min(1, 'Requerido'),
    ciiu: z.string().min(1, 'Requerido'),
    establecimiento_centro_trabajo: z.string().min(1, 'Requerido'),
    numero_historia_clinica: z.string(),
    numero_archivo: z.string().min(1, 'Requerido'),
  }),
  usuario: z.object({
    primer_apellido: z.string().min(1, 'Requerido'),
    segundo_apellido: z.string(),
    primer_nombre: z.string().min(1, 'Requerido'),
    segundo_nombre: z.string(),
  }),
  atencion_prioritaria: z.object({
    embarazada: z.boolean(),
    persona_discapacidad: z.boolean(),
    enfermedad_catastrofica: z.boolean(),
    lactancia: z.boolean(),
    adulto_mayor: z.boolean(),
  }),
  sexo: z.enum(['hombre', 'mujer']),
  fecha_nacimiento: z.string().min(1, 'Requerido'),
  edad: z.preprocess(
    (v) => {
      if (v === '' || v === undefined) return null
      const n = Number(v)
      return Number.isNaN(n) ? null : n
    },
    z.number().nullable()
  ).optional(),
  grupo_sanguineo: z.string(),
  lateralidad: z.enum(['diestro', 'zurdo', 'ambidiestro']),
})

type SeccionAFormValues = z.infer<typeof seccionASchema>

function toFormValues(data: Partial<FichaEva1SeccionA> | undefined): SeccionAFormValues {
  const def = {
    establecimiento: {
      institucion_sistema: '',
      ruc: '',
      ciiu: '',
      establecimiento_centro_trabajo: '',
      numero_historia_clinica: '',
      numero_archivo: '',
    },
    usuario: {
      primer_apellido: '',
      segundo_apellido: '',
      primer_nombre: '',
      segundo_nombre: '',
    },
    atencion_prioritaria: {
      embarazada: false,
      persona_discapacidad: false,
      enfermedad_catastrofica: false,
      lactancia: false,
      adulto_mayor: false,
    },
    sexo: 'hombre' as const,
    fecha_nacimiento: '',
    edad: null as number | null,
    grupo_sanguineo: '',
    lateralidad: 'diestro' as const,
  }
  if (!data) return def
  return {
    establecimiento: { ...def.establecimiento, ...data.establecimiento },
    usuario: { ...def.usuario, ...data.usuario },
    atencion_prioritaria: {
      ...def.atencion_prioritaria,
      ...data.atencion_prioritaria,
    } as AtencionPrioritaria,
    sexo: data.sexo ?? 'hombre',
    fecha_nacimiento: data.fecha_nacimiento ?? '',
    edad: data.edad ?? null,
    grupo_sanguineo: data.grupo_sanguineo ?? '',
    lateralidad: data.lateralidad ?? 'diestro',
  }
}

interface FichaEva1SeccionAProps {
  defaultValues?: Partial<FichaEva1SeccionA>
  onNext: (data: FichaEva1SeccionA) => void | Promise<void>
  /** Si true, el botón funciona como guardar en vez de siguiente (cuando es la única sección) */
  isLastStep?: boolean
  disabled?: boolean
}

export function FichaEva1SeccionA({
  defaultValues,
  onNext,
  isLastStep = false,
  disabled = false,
}: FichaEva1SeccionAProps) {
  const form = useForm<SeccionAFormValues>({
    resolver: zodResolver(seccionASchema),
    defaultValues: toFormValues(defaultValues),
  })

  const handleSubmit = (values: SeccionAFormValues) => {
    onNext({
      establecimiento: values.establecimiento,
      usuario: values.usuario,
      atencion_prioritaria: values.atencion_prioritaria,
      sexo: values.sexo,
      fecha_nacimiento: values.fecha_nacimiento,
      edad: values.edad ?? null,
      grupo_sanguineo: values.grupo_sanguineo,
      lateralidad: values.lateralidad,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Card 1: Datos del Establecimiento */}
        <Card>
          <CardHeader>
            <CardTitle>A. Datos del Establecimiento</CardTitle>
            <CardDescription>
              Información de la institución y el centro de trabajo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="establecimiento.institucion_sistema"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institución del Sistema</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: HILTEXPOY S.A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="establecimiento.ruc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RUC</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 1791436210001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="establecimiento.ciiu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CIIU</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: C1310" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="establecimiento.establecimiento_centro_trabajo"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Establecimiento / Centro de Trabajo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: HILTEXPOY S.A. - Planta Principal"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="establecimiento.numero_historia_clinica"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Historia Clínica</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 402016950" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="establecimiento.numero_archivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Archivo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 12025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Datos del Usuario - Nombre */}
        <Card>
          <CardHeader>
            <CardTitle>Datos del Usuario</CardTitle>
            <CardDescription>Nombres y apellidos del trabajador</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <FormField
                control={form.control}
                name="usuario.primer_apellido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primer Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: PEREZ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usuario.segundo_apellido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Segundo Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: SOLARTE" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usuario.primer_nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primer Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: JONATHAN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usuario.segundo_nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Segundo Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: ALEXANDER" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Atención Prioritaria y Datos Demográficos */}
        <Card>
          <CardHeader>
            <CardTitle>Atención Prioritaria y Datos Demográficos</CardTitle>
            <CardDescription>
              Condiciones especiales y datos personales del usuario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="atencion_prioritaria"
              render={() => (
                <FormItem>
                  <FormLabel>Atención Prioritaria</FormLabel>
                  <div className="flex flex-col gap-3 pt-2">
                    <FormField
                      control={form.control}
                      name="atencion_prioritaria.embarazada"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0 cursor-pointer font-normal">
                            Embarazada
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="atencion_prioritaria.persona_discapacidad"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0 cursor-pointer font-normal">
                            Persona con Discapacidad
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="atencion_prioritaria.enfermedad_catastrofica"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0 cursor-pointer font-normal">
                            E. Catastrófica
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="atencion_prioritaria.lactancia"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0 cursor-pointer font-normal">
                            Lactancia
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="atencion_prioritaria.adulto_mayor"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0 cursor-pointer font-normal">
                            Adulto Mayor
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <FormField
                control={form.control}
                name="sexo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hombre">Hombre</SelectItem>
                        <SelectItem value="mujer">Mujer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fecha_nacimiento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Nacimiento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="edad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={120}
                        placeholder="Años"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const v = e.target.value
                          field.onChange(
                            v === '' ? null : parseInt(v, 10)
                          )
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grupo_sanguineo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grupo Sanguíneo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: O+, A-, AB+"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lateralidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lateralidad</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="diestro">Diestro</SelectItem>
                        <SelectItem value="zurdo">Zurdo</SelectItem>
                        <SelectItem value="ambidiestro">Ambidiestro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={disabled}>
            {disabled ? 'Guardando...' : isLastStep ? 'Guardar ficha' : 'Siguiente'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  )
}
