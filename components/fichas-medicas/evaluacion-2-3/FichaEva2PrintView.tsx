'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Printer } from 'lucide-react'
import Link from 'next/link'
import type { FichaMedicaEvaluacion2Document } from '@/lib/types/ficha-medica-evaluacion-2'
import { FACTORES_FISICOS } from '@/lib/constants/factores-riesgo-fisicos'
import { FACTORES_SEGURIDAD } from '@/lib/constants/factores-riesgo-seguridad'
import { FACTORES_QUIMICOS } from '@/lib/constants/factores-riesgo-quimicos'
import { FACTORES_BIOLOGICOS } from '@/lib/constants/factores-riesgo-biologicos'
import { FACTORES_ERGONOMICOS } from '@/lib/constants/factores-riesgo-ergonomicos'
import { FACTORES_PSICOSOCIALES } from '@/lib/constants/factores-riesgo-psicosociales'

const PRINT_STYLES = `
  @media print {
    @page { margin: 12mm; size: A4; }
    html, body {
      overflow: visible !important;
      margin: 0 !important;
      padding: 0 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body * { visibility: hidden; }
    #ficha-eva2-print-root, #ficha-eva2-print-root * { visibility: visible; }
    #ficha-eva2-print-root {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      padding: 0 !important;
      box-sizing: border-box !important;
    }
    #ficha-eva2-print-content {
      width: 100% !important;
      box-sizing: border-box !important;
    }
    #ficha-eva2-print-content table {
      table-layout: fixed !important;
    }
    #ficha-eva2-print-content td, #ficha-eva2-print-content th {
      overflow-wrap: break-word !important;
      word-break: break-word !important;
    }
    .ficha-eva2-pagina {
      page-break-after: always !important;
      page-break-inside: avoid !important;
      height: 273mm !important;
      min-height: 273mm !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    .ficha-eva2-pagina:last-child {
      page-break-after: auto !important;
    }
    .ficha-eva2-tabla {
      height: 100% !important;
      width: 100% !important;
    }
    #ficha-eva2-print-content .ficha-eva2-tabla,
    #ficha-eva2-print-content .ficha-eva2-tabla * {
      font-size: 9px !important;
      line-height: 1.3 !important;
    }
    #ficha-eva2-print-content .ficha-eva2-tabla td,
    #ficha-eva2-print-content .ficha-eva2-tabla th {
      padding: 2px 3px !important;
    }
  }
`

interface FichaEva2PrintViewProps {
  data: FichaMedicaEvaluacion2Document
  autoPrint?: boolean
}

const headerCell =
  'border border-gray-300 bg-emerald-100 px-2 py-1.5 text-left text-xs font-semibold uppercase text-gray-800 print:px-1 print:py-0.5 print:text-[9px]'
const dataCell =
  'border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 print:px-1 print:py-0.5 print:text-[9px]'
const sectionHeader =
  'border border-gray-300 bg-sky-200 px-2 py-1.5 text-left text-xs font-bold uppercase text-gray-900 print:px-1 print:py-0.5 print:text-[9px]'

function getCampo(
  factores: Record<string, { campo1?: string; campo2?: string; campo3?: string; campo4?: string; campo5?: string; campo6?: string; campo7?: string }> | undefined,
  key: string,
  n: 1 | 2 | 3 | 4 | 5 | 6 | 7
) {
  const row = factores?.[key]
  return row?.[`campo${n}` as keyof typeof row] ?? ''
}

