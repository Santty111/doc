'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Printer } from 'lucide-react'
import type { CertificadoAptitudOficial } from '@/lib/schema-medico-types'
import { createEstadoCertificadoOficialVacio } from '@/lib/evaluacion-medica-state'

const OPCIONES_APTITUD = [
  'Apto',
  'Apto en Observación',
  'Apto con Limitaciones',
  'No Apto',
] as const

interface Props {
  data: CertificadoAptitudOficial
  onChange: (data: CertificadoAptitudOficial) => void
  onImprimir: () => void
}

export function CertificadoOficialForm({ data, onChange, onImprimir }: Props) {
  const A = data.seccion_A_datos_establecimiento_usuario
  const B = data.seccion_B_datos_generales
  const C = data.seccion_C_concepto_aptitud
  const E = data.seccion_E_recomendaciones
  const F = data.seccion_F_datos_profesional

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Certificado de Aptitud (Oficial)</h2>
        <Button type="button" onClick={onImprimir}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimir certificado oficial
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Documento independiente. Fecha en casillas AAAA / MM / DD. Secciones C (Aptitud) y E (Recomendaciones); no existe sección D.
      </p>

      <section>
        <h3 className="mb-4 font-semibold">A. Datos establecimiento y usuario</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>Institución / Empresa</Label>
            <Input
              value={A.empresa.institucion_sistema}
              onChange={(e) =>
                onChange({
                  ...data,
                  seccion_A_datos_establecimiento_usuario: {
                    ...A,
                    empresa: { ...A.empresa, institucion_sistema: e.target.value },
                  },
                })
              }
            />
          </div>
          <Input
            placeholder="RUC"
            value={A.empresa.ruc}
            onChange={(e) =>
              onChange({
                ...data,
                seccion_A_datos_establecimiento_usuario: {
                  ...A,
                  empresa: { ...A.empresa, ruc: e.target.value },
                },
              })
            }
          />
          <Input
            placeholder="CIIU"
            value={A.empresa.ciiu}
            onChange={(e) =>
              onChange({
                ...data,
                seccion_A_datos_establecimiento_usuario: {
                  ...A,
                  empresa: { ...A.empresa, ciiu: e.target.value },
                },
              })
            }
          />
          <Input
            placeholder="Establecimiento salud"
            value={A.empresa.establecimiento_salud}
            onChange={(e) =>
              onChange({
                ...data,
                seccion_A_datos_establecimiento_usuario: {
                  ...A,
                  empresa: { ...A.empresa, establecimiento_salud: e.target.value },
                },
              })
            }
          />
          <Input
            placeholder="Nº Historia clínica"
            value={A.empresa.numero_historia_clinica}
            onChange={(e) =>
              onChange({
                ...data,
                seccion_A_datos_establecimiento_usuario: {
                  ...A,
                  empresa: { ...A.empresa, numero_historia_clinica: e.target.value },
                },
              })
            }
          />
          <Input
            placeholder="Nº Archivo"
            value={A.empresa.numero_archivo}
            onChange={(e) =>
              onChange({
                ...data,
                seccion_A_datos_establecimiento_usuario: {
                  ...A,
                  empresa: { ...A.empresa, numero_archivo: e.target.value },
                },
              })
            }
          />
          <div className="md:col-span-2 grid grid-cols-2 gap-2">
            <Input
              placeholder="Primer apellido"
              value={A.usuario.primer_apellido}
              onChange={(e) =>
                onChange({
                  ...data,
                  seccion_A_datos_establecimiento_usuario: {
                    ...A,
                    usuario: { ...A.usuario, primer_apellido: e.target.value },
                  },
                })
              }
            />
            <Input
              placeholder="Segundo apellido"
              value={A.usuario.segundo_apellido}
              onChange={(e) =>
                onChange({
                  ...data,
                  seccion_A_datos_establecimiento_usuario: {
                    ...A,
                    usuario: { ...A.usuario, segundo_apellido: e.target.value },
                  },
                })
              }
            />
            <Input
              placeholder="Primer nombre"
              value={A.usuario.primer_nombre}
              onChange={(e) =>
                onChange({
                  ...data,
                  seccion_A_datos_establecimiento_usuario: {
                    ...A,
                    usuario: { ...A.usuario, primer_nombre: e.target.value },
                  },
                })
              }
            />
            <Input
              placeholder="Segundo nombre"
              value={A.usuario.segundo_nombre}
              onChange={(e) =>
                onChange({
                  ...data,
                  seccion_A_datos_establecimiento_usuario: {
                    ...A,
                    usuario: { ...A.usuario, segundo_nombre: e.target.value },
                  },
                })
              }
            />
          </div>
          <Input
            placeholder="Sexo (M/F)"
            value={A.usuario.sexo}
            onChange={(e) =>
              onChange({
                ...data,
                seccion_A_datos_establecimiento_usuario: {
                  ...A,
                  usuario: { ...A.usuario, sexo: e.target.value as 'M' | 'F' },
                },
              })
            }
          />
          <Input
            placeholder="Cargo / Ocupación"
            value={A.usuario.cargo_ocupacion}
            onChange={(e) =>
              onChange({
                ...data,
                seccion_A_datos_establecimiento_usuario: {
                  ...A,
                  usuario: { ...A.usuario, cargo_ocupacion: e.target.value },
                },
              })
            }
          />
        </div>
      </section>

      <section>
        <h3 className="mb-4 font-semibold">B. Datos generales</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Label>Fecha de emisión:</Label>
          <Input
            type="number"
            placeholder="AAAA"
            className="w-20"
            value={B.fecha_emision.aaaa || ''}
            onChange={(e) =>
              onChange({
                ...data,
                seccion_B_datos_generales: {
                  ...B,
                  fecha_emision: {
                    ...B.fecha_emision,
                    aaaa: parseInt(e.target.value, 10) || 0,
                  },
                },
              })
            }
          />
          <Input
            type="number"
            placeholder="MM"
            className="w-16"
            min={1}
            max={12}
            value={B.fecha_emision.mm || ''}
            onChange={(e) =>
              onChange({
                ...data,
                seccion_B_datos_generales: {
                  ...B,
                  fecha_emision: {
                    ...B.fecha_emision,
                    mm: parseInt(e.target.value, 10) || 0,
                  },
                },
              })
            }
          />
          <Input
            type="number"
            placeholder="DD"
            className="w-16"
            min={1}
            max={31}
            value={B.fecha_emision.dd || ''}
            onChange={(e) =>
              onChange({
                ...data,
                seccion_B_datos_generales: {
                  ...B,
                  fecha_emision: {
                    ...B.fecha_emision,
                    dd: parseInt(e.target.value, 10) || 0,
                  },
                },
              })
            }
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={B.tipo_evaluacion_check.ingreso}
              onCheckedChange={(c) =>
                onChange({
                  ...data,
                  seccion_B_datos_generales: {
                    ...B,
                    tipo_evaluacion_check: { ...B.tipo_evaluacion_check, ingreso: !!c },
                  },
                })
              }
            />
            Ingreso
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={B.tipo_evaluacion_check.periodico}
              onCheckedChange={(c) =>
                onChange({
                  ...data,
                  seccion_B_datos_generales: {
                    ...B,
                    tipo_evaluacion_check: { ...B.tipo_evaluacion_check, periodico: !!c },
                  },
                })
              }
            />
            Periódico
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={B.tipo_evaluacion_check.reintegro}
              onCheckedChange={(c) =>
                onChange({
                  ...data,
                  seccion_B_datos_generales: {
                    ...B,
                    tipo_evaluacion_check: { ...B.tipo_evaluacion_check, reintegro: !!c },
                  },
                })
              }
            />
            Reintegro
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={B.tipo_evaluacion_check.salida}
              onCheckedChange={(c) =>
                onChange({
                  ...data,
                  seccion_B_datos_generales: {
                    ...B,
                    tipo_evaluacion_check: { ...B.tipo_evaluacion_check, salida: !!c },
                  },
                })
              }
            />
            Salida
          </label>
        </div>
      </section>

      <section>
        <h3 className="mb-2 font-semibold">C. Concepto para aptitud laboral</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Después de la valoración médica ocupacional se certifica que la persona en mención, es calificada como:
        </p>
        <RadioGroup
          value={C.opcion_seleccionada}
          onValueChange={(v) =>
            onChange({
              ...data,
              seccion_C_concepto_aptitud: {
                ...C,
                opcion_seleccionada: v as typeof C.opcion_seleccionada,
              },
            })
          }
          className="flex flex-wrap gap-4"
        >
          {OPCIONES_APTITUD.map((o) => (
            <label key={o} className="flex items-center gap-2">
              <RadioGroupItem value={o} />
              {o}
            </label>
          ))}
        </RadioGroup>
        <div className="mt-2">
          <Label>Detalle de observaciones</Label>
          <Textarea
            value={C.detalle_observaciones}
            onChange={(e) =>
              onChange({
                ...data,
                seccion_C_concepto_aptitud: {
                  ...C,
                  detalle_observaciones: e.target.value,
                },
              })
            }
            rows={2}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-2 font-semibold">E. Recomendaciones</h3>
        <Textarea
          value={E.campo_texto_abierto}
          onChange={(e) =>
            onChange({
              ...data,
              seccion_E_recomendaciones: { campo_texto_abierto: e.target.value },
            })
          }
          placeholder="Hacer ejercicio, dieta equilibrada, pausas activas, uso de EPPs..."
          rows={5}
        />
      </section>

      <section>
        <h3 className="mb-4 font-semibold">F. Datos del profesional</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Nombre y apellido</Label>
            <Input
              value={F.nombre_y_apellido}
              onChange={(e) =>
                onChange({
                  ...data,
                  seccion_F_datos_profesional: { ...F, nombre_y_apellido: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label>Código</Label>
            <Input
              value={F.codigo}
              onChange={(e) =>
                onChange({
                  ...data,
                  seccion_F_datos_profesional: { ...F, codigo: e.target.value },
                })
              }
            />
          </div>
        </div>
      </section>
    </div>
  )
}
