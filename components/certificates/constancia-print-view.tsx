'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileDown } from 'lucide-react'

type CertificatePrintData = {
  id: string
  worker_id: string
  certificate_type: string
  issue_date: string
  expiry_date: string | null
  result: string
  restrictions: string | null
  recommendations: string | null
  doctor_name: string | null
  doctor_license: string | null
  observations: string | null
  workerName: string
  employeeCode: string
  companyName: string
  typeLabel: string
  resultLabel: string
}

export function ConstanciaPrintView({
  certificate,
  autoPrint = false,
}: {
  certificate: CertificatePrintData
  autoPrint?: boolean
}) {
  useEffect(() => {
    if (autoPrint) {
      const t = setTimeout(() => window.print(), 500)
      return () => clearTimeout(t)
    }
  }, [autoPrint])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8 print:py-4">
        {/* Controles solo en pantalla, no en impresión */}
        <div className="mb-6 flex items-center gap-4 print:hidden">
          <Link href={`/dashboard/constancias/${certificate.id}`}>
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

        {/* Contenido de la constancia */}
        <div className="rounded-lg border border-border bg-card p-8 print:border-0 print:shadow-none">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-foreground">MediControl</h1>
            <p className="text-sm text-muted-foreground">Sistema de Salud Ocupacional</p>
          </div>

          <h2 className="text-lg font-semibold text-center mb-6 border-b pb-2">
            Constancia de Aptitud Médica
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            Tipo: <span className="font-medium text-foreground">{certificate.typeLabel}</span>
          </p>

          <div className="grid gap-4 mb-6">
            <div>
              <p className="text-xs text-muted-foreground">Trabajador</p>
              <p className="font-medium">{certificate.workerName}</p>
              <p className="text-sm text-muted-foreground">
                Cedula: {certificate.employeeCode}
                {certificate.companyName ? ` · ${certificate.companyName}` : ''}
              </p>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-xs text-muted-foreground">Fecha de emisión</p>
                <p className="font-medium">
                  {certificate.issue_date
                    ? new Date(certificate.issue_date).toLocaleDateString('es-MX')
                    : '-'}
                </p>
              </div>
              {certificate.expiry_date && (
                <div>
                  <p className="text-xs text-muted-foreground">Vigencia hasta</p>
                  <p className="font-medium">
                    {new Date(certificate.expiry_date).toLocaleDateString('es-MX')}
                  </p>
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Resultado de la evaluación</p>
              <p className="font-semibold text-lg">{certificate.resultLabel}</p>
            </div>
          </div>

          {(certificate.restrictions || certificate.recommendations || certificate.observations) && (
            <div className="space-y-3 text-sm border-t pt-4">
              {certificate.restrictions && (
                <div>
                  <p className="font-medium text-muted-foreground">Restricciones</p>
                  <p className="whitespace-pre-wrap">{certificate.restrictions}</p>
                </div>
              )}
              {certificate.recommendations && (
                <div>
                  <p className="font-medium text-muted-foreground">Recomendaciones</p>
                  <p className="whitespace-pre-wrap">{certificate.recommendations}</p>
                </div>
              )}
              {certificate.observations && (
                <div>
                  <p className="font-medium text-muted-foreground">Observaciones</p>
                  <p className="whitespace-pre-wrap">{certificate.observations}</p>
                </div>
              )}
            </div>
          )}

          {(certificate.doctor_name || certificate.doctor_license) && (
            <div className="mt-8 pt-6 border-t text-sm">
              <p className="text-muted-foreground">Médico responsable</p>
              <p className="font-medium">{certificate.doctor_name ?? '-'}</p>
              {certificate.doctor_license && (
                <p className="text-muted-foreground">Cédula: {certificate.doctor_license}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
