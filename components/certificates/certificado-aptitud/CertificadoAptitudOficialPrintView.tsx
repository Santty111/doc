'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileDown } from 'lucide-react'
import type { CertificadoAptitudOficialDocument } from '@/lib/types/certificado-aptitud'

const PRINT_STYLES = `
  @media print {
    @page {
      margin: 0;
      size: A4;
    }
    html, body {
      overflow: visible !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 210mm !important;
      min-height: 297mm !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body * {
      visibility: hidden;
    }
    #certificado-print-root,
    #certificado-print-root * {
      visibility: visible;
    }
    #certificado-print-root {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 210mm !important;
      height: 297mm !important;
      padding: 4mm 8mm 18mm 8mm !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
      page-break-inside: avoid !important;
    }
    #certificado-print-content {
      width: 135mm !important;
      min-height: 190mm !important;
      transform: scale(1.44) !important;
      transform-origin: top left !important;
      box-sizing: border-box !important;
      padding: 0 !important;
    }
    #certificado-print-content [data-cert-content] {
      width: 100% !important;
    }
    #certificado-print-content,
    #certificado-print-content * {
      font-size: 9px !important;
      line-height: 1.2 !important;
    }
    #certificado-print-content table {
      table-layout: fixed !important;
    }
    #certificado-print-content td,
    #certificado-print-content th {
      padding: 2px 3px !important;
    }
    #certificado-print-content .cert-observaciones,
    #certificado-print-content .cert-recomendaciones {
      min-height: 18px !important;
    }
    #certificado-print-content .cert-firma-usuario {
      min-height: 30mm !important;
      display: block !important;
    }
    #certificado-print-content .cert-firma-sello,
    #certificado-print-content .cert-firma-profesional {
      min-height: 20mm !important;
      height: 20mm !important;
      display: block !important;
    }
    #certificado-print-content .border-gray-300 {
      border-color: #d1d5db !important;
    }
    ::-webkit-scrollbar {
      display: none !important;
    }
    * {
      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
    }
  }
`

const EVALUACION_LABELS: Record<string, string> = {
  ingreso: 'INGRESO',
  periodico: 'PERIÓDICO',
  reintegro: 'REINTEGRO',
  salida: 'SALIDA',
}

const CONCEPTO_LABELS: Record<string, string> = {
  apto: 'APTO',
  apto_en_observacion: 'APTO EN OBSERVACIÓN',
  apto_con_limitaciones: 'APTO CON LIMITACIONES',
  no_apto: 'NO APTO',
}

const EVALUACION_CERTIFICACION: Record<string, string> = {
  ingreso: 'el ingreso',
  periodico: 'la ejecución',
  reintegro: 'el reintegro',
  salida: 'el retiro',
}

const headerCell =
  'border border-gray-300 bg-emerald-100 px-2 py-1.5 text-left text-xs font-semibold uppercase text-gray-800'
const dataCell =
  'border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900'

function parseFecha(fecha: string): { dd: number; mm: number; aaaa: number } {
  if (!fecha) {
    const d = new Date()
    return {
      dd: d.getDate(),
      mm: d.getMonth() + 1,
      aaaa: d.getFullYear(),
    }
  }
  const [aaaa, mm, dd] = fecha.split('T')[0].split('-').map(Number)
  return { dd: dd || 0, mm: mm || 0, aaaa: aaaa || 0 }
}

interface CertificadoAptitudOficialPrintViewProps {
  id: string
  data: CertificadoAptitudOficialDocument
  autoPrint?: boolean
}

