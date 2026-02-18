'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2 } from 'lucide-react'
import type {
  Pagina3HistoriaYDiagnostico,
  AntecedenteLaboral,
  AccidenteEnfermedad,
  DiagnosticoCIE10,
} from '@/lib/schema-medico-types'

const emptyAntecedente = (): AntecedenteLaboral => ({
  empresa_centro_trabajo: '',
  actividades_desempenadas: '',
  tipo: 'Actual',
  tiempo_trabajo: '',
  riesgos: '',
})
const emptyAccidente = (): AccidenteEnfermedad => ({
  tipo: 'Incidente',
  calificado_IESS: false,
  fecha: '',
  especificar_diagnostico: '',
  observaciones: '',
})
const emptyDiagnostico = (): DiagnosticoCIE10 => ({
  descripcion_diagnostica: '',
  CIE_10: '',
  estado: 'Presuntivo',
})

interface Props {
  data: Pagina3HistoriaYDiagnostico
  onChange: (data: Pagina3HistoriaYDiagnostico) => void
}

function FichaPaso3HistoriaDiagnosticoInner({ data, onChange }: Props) {
  const H = data.seccion_H_actividad_laboral
  const J = data.seccion_J_diagnostico
  const N = data.seccion_N_retiro
  const F = data.seccion_firmas_ficha

  const setH = (patch: Partial<typeof H>) =>
    onChange({
      ...data,
      seccion_H_actividad_laboral: { ...H, ...patch },
    })
  const setAntecedente = (i: number, patch: Partial<AntecedenteLaboral>) => {
    const arr = [...H.tabla_antecedentes]
    arr[i] = { ...arr[i], ...patch }
    setH({ tabla_antecedentes: arr })
  }
  const setAccidente = (i: number, patch: Partial<AccidenteEnfermedad>) => {
    const arr = [...H.tabla_accidentes_enfermedades]
    arr[i] = { ...arr[i], ...patch }
    setH({ tabla_accidentes_enfermedades: arr })
  }
  const setDiagnostico = (i: number, patch: Partial<DiagnosticoCIE10>) => {
    const arr = [...J.tabla_diagnosticos]
    arr[i] = { ...arr[i], ...patch }
    onChange({
      ...data,
      seccion_J_diagnostico: { tabla_diagnosticos: arr },
    })
  }

  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-4 text-lg font-semibold">H. Actividad laboral</h3>
        <h4 className="mb-2 font-medium">Antecedentes de empleos</h4>
        <div className="space-y-3">
          {H.tabla_antecedentes.map((a, i) => (
            <div key={i} className="grid gap-2 rounded border p-3 md:grid-cols-5">
              <Input
                placeholder="Centro de trabajo"
                value={a.empresa_centro_trabajo}
                onChange={(e) => setAntecedente(i, { empresa_centro_trabajo: e.target.value })}
              />
              <Input
                placeholder="Actividades"
                value={a.actividades_desempenadas}
                onChange={(e) => setAntecedente(i, { actividades_desempenadas: e.target.value })}
              />
              <Select
                value={a.tipo}
                onValueChange={(v) => setAntecedente(i, { tipo: v as AntecedenteLaboral['tipo'] })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Anterior">Anterior</SelectItem>
                  <SelectItem value="Actual">Actual</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Tiempo"
                value={a.tiempo_trabajo}
                onChange={(e) => setAntecedente(i, { tiempo_trabajo: e.target.value })}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Riesgos"
                  value={a.riesgos}
                  onChange={(e) => setAntecedente(i, { riesgos: e.target.value })}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setH({
                      tabla_antecedentes: H.tabla_antecedentes.filter((_, j) => j !== i),
                    })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setH({ tabla_antecedentes: [...H.tabla_antecedentes, emptyAntecedente()] })}
          >
            <Plus className="mr-2 h-4 w-4" /> Añadir antecedente
          </Button>
        </div>

        <h4 className="mt-6 mb-2 font-medium">Accidentes / Enfermedades</h4>
        <div className="space-y-3">
          {H.tabla_accidentes_enfermedades.map((a, i) => (
            <div key={i} className="grid gap-2 rounded border p-3 md:grid-cols-6">
              <Select
                value={a.tipo}
                onValueChange={(v) => setAccidente(i, { tipo: v as AccidenteEnfermedad['tipo'] })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Incidente">Incidente</SelectItem>
                  <SelectItem value="Accidente">Accidente</SelectItem>
                  <SelectItem value="Enfermedad Profesional">Enfermedad Profesional</SelectItem>
                </SelectContent>
              </Select>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={a.calificado_IESS}
                  onCheckedChange={(c) => setAccidente(i, { calificado_IESS: !!c })}
                />
                <span className="text-sm">IESS</span>
              </label>
              <Input
                type="date"
                placeholder="Fecha"
                value={a.fecha}
                onChange={(e) => setAccidente(i, { fecha: e.target.value })}
              />
              <Input
                placeholder="Diagnóstico"
                value={a.especificar_diagnostico}
                onChange={(e) => setAccidente(i, { especificar_diagnostico: e.target.value })}
              />
              <Input
                placeholder="Observaciones"
                value={a.observaciones}
                onChange={(e) => setAccidente(i, { observaciones: e.target.value })}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  setH({
                    tabla_accidentes_enfermedades: H.tabla_accidentes_enfermedades.filter(
                      (_, j) => j !== i
                    ),
                  })
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setH({
                tabla_accidentes_enfermedades: [
                  ...H.tabla_accidentes_enfermedades,
                  emptyAccidente(),
                ],
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Añadir
          </Button>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">J. Diagnóstico CIE-10</h3>
        <div className="space-y-3">
          {(J.tabla_diagnosticos.length ? J.tabla_diagnosticos : [emptyDiagnostico()]).map(
            (d, i) => (
              <div key={i} className="grid gap-2 rounded border p-3 md:grid-cols-4">
                <Input
                  placeholder="Descripción"
                  value={d.descripcion_diagnostica}
                  onChange={(e) => setDiagnostico(i, { descripcion_diagnostica: e.target.value })}
                />
                <Input
                  placeholder="CIE-10"
                  value={d.CIE_10}
                  onChange={(e) => setDiagnostico(i, { CIE_10: e.target.value })}
                />
                <Select
                  value={d.estado}
                  onValueChange={(v) =>
                    setDiagnostico(i, { estado: v as DiagnosticoCIE10['estado'] })
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Presuntivo">Presuntivo</SelectItem>
                    <SelectItem value="Definitivo">Definitivo</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    onChange({
                      ...data,
                      seccion_J_diagnostico: {
                        tabla_diagnosticos: J.tabla_diagnosticos.filter((_, j) => j !== i),
                      },
                    })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({
                ...data,
                seccion_J_diagnostico: {
                  tabla_diagnosticos: [...J.tabla_diagnosticos, emptyDiagnostico()],
                },
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Añadir diagnóstico
          </Button>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">N. Retiro (evaluación)</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={N.se_realiza_evaluacion}
              onCheckedChange={(c) =>
                onChange({
                  ...data,
                  seccion_N_retiro: { ...N, se_realiza_evaluacion: !!c },
                })
              }
            />
            <span>Se realiza la evaluación</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={N.condicion_salud_relacionada_trabajo}
              onCheckedChange={(c) =>
                onChange({
                  ...data,
                  seccion_N_retiro: { ...N, condicion_salud_relacionada_trabajo: !!c },
                })
              }
            />
            <span>La condición de salud está relacionada con el trabajo</span>
          </label>
          <div>
            <Label>Observación</Label>
            <Textarea
              value={N.observacion_retiro}
              onChange={(e) =>
                onChange({
                  ...data,
                  seccion_N_retiro: { ...N, observacion_retiro: e.target.value },
                })
              }
              rows={3}
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">Firmas (ficha)</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Profesional - Nombre</Label>
            <Input
              value={F.profesional.nombre}
              onChange={(e) =>
                onChange({
                  ...data,
                  seccion_firmas_ficha: {
                    ...F,
                    profesional: { ...F.profesional, nombre: e.target.value },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Profesional - Código</Label>
            <Input
              value={F.profesional.codigo}
              onChange={(e) =>
                onChange({
                  ...data,
                  seccion_firmas_ficha: {
                    ...F,
                    profesional: { ...F.profesional, codigo: e.target.value },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Trabajador - Nombre</Label>
            <Input
              value={F.trabajador.nombre}
              onChange={(e) =>
                onChange({
                  ...data,
                  seccion_firmas_ficha: {
                    ...F,
                    trabajador: { ...F.trabajador, nombre: e.target.value },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Trabajador - Cédula</Label>
            <Input
              value={F.trabajador.cedula}
              onChange={(e) =>
                onChange({
                  ...data,
                  seccion_firmas_ficha: {
                    ...F,
                    trabajador: { ...F.trabajador, cedula: e.target.value },
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

export const FichaPaso3HistoriaDiagnostico = React.memo(FichaPaso3HistoriaDiagnosticoInner)
