'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { Pagina4Certificado } from '@/lib/schema-medico-types'
import { TIPOS_EVALUACION, CONCEPTO_APTITUD_OPCIONES } from '@/lib/schema-medico-types'

interface Props {
  data: Pagina4Certificado
  onChange: (data: Pagina4Certificado) => void
}

function FichaPaso4CertificadoInternoInner({ data, onChange }: Props) {
  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Certificado interno (no es el documento legal oficial). El certificado oficial se genera por separado.
      </p>
      <section>
        <Label>Tipo de evaluación</Label>
        <RadioGroup
          value={data.tipo_evaluacion}
          onValueChange={(v) =>
            onChange({ ...data, tipo_evaluacion: v as Pagina4Certificado['tipo_evaluacion'] })
          }
          className="flex flex-wrap gap-4 pt-2"
        >
          {TIPOS_EVALUACION.map((t) => (
            <label key={t} className="flex items-center gap-2">
              <RadioGroupItem value={t} />
              {t}
            </label>
          ))}
        </RadioGroup>
      </section>
      <section>
        <Label>Concepto de aptitud</Label>
        <RadioGroup
          value={data.concepto_aptitud.seleccion}
          onValueChange={(v) =>
            onChange({
              ...data,
              concepto_aptitud: {
                ...data.concepto_aptitud,
                seleccion: v as Pagina4Certificado['concepto_aptitud']['seleccion'],
              },
            })
          }
          className="flex flex-wrap gap-4 pt-2"
        >
          {CONCEPTO_APTITUD_OPCIONES.map((o) => (
            <label key={o} className="flex items-center gap-2">
              <RadioGroupItem value={o} />
              {o}
            </label>
          ))}
        </RadioGroup>
        <div className="mt-2">
          <Label>Detalle / observaciones</Label>
          <Textarea
            value={data.concepto_aptitud.detalle_observaciones}
            onChange={(e) =>
              onChange({
                ...data,
                concepto_aptitud: {
                  ...data.concepto_aptitud,
                  detalle_observaciones: e.target.value,
                },
              })
            }
            rows={2}
          />
        </div>
      </section>
      <section>
        <Label>Recomendaciones - Descripción</Label>
        <Textarea
          value={data.recomendaciones.descripcion}
          onChange={(e) =>
            onChange({
              ...data,
              recomendaciones: {
                ...data.recomendaciones,
                descripcion: e.target.value,
              },
            })
          }
          placeholder="Hábitos, EPPs, etc."
          rows={4}
        />
        <div className="mt-2">
          <Label>Observaciones adicionales</Label>
          <Textarea
            value={data.recomendaciones.observaciones_adicionales}
            onChange={(e) =>
              onChange({
                ...data,
                recomendaciones: {
                  ...data.recomendaciones,
                  observaciones_adicionales: e.target.value,
                },
              })
            }
            rows={2}
          />
        </div>
      </section>
      <section>
        <h4 className="font-medium mb-2">Firmas certificado interno</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Profesional - Nombre</Label>
            <Input
              value={data.firmas_certificado.profesional.nombre}
              onChange={(e) =>
                onChange({
                  ...data,
                  firmas_certificado: {
                    ...data.firmas_certificado,
                    profesional: {
                      ...data.firmas_certificado.profesional,
                      nombre: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Profesional - Código</Label>
            <Input
              value={data.firmas_certificado.profesional.codigo}
              onChange={(e) =>
                onChange({
                  ...data,
                  firmas_certificado: {
                    ...data.firmas_certificado,
                    profesional: {
                      ...data.firmas_certificado.profesional,
                      codigo: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Usuario - Nombre</Label>
            <Input
              value={data.firmas_certificado.usuario.nombre}
              onChange={(e) =>
                onChange({
                  ...data,
                  firmas_certificado: {
                    ...data.firmas_certificado,
                    usuario: {
                      ...data.firmas_certificado.usuario,
                      nombre: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Usuario - Cédula</Label>
            <Input
              value={data.firmas_certificado.usuario.cedula}
              onChange={(e) =>
                onChange({
                  ...data,
                  firmas_certificado: {
                    ...data.firmas_certificado,
                    usuario: {
                      ...data.firmas_certificado.usuario,
                      cedula: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export const FichaPaso4CertificadoInterno = React.memo(FichaPaso4CertificadoInternoInner)
