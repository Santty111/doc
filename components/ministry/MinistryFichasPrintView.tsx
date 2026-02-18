'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer } from 'lucide-react'
import type { MinistryPrintData } from './ministry-print-types'
import { REVISION_SISTEMAS_LABELS } from './ministry-print-types'
import { CONCEPTO_APTITUD_LABELS } from '@/lib/types'

function formatDate(d: string | null): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('es-MX')
  } catch {
    return String(d)
  }
}

export function MinistryFichasPrintView({
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

  const revisionKeys = Object.keys(REVISION_SISTEMAS_LABELS) as (keyof typeof REVISION_SISTEMAS_LABELS)[]

  return (
    <div className="min-h-screen bg-white">
      <div className="no-print fixed top-4 left-4 z-50 flex gap-2">
        <Link href="/dashboard/expedientes">
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
        {/* FICHA 1 - Cabecera + Revisión por sistemas */}
        <section className="m-page">
          <h2 className="text-[10pt] font-bold text-center mb-2 border-b border-black pb-1">
            FICHA MÉDICA OCUPACIONAL (1/3) – EVALUACIÓN MÉDICA
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
                <td className="m-label">CIIU</td>
                <td>{data.empresa_ciiu || '-'}</td>
              </tr>
              <tr>
                <td className="m-label">Establecimiento</td>
                <td>{data.empresa_establecimiento || '-'}</td>
                <td className="m-label">Nro Historia Clínica</td>
                <td>{data.nro_historia_clinica || '-'}</td>
              </tr>
              <tr>
                <td className="m-label">Nro Archivo</td>
                <td colSpan={3}>{data.nro_archivo || '-'}</td>
              </tr>
              <tr>
                <td className="m-label">Apellidos</td>
                <td>{data.usuario_apellidos || '-'}</td>
                <td className="m-label">Nombres</td>
                <td>{data.usuario_nombres || '-'}</td>
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
                <td className="m-label">Fecha Nacimiento</td>
                <td>{formatDate(data.usuario_fecha_nacimiento)}</td>
              </tr>
              <tr>
                <td className="m-label">Edad</td>
                <td>{data.usuario_edad ?? '-'}</td>
                <td className="m-label">Lateralidad</td>
                <td>{data.usuario_lateralidad || '-'}</td>
              </tr>
              <tr>
                <td className="m-label">Grupos Prioritarios</td>
                <td colSpan={3}>
                  {[
                    data.grupos_prioritarios_embarazo && 'Embarazo',
                    data.grupos_prioritarios_discapacidad && 'Discapacidad',
                    data.grupos_prioritarios_catastrofica && 'Catastrófica',
                    data.grupos_prioritarios_lactancia && 'Lactancia',
                    data.grupos_prioritarios_adulto_mayor && 'Adulto Mayor',
                  ]
                    .filter(Boolean)
                    .join(', ') || '-'}
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="text-[9pt] font-bold mt-3 mb-1">Revisión por Sistemas</h3>
          <table className="m-table w-full text-[9pt]">
            <thead>
              <tr>
                <th className="w-1/3">Sistema</th>
                <th className="w-20">Normal/Anormal</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              {revisionKeys.map((key) => {
                const r = data[key] as { estado?: string; observacion?: string } | undefined
                return (
                  <tr key={key}>
                    <td>{REVISION_SISTEMAS_LABELS[key] ?? key}</td>
                    <td>{r?.estado === 'anormal' ? 'Anormal' : 'Normal'}</td>
                    <td>{r?.observacion || '-'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>

        {/* FICHA 2 - Factores de riesgo */}
        <section className="m-page">
          <h2 className="text-[10pt] font-bold text-center mb-2 border-b border-black pb-1">
            FICHA MÉDICA OCUPACIONAL (2/3) – FACTORES DE RIESGO
          </h2>
          <table className="m-table w-full text-[9pt]">
            <tbody>
              <tr>
                <td className="m-label w-1/4">Físicos (Ruido, vibración, iluminación, temp.)</td>
                <td>{data.riesgo_fisicos || '-'}</td>
              </tr>
              <tr>
                <td className="m-label">Mecánicos (Atrapamientos, caídas, cortes)</td>
                <td>{data.riesgo_mecanicos || '-'}</td>
              </tr>
              <tr>
                <td className="m-label">Químicos (Polvos, humos, líquidos, gases)</td>
                <td>{data.riesgo_quimicos || '-'}</td>
              </tr>
              <tr>
                <td className="m-label">Biológicos (Virus, hongos, bacterias)</td>
                <td>{data.riesgo_biologicos || '-'}</td>
              </tr>
              <tr>
                <td className="m-label">Ergonómicos (Cargas, repetitivos, posturas, PVD)</td>
                <td>{data.riesgo_ergonomicos || '-'}</td>
              </tr>
              <tr>
                <td className="m-label">Psicosociales (Monotonía, turnos, estrés)</td>
                <td>{data.riesgo_psicosociales || '-'}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* FICHA 3 - Antecedentes, accidentes, concepto, firmas */}
        <section className="m-page">
          <h2 className="text-[10pt] font-bold text-center mb-2 border-b border-black pb-1">
            FICHA MÉDICA OCUPACIONAL (3/3) – HISTORIA Y CERTIFICADO
          </h2>
          <h3 className="text-[9pt] font-bold mt-2 mb-1">Antecedentes Laborales</h3>
          <table className="m-table w-full text-[9pt]">
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Puesto</th>
                <th>Tiempo</th>
                <th>Riesgos</th>
              </tr>
            </thead>
            <tbody>
              {(data.antecedentes_laborales?.length ? data.antecedentes_laborales : [{ empresa: '', puesto: '', tiempo: '', riesgos: '' }]).map((a, i) => (
                <tr key={i}>
                  <td>{a.empresa || '-'}</td>
                  <td>{a.puesto || '-'}</td>
                  <td>{a.tiempo || '-'}</td>
                  <td>{a.riesgos || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className="text-[9pt] font-bold mt-2 mb-1">Accidentes / Enfermedades</h3>
          <table className="m-table w-full text-[9pt]">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {(data.accidentes_enfermedades?.length ? data.accidentes_enfermedades : [{ tipo: '', fecha: '', observaciones: '' }]).map((a, i) => (
                <tr key={i}>
                  <td>{a.tipo || '-'}</td>
                  <td>{a.fecha || '-'}</td>
                  <td>{a.observaciones || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3">
            <span className="m-label inline-block mr-2">Concepto de Aptitud:</span>
            <span>{data.concepto_aptitud ? CONCEPTO_APTITUD_LABELS[data.concepto_aptitud] : '-'}</span>
          </div>
          {data.recomendaciones && (
            <div className="mt-2">
              <span className="m-label block mb-1">Recomendaciones:</span>
              <p className="whitespace-pre-wrap text-[9pt]">{data.recomendaciones}</p>
            </div>
          )}
          <div className="mt-6 grid grid-cols-2 gap-8 text-[9pt]">
            <div>
              <p className="font-semibold">Firma Profesional</p>
              <p>{data.firma_profesional_nombre || '________________'}</p>
              <p>Código: {data.firma_profesional_codigo || '________________'}</p>
            </div>
            <div>
              <p className="font-semibold">Firma Trabajador</p>
              <p>{data.firma_trabajador ? 'Firmado' : '________________'}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
