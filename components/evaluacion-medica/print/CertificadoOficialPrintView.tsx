'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer } from 'lucide-react'
import type { CertificadoAptitudOficial } from '@/lib/schema-medico-types'

interface Props {
  data: CertificadoAptitudOficial
  autoPrint?: boolean
  /** En true, no muestra botones Volver/Imprimir (para incrustar en página de flujo). */
  embedded?: boolean
}

export function CertificadoOficialPrintView({ data, autoPrint = false, embedded = false }: Props) {
  useEffect(() => {
    if (autoPrint) {
      const t = setTimeout(() => window.print(), 500)
      return () => clearTimeout(t)
    }
  }, [autoPrint])

  const A = data.seccion_A_datos_establecimiento_usuario
  const B = data.seccion_B_datos_generales
  const C = data.seccion_C_concepto_aptitud
  const E = data.seccion_E_recomendaciones
  const F = data.seccion_F_datos_profesional
  const legal = data.textos_legales_obligatorios

  const docBody = (
    <>
        <h1 className="text-center text-sm font-bold border-b-2 border-black pb-2 mb-4">
          CERTIFICADO DE APTITUD
        </h1>

        <table className="w-full border-collapse border border-black text-[9pt]">
          <tbody>
            <tr>
              <td colSpan={6} className="border border-black bg-[#e8e8e8] font-bold p-1">
                A. DATOS DEL ESTABLECIMIENTO - EMPRESA Y USUARIO
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-medium w-1/4">Institución / Empresa</td>
              <td colSpan={5} className="border border-black p-1">
                {A.empresa.institucion_sistema || '-'}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1">RUC</td>
              <td className="border border-black p-1">{A.empresa.ruc || '-'}</td>
              <td className="border border-black p-1">CIIU</td>
              <td className="border border-black p-1">{A.empresa.ciiu || '-'}</td>
              <td className="border border-black p-1">Nº H. Clínica</td>
              <td className="border border-black p-1">{A.empresa.numero_historia_clinica || '-'}</td>
            </tr>
            <tr>
              <td className="border border-black p-1">Nº Archivo</td>
              <td className="border border-black p-1">{A.empresa.numero_archivo || '-'}</td>
              <td colSpan={4} className="border border-black p-1" />
            </tr>
            <tr>
              <td className="border border-black p-1">Primer apellido</td>
              <td className="border border-black p-1">{A.usuario.primer_apellido || '-'}</td>
              <td className="border border-black p-1">Segundo apellido</td>
              <td className="border border-black p-1">{A.usuario.segundo_apellido || '-'}</td>
              <td className="border border-black p-1">Nombres</td>
              <td className="border border-black p-1">
                {[A.usuario.primer_nombre, A.usuario.segundo_nombre].filter(Boolean).join(' ') || '-'}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1">Sexo</td>
              <td className="border border-black p-1">{A.usuario.sexo || '-'}</td>
              <td className="border border-black p-1">Cargo / Ocupación</td>
              <td colSpan={3} className="border border-black p-1">
                {A.usuario.cargo_ocupacion || '-'}
              </td>
            </tr>
            <tr>
              <td colSpan={6} className="border border-black bg-[#e8e8e8] font-bold p-1">
                B. DATOS GENERALES
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1">Fecha de emisión</td>
              <td className="border border-black p-1 text-center w-16">
                {B.fecha_emision.aaaa || ''}
              </td>
              <td className="border border-black p-1 text-center w-12">
                {B.fecha_emision.mm || ''}
              </td>
              <td className="border border-black p-1 text-center w-12">
                {B.fecha_emision.dd || ''}
              </td>
              <td className="border border-black p-1 text-[8pt]">aaaa</td>
              <td className="border border-black p-1 text-[8pt]">mm</td>
              <td className="border border-black p-1 text-[8pt]">dd</td>
            </tr>
            <tr>
              <td className="border border-black p-1">Evaluación</td>
              <td colSpan={5} className="border border-black p-1">
                {[
                  B.tipo_evaluacion_check.ingreso && 'Ingreso',
                  B.tipo_evaluacion_check.periodico && 'Periódico',
                  B.tipo_evaluacion_check.reintegro && 'Reintegro',
                  B.tipo_evaluacion_check.salida && 'Salida',
                ]
                  .filter(Boolean)
                  .join(' · ') || '-'}
              </td>
            </tr>
            <tr>
              <td colSpan={6} className="border border-black bg-[#e8e8e8] font-bold p-1">
                C. CONCEPTO PARA APTITUD LABORAL
              </td>
            </tr>
            <tr>
              <td colSpan={6} className="border border-black p-1 text-[8pt]">
                Después de la valoración médica ocupacional se certifica que la persona en mención, es calificada como:
              </td>
            </tr>
            <tr>
              <td colSpan={6} className="border border-black p-1">
                {C.opcion_seleccionada || '-'}
              </td>
            </tr>
            {C.detalle_observaciones && (
              <tr>
                <td className="border border-black p-1 font-medium">Detalle observaciones</td>
                <td colSpan={5} className="border border-black p-1">
                  {C.detalle_observaciones}
                </td>
              </tr>
            )}
            <tr>
              <td colSpan={6} className="border border-black bg-[#e8e8e8] font-bold p-1">
                E. RECOMENDACIONES
              </td>
            </tr>
            <tr>
              <td colSpan={6} className="border border-black p-1 whitespace-pre-wrap min-h-[80px]">
                {E.campo_texto_abierto || '-'}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 text-[7pt] text-[#333] space-y-1 border-t border-black pt-2">
          <p>{legal.nota_1}</p>
          <p>{legal.nota_2}</p>
        </div>

        <table className="w-full border-collapse border border-black text-[9pt] mt-4">
          <tbody>
            <tr>
              <td className="border border-black bg-[#e8e8e8] font-bold p-1 w-1/2">
                F. DATOS DEL PROFESIONAL
              </td>
              <td className="border border-black bg-[#e8e8e8] font-bold p-1">
                G. FIRMA DEL USUARIO
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1">
                Nombre y apellido: {F.nombre_y_apellido || '________________'}<br />
                Código: {F.codigo || '________________'}
              </td>
              <td className="border border-black p-1 align-top">
                {data.seccion_G_firma_usuario.firma ? 'Firmado' : '________________'}
              </td>
            </tr>
          </tbody>
        </table>
    </>
  )

  if (embedded) {
    return <div className="mx-auto max-w-[210mm]">{docBody}</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="no-print fixed top-4 left-4 z-50 flex gap-2">
        <Link href="/dashboard/evaluacion">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <Button type="button" size="sm" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimir
        </Button>
      </div>
      <div className="evaluacion-print mx-auto max-w-[210mm] px-4 pt-16 print:pt-0 print:px-0">
        {docBody}
      </div>
    </div>
  )
}
