'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Printer } from 'lucide-react'
import Link from 'next/link'
import type {
  FichaMedicaEvaluacion3Document,
  FichaEva3AntecedenteEmpleo,
  FichaEva3ActividadExtra,
  FichaEva3ResultadoExamen,
  FichaEva3Diagnostico,
} from '@/lib/types/ficha-medica-evaluacion-3'

const PRINT_STYLES = `
  @media screen {
    #ficha-eva3-print-content {
      overflow-x: hidden;
      max-width: 100%;
    }
    #ficha-eva3-print-content .ficha-eva3-tabla-seccion-h {
      table-layout: fixed !important;
      width: 100% !important;
    }
    #ficha-eva3-print-content .ficha-eva3-tabla-seccion-h th,
    #ficha-eva3-print-content .ficha-eva3-tabla-seccion-h td {
      min-width: 0 !important;
      padding: 6px 8px !important;
      white-space: normal !important;
      word-wrap: break-word !important;
      overflow-wrap: break-word !important;
    }
    #ficha-eva3-print-content .ficha-eva3-tabla-seccion-h .ficha-eva3-col-si,
    #ficha-eva3-print-content .ficha-eva3-tabla-seccion-h .ficha-eva3-col-no {
      min-width: 0 !important;
      width: 2.5rem !important;
      max-width: 2.5rem !important;
    }
  }
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
    #ficha-eva3-print-root, #ficha-eva3-print-root * { visibility: visible; }
    #ficha-eva3-print-root {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      padding: 0 !important;
      box-sizing: border-box !important;
    }
    #ficha-eva3-print-content {
      width: 100% !important;
      box-sizing: border-box !important;
    }
    #ficha-eva3-print-content table {
      table-layout: fixed !important;
    }
    #ficha-eva3-print-content td, #ficha-eva3-print-content th {
      overflow-wrap: break-word !important;
      word-break: break-word !important;
    }
    #ficha-eva3-print-content .ficha-eva3-tabla,
    #ficha-eva3-print-content .ficha-eva3-tabla * {
      font-size: 9px !important;
      line-height: 1.3 !important;
    }
    #ficha-eva3-print-content .ficha-eva3-tabla td,
    #ficha-eva3-print-content .ficha-eva3-tabla th {
      padding: 2px 3px !important;
    }
  }
`

interface FichaEva3PrintViewProps {
  data: FichaMedicaEvaluacion3Document
  autoPrint?: boolean
}

const headerCell =
  'border border-gray-300 bg-emerald-100 px-2 py-1.5 text-left text-xs font-semibold text-gray-800 print:px-1 print:py-0.5 print:text-[9px]'
const dataCell =
  'border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 print:px-1 print:py-0.5 print:text-[9px]'
const sectionHeader =
  'border border-gray-300 bg-sky-200 px-2 py-1.5 text-left text-xs font-bold uppercase text-gray-900 print:px-1 print:py-0.5 print:text-[9px]'
const subHeader =
  'border border-gray-300 bg-emerald-100 px-2 py-1.5 text-left text-xs font-medium text-gray-800 print:px-1 print:py-0.5 print:text-[9px]'
const parentHeader =
  'border border-gray-300 bg-emerald-200 px-1 py-1 text-center text-xs font-bold uppercase text-gray-900 print:px-0.5 print:py-0.5 print:text-[9px]'
function checkVal(v: boolean): string {
  return v ? 'X' : ''
}