export function FichaEva2PrintView({ data, autoPrint = false }: FichaEva2PrintViewProps) {
  useEffect(() => {
    if (autoPrint) {
      const t = setTimeout(() => window.print(), 600)
      return () => clearTimeout(t)
    }
  }, [autoPrint])

  const fisicos = data.seccionG?.fisicos
  const seguridad = data.seccionG?.seguridad
  const quimicos = data.seccionG?.quimicos
  const biologicos = data.seccionG?.biologicos
  const ergonomicos = data.seccionG?.ergonomicos
  const psicosociales = data.seccionG?.psicosociales
  const medidasPreventivas = data.seccionG?.medidas_preventivas
  const factoresFisicos = fisicos?.factores ?? {}
  const factoresSeguridad = seguridad?.factores ?? {}
  const factoresQuimicos = quimicos?.factores ?? {}
  const factoresBiologicos = biologicos?.factores ?? {}
  const factoresErgonomicos = ergonomicos?.factores ?? {}
  const factoresPsicosociales = psicosociales?.factores ?? {}
  const puestoTrabajo = fisicos?.puesto_trabajo ?? ''

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />
      <div
        id="ficha-eva2-print-root"
        className="min-h-screen w-full max-w-[210mm] mx-auto space-y-6 rounded-lg border bg-white p-6 print:min-h-0 print:max-w-none print:mx-0 print:border-0 print:shadow-none print:p-0"
      >
        <div className="mb-6 print:hidden">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link href="/dashboard/fichas-medicas/evaluacion-2-3">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Button>
              </Link>
              <h1 className="min-w-0 flex-1 text-2xl font-semibold leading-tight text-gray-900">
                Evaluación Ocupacional 2-3 — Factores de Riesgo
              </h1>
            </div>
            <Link
              href={
                data.worker_id
                  ? `/dashboard/fichas-medicas/evaluacion-3-3/nuevo?trabajador=${encodeURIComponent(data.worker_id)}`
                  : '/dashboard/fichas-medicas/evaluacion-3-3/nuevo'
              }
            >
              <Button variant="outline" size="sm">
                Seguir 3-3
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir / Ver PDF
              </Button>
              <p className="text-xs text-muted-foreground">
                Si aparecen encabezados o pies de página, desmárcalos en la ventana de impresión.
              </p>
            </div>
          </div>
        </div>
        <div id="ficha-eva2-print-content" className="w-full">
        {/* Hoja 1: Puesto, Actividades, FÍSICO, DE SEGURIDAD, QUÍMICO */}
        <div className="ficha-eva2-pagina">
        <table className="ficha-eva2-tabla w-full table-fixed border-collapse text-sm">
          <thead>
            <tr>
              <th
                colSpan={8}
                className={`${sectionHeader} bg-sky-100 border-t border-gray-300`}
              >
                G. FACTORES DE RIESGO DEL TRABAJO ACTUAL
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={headerCell}>PUESTO DE TRABAJO</td>
              <td className={dataCell} colSpan={7}>
                {puestoTrabajo}
              </td>
            </tr>
            <tr>
              <td className={headerCell} colSpan={8}>
                ACTIVIDADES IMPORTANTES DENTRO DE LA JORNADA LABORAL
              </td>
            </tr>
            <tr>
              <td className={`${headerCell} bg-emerald-100`}>FÍSICO</td>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <td key={n} className={`${headerCell} text-center`}>
                  {n}
                </td>
              ))}
            </tr>
            {FACTORES_FISICOS.map(({ key, label }) => (
              <tr key={key}>
                <td className={`${dataCell} bg-emerald-50`}>{key === 'otros' ? (fisicos?.label_otros || 'Otros') : label}</td>
                <td className={dataCell}>{getCampo(factoresFisicos, key, 1)}</td>
                <td className={dataCell}>{getCampo(factoresFisicos, key, 2)}</td>
                <td className={dataCell}>{getCampo(factoresFisicos, key, 3)}</td>
                <td className={dataCell}>{getCampo(factoresFisicos, key, 4)}</td>
                <td className={dataCell}>{getCampo(factoresFisicos, key, 5)}</td>
                <td className={dataCell}>{getCampo(factoresFisicos, key, 6)}</td>
                <td className={dataCell}>{getCampo(factoresFisicos, key, 7)}</td>
              </tr>
            ))}
            <tr>
              <td className={`${headerCell} bg-emerald-100`}>DE SEGURIDAD</td>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <td key={n} className={`${headerCell} text-center`}>
                  {n}
                </td>
              ))}
            </tr>
            {(['LOCATIVOS', 'MECÁNICOS', 'ELÉCTRICOS', 'OTROS'] as const).map((categoria) => {
              const items = FACTORES_SEGURIDAD.filter((f) => f.categoria === categoria)
              if (items.length === 0) return null
              return (
                <React.Fragment key={categoria}>
                  <tr>
                    <td className={`${headerCell} bg-emerald-100/80`} colSpan={8}>
                      {categoria}
                    </td>
                  </tr>
                  {items.map(({ key, label }) => (
                    <tr key={key}>
                      <td className={`${dataCell} bg-emerald-50`}>{label}</td>
                      <td className={dataCell}>{getCampo(factoresSeguridad, key, 1)}</td>
                      <td className={dataCell}>{getCampo(factoresSeguridad, key, 2)}</td>
                      <td className={dataCell}>{getCampo(factoresSeguridad, key, 3)}</td>
                      <td className={dataCell}>{getCampo(factoresSeguridad, key, 4)}</td>
                      <td className={dataCell}>{getCampo(factoresSeguridad, key, 5)}</td>
                      <td className={dataCell}>{getCampo(factoresSeguridad, key, 6)}</td>
                      <td className={dataCell}>{getCampo(factoresSeguridad, key, 7)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              )
            })}
            <tr>
              <td className={`${headerCell} bg-emerald-100`}>QUÍMICO</td>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <td key={n} className={`${headerCell} text-center`}>
                  {n}
                </td>
              ))}
            </tr>
            {FACTORES_QUIMICOS.map(({ key, label }) => (
              <tr key={key}>
                <td className={`${dataCell} bg-emerald-50`}>{key === 'otros_quimicos' ? (quimicos?.label_otros || 'Otros') : label}</td>
                <td className={dataCell}>{getCampo(factoresQuimicos, key, 1)}</td>
                <td className={dataCell}>{getCampo(factoresQuimicos, key, 2)}</td>
                <td className={dataCell}>{getCampo(factoresQuimicos, key, 3)}</td>
                <td className={dataCell}>{getCampo(factoresQuimicos, key, 4)}</td>
                <td className={dataCell}>{getCampo(factoresQuimicos, key, 5)}</td>
                <td className={dataCell}>{getCampo(factoresQuimicos, key, 6)}</td>
                <td className={dataCell}>{getCampo(factoresQuimicos, key, 7)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Hoja 2: BIOLÓGICO, ERGONÓMICO, PSICOSOCIAL, MEDIDAS PREVENTIVAS */}
        <div className="ficha-eva2-pagina">
        <table className="ficha-eva2-tabla w-full table-fixed border-collapse text-sm">
          <thead>
            <tr>
              <th
                colSpan={8}
                className={`${sectionHeader} bg-sky-100 border-t border-gray-300`}
              >
                G. FACTORES DE RIESGO DEL TRABAJO ACTUAL
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`${headerCell} bg-emerald-100`}>BIOLÓGICO</td>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <td key={n} className={`${headerCell} text-center`}>
                  {n}
                </td>
              ))}
            </tr>
            {FACTORES_BIOLOGICOS.map(({ key, label }) => (
              <tr key={key}>
                <td className={`${dataCell} bg-emerald-50`}>{label}</td>
                <td className={dataCell}>{getCampo(factoresBiologicos, key, 1)}</td>
                <td className={dataCell}>{getCampo(factoresBiologicos, key, 2)}</td>
                <td className={dataCell}>{getCampo(factoresBiologicos, key, 3)}</td>
                <td className={dataCell}>{getCampo(factoresBiologicos, key, 4)}</td>
                <td className={dataCell}>{getCampo(factoresBiologicos, key, 5)}</td>
                <td className={dataCell}>{getCampo(factoresBiologicos, key, 6)}</td>
                <td className={dataCell}>{getCampo(factoresBiologicos, key, 7)}</td>
              </tr>
            ))}
            <tr>
              <td className={`${headerCell} bg-emerald-100`}>ERGONÓMICO</td>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <td key={n} className={`${headerCell} text-center`}>
                  {n}
                </td>
              ))}
            </tr>
            {FACTORES_ERGONOMICOS.map(({ key, label }) => (
              <tr key={key}>
                <td className={`${dataCell} bg-emerald-50`}>{key === 'otros_ergonomicos' ? (ergonomicos?.label_otros || 'Otros') : label}</td>
                <td className={dataCell}>{getCampo(factoresErgonomicos, key, 1)}</td>
                <td className={dataCell}>{getCampo(factoresErgonomicos, key, 2)}</td>
                <td className={dataCell}>{getCampo(factoresErgonomicos, key, 3)}</td>
                <td className={dataCell}>{getCampo(factoresErgonomicos, key, 4)}</td>
                <td className={dataCell}>{getCampo(factoresErgonomicos, key, 5)}</td>
                <td className={dataCell}>{getCampo(factoresErgonomicos, key, 6)}</td>
                <td className={dataCell}>{getCampo(factoresErgonomicos, key, 7)}</td>
              </tr>
            ))}
            <tr>
              <td className={`${headerCell} bg-emerald-100`}>PSICOSOCIAL</td>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <td key={n} className={`${headerCell} text-center`}>
                  {n}
                </td>
              ))}
            </tr>
            {FACTORES_PSICOSOCIALES.map(({ key, label }) => (
              <tr key={key}>
                <td className={`${dataCell} bg-emerald-50`}>{key === 'otros_psicosociales' ? (psicosociales?.label_otros || 'Otros') : label}</td>
                <td className={dataCell}>{getCampo(factoresPsicosociales, key, 1)}</td>
                <td className={dataCell}>{getCampo(factoresPsicosociales, key, 2)}</td>
                <td className={dataCell}>{getCampo(factoresPsicosociales, key, 3)}</td>
                <td className={dataCell}>{getCampo(factoresPsicosociales, key, 4)}</td>
                <td className={dataCell}>{getCampo(factoresPsicosociales, key, 5)}</td>
                <td className={dataCell}>{getCampo(factoresPsicosociales, key, 6)}</td>
                <td className={dataCell}>{getCampo(factoresPsicosociales, key, 7)}</td>
              </tr>
            ))}
            <tr>
              <td className={`${headerCell} bg-emerald-100`}>MEDIDAS PREVENTIVAS</td>
              <td className={dataCell} colSpan={7}>
                {medidasPreventivas?.texto ?? ''}
              </td>
            </tr>
          </tbody>
        </table>
        </div>
        </div>
      </div>
    </>
  )
}
