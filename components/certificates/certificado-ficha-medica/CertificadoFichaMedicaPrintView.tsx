'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Printer } from 'lucide-react'
import type { CertificadoFichaMedicaDocument } from '@/lib/types/certificado-ficha-medica'

const PRINT_STYLES = `
  @media screen {
    #cert-ficha-print-content {
      overflow-x: hidden;
      max-width: 100%;
    }
    #cert-ficha-print-content table {
      table-layout: fixed;
      width: 100%;
    }
    #cert-ficha-print-content th,
    #cert-ficha-print-content td {
      min-width: 0;
      overflow-wrap: break-word;
    }
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
    }
    body * { visibility: hidden; }
    #cert-ficha-print-root, #cert-ficha-print-root * { visibility: visible; }
    #cert-ficha-print-root {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 210mm !important;
      height: 297mm !important;
      padding: 15mm !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
    }
    #cert-ficha-print-content {
      width: 100% !important;
      flex: 1 !important;
      min-height: 0 !important;
      display: flex !important;
      flex-direction: column !important;
      box-sizing: border-box !important;
    }
    #cert-ficha-print-content .cert-firma-final {
      flex: 1 1 0 !important;
      min-height: 50mm !important;
      height: 100% !important;
    }
    #cert-ficha-print-content .cert-firma-final tbody {
      height: 100% !important;
    }
    #cert-ficha-print-content .cert-firma-final tbody tr:last-child {
      height: 100% !important;
    }
    #cert-ficha-print-content .cert-firma-final tbody tr:last-child td {
      height: 100% !important;
      vertical-align: top !important;
    }
    #cert-ficha-print-content .cert-firma-final .cert-sign-cell {
      min-height: 40mm !important;
      height: 100% !important;
      display: block !important;
    }
    #cert-ficha-print-content,
    #cert-ficha-print-content table,
    #cert-ficha-print-content td,
    #cert-ficha-print-content th {
      font-size: 9px !important;
      line-height: 1.3 !important;
    }
    #cert-ficha-print-content td, #cert-ficha-print-content th {
      overflow-wrap: break-word !important;
      word-break: break-word !important;
      padding: 3px 4px !important;
    }
    #cert-ficha-print-content .cert-print-titulo { padding: 5px 8px !important; }
    #cert-ficha-print-content .cert-print-seccion { padding: 3px 8px !important; }
    #cert-ficha-print-content .cert-print-block,
    #cert-ficha-print-content .cert-print-block p,
    #cert-ficha-print-content .cert-print-block *,
    #cert-ficha-print-content p {
      font-size: 9px !important;
    }
    #cert-ficha-print-content .cert-print-min { min-height: 20px !important; }
    #cert-ficha-print-content .cert-print-sign { min-height: 35mm !important; }
    #cert-ficha-print-content .cert-print-block { padding: 4px 6px !important; }
    #cert-ficha-print-content .inline-flex { width: 10px !important; height: 10px !important; min-width: 10px !important; min-height: 10px !important; }
    #cert-ficha-print-content .gap-4 { gap: 4px !important; }
  }
`

const APTITUD_LABELS: Record<string, string> = {
  apto: 'APTO',
  apto_en_observacion: 'APTO EN OBSERVACIÓN',
  apto_con_limitaciones: 'APTO CON LIMITACIONES',
  no_apto: 'NO APTO',
}

const EVALUACION_LABELS: Record<string, string> = {
  ingreso: 'INGRESO',
  periodico: 'PERIÓDICO',
  reintegro: 'REINTEGRO',
  retiro: 'RETIRO',
}

function parseFecha(fecha: string): { dd: number; mm: number; aaaa: number } {
  if (!fecha) {
    const d = new Date()
    return { dd: d.getDate(), mm: d.getMonth() + 1, aaaa: d.getFullYear() }
  }
  const [aaaa, mm, dd] = fecha.split('T')[0].split('-').map(Number)
  return { dd: dd || 0, mm: mm || 0, aaaa: aaaa || 0 }
}

const mainTitle =
  'border border-gray-300 bg-sky-300 px-4 py-3 text-center text-sm font-bold uppercase text-gray-900 cert-print-titulo'
const sectionHeader =
  'border border-gray-300 bg-sky-200 px-4 py-2 text-left text-xs font-bold uppercase text-gray-900 cert-print-seccion'
const headerCell =
  'border border-gray-300 bg-emerald-100 px-2 py-1.5 text-left text-xs font-semibold text-gray-800'
const dataCell =
  'border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900'

interface CertificadoFichaMedicaPrintViewProps {
  data: CertificadoFichaMedicaDocument
  autoPrint?: boolean
}

