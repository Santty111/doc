'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useDebouncedCallback } from '@/lib/hooks/useDebouncedCallback'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import type { Pagina1IdentificacionYExamen, KeyRevision } from '@/lib/schema-medico-types'
import { LABELS_REVISION } from '@/lib/schema-medico-types'

interface Props {
  data: Pagina1IdentificacionYExamen
  onChange: (data: Pagina1IdentificacionYExamen) => void
}

function splitApellidosNombres(apellidos: string, nombres: string) {
  const a = (apellidos || '').trim().split(/\s+/)
  const n = (nombres || '').trim().split(/\s+/)
  return {
    primer_apellido: a[0] ?? '',
    segundo_apellido: a.slice(1).join(' ') ?? '',
    primer_nombre: n[0] ?? '',
    segundo_nombre: n.slice(1).join(' ') ?? '',
  }
}

function parseFechaNacimiento(fecha: string): { ano: string; mes: string; dia: string } {
  if (!fecha) return { ano: '', mes: '', dia: '' }
  const d = new Date(fecha)
  if (Number.isNaN(d.getTime())) return { ano: '', mes: '', dia: '' }
  return {
    ano: String(d.getFullYear()),
    mes: String(d.getMonth() + 1).padStart(2, '0'),
    dia: String(d.getDate()).padStart(2, '0'),
  }
}

const YEAR_OPTIONS = Array.from({ length: 101 }, (_, i) => String(1950 + i))
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))

