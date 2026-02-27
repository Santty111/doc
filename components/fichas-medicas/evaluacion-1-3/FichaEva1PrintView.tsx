'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Printer } from 'lucide-react'
import type { FichaMedicaEvaluacion1Document } from '@/lib/types/ficha-medica-evaluacion-1'
import { REGIONES_EXAMEN_FISICO_CONFIG } from '@/lib/constants/examen-fisico-regional'

const PRINT_STYLES = `
  #ficha-print-content {
    width: 100% !important;
  }
  #ficha-print-content table {
    table-layout: fixed !important;
    width: 100% !important;
  }
  #ficha-print-content table.seccion-a td:nth-child(5),
  #ficha-print-content table.seccion-a td:nth-child(6) {
    border-right: none !important;
  }
  #ficha-print-content table.seccion-a td:nth-child(6),
  #ficha-print-content table.seccion-a td:nth-child(7) {
    border-left: none !important;
  }
  @media print {
    @page { margin: 0; size: A4; }
    html, body {
      overflow: visible !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 210mm !important;
      min-height: 297mm !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      box-shadow: none !important;
      -webkit-box-shadow: none !important;
    }
    body * { visibility: hidden; }
    #ficha-print-root, #ficha-print-root * { visibility: visible; }
    /* Raíz ocupa toda la página (ancho e imprimir desde esquina) */
    #ficha-print-root {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      max-width: 210mm !important;
      min-width: 210mm !important;
      padding: 0 !important;
      box-sizing: border-box !important;
      box-shadow: none !important;
      -webkit-box-shadow: none !important;
    }
    #ficha-print-content {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
      border: none !important;
      box-shadow: none !important;
      -webkit-box-shadow: none !important;
    }
    #ficha-print-content table {
      table-layout: fixed !important;
      width: 100% !important;
    }
    #ficha-print-content, #ficha-print-content * {
      box-sizing: border-box !important;
    }
    #ficha-print-content td, #ficha-print-content th {
      overflow-wrap: break-word !important;
      word-wrap: break-word !important;
      word-break: break-word !important;
    }
    #ficha-print-content [class*="min-h-"] { min-height: 0 !important; }
    /* Hoja 1: A–E en una sola hoja, texto más legible; márgenes 15mm y 25mm abajo */
    .ficha-pagina-1,
    .ficha-pagina-1 * {
      font-size: 9px !important;
      line-height: 1.3 !important;
    }
    .ficha-pagina-1 td,
    .ficha-pagina-1 th {
      padding: 2px 4px !important;
    }
    .ficha-pagina-1 {
      isolation: isolate !important;
      position: relative !important;
      width: 100% !important;
      height: 267mm !important;
      min-height: 267mm !important;
      padding: 15mm 15mm 25mm 15mm !important;
      box-sizing: border-box !important;
      display: flex !important;
      flex-direction: column !important;
      page-break-after: always !important;
      page-break-inside: avoid !important;
    }
    .ficha-pagina-1 .ficha-pagina-contenido {
      flex: 0 0 auto !important;
      min-height: 0 !important;
      width: 100% !important;
    }
    .ficha-pagina-1 .ficha-pagina-espacio {
      flex: 1 1 0 !important;
      min-height: 0 !important;
      display: block !important;
    }
    /* Hoja 2: F. EXAMEN FÍSICO REGIONAL - margen superior mayor para no cortarse al imprimir */
    .ficha-pagina-2 {
      isolation: isolate !important;
      position: relative !important;
      width: 100% !important;
      min-height: 267mm !important;
      padding: 28mm 18mm 18mm 18mm !important;
      box-sizing: border-box !important;
      page-break-before: always !important;
      page-break-inside: avoid !important;
    }
    .ficha-pagina-2 .ficha-pagina-2-tabla {
      display: table !important;
      width: 100% !important;
      border-collapse: collapse !important;
    }
    .ficha-pagina-2 .ficha-pagina-2-tabla > tbody > tr > td {
      vertical-align: top !important;
      padding: 0 !important;
    }
    .ficha-pagina-2,
    .ficha-pagina-2 * {
      font-size: 9px !important;
      line-height: 1.3 !important;
    }
    .ficha-pagina-2 td,
    .ficha-pagina-2 th {
      padding: 3px 5px !important;
      white-space: normal !important;
    }
    .ficha-pagina-2 .ficha-pagina-2-pantalla {
      display: none !important;
    }
    .ficha-pagina-contenido {
      min-height: 0 !important;
      width: 100% !important;
    }
    .ficha-pagina-espacio {
      display: block !important;
    }
  }
`

