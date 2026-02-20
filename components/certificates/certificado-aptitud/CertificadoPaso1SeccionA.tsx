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
import type { CertificadoAptitudSeccionA } from '@/lib/types/certificado-aptitud'

const seccionASchema = z.object({
  empresa: z.object({
    institucion_nombre: z.string().min(1, 'Requerido'),
    ruc: z.string().min(1, 'Requerido'),
    ciiu: z.string().min(1, 'Requerido'),
    establecimiento_salud: z.string().min(1, 'Requerido'),
    numero_historia_clinica: z.string().min(1, 'Requerido'),
    numero_archivo: z.string().min(1, 'Requerido'),
  }),
  usuario: z.object({
    primer_apellido: z.string().min(1, 'Requerido'),
    segundo_apellido: z.string(),
    primer_nombre: z.string().min(1, 'Requerido'),
    segundo_nombre: z.string(),
    sexo: z.enum(['M', 'F']),
    cargo_ocupacion: z.string().min(1, 'Requerido'),
  }),
})

type SeccionAFormValues = z.infer<typeof seccionASchema>

const DEFAULT_VALUES: SeccionAFormValues = {
  empresa: {
    institucion_nombre: '',
    ruc: '',
    ciiu: '',
    establecimiento_salud: '',
    numero_historia_clinica: '',
    numero_archivo: '',
  },
  usuario: {
    primer_apellido: '',
    segundo_apellido: '',
    primer_nombre: '',
    segundo_nombre: '',
    sexo: 'M',
    cargo_ocupacion: '',
  },
}

interface CertificadoPaso1SeccionAProps {
  defaultValues?: Partial<CertificadoAptitudSeccionA>
  onNext: (data: CertificadoAptitudSeccionA) => void
}

export function CertificadoPaso1SeccionA({
  defaultValues,
  onNext,
}: CertificadoPaso1SeccionAProps) {
  const form = useForm<SeccionAFormValues>({
    resolver: zodResolver(seccionASchema),
    defaultValues: defaultValues
      ? { ...DEFAULT_VALUES, ...defaultValues }
      : DEFAULT_VALUES,
  })

  const handleSubmit = (values: SeccionAFormValues) => {
    onNext(values as CertificadoAptitudSeccionA)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Card 1: Datos de la Empresa */}
        <Card>
          <CardHeader>
            <CardTitle>Datos de la Empresa</CardTitle>
            <CardDescription>
              Información del establecimiento y la institución
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="empresa.institucion_nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institución / Nombre de la Empresa</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: HILTEXPOY SA"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="empresa.ruc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RUC</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: 1791436210001"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="empresa.ciiu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CIIU</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Q8620.01"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="empresa.establecimiento_salud"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Establecimiento de Salud</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: PRIVADO"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="empresa.numero_historia_clinica"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Historia Clínica</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: 402016950"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="empresa.numero_archivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Archivo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: 1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Datos del Usuario */}
        <Card>
          <CardHeader>
            <CardTitle>Datos del Usuario</CardTitle>
            <CardDescription>
              Información del trabajador o usuario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="usuario.primer_apellido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primer Apellido</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: PEREZ"
                        {...field}
                      />
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
                      <Input
                        placeholder="Ej: SOLARTE"
                        {...field}
                      />
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
                      <Input
                        placeholder="Ej: JONATHAN"
                        {...field}
                      />
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
                      <Input
                        placeholder="Ej: ALEXANDER"
                        {...field}
                      />
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
                name="usuario.cargo_ocupacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo / Ocupación</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: OPERADOR DE MAQUINA"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