export function CertificadoFichaMedicaPrintView({
  data,
  autoPrint = false,
}: CertificadoFichaMedicaPrintViewProps) {
  useEffect(() => {
    if (autoPrint) {
      const t = setTimeout(() => window.print(), 600)
      return () => clearTimeout(t)
    }
  }, [autoPrint])

  const { establecimiento, usuario } = data.seccionA ?? {
    establecimiento: { institucion_sistema: '', ruc: '', ciiu: '', establecimiento_centro_trabajo: '', numero_formulario: '', numero_archivo: '' },
    usuario: { primer_apellido: '', segundo_apellido: '', primer_nombre: '', segundo_nombre: '', sexo: 'M', puesto_trabajo_ciuo: '' },
  }
  const seccionB = data.seccionB ?? { fecha_emision: '', evaluacion: 'ingreso' as const }
  const seccionC = data.seccionC ?? { concepto_aptitud: 'apto' as const, detalle_observaciones: '' }
  const seccionD = data.seccionD ?? { descripcion: '', observacion: '' }
  const seccionE = data.seccionE ?? { nombre_apellido: '', codigo_medico: '' }
  const fecha = parseFecha(seccionB.fecha_emision)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />
      <div
        id="cert-ficha-print-root"
        className="min-h-screen w-full max-w-[210mm] mx-auto space-y-6 rounded-lg border bg-white p-6 overflow-x-hidden print:min-h-0 print:max-w-none print:mx-0 print:border-0 print:shadow-none print:p-0 print:overflow-visible"
      >
        <div className="mb-6 print:hidden">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link href="/dashboard/fichas-medicas/certificado">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Button>
              </Link>
              <h1 className="min-w-0 flex-1 text-2xl font-semibold leading-tight text-gray-900">
                Certificado de Ficha Médica
              </h1>
            </div>
            <Link href="/dashboard/fichas-medicas/certificado">
              <Button variant="outline" size="sm">
                Finalizar
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

        <div id="cert-ficha-print-content" className="w-full border border-gray-300">
          <table className="w-full border-collapse text-sm">
            {/* Título principal */}
            <thead>
              <tr>
                <th colSpan={6} className={mainTitle}>
                  CERTIFICADO - EVALUACIÓN MÉDICA OCUPACIONAL
                </th>
              </tr>
              <tr>
                <th colSpan={6} className={sectionHeader}>
                  A. DATOS DEL ESTABLECIMIENTO - DATOS DEL USUARIO
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Fila: encabezados establecimiento */}
              <tr>
                <th className={headerCell}>INSTITUCIÓN DEL SISTEMA</th>
                <th className={headerCell}>RUC</th>
                <th className={headerCell}>CIIU</th>
                <th className={headerCell}>ESTABLECIMIENTO / CENTRO DE TRABAJO</th>
                <th className={headerCell}>NÚMERO DE FORMULARIO</th>
                <th className={headerCell}>NÚMERO DE ARCHIVO</th>
              </tr>
              {/* Fila: datos establecimiento */}
              <tr>
                <td className={dataCell}>{establecimiento.institucion_sistema}</td>
                <td className={dataCell}>{establecimiento.ruc}</td>
                <td className={dataCell}>{establecimiento.ciiu}</td>
                <td className={dataCell}>{establecimiento.establecimiento_centro_trabajo}</td>
                <td className={dataCell}>{establecimiento.numero_formulario}</td>
                <td className={dataCell}>{establecimiento.numero_archivo}</td>
              </tr>
              {/* Fila: encabezados usuario */}
              <tr>
                <th className={headerCell}>PRIMER APELLIDO</th>
                <th className={headerCell}>SEGUNDO APELLIDO</th>
                <th className={headerCell}>PRIMER NOMBRE</th>
                <th className={headerCell}>SEGUNDO NOMBRE</th>
                <th className={headerCell}>SEXO</th>
                <th className={headerCell}>PUESTO DE TRABAJO (CIUO)</th>
              </tr>
              {/* Fila: datos usuario */}
              <tr>
                <td className={dataCell}>{usuario.primer_apellido}</td>
                <td className={dataCell}>{usuario.segundo_apellido}</td>
                <td className={dataCell}>{usuario.primer_nombre}</td>
                <td className={dataCell}>{usuario.segundo_nombre}</td>
                <td className={dataCell}>{usuario.sexo}</td>
                <td className={dataCell}>{usuario.puesto_trabajo_ciuo}</td>
              </tr>
            </tbody>
          </table>

          {/* B. DATOS GENERALES */}
          <table className="w-full border-collapse border-t-0 text-sm">
            <thead>
              <tr>
                <th colSpan={4} className={`${sectionHeader} bg-sky-100`}>
                  B. DATOS GENERALES
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={headerCell}>FECHA DE EMISIÓN</td>
                <td className={dataCell} style={{ width: 60 }}>
                  <div className="text-center">{fecha.aaaa}</div>
                  <div className="text-center text-xs text-gray-500">aaaa</div>
                </td>
                <td className={dataCell} style={{ width: 60 }}>
                  <div className="text-center">{fecha.mm}</div>
                  <div className="text-center text-xs text-gray-500">mm</div>
                </td>
                <td className={dataCell} style={{ width: 60 }}>
                  <div className="text-center">{fecha.dd}</div>
                  <div className="text-center text-xs text-gray-500">dd</div>
                </td>
              </tr>
              <tr>
                <td className={headerCell}>EVALUACIÓN</td>
                <td className={dataCell} colSpan={3}>
                  <div className="flex flex-wrap gap-4">
                    {(['ingreso', 'periodico', 'reintegro', 'retiro'] as const).map((opt) => (
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
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* C. APTITUD MÉDICA PARA EL TRABAJO */}
          <table className="w-full border-collapse border-t-0 text-sm">
            <thead>
              <tr>
                <th colSpan={1} className={`${sectionHeader} bg-sky-100`}>
                  C. APTITUD MÉDICA PARA EL TRABAJO
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={dataCell}>
                  Después de la valoración médica ocupacional se certifica que la persona en mención, es calificada como:
                </td>
              </tr>
              <tr>
                <td className={dataCell}>
                  <div className="flex flex-wrap gap-4">
                    {(['apto', 'apto_en_observacion', 'apto_con_limitaciones', 'no_apto'] as const).map((opt) => (
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
                        {APTITUD_LABELS[opt]}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <td className={headerCell}>DETALLE DE OBSERVACIONES:</td>
              </tr>
              <tr>
                <td className={dataCell}>
                  <div className="min-h-[60px] cert-print-min whitespace-pre-wrap">
                    {seccionC.detalle_observaciones || ''}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* D. RECOMENDACIONES / OBSERVACIONES */}
          <table className="w-full border-collapse border-t-0 text-sm">
            <thead>
              <tr>
                <th className={`${sectionHeader} bg-sky-100`}>
                  D. RECOMENDACIONES / OBSERVACIONES
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={headerCell}>Descripción</td>
              </tr>
              <tr>
                <td className={dataCell}>
                  <div className="min-h-[50px] whitespace-pre-wrap">
                    {seccionD.descripcion || ''}
                  </div>
                </td>
              </tr>
              <tr>
                <td className={headerCell}>Observación:</td>
              </tr>
              <tr>
                <td className={dataCell}>
                  <div className="min-h-[50px] whitespace-pre-wrap">
                    {seccionD.observacion || ''}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Texto de certificación (no editable) */}
          <div className="border border-gray-300 bg-emerald-50 p-3 cert-print-block">
            <p className="text-sm select-none">
              Con este documento certifico que el trabajador se ha sometido a la evaluación médica requerida para (el ingreso /la ejecución/ el reingreso y retiro) al puesto laboral y se le ha informado sobre los riesgos relacionados con el trabajo emitiendo recomendaciones relacionadas con su estado de salud.
            </p>
          </div>
          <p className="border border-t-0 border-gray-300 px-3 py-2 text-sm select-none">
            La presente certificación se expide con base en el formulario de Evaluación Ocupacional, el cual tiene carácter de confidencial.
          </p>

          {/* E. DATOS DEL PROFESIONAL y F. FIRMA DEL USUARIO */}
          <table className="cert-firma-final w-full border-collapse border-t-0 text-sm flex-1">
            <thead>
              <tr>
                <th className={`${sectionHeader} bg-sky-100 border-r border-gray-300`} style={{ width: '50%' }}>
                  E. DATOS DEL PROFESIONAL
                </th>
                <th className={`${sectionHeader} bg-sky-100`} style={{ width: '50%' }}>
                  F. FIRMA DEL USUARIO
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`${headerCell} border-r border-gray-300 align-top`}>NOMBRE Y APELLIDO</td>
                <td rowSpan={4} className={`${dataCell} align-top p-0 border-l border-gray-300`}>
                  <div className="min-h-[80px] cert-print-sign cert-sign-cell w-full" />
                  <span className="text-xs text-gray-500 px-2">(Firma física en documento impreso)</span>
                </td>
              </tr>
              <tr>
                <td className={`${dataCell} border-r border-gray-300`}>{seccionE.nombre_apellido}</td>
              </tr>
              <tr>
                <td className={`${headerCell} border-r border-gray-300 align-top`}>CÓDIGO MEDICO</td>
              </tr>
              <tr>
                <td className={`${dataCell} border-r border-gray-300`}>{seccionE.codigo_medico}</td>
              </tr>
              <tr>
                <td className={`${headerCell} border-r border-gray-300 align-top`}>FIRMA Y SELLO</td>
                <td className={`${headerCell} border-l border-gray-300 align-top`}>FIRMA DEL USUARIO</td>
              </tr>
              <tr>
                <td className={`${dataCell} border-r border-gray-300`}>
                  <div className="min-h-[60px] cert-print-sign cert-sign-cell w-full" />
                  <span className="text-xs text-gray-500">(Firma y sello en documento impreso)</span>
                </td>
                <td className={`${dataCell} border-l border-gray-300`}>
                  <div className="min-h-[60px] cert-print-sign cert-sign-cell w-full" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
