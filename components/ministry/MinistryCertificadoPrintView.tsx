'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer } from 'lucide-react'
import type { MinistryPrintData } from './ministry-print-types'
import { CONCEPTO_APTITUD_LABELS } from '@/lib/types'

function formatDate(d: string | null): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('es-MX')
  } catch {
    return String(d)
  }
}

export function MinistryCertificadoPrintView({
  data,
  autoPrint = false,
}: {
  data: MinistryPrintData
  autoPrint?: boolean
}) {
  useEffect(() => {
    if (autoPrint) {
      const t = setTimeout(() => window.print(), 500)
      return () => clearTimeout(t)
    }
  }, [autoPrint])

  return (
    <div className="min-h-screen bg-white">
      <div className="no-print fixed top-4 left-4 z-50 flex gap-2">
        <Link href="/dashboard/constancias">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <Button size="sm" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimir / PDF
        </Button>
      </div>

      <div className="ministerio-print mx-auto max-w-[210mm] px-4 pt-16 print:pt-0 print:px-0">
        <section>
          <h2 className="text-[11pt] font-bold text-center border-b-2 border-black pb-2 mb-4">
            CERTIFICADO DE APTITUD
          </h2>
          <table className="m-table w-full text-[9pt]">
            <tbody>
              <tr>
                <td className="m-label w-1/4">Empresa / Razón Social</td>
                <td colSpan={3}>{data.empresa_razon_social || '-'}</td>
              </tr>
              <tr>
                <td className="m-label">RUC</td>
                <td>{data.empresa_ruc || '-'}</td>
                <td className="m-label">Nro Historia Clínica</td>
                <td>{data.nro_historia_clinica || '-'}</td>
              </tr>
              <tr>
                <td className="m-label">Apellidos y Nombres</td>
                <td colSpan={3}>
                  {[data.usuario_apellidos, data.usuario_nombres].filter(Boolean).join(' ') || '-'}
                </td>
              </tr>
              <tr>
                <td className="m-label">Sexo</td>
                <td>{data.usuario_sexo || '-'}</td>
                <td className="m-label">Cargo</td>
                <td>{data.usuario_cargo || '-'}</td>
              </tr>
              <tr>
                <td className="m-label">Grupo Sanguíneo</td>
                <td>{data.usuario_grupo_sanguineo || '-'}</td>
                <td className="m-label">Fecha Nacimiento / Edad</td>
                <td>
                  {formatDate(data.usuario_fecha_nacimiento)}
                  {data.usuario_edad != null ? ` (${data.usuario_edad} años)` : ''}
                </td>
              </tr>
              <tr>
                <td className="m-label">Concepto de Aptitud</td>
                <td colSpan={3} className="font-bold">
                  {data.concepto_aptitud ? CONCEPTO_APTITUD_LABELS[data.concepto_aptitud] : '-'}
                </td>
              </tr>
              <tr>
                <td className="m-label">Recomendaciones</td>
                <td colSpan={3}>
                  <p className="whitespace-pre-wrap min-h-[60px]">{data.recomendaciones || '-'}</p>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-8 grid grid-cols-2 gap-8 text-[9pt]">
            <div>
              <p className="font-semibold">Profesional</p>
              <p>{data.firma_profesional_nombre || '________________'}</p>
              <p>Código: {data.firma_profesional_codigo || '________________'}</p>
            </div>
            <div>
              <p className="font-semibold">Trabajador</p>
              <p>{data.firma_trabajador ? 'Firmado' : '________________'}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