export function CertificadoAptitudOficialPrintView({
  id,
  data,
  autoPrint = false,
}: CertificadoAptitudOficialPrintViewProps) {
  useEffect(() => {
    if (autoPrint) {
      const t = setTimeout(() => window.print(), 600)
      return () => clearTimeout(t)
    }
  }, [autoPrint])

  const { seccionA, seccionB, seccionC, seccionD, seccionE, seccionF } = data
  const empresa = seccionA.empresa
  const usuario = seccionA.usuario
  const fecha = parseFecha(seccionB.fecha_emision)
  const textoEval = EVALUACION_CERTIFICACION[seccionB.evaluacion] ?? seccionB.evaluacion

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />
      <div
        id="certificado-print-root"
        className="min-h-screen w-full max-w-[210mm] mx-auto bg-white print:min-h-0 print:max-w-none print:mx-0"
      >
        <div
          id="certificado-print-content"
          className="mx-auto max-w-4xl px-6 py-8 print:mx-0 print:max-w-none print:h-full print:min-h-full print:py-0 print:px-0"
        >
        {/* Controles - no se imprimen */}
        <div className="mb-6 flex flex-col gap-3 print:hidden">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/certificado-aptitud-oficial`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </Link>
            <Button size="sm" onClick={() => window.print()}>
              <FileDown className="mr-2 h-4 w-4" />
              Guardar como PDF / Imprimir
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            El certificado se ajusta automáticamente a la hoja A4. En Firefox,
            desactive &quot;Encabezados y pies de página&quot; si aparecen.
          </p>
        </div>

        {/* Contenido - formato Excel/tabular */}
        <div data-cert-content className="w-full border border-gray-300 print:border-0">
          {/* A. DATOS DEL ESTABLECIMIENTO - EMPRESA Y USUARIO */}
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th
                  colSpan={6}
                  className={`${headerCell} bg-emerald-200`}
                >
                  A. DATOS DEL ESTABLECIMIENTO - EMPRESA Y USUARIO
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={headerCell}>INSTITUCIÓN DEL SISTEMA O NOMBRE DE LA EMPRESA</td>
                <td className={dataCell} colSpan={2}>{empresa.institucion_nombre}</td>
                <td className={headerCell}>RUC</td>
                <td className={dataCell} colSpan={2}>{empresa.ruc}</td>
              </tr>
              <tr>
                <td className={headerCell}>CIIU</td>
                <td className={dataCell}>{empresa.ciiu}</td>
                <td className={headerCell}>ESTABLECIMIENTO DE SALUD</td>
                <td className={dataCell}>{empresa.establecimiento_salud}</td>
                <td className={headerCell}>NRO. HISTORIA CLÍNICA</td>
                <td className={dataCell}>{empresa.numero_historia_clinica}</td>
              </tr>
              <tr>
                <td className={headerCell}>NRO. ARCHIVO</td>
                <td className={dataCell} colSpan={5}>{empresa.numero_archivo}</td>
              </tr>
              <tr>
                <td className={headerCell}>PRIMER APELLIDO</td>
                <td className={dataCell}>{usuario.primer_apellido}</td>
                <td className={headerCell}>SEGUNDO APELLIDO</td>
                <td className={dataCell}>{usuario.segundo_apellido}</td>
                <td className={headerCell}>PRIMER NOMBRE</td>
                <td className={dataCell}>{usuario.primer_nombre}</td>
              </tr>
              <tr>
                <td className={headerCell}>SEGUNDO NOMBRE</td>
                <td className={dataCell}>{usuario.segundo_nombre}</td>
                <td className={headerCell}>SEXO</td>
                <td className={dataCell}>{usuario.sexo}</td>
                <td className={headerCell}>CARGO / OCUPACIÓN</td>
                <td className={dataCell}>{usuario.cargo_ocupacion}</td>
              </tr>
            </tbody>
          </table>

          {/* B. DATOS GENERALES */}
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th colSpan={4} className={`${headerCell} bg-violet-100`}>
                  B. DATOS GENERALES
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={headerCell}>FECHA DE EMISIÓN</td>
                <td className={dataCell} style={{ width: 60 }}>
                  <div className="text-center">{fecha.dd}</div>
                  <div className="text-center text-xs text-gray-500">dd</div>
                </td>
                <td className={dataCell} style={{ width: 60 }}>
                  <div className="text-center">{fecha.mm}</div>
                  <div className="text-center text-xs text-gray-500">mm</div>
                </td>
                <td className={dataCell} style={{ width: 80 }}>
                  <div className="text-center">{fecha.aaaa}</div>
                  <div className="text-center text-xs text-gray-500">aaaa</div>
                </td>
              </tr>
              <tr>
                <td className={headerCell}>EVALUACIÓN</td>
                <td className={dataCell} colSpan={3}>
                  <div className="flex gap-4">
                    {['ingreso', 'periodico', 'reintegro', 'salida'].map(
                      (opt) => (
                        <span key={opt} className="flex items-center gap-1">
                          <span
                            className={`inline-flex h-4 w-4 items-center justify-center border ${
                              seccionB.evaluacion === opt
                                ? 'border-gray-600 bg-gray-800 text-white'
                                : 'border-gray-400'
                            }`}
                          >
                            {seccionB.evaluacion === opt ? 'X' : ''}
                          </span>
                          {EVALUACION_LABELS[opt]}
                        </span>
                      )
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* C. CONCEPTO PARA APTITUD LABORAL */}
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th colSpan={4} className={`${headerCell} bg-sky-100`}>
                  C. CONCEPTO PARA APTITUD LABORAL
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={dataCell} colSpan={4}>
                  Después de la valoración médica ocupacional se certifica que
                  la persona en mención, es calificada como:
                </td>
              </tr>
              <tr>
                <td className={dataCell} colSpan={4}>
                  <div className="flex flex-wrap gap-4">
                    {[
                      'apto',
                      'apto_en_observacion',
                      'apto_con_limitaciones',
                      'no_apto',
                    ].map((opt) => (
                      <span key={opt} className="flex items-center gap-1">
                        <span
                          className={`inline-flex h-4 w-4 items-center justify-center border ${
                            seccionC.concepto_aptitud === opt
                              ? 'border-gray-600 bg-gray-800 text-white'
                              : 'border-gray-400'
                          }`}
                        >
                          {seccionC.concepto_aptitud === opt ? 'X' : ''}
                        </span>
                        {CONCEPTO_LABELS[opt]}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <td className={headerCell}>DETALLE DE OBSERVACIONES</td>
                <td className={dataCell} colSpan={3}>
                  <div className="cert-observaciones min-h-[60px] whitespace-pre-wrap">
                    {seccionC.detalle_observaciones || ''}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* D. CONDICIONES DE SALUD AL MOMENTO DEL RETIRO */}
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th colSpan={2} className={`${headerCell} bg-sky-100`}>
                  D. CONDICIONES DE SALUD AL MOMENTO DEL RETIRO
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={dataCell} colSpan={2}>
                  Después de la valoración médica ocupacional se certifica las
                  condiciones de salud al momento del retiro:
                </td>
              </tr>
              <tr>
                <td className={dataCell} colSpan={2}>
                  <div className="flex gap-6">
                    <span className="flex items-center gap-1">
                      <span
                        className={`inline-flex h-4 w-4 items-center justify-center border ${
                          seccionD.condiciones_salud_retiro === 'satisfactorio'
                            ? 'border-gray-600 bg-gray-800 text-white'
                            : 'border-gray-400'
                        }`}
                      >
                        {seccionD.condiciones_salud_retiro === 'satisfactorio'
                          ? 'X'
                          : ''}
                      </span>
                      SATISFACTORIO
                    </span>
                    <span className="flex items-center gap-1">
                      <span
                        className={`inline-flex h-4 w-4 items-center justify-center border ${
                          seccionD.condiciones_salud_retiro === 'no_satisfactorio'
                            ? 'border-gray-600 bg-gray-800 text-white'
                            : 'border-gray-400'
                        }`}
                      >
                        {seccionD.condiciones_salud_retiro === 'no_satisfactorio'
                          ? 'X'
                          : ''}
                      </span>
                      NO SATISFACTORIO
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  className={`${headerCell} align-top`}
                  style={{ width: 280 }}
                >
                  OBSERVACIONES RELACIONADAS CON LAS CONDICIONES DE SALUD AL
                  MOMENTO DEL RETIRO
                </td>
                <td className={dataCell}>
                  <div className="cert-observaciones min-h-[60px] whitespace-pre-wrap">
                    {seccionD.observaciones_salud_retiro || ''}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* E. RECOMENDACIONES */}
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className={`${headerCell} bg-sky-100`}>
                  E. RECOMENDACIONES
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={dataCell}>
                  <div className="cert-recomendaciones min-h-[80px] whitespace-pre-wrap">
                    {seccionE.recomendaciones || ''}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Párrafo de certificación */}
          <div className="border border-gray-300 bg-emerald-50 p-3">
            <p className="text-sm">
              Con este documento certifico que el trabajador se ha sometido a la
              evaluación médica requerida para{' '}
              <strong>{textoEval}</strong> al puesto laboral y se ha informado
              sobre los riesgos relacionados con el trabajo emitiendo
              recomendaciones relacionadas con su estado de salud.
            </p>
          </div>
          <p className="border border-t-0 border-gray-300 px-3 py-2 text-sm">
            La presente certificación se expide con base en la historia
            ocupacional del usuario (a), la cual tiene carácter de confidencial.
          </p>

          {/* F y G en una tabla única - alineación perfecta */}
          <table className="w-full border-collapse border-t-0 border-gray-300 text-sm">
            <thead>
              <tr>
                <th className={`${headerCell} bg-violet-100 border-r border-gray-300`} style={{ width: 'auto' }}>
                  F. DATOS DEL PROFESIONAL DE SALUD
                </th>
                <th className={`${headerCell} bg-violet-100`} style={{ width: 256 }}>
                  G. FIRMA DEL USUARIO
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`${headerCell} border-r border-gray-300`}>NOMBRE Y APELLIDO</td>
                <td rowSpan={4} className={`${dataCell} align-top p-0 border-l border-gray-300`}>
                  <div className="cert-firma-usuario min-h-[30mm] w-full" />
                </td>
              </tr>
              <tr>
                <td className={`${dataCell} border-r border-gray-300`}>{seccionF.nombre_apellido}</td>
              </tr>
              <tr>
                <td className={`${headerCell} border-r border-gray-300`}>CÓDIGO</td>
              </tr>
              <tr>
                <td className={`${dataCell} border-r border-gray-300`}>{seccionF.codigo}</td>
              </tr>
              <tr>
                <td className={`${headerCell} border-r border-gray-300`}>SELLO</td>
                <td className={`${headerCell} border-l border-gray-300`}>FIRMA DEL PROFESIONAL</td>
              </tr>
              <tr>
                <td className={`${dataCell} border-r border-gray-300`}>
                  <div className="cert-firma-sello min-h-[20mm] w-full" />
                </td>
                <td className={`${dataCell} border-l border-gray-300`}>
                  <div className="cert-firma-profesional min-h-[20mm] w-full" />
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
