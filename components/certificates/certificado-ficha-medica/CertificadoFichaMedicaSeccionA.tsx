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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CertificadoFichaMedicaSeccionA } from '@/lib/types/certificado-ficha-medica'

const schema = z.object({
  establecimiento: z.object({
    institucion_sistema: z.string().min(1, 'Requerido'),
    ruc: z.string().min(1, 'Requerido'),
    ciiu: z.string().min(1, 'Requerido'),
    establecimiento_centro_trabajo: z.string().min(1, 'Requerido'),
    numero_formulario: z.string().min(1, 'Requerido'),
    numero_archivo: z.string().min(1, 'Requerido'),
  }),
  usuario: z.object({
    primer_apellido: z.string().min(1, 'Requerido'),
    segundo_apellido: z.string(),
    primer_nombre: z.string().min(1, 'Requerido'),
    segundo_nombre: z.string(),
    sexo: z.enum(['M', 'F']),
    puesto_trabajo_ciuo: z.string().min(1, 'Requerido'),
  }),
})

type FormValues = z.infer<typeof schema>

interface CertificadoFichaMedicaSeccionAProps {
  defaultValues?: Partial<CertificadoFichaMedicaSeccionA>
  onNext: (data: CertificadoFichaMedicaSeccionA) => void
}

const DEFAULT: FormValues = {
  establecimiento: {
    institucion_sistema: '',
    ruc: '',
    ciiu: '',
    establecimiento_centro_trabajo: '',
    numero_formulario: '',
    numero_archivo: '',
  },
  usuario: {
    primer_apellido: '',
    segundo_apellido: '',
    primer_nombre: '',
    segundo_nombre: '',
    sexo: 'M',
    puesto_trabajo_ciuo: '',
  },
}

export function CertificadoFichaMedicaSeccionA({
  defaultValues,
  onNext,
}: CertificadoFichaMedicaSeccionAProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
      ? {
          establecimiento: { ...DEFAULT.establecimiento, ...defaultValues.establecimiento },
          usuario: { ...DEFAULT.usuario, ...defaultValues.usuario },
        }
      : DEFAULT,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => onNext(v))} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>A. Datos del Establecimiento - Datos del Usuario</CardTitle>
            <CardDescription>
              Información del establecimiento y del trabajador
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-3 font-medium text-sm">Establecimiento</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="establecimiento.institucion_sistema"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institución del sistema</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: EMPRESA SA" {...field} />
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
                        <Input placeholder="Ej: Q8620.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="establecimiento.establecimiento_centro_trabajo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Establecimiento / Centro de trabajo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: SEDE CENTRAL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="establecimiento.numero_formulario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de formulario</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 001" {...field} />
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
                      <FormLabel>Número de archivo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-medium text-sm">Usuario / Trabajador</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="usuario.primer_apellido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primer apellido</FormLabel>
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
                      <FormLabel>Segundo apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: GARCÍA" {...field} />
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
                      <FormLabel>Primer nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: JUAN" {...field} />
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
                      <FormLabel>Segundo nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: CARLOS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="usuario.sexo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Femenino</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="usuario.puesto_trabajo_ciuo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Puesto de trabajo (CIUO)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: OPERADOR DE MÁQUINA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">
            Siguiente
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  )
}