const headerCell =
  'border border-gray-300 bg-emerald-100 px-2 py-1.5 text-left text-xs font-semibold uppercase text-gray-800'
const dataCell =
  'border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900'
const sectionHeader = 'border border-gray-300 bg-sky-200 px-2 py-1.5 text-left text-xs font-bold uppercase text-gray-900'

function formatDate(iso: string | undefined): string {
  if (!iso || typeof iso !== 'string') return ''
  const trimmed = iso.trim()
  if (!trimmed) return ''
  // Ya está en formato dd/mm/yyyy
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) return trimmed
  const d = new Date(trimmed)
  if (Number.isNaN(d.getTime())) return trimmed
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const TIPO_EVAL_LABELS: Record<string, string> = {
  ingreso: 'INGRESO',
  periodico: 'PERIÓDICO',
  reintegro: 'REINTEGRO',
  retiro: 'RETIRO',
}

interface FichaEva1PrintViewProps {
  id: string
  data: FichaMedicaEvaluacion1Document
  autoPrint?: boolean
}

export function FichaEva1PrintView({
  id,
  data,
  autoPrint = false,
}: FichaEva1PrintViewProps) {
  useEffect(() => {
    if (autoPrint) {
      const t = setTimeout(() => window.print(), 600)
      return () => clearTimeout(t)
    }
  }, [autoPrint])

  const { seccionA, seccionB, seccionC, seccionD, seccionE, seccionF } = data
  const est = seccionA?.establecimiento ?? {}
  const usu = seccionA?.usuario ?? {}
  const ap = seccionA?.atencion_prioritaria ?? {}

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />
      <div
        id="ficha-print-root"
        className="min-h-screen w-full max-w-[210mm] mx-auto space-y-6 rounded-lg border bg-white p-6 print:min-h-0 print:max-w-none print:mx-0 print:border-0 print:shadow-none print:p-0"
      >
        <div className="mb-6 print:hidden">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link href="/dashboard/fichas-medicas/evaluacion-1-3">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Button>
              </Link>
              <h1 className="min-w-0 flex-1 text-2xl font-semibold leading-tight text-gray-900">
                Evaluación Ocupacional 1-3 — Datos Generales
              </h1>
            </div>
            <Link
              href={
                data.worker_id
                  ? `/dashboard/fichas-medicas/evaluacion-2-3/nuevo?trabajador=${encodeURIComponent(data.worker_id)}`
                  : '/dashboard/fichas-medicas/evaluacion-2-3/nuevo'
              }
            >
              <Button variant="outline" size="sm">
                Seguir 2-3
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
                Si al imprimir aparecen encabezados o pies de página, desmarca esa opción en la ventana de impresión.
              </p>
            </div>
          </div>
        </div>

        <div id="ficha-print-content" className="w-full max-w-full border border-gray-300 [&_table]:table-fixed [&_table]:w-full">
          {/* Hoja 1: A hasta E */}
          <div className="ficha-pagina-1">
          <div className="ficha-pagina-contenido">
          {/* A. DATOS DEL ESTABLECIMIENTO - DATOS DEL USUARIO (incluye título) */}
          <table className="seccion-a w-full table-fixed border-collapse text-sm" style={{ tableLayout: 'fixed', width: '100%' }}>
            <colgroup>
              <col style={{ width: '14%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '17%' }} />
              <col style={{ width: '17%' }} />
            </colgroup>
            <thead>
              <tr>
                <th colSpan={7} className="border border-gray-300 bg-sky-300 px-4 py-2 text-center text-sm font-bold uppercase text-gray-900">
                  FORMULARIO DE EVALUACIÓN MÉDICA OCUPACIONAL
                </th>
              </tr>
              <tr>
                <th colSpan={7} className={`${sectionHeader} bg-sky-100`}>
                  A. DATOS DEL ESTABLECIMIENTO - DATOS DEL USUARIO
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={headerCell}>INSTITUCIÓN DEL SISTEMA</td>
                <td className={dataCell}>{est.institucion_sistema || ''}</td>
                <td className={headerCell}>RUC</td>
                <td className={dataCell}>{est.ruc || ''}</td>
                <td className={headerCell}>CIIU</td>
                <td className={dataCell}>{est.ciiu || ''}</td>
                <td className={dataCell}></td>
              </tr>
              <tr>
                <td className={headerCell}>ESTABLECIMIENTO / CENTRO DE TRABAJO</td>
                <td className={dataCell} colSpan={3}>{est.establecimiento_centro_trabajo || ''}</td>
                <td className={`${headerCell} border-r-0`}>NÚMERO DE HISTORIA CLÍNICA</td>
                <td className={`${dataCell} border-r-0 border-l-0`}>{est.numero_historia_clinica || ''}</td>
                <td className={`${dataCell} border-l-0`}></td>
              </tr>
              <tr>
                <td className={headerCell}>NÚMERO DE ARCHIVO</td>
                <td className={dataCell} colSpan={6}>{est.numero_archivo || ''}</td>
              </tr>
              <tr>
                <td className={headerCell}>PRIMER APELLIDO</td>
                <td className={dataCell}>{usu.primer_apellido || ''}</td>
                <td className={headerCell}>SEGUNDO APELLIDO</td>
                <td className={dataCell}>{usu.segundo_apellido || ''}</td>
                <td className={headerCell}>PRIMER NOMBRE</td>
                <td className={dataCell}>{usu.primer_nombre || ''}</td>
                <td className={dataCell}></td>
              </tr>
              <tr>
                <td className={headerCell}>SEGUNDO NOMBRE</td>
                <td className={dataCell} colSpan={6}>{usu.segundo_nombre || ''}</td>
              </tr>
              <tr>
                <td className={headerCell} rowSpan={2}>ATENCIÓN PRIORITARIA</td>
                <td className={headerCell}>Embarazada</td>
                <td className={dataCell}>{ap.embarazada ? 'X' : ''}</td>
                <td className={headerCell}>Persona con Discapacidad</td>
                <td className={dataCell}>{ap.persona_discapacidad ? 'X' : ''}</td>
                <td className={headerCell}>E. Catastrófica</td>
                <td className={dataCell}>{ap.enfermedad_catastrofica ? 'X' : ''}</td>
                <td className={dataCell}></td>
              </tr>
              <tr>
                <td className={headerCell}>Lactancia</td>
                <td className={dataCell}>{ap.lactancia ? 'X' : ''}</td>
                <td className={`${headerCell} border-r-0`}>Adulto Mayor</td>
                <td className={`${dataCell} border-r-0 border-l-0`}>{ap.adulto_mayor ? 'X' : ''}</td>
                <td colSpan={3} className={`${dataCell} border-l-0`}></td>
              </tr>
              <tr>
                <td className={headerCell}>SEXO</td>
                <td className={headerCell}>Hombre</td>
                <td className={dataCell}>{seccionA.sexo === 'hombre' ? 'X' : ''}</td>
                <td className={headerCell}>Mujer</td>
                <td className={dataCell}>{seccionA.sexo === 'mujer' ? 'X' : ''}</td>
                <td className={headerCell}>FECHA DE NACIMIENTO</td>
                <td className={dataCell}>{formatDate(seccionA.fecha_nacimiento) || ''}</td>
              </tr>
              <tr>
                <td className={headerCell}>Edad</td>
                <td className={dataCell}>{seccionA.edad ?? ''}</td>
                <td className={headerCell}>GRUPO SANGUÍNEO</td>
                <td className={dataCell}>{seccionA.grupo_sanguineo || ''}</td>
                <td className={headerCell}>LATERALIDAD</td>
                <td className={dataCell}>{seccionA.lateralidad ? String(seccionA.lateralidad).charAt(0).toUpperCase() + String(seccionA.lateralidad).slice(1) : ''}</td>
                <td className={dataCell}></td>
              </tr>
            </tbody>
          </table>

          {/* B. MOTIVO DE CONSULTA */}
          {(
            <table className="w-full table-fixed border-collapse text-sm border-t-0">
              <thead>
                <tr>
                  <th colSpan={6} className={`${sectionHeader} bg-sky-100 border-t-0`}>
                    B. MOTIVO DE CONSULTA
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={headerCell}>Puesto de Trabajo CIUO</td>
                  <td className={dataCell} colSpan={2}>{seccionB?.puesto_trabajo_ciuo || ''}</td>
                  <td className={headerCell}>Fecha de Atención aaaa/mm/dd</td>
                  <td className={dataCell} colSpan={2}>{formatDate(seccionB?.fecha_atencion) || ''}</td>
                </tr>
                <tr>
                  <td className={headerCell}>Fecha de Ingreso al trabajo aaaa/mm/dd</td>
                  <td className={dataCell}>{formatDate(seccionB?.fecha_ingreso_trabajo)}</td>
                  <td className={headerCell}>Fecha de Reintegro aaaa/mm/dd</td>
                  <td className={dataCell}>{formatDate(seccionB?.fecha_reintegro)}</td>
                  <td className={headerCell}>Fecha del Último día laboral/salida</td>
                  <td className={dataCell}>{formatDate(seccionB?.fecha_ultimo_dia_laboral)}</td>
                </tr>
                <tr>
                  <td className={headerCell}>Descripción</td>
                  <td className={dataCell} colSpan={5}>{seccionB?.descripcion_motivo || ''}</td>
                </tr>
                <tr>
                  <td className={headerCell}>Tipo de Evaluación</td>
                  <td className={dataCell} colSpan={5}>
                    {['ingreso', 'periodico', 'reintegro', 'retiro'].map((opt) => (
                      <span key={opt} className="inline-flex items-center gap-1 mr-4">
                        <span className={`inline-flex h-3 w-3 items-center justify-center border text-[9px] ${seccionB?.tipo_evaluacion === opt ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-400'}`}>
                          {seccionB?.tipo_evaluacion === opt ? 'X' : ''}
                        </span>
                        {TIPO_EVAL_LABELS[opt]}
                      </span>
                    ))}
                  </td>
                </tr>
                <tr>
                  <td className={headerCell}>Observación</td>
                  <td className={dataCell} colSpan={5}>{seccionB?.observacion || 'NINGUNA'}</td>
                </tr>
              </tbody>
            </table>
          )}

          {/* C. ANTECEDENTES PERSONALES */}
          {(
            <table className="w-full table-fixed border-collapse text-sm border-t-0">
              <thead>
                <tr>
                  <th colSpan={6} className={`${sectionHeader} bg-sky-100 border-t-0`}>
                    C. ANTECEDENTES PERSONALES
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={headerCell}>ANTECEDENTES CLÍNICOS Y QUIRÚRGICOS - Descripción</td>
                  <td className={dataCell} colSpan={5}><div className="min-h-[24px] whitespace-pre-wrap">{seccionC?.antecedentes_clinicos_quirurgicos || ''}</div></td>
                </tr>
                <tr>
                  <td className={headerCell}>ANTECEDENTES FAMILIARES - Descripción</td>
                  <td className={dataCell} colSpan={5}><div className="min-h-[24px] whitespace-pre-wrap">{seccionC?.antecedentes_familiares || ''}</div></td>
                </tr>
                <tr>
                  <td className={headerCell}>Transfusiones autoriza</td>
                  <td className={dataCell}>SI {seccionC?.transfusiones_autoriza === 'si' ? 'X' : ''}</td>
                  <td className={dataCell}>NO {seccionC?.transfusiones_autoriza === 'no' ? 'X' : ''}</td>
                  <td className={headerCell}>Tratamiento hormonal</td>
                  <td className={dataCell}>SI {seccionC?.tratamiento_hormonal === 'si' ? 'X' : ''} ¿Cuál? {seccionC?.tratamiento_hormonal_cual || ''}</td>
                  <td className={dataCell}>NO {seccionC?.tratamiento_hormonal === 'no' ? 'X' : ''}</td>
                </tr>
                {seccionA.sexo === 'mujer' && seccionC?.gineco_obstetricos && (
                  <>
                    <tr>
                      <td colSpan={6} className={headerCell}>ANTECEDENTES GINECO OBSTÉTRICOS</td>
                    </tr>
                    <tr>
                      <td className={headerCell}>Última menstruación</td>
                      <td className={dataCell}>{formatDate(seccionC.gineco_obstetricos.fecha_ultima_menstruacion)}</td>
                      <td className={headerCell}>Gestas</td>
                      <td className={dataCell}>{seccionC.gineco_obstetricos.gestas ?? ''}</td>
                      <td className={headerCell}>Partos</td>
                      <td className={dataCell}>{seccionC.gineco_obstetricos.partos ?? ''}</td>
                    </tr>
                    <tr>
                      <td className={headerCell}>Cesáreas</td>
                      <td className={dataCell}>{seccionC.gineco_obstetricos.cesareas ?? ''}</td>
                      <td className={headerCell}>Abortos</td>
                      <td className={dataCell}>{seccionC.gineco_obstetricos.abortos ?? ''}</td>
                      <td className={headerCell}>Planificación familiar</td>
                      <td className={dataCell}>si {seccionC.gineco_obstetricos.metodo_planificacion === 'si' ? 'X' : ''} ¿Cuál? {seccionC.gineco_obstetricos.metodo_planificacion_cual || ''} | no {seccionC.gineco_obstetricos.metodo_planificacion === 'no' ? 'X' : ''}</td>
                    </tr>
                    <tr>
                      <td className={headerCell}>Exámenes realizados</td>
                      <td className={dataCell}>{seccionC.gineco_obstetricos.examenes_realizados || ''}</td>
                      <td className={headerCell}>Tiempo (años)</td>
                      <td className={dataCell}>{seccionC.gineco_obstetricos.examenes_tiempo_anos ?? ''}</td>
                      <td colSpan={2} className={dataCell}></td>
                    </tr>
                  </>
                )}
                {seccionA.sexo === 'hombre' && seccionC?.reproductivos_masculinos && (
                  <>
                    <tr>
                      <td colSpan={6} className={headerCell}>ANTECEDENTES REPRODUCTIVOS MASCULINOS</td>
                    </tr>
                    {(() => {
                      const rm = seccionC.reproductivos_masculinos
                      const examenes = rm.examenes?.filter(e => e.cual || e.tiempo_anos != null) || []
                      return examenes.length > 0 ? examenes.map((e, i) => (
                        <tr key={i}>
                          <td className={headerCell}>Exámenes ¿Cuál?</td>
                          <td className={dataCell}>{e.cual || ''}</td>
                          <td className={headerCell}>Tiempo (años)</td>
                          <td className={dataCell}>{e.tiempo_anos ?? ''}</td>
                          <td colSpan={2} className={dataCell}></td>
                        </tr>
                      )) : (
                        <tr>
                          <td className={headerCell}>Exámenes ¿Cuál?</td>
                          <td className={dataCell} colSpan={5}></td>
                        </tr>
                      )
                    })()}
                    <tr>
                      <td className={headerCell}>Planificación familiar</td>
                      <td className={dataCell} colSpan={5}>si {seccionC.reproductivos_masculinos.metodo_planificacion === 'si' ? 'X' : ''} ¿Cuál? {seccionC.reproductivos_masculinos.metodo_planificacion_cual || ''} | no {seccionC.reproductivos_masculinos.metodo_planificacion === 'no' ? 'X' : ''}</td>
                    </tr>
                  </>
                )}
                <tr>
                  <td colSpan={6} className={headerCell}>CONSUMO DE SUSTANCIAS</td>
                </tr>
                <tr>
                  <td className={headerCell}></td>
                  <td className={headerCell}>Tiempo consumo (meses)</td>
                  <td className={headerCell}>Ex consumidor</td>
                  <td className={headerCell}>Tiempo abstinencia (meses)</td>
                  <td className={headerCell}>No consume</td>
                  <td className={dataCell}></td>
                </tr>
                <tr>
                  <td className={headerCell}>TABACO</td>
                  <td className={dataCell}>{seccionC?.consumo?.tabaco?.no_consume ? '' : (seccionC?.consumo?.tabaco?.tiempo_consumo_meses ?? '')}</td>
                  <td className={dataCell}>{seccionC?.consumo?.tabaco?.ex_consumidor ? 'X' : ''}</td>
                  <td className={dataCell}>{seccionC?.consumo?.tabaco?.tiempo_abstinencia_meses ?? ''}</td>
                  <td className={dataCell}>{seccionC?.consumo?.tabaco?.no_consume ? 'X' : ''}</td>
                  <td className={dataCell}></td>
                </tr>
                <tr>
                  <td className={headerCell}>ALCOHOL</td>
                  <td className={dataCell}>{seccionC?.consumo?.alcohol?.no_consume ? '' : (seccionC?.consumo?.alcohol?.tiempo_consumo_meses ?? '')}</td>
                  <td className={dataCell}>{seccionC?.consumo?.alcohol?.ex_consumidor ? 'X' : ''}</td>
                  <td className={dataCell}>{seccionC?.consumo?.alcohol?.tiempo_abstinencia_meses ?? ''}</td>
                  <td className={dataCell}>{seccionC?.consumo?.alcohol?.no_consume ? 'X' : ''}</td>
                  <td className={dataCell}></td>
                </tr>
                <tr>
                  <td className={headerCell}>OTRAS ¿Cuál?</td>
                  <td className={dataCell}>{seccionC?.consumo?.otras_cual || ''}</td>
                  <td className={dataCell} colSpan={4}></td>
                </tr>
                <tr>
                  <td colSpan={2} className={headerCell}>ESTILO DE VIDA - Actividad física</td>
                  <td className={headerCell}>¿Cuál?</td>
                  <td className={dataCell}>{seccionC?.estilo_vida?.actividad_fisica_cual || ''}</td>
                  <td className={headerCell}>Tiempo</td>
                  <td className={dataCell}>{seccionC?.estilo_vida?.actividad_fisica_tiempo || ''}</td>
                </tr>
                <tr>
                  <td className={headerCell}>Medicación habitual</td>
                  <td className={dataCell} colSpan={5}>{seccionC?.estilo_vida?.medicacion_habitual || ''}</td>
                </tr>
                <tr>
                  <td className={headerCell}>CONDICIÓN PREEXISTENTE ¿Cuál?</td>
                  <td className={dataCell}>{seccionC?.condicion_preexistente?.cual || ''}</td>
                  <td className={headerCell}>Cantidad</td>
                  <td className={dataCell} colSpan={3}>{seccionC?.condicion_preexistente?.cantidad || ''}</td>
                </tr>
                <tr>
                  <td className={headerCell}>Observación</td>
                  <td className={dataCell} colSpan={5}><div className="min-h-[20px] whitespace-pre-wrap">{seccionC?.observacion || ''}</div></td>
                </tr>
              </tbody>
            </table>
          )}

          {/* D. ENFERMEDAD O PROBLEMA ACTUAL */}
          {(
            <table className="w-full table-fixed border-collapse text-sm border-t-0">
              <thead>
                <tr>
                  <th colSpan={6} className={`${sectionHeader} bg-sky-100 border-t-0`}>
                    D. ENFERMEDAD O PROBLEMA ACTUAL
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={headerCell}>Descripción</td>
                  <td className={dataCell} colSpan={5}><div className="min-h-[40px] whitespace-pre-wrap">{seccionD?.descripcion || ''}</div></td>
                </tr>
              </tbody>
            </table>
          )}

          {/* E. CONSTANTES VITALES Y ANTROPOMETRÍA */}
          {(
            <table className="w-full table-fixed border-collapse text-sm border-t-0">
              <colgroup>
                <col style={{ width: '9%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '12%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th colSpan={9} className={`${sectionHeader} bg-sky-100 border-t-0`}>
                    E. CONSTANTES VITALES Y ANTROPOMETRÍA
                  </th>
                </tr>
                <tr>
                  <th className={`${headerCell} whitespace-nowrap text-[9px] px-1 py-1`}>TEMP (°C)</th>
                  <th className={`${headerCell} whitespace-nowrap text-[9px] px-1 py-1`}>P. ART. (mmHg)</th>
                  <th className={`${headerCell} whitespace-nowrap text-[9px] px-1 py-1`}>F. CARD. (Lat/min)</th>
                  <th className={`${headerCell} whitespace-nowrap text-[9px] px-1 py-1`}>F. RESP. (fr/min)</th>
                  <th className={`${headerCell} whitespace-nowrap text-[9px] px-1 py-1`}>O2 (%)</th>
                  <th className={`${headerCell} whitespace-nowrap text-[9px] px-1 py-1`}>PESO (Kg)</th>
                  <th className={`${headerCell} whitespace-nowrap text-[9px] px-1 py-1`}>TALLA (cm)</th>
                  <th className={`${headerCell} whitespace-nowrap text-[9px] px-1 py-1`}>IMC (kg/m²)</th>
                  <th className={`${headerCell} whitespace-nowrap text-[9px] px-1 py-1`}>P. ABD. (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={`${dataCell} min-h-[28px]`}>{seccionE?.temperatura != null ? String(seccionE.temperatura) : ''}</td>
                  <td className={`${dataCell} min-h-[28px]`}>{seccionE?.presion_arterial ?? ''}</td>
                  <td className={`${dataCell} min-h-[28px]`}>{seccionE?.frecuencia_cardiaca != null ? String(seccionE.frecuencia_cardiaca) : ''}</td>
                  <td className={`${dataCell} min-h-[28px]`}>{seccionE?.frecuencia_respiratoria != null ? String(seccionE.frecuencia_respiratoria) : ''}</td>
                  <td className={`${dataCell} min-h-[28px]`}>{seccionE?.saturacion_oxigeno != null ? String(seccionE.saturacion_oxigeno) : ''}</td>
                  <td className={`${dataCell} min-h-[28px]`}>{seccionE?.peso != null ? String(seccionE.peso) : ''}</td>
                  <td className={`${dataCell} min-h-[28px]`}>{seccionE?.talla != null ? String(seccionE.talla) : ''}</td>
                  <td className={`${dataCell} min-h-[28px]`}>{seccionE?.imc != null ? String(seccionE.imc) : ''}</td>
                  <td className={`${dataCell} min-h-[28px]`}>{seccionE?.perimetro_abdominal != null ? String(seccionE.perimetro_abdominal) : ''}</td>
                </tr>
              </tbody>
            </table>
          )}
          </div>
          <div className="ficha-pagina-espacio hidden print:block" aria-hidden="true" />
          </div>

          {/* Hoja 2: F. EXAMEN FÍSICO REGIONAL */}
          <div className="ficha-pagina-2">
          <table className="ficha-pagina-2-tabla hidden w-full border-0 print:table" role="presentation">
            <tbody>
              <tr>
                <td className="align-top p-0">
          {(
            <table className="w-full table-fixed border-collapse text-sm border-t-0">
              <thead>
                <tr>
                  <th colSpan={2} className={`${sectionHeader} bg-sky-100 border-t-0`}>
                    F. EXAMEN FÍSICO REGIONAL
                  </th>
                </tr>
                <tr>
                  <td className={headerCell}>REGIONES</td>
                  <td className={headerCell}>Patología</td>
                </tr>
              </thead>
              <tbody>
                {REGIONES_EXAMEN_FISICO_CONFIG.map(({ key: regionKey, numero, nombre, items }) =>
                  items.map((item) => {
                    const regionData = seccionF?.regiones?.[regionKey] as Record<string, boolean> | undefined
                    const val = regionData?.[item.key] ?? false
                    return (
                      <tr key={`${regionKey}-${String(item.key)}`}>
                        <td className={dataCell}>{numero}. {nombre} — {item.letra}. {item.descripcion}</td>
                        <td className={dataCell}>{val ? 'X' : ''}</td>
                      </tr>
                    )
                  })
                )}
                <tr>
                  <td colSpan={2} className={headerCell}>SI EXISTE EVIDENCIA DE PATOLOGÍA MARCAR CON &quot;X&quot; Y DESCRIBIR EN LA SIGUIENTE SECCIÓN COLOCANDO EL NUMERAL</td>
                </tr>
                <tr>
                  <td className={headerCell}>Descripción de patologías</td>
                  <td className={dataCell}><div className="min-h-[30px] whitespace-pre-wrap">{seccionF?.descripcion_patologias || ''}</div></td>
                </tr>
                <tr>
                  <td className={headerCell}>Observación</td>
                  <td className={dataCell}>{seccionF?.observacion || ''}</td>
                </tr>
              </tbody>
            </table>
          )}
                </td>
              </tr>
            </tbody>
          </table>
          {/* En pantalla se muestra sin tabla de layout */}
          <div className="ficha-pagina-2-pantalla print:hidden">
          {(
            <table className="w-full table-fixed border-collapse text-sm border-t-0">
              <thead>
                <tr>
                  <th colSpan={2} className={`${sectionHeader} bg-sky-100 border-t-0`}>
                    F. EXAMEN FÍSICO REGIONAL
                  </th>
                </tr>
                <tr>
                  <td className={headerCell}>REGIONES</td>
                  <td className={headerCell}>Patología</td>
                </tr>
              </thead>
              <tbody>
                {REGIONES_EXAMEN_FISICO_CONFIG.map(({ key: regionKey, numero, nombre, items }) =>
                  items.map((item) => {
                    const regionData = seccionF?.regiones?.[regionKey] as Record<string, boolean> | undefined
                    const val = regionData?.[item.key] ?? false
                    return (
                      <tr key={`${regionKey}-${String(item.key)}`}>
                        <td className={dataCell}>{numero}. {nombre} — {item.letra}. {item.descripcion}</td>
                        <td className={dataCell}>{val ? 'X' : ''}</td>
                      </tr>
                    )
                  })
                )}
                <tr>
                  <td colSpan={2} className={headerCell}>SI EXISTE EVIDENCIA DE PATOLOGÍA MARCAR CON &quot;X&quot; Y DESCRIBIR EN LA SIGUIENTE SECCIÓN COLOCANDO EL NUMERAL</td>
                </tr>
                <tr>
                  <td className={headerCell}>Descripción de patologías</td>
                  <td className={dataCell}><div className="min-h-[30px] whitespace-pre-wrap">{seccionF?.descripcion_patologias || ''}</div></td>
                </tr>
                <tr>
                  <td className={headerCell}>Observación</td>
                  <td className={dataCell}>{seccionF?.observacion || ''}</td>
                </tr>
              </tbody>
            </table>
          )}
          </div>
          </div>
        </div>
      </div>
    </>
  )
}