function FechaDesplegable({
  value,
  onChange,
}: {
  value: string
  onChange: (next: string) => void
}) {
  const parts = parseFechaNacimiento(value)
  const canPickMD = !!parts.ano
  const formatted = parts.ano && parts.mes && parts.dia ? `${parts.ano}/${parts.mes}/${parts.dia}` : ''

  return (
    <>
      <div className="screen-only inline-flex items-center justify-center gap-1">
        <Select
          value={parts.ano || ''}
          onValueChange={(y) => onChange(y ? `${y}-${parts.mes || '01'}-${parts.dia || '01'}` : '')}
        >
          <SelectTrigger className="h-6 min-h-0 w-16 border-0 bg-transparent p-0 text-[9pt]">
            <SelectValue placeholder="aaaa" />
          </SelectTrigger>
          <SelectContent>
            {YEAR_OPTIONS.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={parts.mes || ''}
          onValueChange={(m) => {
            if (!parts.ano) return
            onChange(`${parts.ano}-${m}-${parts.dia || '01'}`)
          }}
          disabled={!canPickMD}
        >
          <SelectTrigger className="h-6 min-h-0 w-12 border-0 bg-transparent p-0 text-[9pt]">
            <SelectValue placeholder="mm" />
          </SelectTrigger>
          <SelectContent>
            {MONTH_OPTIONS.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={parts.dia || ''}
          onValueChange={(d) => {
            if (!parts.ano) return
            onChange(`${parts.ano}-${parts.mes || '01'}-${d}`)
          }}
          disabled={!canPickMD}
        >
          <SelectTrigger className="h-6 min-h-0 w-12 border-0 bg-transparent p-0 text-[9pt]">
            <SelectValue placeholder="dd" />
          </SelectTrigger>
          <SelectContent>
            {DAY_OPTIONS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <span className="print-only">{formatted}</span>
    </>
  )
}

const ATENCION_PRIORITARIA_LABELS: { key: keyof Pagina1IdentificacionYExamen['seccion_A_establecimiento_usuario']['atencion_prioritaria']; label: string }[] = [
  { key: 'embarazada', label: 'Embarazada' },
  { key: 'persona_con_discapacidad', label: 'Persona con Discapacidad' },
  { key: 'enfermedad_catastrofica', label: 'E.Catastrófica' },
  { key: 'lactancia', label: 'Lactancia' },
  { key: 'adulto_mayor', label: 'Adulto Mayor' },
]

const REVISION_KEYS: KeyRevision[] = [
  'piel_y_faneras',
  '2_ojos',
  '3_oidos',
  '4_oro_faringe',
  'senos_paranasales',
  '6_cuello',
  '7_torax',
  'pulmones',
  'corazon',
  '9_abdomen',
  'genitales',
  '10_columna',
  '12_extremidades',
  '13_neurologico',
]

const DEBOUNCE_MS = 250

function FichaPaso1IdentificacionInner({ data, onChange }: Props) {
  const [localData, setLocalData] = useState(data)
  const [debouncedOnChange, flush] = useDebouncedCallback(onChange, DEBOUNCE_MS)

  const apply = useCallback(
    (next: Pagina1IdentificacionYExamen) => {
      setLocalData(next)
      debouncedOnChange(next)
    },
    [debouncedOnChange]
  )

  useEffect(() => () => flush(), [flush])

  const A = localData.seccion_A_establecimiento_usuario
  const B = localData.seccion_B_motivo_consulta
  const C = localData.seccion_C_antecedentes_personales
  const rev = localData.seccion_revision_organos_sistemas.items
  const signos = localData.signos_vitales_y_antropometria

  const setA = (patch: Partial<typeof A>) =>
    apply({
      ...localData,
      seccion_A_establecimiento_usuario: { ...A, ...patch },
    })
  const setB = (patch: Partial<typeof B>) =>
    apply({
      ...localData,
      seccion_B_motivo_consulta: { ...B, ...patch },
    })
  const setC = (patch: Partial<typeof C>) =>
    apply({
      ...localData,
      seccion_C_antecedentes_personales: { ...C, ...patch },
    })
  const setGineco = (patch: Partial<typeof C.gineco_obstetricos>) =>
    setC({
      gineco_obstetricos: { ...C.gineco_obstetricos, ...patch },
    })
  const setEmpresa = (patch: Partial<typeof A.empresa>) =>
    setA({ empresa: { ...A.empresa, ...patch } })
  const setTrabajador = (patch: Partial<typeof A.trabajador>) =>
    setA({ trabajador: { ...A.trabajador, ...patch } })
  const setPrioritaria = (patch: Partial<typeof A.atencion_prioritaria>) =>
    setA({ atencion_prioritaria: { ...A.atencion_prioritaria, ...patch } })
  const setBiograficos = (patch: Partial<typeof A.datos_biograficos>) =>
    setA({ datos_biograficos: { ...A.datos_biograficos, ...patch } })

  const setItemRevision = (
    key: KeyRevision,
    field: 'estado' | 'observacion',
    value: string
  ) => {
    apply({
      ...localData,
      seccion_revision_organos_sistemas: {
        ...localData.seccion_revision_organos_sistemas,
        items: {
          ...rev,
          [key]: { ...rev[key], [field]: value },
        },
      },
    })
  }

  const setSignos = (patch: Partial<typeof signos>) =>
    apply({
      ...localData,
      signos_vitales_y_antropometria: { ...signos, ...patch },
    })

  const peso = signos.peso_kg
  const talla = signos.talla_cm
  const imc =
    peso && talla && talla > 0
      ? Math.round((peso / (talla / 100) ** 2) * 10) / 10
      : 0

  const updatePeso = (v: number) => {
    setSignos({
      peso_kg: v,
      indice_masa_corporal:
        v && talla && talla > 0
          ? Math.round((v / (talla / 100) ** 2) * 10) / 10
          : signos.indice_masa_corporal,
    })
  }
  const updateTalla = (v: number) => {
    setSignos({
      talla_cm: v,
      indice_masa_corporal:
        peso && v && v > 0
          ? Math.round((peso / (v / 100) ** 2) * 10) / 10
          : signos.indice_masa_corporal,
    })
  }

  const { primer_apellido, segundo_apellido, primer_nombre, segundo_nombre } = splitApellidosNombres(
    A.trabajador.apellidos,
    A.trabajador.nombres
  )
  const fechaParts = parseFechaNacimiento(A.datos_biograficos.fecha_nacimiento)

  return (
    <div className="evaluacion-print ficha-paso1 max-w-[210mm] text-[9pt]">
      {/* Título del formulario */}
      <div className="ficha-paso1-title border border-black bg-[#bccbef] py-2 text-center font-bold uppercase text-black">
        Formulario de evaluación médica ocupacional
      </div>

      {/* Sección A: Datos del establecimiento y usuario */}
      <table className="ficha-paso1-table w-full border-collapse border border-black text-[9pt]">
        <tbody>
          <tr>
            <td colSpan={6} className="seccion-header border border-black">
              A. DATOS DEL ESTABLECIMIENTO - DATOS DEL USUARIO
            </td>
          </tr>
          <tr>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Institución del sistema</td>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">RUC</td>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">CIIU</td>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Establecimiento/Centro de trabajo</td>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Nº Historia clínica</td>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Nº Archivo</td>
          </tr>
          <tr>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input
                className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]"
                value={A.empresa.institucion_del_sistema}
                onChange={(e) => setEmpresa({ institucion_del_sistema: e.target.value })}
              />
              <span className="print-only">{A.empresa.institucion_del_sistema || ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input
                className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]"
                value={A.empresa.ruc}
                onChange={(e) => setEmpresa({ ruc: e.target.value })}
              />
              <span className="print-only">{A.empresa.ruc || ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input
                className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]"
                value={A.empresa.ciiu}
                onChange={(e) => setEmpresa({ ciiu: e.target.value })}
              />
              <span className="print-only">{A.empresa.ciiu || ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input
                className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]"
                value={A.empresa.establecimiento_salud}
                onChange={(e) => setEmpresa({ establecimiento_salud: e.target.value })}
              />
              <span className="print-only">{A.empresa.establecimiento_salud || ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input
                className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]"
                value={A.empresa.numero_historia_clinica}
                onChange={(e) => setEmpresa({ numero_historia_clinica: e.target.value })}
              />
              <span className="print-only">{A.empresa.numero_historia_clinica || ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input
                className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]"
                value={A.empresa.numero_archivo}
                onChange={(e) => setEmpresa({ numero_archivo: e.target.value })}
              />
              <span className="print-only">{A.empresa.numero_archivo || ''}</span>
            </td>
          </tr>
          <tr>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Primer apellido</td>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Segundo apellido</td>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Primer nombre</td>
            <td colSpan={3} className="border border-black bg-[#d4edda] p-0.5 font-semibold">Segundo nombre</td>
          </tr>
          <tr>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input
                className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]"
                value={primer_apellido}
                onChange={(e) => {
                  const rest = A.trabajador.apellidos.replace(/^\s*\S+/, '').trim()
                  setTrabajador({ apellidos: [e.target.value, rest].filter(Boolean).join(' ') })
                }}
              />
              <span className="print-only">{primer_apellido || ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input
                className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]"
                value={segundo_apellido}
                onChange={(e) => {
                  const first = (A.trabajador.apellidos || '').split(/\s+/)[0] || ''
                  setTrabajador({ apellidos: [first, e.target.value].filter(Boolean).join(' ') })
                }}
              />
              <span className="print-only">{segundo_apellido || ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input
                className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]"
                value={primer_nombre}
                onChange={(e) => {
                  const rest = (A.trabajador.nombres || '').replace(/^\s*\S+/, '').trim()
                  setTrabajador({ nombres: [e.target.value, rest].filter(Boolean).join(' ') })
                }}
              />
              <span className="print-only">{primer_nombre || ''}</span>
            </td>
            <td colSpan={3} className="border border-black bg-[#e8f5e9] p-0.5">
              <Input
                className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]"
                value={segundo_nombre}
                onChange={(e) => {
                  const first = (A.trabajador.nombres || '').split(/\s+/)[0] || ''
                  setTrabajador({ nombres: [first, e.target.value].filter(Boolean).join(' ') })
                }}
              />
              <span className="print-only">{segundo_nombre || ''}</span>
            </td>
          </tr>
          {/* Atención prioritaria: 1 celda título + 5 celdas (una por opción) = 6 columnas */}
          <tr>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">
              Atención prioritaria
            </td>
            {ATENCION_PRIORITARIA_LABELS.map(({ key, label }) => (
              <td key={key} className="border border-black bg-[#e8f5e9] p-0.5 text-center align-middle">
                <label className="flex flex-col items-center justify-center gap-0.5">
                  <span className="text-[7pt]">{label}</span>
                  <Checkbox
                    className="screen-only h-4 w-4"
                    checked={A.atencion_prioritaria[key]}
                    onCheckedChange={(c) => setPrioritaria({ [key]: !!c })}
                  />
                </label>
                <span className="print-only">{A.atencion_prioritaria[key] ? 'X' : ''}</span>
              </td>
            ))}
          </tr>
          {/* Sexo, Fecha nacimiento, Edad, Grupo sanguíneo, Lateralidad */}
          <tr>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Sexo</td>
            <td colSpan={2} className="border border-black bg-[#e8f5e9] p-0.5">
              <Select
                value={A.trabajador.sexo}
                onValueChange={(v) => setTrabajador({ sexo: v as 'M' | 'F' })}
              >
                <SelectTrigger className="screen-only h-7 min-h-0 w-full border-0 bg-transparent text-[9pt]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Hombre</SelectItem>
                  <SelectItem value="F">Mujer</SelectItem>
                </SelectContent>
              </Select>
              <span className="print-only">{A.trabajador.sexo === 'M' ? 'Hombre' : A.trabajador.sexo === 'F' ? 'Mujer' : ''}</span>
            </td>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Fecha de nacimiento</td>
            <td className="border border-black bg-[#e8f5e9] p-0.5 text-center">
              <Select
                value={fechaParts.ano || ''}
                onValueChange={(v) => {
                  const prev = A.datos_biograficos.fecha_nacimiento || ''
                  const [, restMes, restDia] = prev.split(/-/)
                  const rest = restMes && restDia ? `${restMes}-${restDia}` : '01-01'
                  const next = v ? `${v}-${rest}` : ''
                  setBiograficos({ fecha_nacimiento: next })
                }}
              >
                <SelectTrigger className="screen-only h-6 min-h-0 w-16 border-0 bg-transparent p-0 text-[9pt]">
                  <SelectValue placeholder="año" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 81 }, (_, i) => {
                    const year = 1950 + i
                    return (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <span className="print-only">{fechaParts.ano}</span>
              <span className="text-[7pt]">año</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5 text-center">
              <Select
                value={fechaParts.mes || ''}
                onValueChange={(v) => {
                  const prev = A.datos_biograficos.fecha_nacimiento || ''
                  const [y, , d] = prev.split(/-/)
                  const next = y && d ? `${y}-${v}-${d}` : (v ? `0000-${v}-01` : '')
                  setBiograficos({ fecha_nacimiento: next })
                }}
              >
                <SelectTrigger className="screen-only h-6 min-h-0 w-12 border-0 bg-transparent p-0 text-[9pt]">
                  <SelectValue placeholder="mes" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = String(i + 1).padStart(2, '0')
                    return (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <span className="print-only">{fechaParts.mes}</span>
              <span className="text-[7pt]">mes</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5 text-center">
              <Select
                value={fechaParts.dia || ''}
                onValueChange={(v) => {
                  const prev = A.datos_biograficos.fecha_nacimiento || ''
                  const [y, m] = prev.split(/-/)
                  const next = y && m ? `${y}-${m}-${v}` : (v ? `0000-01-${v}` : '')
                  setBiograficos({ fecha_nacimiento: next })
                }}
              >
                <SelectTrigger className="screen-only h-6 min-h-0 w-12 border-0 bg-transparent p-0 text-[9pt]">
                  <SelectValue placeholder="día" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => {
                    const day = String(i + 1).padStart(2, '0')
                    return (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <span className="print-only">{fechaParts.dia}</span>
              <span className="text-[7pt]">día</span>
            </td>
          </tr>
          <tr>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Edad</td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input
                type="number"
                className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]"
                value={A.datos_biograficos.edad || ''}
                onChange={(e) => setBiograficos({ edad: parseInt(e.target.value, 10) || 0 })}
              />
              <span className="print-only">{A.datos_biograficos.edad ?? ''}</span>
            </td>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Grupo sanguíneo</td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Select
                value={A.datos_biograficos.grupo_sanguineo || ''}
                onValueChange={(v) => setBiograficos({ grupo_sanguineo: v })}
              >
                <SelectTrigger className="screen-only h-7 min-h-0 w-full border-0 bg-transparent text-[9pt]">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="print-only">{A.datos_biograficos.grupo_sanguineo || ''}</span>
            </td>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Lateralidad</td>
            <td colSpan={2} className="border border-black bg-[#e8f5e9] p-0.5">
              <Select
                value={A.datos_biograficos.lateralidad}
                onValueChange={(v) => setBiograficos({ lateralidad: v as typeof A.datos_biograficos.lateralidad })}
              >
                <SelectTrigger className="screen-only h-7 min-h-0 w-full border-0 bg-transparent text-[9pt]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Diestro">Diestro</SelectItem>
                  <SelectItem value="Zurdo">Zurdo</SelectItem>
                  <SelectItem value="Ambidiestro">Ambidiestro</SelectItem>
                </SelectContent>
              </Select>
              <span className="print-only">{A.datos_biograficos.lateralidad || ''}</span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Sección B: Motivo de consulta */}
      <table className="mt-2 w-full border-collapse border border-black text-[9pt]">
        <tbody>
          <tr>
            <td colSpan={6} className="seccion-header border border-black">
              B. MOTIVO DE CONSULTA
            </td>
          </tr>
          <tr>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Puesto de Trabajo CIUO</td>
            <td colSpan={3} className="border border-black bg-[#e8f5e9] p-0.5">
              <Input
                className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]"
                value={B.puesto_trabajo_ciuo}
                onChange={(e) => setB({ puesto_trabajo_ciuo: e.target.value })}
              />
              <span className="print-only">{B.puesto_trabajo_ciuo || ''}</span>
            </td>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Fecha de Atención</td>
            <td className="border border-black bg-[#e8f5e9] p-0.5 text-center">
              <FechaDesplegable value={B.fecha_atencion} onChange={(next) => setB({ fecha_atencion: next })} />
            </td>
          </tr>
          <tr>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Fecha de Ingreso al trabajo</td>
            <td className="border border-black bg-[#e8f5e9] p-0.5 text-center">
              <FechaDesplegable value={B.fecha_ingreso_trabajo} onChange={(next) => setB({ fecha_ingreso_trabajo: next })} />
            </td>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Fecha de Reintegro</td>
            <td className="border border-black bg-[#e8f5e9] p-0.5 text-center">
              <FechaDesplegable value={B.fecha_reintegro} onChange={(next) => setB({ fecha_reintegro: next })} />
            </td>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Fecha del Último día laboral/salida</td>
            <td className="border border-black bg-[#e8f5e9] p-0.5 text-center">
              <FechaDesplegable
                value={B.fecha_ultimo_dia_laboral_salida}
                onChange={(next) => setB({ fecha_ultimo_dia_laboral_salida: next })}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={6} className="border border-black bg-[#e8f5e9] p-0.5 text-[8pt]">
              APERTURA DE HISTORIA CLÍNICA OCUPACIONAL, REVISIÓN DE RESULTADOS Y CHEQUEO DE SALUD
            </td>
          </tr>
          <tr>
            {(
              [
                { key: 'ingreso', label: 'INGRESO' },
                { key: 'periodico', label: 'PERIÓDICO' },
                { key: 'reintegro', label: 'REINTEGRO' },
                { key: 'retiro', label: 'RETIRO' },
              ] as const
            ).map(({ key, label }) => (
              <td key={key} className="border border-black bg-[#e8f5e9] p-0.5 text-center">
                <div className="text-[8pt] font-medium">{label}</div>
                <Checkbox
                  className="screen-only mx-auto h-4 w-4"
                  checked={B.tipo_evaluacion_check[key]}
                  onCheckedChange={(c) =>
                    setB({
                      tipo_evaluacion_check: { ...B.tipo_evaluacion_check, [key]: !!c },
                    })
                  }
                />
                <span className="print-only">{B.tipo_evaluacion_check[key] ? 'X' : ''}</span>
              </td>
            ))}
            <td colSpan={2} className="border border-black bg-[#e8f5e9] p-0.5" />
          </tr>
          <tr>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Observación</td>
            <td colSpan={5} className="border border-black bg-[#e8f5e9] p-0.5">
              <Input
                className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]"
                value={B.observacion}
                onChange={(e) => setB({ observacion: e.target.value })}
              />
              <span className="print-only">{B.observacion || ''}</span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Sección C: Antecedentes personales */}
      <table className="mt-2 w-full border-collapse border border-black text-[9pt]">
        <tbody>
          <tr>
            <td colSpan={7} className="seccion-header border border-black">
              C. ANTECEDENTES PERSONALES
            </td>
          </tr>
          <tr>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold w-48">ANTECEDENTES CLÍNICOS Y QUIRÚRGICOS</td>
            <td colSpan={6} className="border border-black bg-[#e8f5e9] p-0.5">
              <Textarea
                className="screen-only min-h-[60px] w-full resize-none border-0 bg-transparent p-1 text-[9pt]"
                value={C.antecedentes_clinicos_quirurgicos}
                onChange={(e) => setC({ antecedentes_clinicos_quirurgicos: e.target.value })}
              />
              <span className="print-only whitespace-pre-wrap">{C.antecedentes_clinicos_quirurgicos || ''}</span>
            </td>
          </tr>
          <tr>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">ANTECEDENTES FAMILIARES</td>
            <td colSpan={6} className="border border-black bg-[#e8f5e9] p-0.5">
              <Textarea
                className="screen-only min-h-[60px] w-full resize-none border-0 bg-transparent p-1 text-[9pt]"
                value={C.antecedentes_familiares}
                onChange={(e) => setC({ antecedentes_familiares: e.target.value })}
              />
              <span className="print-only whitespace-pre-wrap">{C.antecedentes_familiares || ''}</span>
            </td>
          </tr>
          <tr>
            <td colSpan={4} className="border border-black bg-[#d9e1f2] p-0.5 text-[8pt]">
              Condición especial para urgencia, emergencia y tratamiento médico (referido por el paciente).
            </td>
            <td colSpan={3} className="border border-black bg-[#e8f5e9] p-0.5" />
          </tr>
          <tr>
            <td className="border border-black bg-[#d4edda] p-0.5 text-[8pt]">En caso de requerir transfusiones autoriza</td>
            <td colSpan={2} className="border border-black bg-[#e8f5e9] p-0.5">
              <label className="screen-only mr-2">
                <input type="radio" name="transfusiones" checked={C.transfusiones_autoriza === 'si'} onChange={() => setC({ transfusiones_autoriza: 'si' })} /> SI
              </label>
              <label className="screen-only">
                <input type="radio" name="transfusiones" checked={C.transfusiones_autoriza === 'no'} onChange={() => setC({ transfusiones_autoriza: 'no' })} /> NO
              </label>
              <span className="print-only">{C.transfusiones_autoriza === 'si' ? 'X SI' : C.transfusiones_autoriza === 'no' ? 'X NO' : ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input className="screen-only h-6 min-h-0 w-full border-0 bg-transparent p-0.5 text-[8pt]" value={C.transfusiones_observacion} onChange={(e) => setC({ transfusiones_observacion: e.target.value })} />
              <span className="print-only">{C.transfusiones_observacion || ''}</span>
            </td>
            <td className="border border-black bg-[#d4edda] p-0.5 text-[8pt]">Se encuentra bajo algún tratamiento hormonal</td>
            <td colSpan={2} className="border border-black bg-[#e8f5e9] p-0.5">
              <label className="screen-only mr-2">
                <input type="radio" name="hormonal" checked={C.tratamiento_hormonal === 'si'} onChange={() => setC({ tratamiento_hormonal: 'si' })} /> SI
              </label>
              <Input className="screen-only mx-1 inline-block h-6 w-24 border-0 bg-transparent p-0.5 text-[8pt]" placeholder="¿Cuál?" value={C.tratamiento_hormonal_cual} onChange={(e) => setC({ tratamiento_hormonal_cual: e.target.value })} />
              <label className="screen-only mr-2">
                <input type="radio" name="hormonal" checked={C.tratamiento_hormonal === 'no'} onChange={() => setC({ tratamiento_hormonal: 'no' })} /> NO
              </label>
              <span className="print-only">{C.tratamiento_hormonal === 'si' ? 'X SI' : C.tratamiento_hormonal === 'no' ? 'X NO' : ''} {C.tratamiento_hormonal_cual || ''}</span>
            </td>
          </tr>
          <tr>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">ANTECEDENTES GINECO OBSTÉTRICOS</td>
            <td colSpan={6} className="border border-black bg-[#e8f5e9] p-0.5" />
          </tr>
          <tr>
            <td className="border border-black bg-[#d9e1f2] p-0.5 text-[8pt]">FECHA ÚLTIMA MENSTRUACIÓN</td>
            <td className="border border-black bg-[#e8f5e9] p-0.5 text-center">
              <FechaDesplegable value={C.gineco_obstetricos.fecha_ultima_menstruacion} onChange={(next) => setGineco({ fecha_ultima_menstruacion: next })} />
            </td>
            <td className="border border-black bg-[#d9e1f2] p-0.5 text-[8pt]">GESTAS</td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input type="number" min={0} className="screen-only h-6 min-h-0 w-full border-0 bg-transparent p-0.5 text-[9pt]" value={C.gineco_obstetricos.gestas || ''} onChange={(e) => setGineco({ gestas: parseInt(e.target.value, 10) || 0 })} />
              <span className="print-only">{C.gineco_obstetricos.gestas ?? ''}</span>
            </td>
            <td className="border border-black bg-[#d9e1f2] p-0.5 text-[8pt]">PARTOS</td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input type="number" min={0} className="screen-only h-6 min-h-0 w-full border-0 bg-transparent p-0.5 text-[9pt]" value={C.gineco_obstetricos.partos || ''} onChange={(e) => setGineco({ partos: parseInt(e.target.value, 10) || 0 })} />
              <span className="print-only">{C.gineco_obstetricos.partos ?? ''}</span>
            </td>
            <td className="border border-black bg-[#d9e1f2] p-0.5 text-[8pt]">CESÁREAS</td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input type="number" min={0} className="screen-only h-6 min-h-0 w-full border-0 bg-transparent p-0.5 text-[9pt]" value={C.gineco_obstetricos.cesareas || ''} onChange={(e) => setGineco({ cesareas: parseInt(e.target.value, 10) || 0 })} />
              <span className="print-only">{C.gineco_obstetricos.cesareas ?? ''}</span>
            </td>
          </tr>
          <tr>
            <td className="border border-black bg-[#d9e1f2] p-0.5 text-[8pt]">ABORTOS</td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input type="number" min={0} className="screen-only h-6 min-h-0 w-full border-0 bg-transparent p-0.5 text-[9pt]" value={C.gineco_obstetricos.abortos || ''} onChange={(e) => setGineco({ abortos: parseInt(e.target.value, 10) || 0 })} />
              <span className="print-only">{C.gineco_obstetricos.abortos ?? ''}</span>
            </td>
            <td className="border border-black bg-[#d9e1f2] p-0.5 text-[8pt]">MÉTODO PLANIFICACIÓN FAMILIAR</td>
            <td colSpan={4} className="border border-black bg-[#e8f5e9] p-0.5">
              <label className="screen-only mr-2">
                <input type="radio" name="metodo_plan" checked={C.gineco_obstetricos.metodo_planificacion === 'si'} onChange={() => setGineco({ metodo_planificacion: 'si' })} /> si
              </label>
              <Input className="screen-only mx-1 inline-block h-6 w-20 border-0 bg-transparent p-0.5 text-[8pt]" placeholder="¿cuál?" value={C.gineco_obstetricos.metodo_planificacion_cual} onChange={(e) => setGineco({ metodo_planificacion_cual: e.target.value })} />
              <label className="screen-only mr-2">
                <input type="radio" name="metodo_plan" checked={C.gineco_obstetricos.metodo_planificacion === 'no'} onChange={() => setGineco({ metodo_planificacion: 'no' })} /> no
              </label>
              <label className="screen-only">
                <input type="radio" name="metodo_plan" checked={C.gineco_obstetricos.metodo_planificacion === 'no_responde'} onChange={() => setGineco({ metodo_planificacion: 'no_responde' })} /> no responde
              </label>
              <span className="print-only">{C.gineco_obstetricos.metodo_planificacion} {C.gineco_obstetricos.metodo_planificacion_cual || ''}</span>
            </td>
          </tr>
          <tr>
            <td className="border border-black bg-[#d9e1f2] p-1 text-[8pt]">EXÁMENES REALIZADOS ¿CUAL?</td>
            <td className="border border-black bg-[#d9e1f2] p-1 text-[8pt]">TIEMPO (años)</td>
            <td colSpan={4} className="border border-black bg-[#d9e1f2] p-1 text-[7pt] border-b-2 border-[#2e7d32]">
              Registrar resultado únicamente si interfiere con la actividad laboral y previa autorización del titular.
            </td>
          </tr>
          <tr>
            <td className="border border-black bg-[#e8f5e9] p-1 align-top">
              <Input className="screen-only h-8 w-full border-0 bg-transparent p-1 text-[9pt]" value={C.examenes_realizados_cual} onChange={(e) => setC({ examenes_realizados_cual: e.target.value })} />
              <span className="print-only">{C.examenes_realizados_cual || ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-1 align-top">
              <Input type="number" min={0} className="screen-only h-8 w-full border-0 bg-transparent p-1 text-[9pt]" value={C.examenes_realizados_tiempo_anos || ''} onChange={(e) => setC({ examenes_realizados_tiempo_anos: parseInt(e.target.value, 10) || 0 })} />
              <span className="print-only">{C.examenes_realizados_tiempo_anos ?? ''}</span>
            </td>
            <td colSpan={4} className="border border-black bg-[#e8f5e9] p-1 align-top">
              <Textarea
                className="screen-only min-h-[72px] w-full resize-none border-0 bg-transparent p-1 text-[9pt]"
                placeholder="Escribir aquí..."
                value={C.registro_resultado_autorizacion_titular}
                onChange={(e) => setC({ registro_resultado_autorizacion_titular: e.target.value })}
              />
              <span className="print-only whitespace-pre-wrap">{C.registro_resultado_autorizacion_titular || ''}</span>
            </td>
          </tr>
          <tr>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">ANTECEDENTES REPRODUCTIVOS MASCULINOS</td>
            <td colSpan={6} className="border border-black bg-[#e8f5e9] p-0.5" />
          </tr>
          <tr>
            <td className="border border-black bg-[#d9e1f2] p-1 text-[8pt]">EXÁMENES REALIZADOS ¿CUAL?</td>
            <td className="border border-black bg-[#e8f5e9] p-1">
              <Input className="screen-only h-8 w-full border-0 bg-transparent p-1 text-[9pt]" value={C.reproductivos_masculinos_examenes_cual} onChange={(e) => setC({ reproductivos_masculinos_examenes_cual: e.target.value })} />
              <span className="print-only">{C.reproductivos_masculinos_examenes_cual || ''}</span>
            </td>
            <td className="border border-black bg-[#d9e1f2] p-1 text-[8pt]">TIEMPO (año)</td>
            <td className="border border-black bg-[#e8f5e9] p-1">
              <Input type="number" min={0} className="screen-only h-8 w-full border-0 bg-transparent p-1 text-[9pt]" value={C.reproductivos_masculinos_tiempo_anos || ''} onChange={(e) => setC({ reproductivos_masculinos_tiempo_anos: parseInt(e.target.value, 10) || 0 })} />
              <span className="print-only">{C.reproductivos_masculinos_tiempo_anos ?? ''}</span>
            </td>
            <td className="border border-black bg-[#d9e1f2] p-1 text-[8pt]">MÉTODO PLANIFICACIÓN FAMILIAR</td>
            <td colSpan={2} className="border border-black bg-[#e8f5e9] p-0.5">
              <label className="screen-only mr-1">
                <input type="radio" name="rep_metodo" checked={C.reproductivos_masculinos_metodo_planificacion === 'si'} onChange={() => setC({ reproductivos_masculinos_metodo_planificacion: 'si' })} /> si
              </label>
              <Input className="screen-only mx-1 inline-block h-6 w-16 border-0 bg-transparent p-0.5 text-[8pt]" placeholder="¿cual?" value={C.reproductivos_masculinos_metodo_cual} onChange={(e) => setC({ reproductivos_masculinos_metodo_cual: e.target.value })} />
              <label className="screen-only mr-1">
                <input type="radio" name="rep_metodo" checked={C.reproductivos_masculinos_metodo_planificacion === 'no'} onChange={() => setC({ reproductivos_masculinos_metodo_planificacion: 'no' })} /> no
              </label>
              <label className="screen-only">
                <input type="radio" name="rep_metodo" checked={C.reproductivos_masculinos_metodo_planificacion === 'no_responde'} onChange={() => setC({ reproductivos_masculinos_metodo_planificacion: 'no_responde' })} /> no responde
              </label>
              <span className="print-only">{C.reproductivos_masculinos_metodo_planificacion} {C.reproductivos_masculinos_metodo_cual || ''}</span>
            </td>
          </tr>
          <tr>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">CONSUMO DE SUSTANCIAS</td>
            <td className="border border-black bg-[#d9e1f2] p-0.5 text-[8pt] text-center">TIEMPO CONSUMO</td>
            <td className="border border-black bg-[#d9e1f2] p-0.5 text-[8pt] text-center">EX CONSUMIDOR</td>
            <td className="border border-black bg-[#d9e1f2] p-0.5 text-[8pt] text-center">TIEMPO ABSTINENCIA</td>
            <td className="border border-black bg-[#d9e1f2] p-0.5 text-[8pt] text-center">NO CONSUME</td>
            <td colSpan={2} className="border border-black bg-[#d4edda] p-0.5 font-semibold">ESTILO DE VIDA</td>
          </tr>
          <tr>
            <td className="border border-black bg-[#d9e1f2] p-0.5 text-[8pt]">TABACO</td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input className="screen-only h-6 min-h-0 w-full border-0 bg-transparent p-0.5 text-[8pt]" value={C.consumo_tabaco_tiempo} onChange={(e) => setC({ consumo_tabaco_tiempo: e.target.value })} />
              <span className="print-only">{C.consumo_tabaco_tiempo || ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5 text-center">
              <Checkbox className="screen-only h-4 w-4" checked={C.consumo_tabaco_ex_consumidor} onCheckedChange={(c) => setC({ consumo_tabaco_ex_consumidor: !!c })} />
              <span className="print-only">{C.consumo_tabaco_ex_consumidor ? 'X' : ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input className="screen-only h-6 min-h-0 w-full border-0 bg-transparent p-0.5 text-[8pt]" value={C.consumo_tabaco_abstinencia} onChange={(e) => setC({ consumo_tabaco_abstinencia: e.target.value })} />
              <span className="print-only">{C.consumo_tabaco_abstinencia || ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5 text-center">
              <Checkbox className="screen-only h-4 w-4" checked={C.consumo_tabaco_no_consume} onCheckedChange={(c) => setC({ consumo_tabaco_no_consume: !!c })} />
              <span className="print-only">{C.consumo_tabaco_no_consume ? 'X' : ''}</span>
            </td>
            <td className="border border-black bg-[#d9e1f2] p-0.5 text-[8pt]">ACTIVIDAD FÍSICA ¿CUAL?</td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input className="screen-only h-6 min-h-0 w-full border-0 bg-transparent p-0.5 text-[8pt]" value={C.actividad_fisica_cual} onChange={(e) => setC({ actividad_fisica_cual: e.target.value })} />
              <span className="print-only">{C.actividad_fisica_cual || ''}</span>
            </td>
            <td className="border border-black bg-[#d9e1f2] p-0.5 text-[8pt]">TIEMPO</td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input className="screen-only h-6 min-h-0 w-full border-0 bg-transparent p-0.5 text-[8pt]" value={C.actividad_fisica_tiempo} onChange={(e) => setC({ actividad_fisica_tiempo: e.target.value })} />
              <span className="print-only">{C.actividad_fisica_tiempo || ''}</span>
            </td>
          </tr>
          <tr>
            <td className="border border-black bg-[#d9e1f2] p-0.5 text-[8pt]">ALCOHOL</td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input className="screen-only h-6 min-h-0 w-full border-0 bg-transparent p-0.5 text-[8pt]" value={C.consumo_alcohol_tiempo} onChange={(e) => setC({ consumo_alcohol_tiempo: e.target.value })} />
              <span className="print-only">{C.consumo_alcohol_tiempo || ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5 text-center">
              <Checkbox className="screen-only h-4 w-4" checked={C.consumo_alcohol_ex_consumidor} onCheckedChange={(c) => setC({ consumo_alcohol_ex_consumidor: !!c })} />
              <span className="print-only">{C.consumo_alcohol_ex_consumidor ? 'X' : ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input className="screen-only h-6 min-h-0 w-full border-0 bg-transparent p-0.5 text-[8pt]" value={C.consumo_alcohol_abstinencia} onChange={(e) => setC({ consumo_alcohol_abstinencia: e.target.value })} />
              <span className="print-only">{C.consumo_alcohol_abstinencia || ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5 text-center">
              <Checkbox className="screen-only h-4 w-4" checked={C.consumo_alcohol_no_consume} onCheckedChange={(c) => setC({ consumo_alcohol_no_consume: !!c })} />
              <span className="print-only">{C.consumo_alcohol_no_consume ? 'X' : ''}</span>
            </td>
            <td className="border border-black bg-[#d9e1f2] p-0.5 text-[8pt]">MEDICACIÓN HABITUAL</td>
            <td colSpan={2} className="border border-black bg-[#e8f5e9] p-0.5">
              <Input className="screen-only h-6 min-h-0 w-full border-0 bg-transparent p-0.5 text-[8pt]" value={C.medicacion_habitual} onChange={(e) => setC({ medicacion_habitual: e.target.value })} />
              <span className="print-only">{C.medicacion_habitual || ''}</span>
            </td>
          </tr>
          <tr>
            <td className="border border-black bg-[#d9e1f2] p-0.5 text-[8pt]">OTRAS ¿Cuál?</td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input className="screen-only h-6 min-h-0 w-full border-0 bg-transparent p-0.5 text-[8pt]" value={C.consumo_otras_cual} onChange={(e) => setC({ consumo_otras_cual: e.target.value })} />
              <span className="print-only">{C.consumo_otras_cual || ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input className="screen-only h-6 min-h-0 w-full border-0 bg-transparent p-0.5 text-[8pt]" value={C.consumo_otras_tiempo} onChange={(e) => setC({ consumo_otras_tiempo: e.target.value })} />
              <span className="print-only">{C.consumo_otras_tiempo || ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5 text-center">
              <Checkbox className="screen-only h-4 w-4" checked={C.consumo_otras_ex_consumidor} onCheckedChange={(c) => setC({ consumo_otras_ex_consumidor: !!c })} />
              <span className="print-only">{C.consumo_otras_ex_consumidor ? 'X' : ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input className="screen-only h-6 min-h-0 w-full border-0 bg-transparent p-0.5 text-[8pt]" value={C.consumo_otras_abstinencia} onChange={(e) => setC({ consumo_otras_abstinencia: e.target.value })} />
              <span className="print-only">{C.consumo_otras_abstinencia || ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5 text-center">
              <Checkbox className="screen-only h-4 w-4" checked={C.consumo_otras_no_consume} onCheckedChange={(c) => setC({ consumo_otras_no_consume: !!c })} />
              <span className="print-only">{C.consumo_otras_no_consume ? 'X' : ''}</span>
            </td>
            <td colSpan={2} className="border border-black bg-[#d4edda] p-0.5 text-[8pt] font-semibold">
              CONDICIÓN PREEXISTENTE — ¿CUÁL? <Input className="screen-only ml-1 inline-block h-6 w-24 border-0 bg-transparent p-0.5 text-[8pt]" value={C.condicion_preexistente_cual} onChange={(e) => setC({ condicion_preexistente_cual: e.target.value })} />
              <span className="print-only">{C.condicion_preexistente_cual || ''}</span>
              CANTIDAD <Input className="screen-only ml-1 inline-block h-6 w-16 border-0 bg-transparent p-0.5 text-[8pt]" value={C.condicion_preexistente_cantidad} onChange={(e) => setC({ condicion_preexistente_cantidad: e.target.value })} />
              <span className="print-only">{C.condicion_preexistente_cantidad || ''}</span>
            </td>
          </tr>
          <tr>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Observación</td>
            <td colSpan={6} className="border border-black bg-[#e8f5e9] p-0.5">
              <Input className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]" value={C.observacion} onChange={(e) => setC({ observacion: e.target.value })} />
              <span className="print-only">{C.observacion || ''}</span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Revisión por órganos y sistemas: grid 3 columnas */}
      <div className="ficha-paso1-revision mt-2">
        <div className="seccion-header border border-black p-1 font-bold">
          Revisión por órganos y sistemas (N: Normal / A: Anormal)
        </div>
        <div
          className="grid gap-0 border border-black border-t-0 [&>*:nth-child(3n)]:border-r-0"
          style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
        >
          {REVISION_KEYS.map((key) => (
            <div
              key={key}
              className="flex border-b border-r border-black"
              style={{ minHeight: '2.5rem' }}
            >
              <div className="flex min-w-0 flex-1 flex-col border-r border-black">
                <div className="border-b border-black bg-[#d9e1f2] px-1 py-0.5 text-[8pt] font-medium">
                  {LABELS_REVISION[key]}
                </div>
                <div className="flex flex-1 items-center gap-1 bg-[#e8f0fc] p-0.5">
                  <label className="flex items-center gap-0.5 whitespace-nowrap text-[8pt]">
                    <input
                      type="radio"
                      name={`rev-${key}`}
                      className="screen-only h-3 w-3"
                      checked={rev[key].estado === 'Normal'}
                      onChange={() => setItemRevision(key, 'estado', 'Normal')}
                    />
                    <span className="print-only">{rev[key].estado === 'Normal' ? 'X' : ''}</span>
                    N
                  </label>
                  <label className="flex items-center gap-0.5 whitespace-nowrap text-[8pt]">
                    <input
                      type="radio"
                      name={`rev-${key}`}
                      className="screen-only h-3 w-3"
                      checked={rev[key].estado === 'Anormal'}
                      onChange={() => setItemRevision(key, 'estado', 'Anormal')}
                    />
                    <span className="print-only">{rev[key].estado === 'Anormal' ? 'X' : ''}</span>
                    A
                  </label>
                  <Input
                    className="screen-only ml-1 h-6 min-h-0 flex-1 border-0 bg-transparent p-0.5 text-[8pt]"
                    placeholder="Observación"
                    value={rev[key].observacion}
                    onChange={(e) => setItemRevision(key, 'observacion', e.target.value)}
                  />
                  <span className="print-only ml-1 flex-1 text-[8pt]">{rev[key].observacion || ''}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signos vitales y antropometría: una fila */}
      <table className="ficha-paso1-signos mt-2 w-full border-collapse border border-black text-[9pt]">
        <thead>
          <tr>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Temperatura (°C)</td>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Presión arterial (mmHg)</td>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Frec. cardíaca (lat/min)</td>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Frec. respiratoria (fr/min)</td>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Peso (kg)</td>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Talla (cm)</td>
            <td className="border border-black bg-[#d4edda] p-0.5 font-semibold">Índice masa corporal (kg/m²)</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input
                type="number"
                step="0.1"
                className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]"
                value={signos.temperatura || ''}
                onChange={(e) => setSignos({ temperatura: parseFloat(e.target.value) || 0 })}
              />
              <span className="print-only">{signos.temperatura ?? ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input
                className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]"
                value={signos.presion_arterial}
                onChange={(e) => setSignos({ presion_arterial: e.target.value })}
              />
              <span className="print-only">{signos.presion_arterial || ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input
                type="number"
                className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]"
                value={signos.frecuencia_cardiaca || ''}
                onChange={(e) => setSignos({ frecuencia_cardiaca: parseInt(e.target.value, 10) || 0 })}
              />
              <span className="print-only">{signos.frecuencia_cardiaca ?? ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input
                type="number"
                className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]"
                value={signos.frecuencia_respiratoria || ''}
                onChange={(e) => setSignos({ frecuencia_respiratoria: parseInt(e.target.value, 10) || 0 })}
              />
              <span className="print-only">{signos.frecuencia_respiratoria ?? ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input
                type="number"
                step="0.1"
                className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]"
                value={signos.peso_kg || ''}
                onChange={(e) => updatePeso(parseFloat(e.target.value) || 0)}
              />
              <span className="print-only">{signos.peso_kg ?? ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <Input
                type="number"
                className="screen-only h-7 min-h-0 w-full border-0 bg-transparent p-1 text-[9pt]"
                value={signos.talla_cm || ''}
                onChange={(e) => updateTalla(parseFloat(e.target.value) || 0)}
              />
              <span className="print-only">{signos.talla_cm ?? ''}</span>
            </td>
            <td className="border border-black bg-[#e8f5e9] p-0.5">
              <span className="screen-only font-medium">{imc || ''}</span>
              <span className="print-only">{imc || ''}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export const FichaPaso1Identificacion = React.memo(FichaPaso1IdentificacionInner)