export function FichaEva3PrintView({ data, autoPrint = false }: FichaEva3PrintViewProps) {
  useEffect(() => {
    if (autoPrint) {
      const t = setTimeout(() => window.print(), 600)
      return () => clearTimeout(t)
    }
  }, [autoPrint])

  const antecedentes = data.seccionH?.antecedentes ?? []
  const actividadesExtra = data.seccionI?.actividades ?? []
  const resultadosExamenes = data.seccionJ?.resultados ?? []
  const observacionesJ = data.seccionJ?.observaciones ?? ''
  const diagnosticos = data.seccionK?.diagnosticos ?? []
  const aptitudL = data.seccionL?.aptitud ?? ''
  const observacionesL = data.seccionL?.observaciones ?? ''
  const recomendacionesM = data.seccionM?.descripcion ?? ''
  const seRealizaEvaluacionN = data.seccionN?.se_realiza_evaluacion
  const condicionSaludRelacionadaN = data.seccionN?.condicion_salud_relacionada_trabajo
  const observacionN = data.seccionN?.observacion ?? ''
  const nombresProfesional = data.seccionO?.nombres_apellidos_profesional ?? ''
  const codigoMedico = data.seccionO?.codigo_medico ?? ''

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />
      <div
        id="ficha-eva3-print-root"
        className="min-h-screen w-full max-w-[210mm] mx-auto space-y-6 rounded-lg border bg-white p-6 overflow-x-hidden print:min-h-0 print:max-w-none print:mx-0 print:border-0 print:shadow-none print:p-0 print:overflow-visible"
      >
        <div className="mb-6 print:hidden">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link href="/dashboard/fichas-medicas/evaluacion-3-3">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Button>
              </Link>
              <h1 className="min-w-0 flex-1 text-2xl font-semibold leading-tight text-gray-900">
                Evaluación Ocupacional 3-3 — Cierre de Evaluación
              </h1>
            </div>
            <Link href="/dashboard/fichas-medicas/certificado/nuevo">
              <Button variant="outline" size="sm">
                Seguir Certificado
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
                Si aparecen encabezados o pies de página, desmárcalos en la ventana
                de impresión.
              </p>
            </div>
          </div>
        </div>
        <div id="ficha-eva3-print-content" className="w-full">
          <table className="ficha-eva3-tabla ficha-eva3-tabla-seccion-h w-full table-auto border-collapse text-sm print:table-fixed">
            <thead>
              <tr>
                <th
                  colSpan={13}
                  className={`${sectionHeader} bg-sky-100 border-t border-gray-300`}
                >
                  H. ACTIVIDAD LABORAL / INCIDENTES / ACCIDENTES / ENFERMEDADES
                  OCUPACIONALES
                </th>
              </tr>
              <tr>
                <th
                  colSpan={13}
                  className={`${subHeader} bg-emerald-50 border-t-0`}
                >
                  ANTECEDENTES DE EMPLEOS ANTERIORES Y/O TRABAJO ACTUAL
                </th>
              </tr>
              {/* Fila de encabezados de grupo */}
              <tr>
                <th
                  rowSpan={2}
                  className={`${headerCell} align-middle w-[11%]`}
                >
                  CENTRO DE TRABAJO
                </th>
                <th
                  rowSpan={2}
                  className={`${headerCell} align-middle w-[13%]`}
                >
                  ACTIVIDADES QUE DESEMPEÑABA
                </th>
                <th
                  colSpan={3}
                  className={`${parentHeader} border-b-emerald-200`}
                >
                  TRABAJO
                </th>
                <th
                  colSpan={3}
                  className={`${parentHeader} border-b-emerald-200`}
                >
                  De los Accidentes de Trabajo y las Enfermedades Profesionales
                </th>
                <th
                  colSpan={4}
                  className={`${parentHeader} border-b-emerald-200`}
                >
                  CALIFICADO POR INSTITUTO ECUATORIANO DE SEGURIDAD SOCIAL
                </th>
                <th
                  rowSpan={2}
                  className={`${headerCell} align-middle w-[8%]`}
                >
                  OBSERVACIONES
                </th>
              </tr>
              {/* Fila de subencabezados */}
              <tr>
                <th className={`${headerCell} text-center`}>ANTERIOR</th>
                <th className={`${headerCell} text-center`}>ACTUAL</th>
                <th className={`${headerCell} text-center`}>
                  TIEMPO DE TRABAJO
                </th>
                <th className={`${headerCell} text-center`}>INCIDENTE</th>
                <th className={`${headerCell} text-center`}>ACCIDENTE</th>
                <th className={`${headerCell} text-center`}>
                  ENFERMEDAD PROFESIONAL
                </th>
                <th className={`${headerCell} ficha-eva3-col-si text-center`}>SI</th>
                <th className={`${headerCell} ficha-eva3-col-no text-center`}>NO</th>
                <th className={`${headerCell} text-center`}>
                  FECHA aaaa/mm/dd
                </th>
                <th className={`${headerCell} text-center`}>ESPECIFICAR</th>
              </tr>
            </thead>
            <tbody>
              {antecedentes.length === 0 ? (
                <tr>
                  <td
                    colSpan={13}
                    className={`${dataCell} h-12 text-center text-muted-foreground`}
                  >
                    Sin registros
                  </td>
                </tr>
              ) : (
                antecedentes.map((a: FichaEva3AntecedenteEmpleo, idx: number) => (
                  <tr key={idx}>
                    <td className={dataCell}>{a.centro_trabajo ?? ''}</td>
                    <td className={dataCell}>
                      {a.actividades_desempenadas ?? ''}
                    </td>
                    <td className={`${dataCell} text-center`}>
                      {checkVal(!!a.trabajo_anterior)}
                    </td>
                    <td className={`${dataCell} text-center`}>
                      {checkVal(!!a.trabajo_actual)}
                    </td>
                    <td className={dataCell}>{a.tiempo_trabajo ?? ''}</td>
                    <td className={`${dataCell} text-center`}>
                      {checkVal(!!a.incidente)}
                    </td>
                    <td className={`${dataCell} text-center`}>
                      {checkVal(!!a.accidente)}
                    </td>
                    <td className={`${dataCell} text-center`}>
                      {checkVal(!!a.enfermedad_profesional)}
                    </td>
                    <td className={`${dataCell} text-center`}>
                      {checkVal(!!a.calificado_si)}
                    </td>
                    <td className={`${dataCell} text-center`}>
                      {checkVal(!!a.calificado_no)}
                    </td>
                    <td className={dataCell}>{a.calificado_fecha ?? ''}</td>
                    <td className={dataCell}>
                      {a.calificado_especificar ?? ''}
                    </td>
                    <td className={dataCell}>{a.observaciones ?? ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Sección I - Actividades extra laborales */}
          <table className="ficha-eva3-tabla mt-8 w-full table-fixed border-collapse text-sm">
            <thead>
              <tr>
                <th
                  colSpan={2}
                  className={`${sectionHeader} bg-sky-100 border-t border-gray-300`}
                >
                  I. ACTIVIDADES EXTRA LABORALES
                </th>
              </tr>
              <tr>
                <th
                  className={`${headerCell} text-center w-[66%]`}
                >
                  TIPO DE ACTIVIDAD
                </th>
                <th
                  className={`${headerCell} text-right w-[34%]`}
                >
                  (FECHA) aaaa/mm/dd
                </th>
              </tr>
            </thead>
            <tbody>
              {actividadesExtra.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className={`${dataCell} h-12 text-center text-muted-foreground`}
                  >
                    Sin registros
                  </td>
                </tr>
              ) : (
                actividadesExtra.map((act: FichaEva3ActividadExtra, idx: number) => (
                  <tr key={idx}>
                    <td className={dataCell}>{act.tipo_actividad ?? ''}</td>
                    <td className={`${dataCell} text-right`}>{act.fecha ?? ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Sección J - Resultados de exámenes */}
          <table className="ficha-eva3-tabla mt-8 w-full table-fixed border-collapse text-sm">
            <thead>
              <tr>
                <th
                  colSpan={3}
                  className={`${sectionHeader} bg-sky-100 border-t border-gray-300`}
                >
                  J. RESULTADOS DE EXÁMENES GENERALES Y ESPECÍFICOS DE ACUERDO
                  AL RIESGO Y PUESTO DE TRABAJO (IMAGEN, LABORATORIO Y OTROS)
                </th>
              </tr>
              <tr>
                <th className={`${headerCell} w-[33%]`}>
                  NOMBRE DEL EXAMEN
                </th>
                <th className={`${headerCell} text-right w-[20%]`}>
                  (FECHA) aaaa/mm/dd
                </th>
                <th className={`${headerCell} w-[47%]`}>RESULTADOS</th>
              </tr>
            </thead>
            <tbody>
              {resultadosExamenes.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className={`${dataCell} h-12 text-center text-muted-foreground`}
                  >
                    Sin registros
                  </td>
                </tr>
              ) : (
                resultadosExamenes.map((r: FichaEva3ResultadoExamen, idx: number) => (
                  <tr key={idx}>
                    <td className={dataCell}>{r.nombre_examen ?? ''}</td>
                    <td className={`${dataCell} text-right`}>{r.fecha ?? ''}</td>
                    <td className={dataCell}>{r.resultados ?? ''}</td>
                  </tr>
                ))
              )}
              <tr>
                <td
                  colSpan={3}
                  className={`${headerCell} align-top`}
                >
                  OBSERVACIONES:
                </td>
              </tr>
              <tr>
                <td
                  colSpan={3}
                  className={`${dataCell} min-h-[60px] align-top`}
                >
                  {observacionesJ}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Sección K - Diagnóstico */}
          <table className="ficha-eva3-tabla mt-8 w-full table-fixed border-collapse text-sm">
            <thead>
              <tr>
                <th
                  colSpan={4}
                  className={`${sectionHeader} bg-sky-100 border-t border-gray-300`}
                >
                  K. DIAGNÓSTICO
                </th>
              </tr>
              <tr>
                <th
                  colSpan={4}
                  className={`${subHeader} bg-emerald-50 border-t-0 text-right`}
                >
                  PRE: PRESUNTIVO &nbsp; DEF: DEFINITIVO
                </th>
              </tr>
              <tr>
                <th className={`${headerCell} w-[15%]`}>CIE-10</th>
                <th className={`${headerCell} w-[50%]`}>Descripción</th>
                <th className={`${headerCell} text-center w-[10%]`}>PRE</th>
                <th className={`${headerCell} text-center w-[10%]`}>DEF</th>
              </tr>
            </thead>
            <tbody>
              {diagnosticos.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className={`${dataCell} h-12 text-center text-muted-foreground`}
                  >
                    Sin registros
                  </td>
                </tr>
              ) : (
                diagnosticos.map((d: FichaEva3Diagnostico, idx: number) => (
                  <tr key={idx}>
                    <td className={dataCell}>{d.cie10 ?? ''}</td>
                    <td className={dataCell}>{d.descripcion ?? ''}</td>
                    <td className={`${dataCell} text-center`}>
                      {checkVal(!!d.presuntivo)}
                    </td>
                    <td className={`${dataCell} text-center`}>
                      {checkVal(!!d.definitivo)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Sección L - Aptitud médica */}
          <table className="ficha-eva3-tabla mt-8 w-full table-fixed border-collapse text-sm">
            <thead>
              <tr>
                <th
                  colSpan={4}
                  className={`${sectionHeader} bg-sky-100 border-t border-gray-300`}
                >
                  L. APTITUD MÉDICA PARA EL TRABAJO
                </th>
              </tr>
              <tr>
                <th className={`${headerCell} text-center`}>APTO</th>
                <th className={`${headerCell} text-center`}>APTO EN OBSERVACIÓN</th>
                <th className={`${headerCell} text-center`}>APTO CON LIMITACIONES</th>
                <th className={`${headerCell} text-center`}>NO APTO</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`${dataCell} text-center`}>
                  {aptitudL === 'apto' ? 'X' : ''}
                </td>
                <td className={`${dataCell} text-center`}>
                  {aptitudL === 'apto_observacion' ? 'X' : ''}
                </td>
                <td className={`${dataCell} text-center`}>
                  {aptitudL === 'apto_limitaciones' ? 'X' : ''}
                </td>
                <td className={`${dataCell} text-center`}>
                  {aptitudL === 'no_apto' ? 'X' : ''}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={4}
                  className={`${headerCell} align-top`}
                >
                  OBSERVACIONES:
                </td>
              </tr>
              <tr>
                <td
                  colSpan={4}
                  className={`${dataCell} min-h-[60px] align-top`}
                >
                  {observacionesL}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Sección M - Recomendaciones y/o tratamiento */}
          <table className="ficha-eva3-tabla mt-8 w-full table-fixed border-collapse text-sm">
            <thead>
              <tr>
                <th
                  className={`${sectionHeader} bg-sky-100 border-t border-gray-300`}
                >
                  M. RECOMENDACIONES Y/O TRATAMIENTO
                </th>
              </tr>
              <tr>
                <th className={`${headerCell} align-top`}>
                  Descripción
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`${dataCell} min-h-[80px] align-top whitespace-pre-wrap`}>
                  {recomendacionesM}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Sección N - Retiro (evaluación) */}
          <table className="ficha-eva3-tabla mt-8 w-full table-fixed border-collapse text-sm">
            <thead>
              <tr>
                <th
                  colSpan={3}
                  className={`${sectionHeader} bg-sky-100 border-t border-gray-300`}
                >
                  N. RETIRO (evaluación)
                </th>
              </tr>
              <tr>
                <th className={`${headerCell} w-[50%]`}></th>
                <th className={`${headerCell} text-center`}>SI</th>
                <th className={`${headerCell} text-center`}>NO</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={headerCell}>
                  SE REALIZA LA EVALUACIÓN
                </td>
                <td className={`${dataCell} text-center`}>
                  {seRealizaEvaluacionN === true ? 'X' : ''}
                </td>
                <td className={`${dataCell} text-center`}>
                  {seRealizaEvaluacionN === false ? 'X' : ''}
                </td>
              </tr>
              <tr>
                <td className={headerCell}>
                  LA CONDICIÓN DE SALUD ESTÁ RELACIONADA CON EL TRABAJO
                </td>
                <td className={`${dataCell} text-center`}>
                  {condicionSaludRelacionadaN === true ? 'X' : ''}
                </td>
                <td className={`${dataCell} text-center`}>
                  {condicionSaludRelacionadaN === false ? 'X' : ''}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={3}
                  className={`${headerCell} align-top`}
                >
                  Observación:
                </td>
              </tr>
              <tr>
                <td
                  colSpan={3}
                  className={`${dataCell} min-h-[60px] align-top whitespace-pre-wrap`}
                >
                  {observacionN}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Sección O y P - Datos del profesional / Firma del trabajador */}
          <table className="ficha-eva3-tabla mt-8 w-full table-fixed border-collapse text-sm">
            <thead>
              <tr>
                <th
                  className={`${sectionHeader} bg-sky-100 border-t border-r border-gray-300 w-[70%]`}
                >
                  O. DATOS DEL PROFESIONAL
                </th>
                <th
                  className={`${sectionHeader} bg-sky-100 border-t border-gray-300 w-[30%]`}
                >
                  P. FIRMA DEL TRABAJADOR
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`${dataCell} border-r align-top p-3`}>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-semibold text-gray-600">NOMBRES Y APELLIDOS DEL PROFESIONAL: </span>
                      <span>{nombresProfesional || '—'}</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-600">CÓDIGO MÉDICO: </span>
                      <span>{codigoMedico || '—'}</span>
                    </div>
                    <div className="mt-4">
                      <span className="text-xs font-semibold text-gray-600">FIRMA Y SELLO: </span>
                      <div className="mt-2 h-16 border border-dashed border-gray-300 rounded" />
                    </div>
                  </div>
                </td>
                <td className={`${dataCell} align-top p-3`}>
                  <div className="h-28 border border-gray-300 rounded bg-gray-50/50 flex flex-col justify-end">
                    <span className="text-[8px] text-gray-400 print:text-[9px] px-1 pb-0.5">
                      (Firma física en documento impreso)
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
