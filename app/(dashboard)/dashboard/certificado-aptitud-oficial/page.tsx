import { connectDB } from '@/lib/db'
import { CertificadoAptitudOficial } from '@/lib/models'
import { Button } from '@/components/ui/button'
import { Plus, Printer } from 'lucide-react'
import Link from 'next/link'

function formatDate(date: unknown): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date as Date
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default async function CertificadoAptitudOficialPage() {
  await connectDB()
  const certificados = await CertificadoAptitudOficial.find()
    .sort({ createdAt: -1 })
    .lean()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Certificados de Aptitud Oficial
          </h1>
          <p className="text-muted-foreground">
            Gestión de certificados de aptitud oficial emitidos
          </p>
        </div>
        <Link href="/dashboard/certificado-aptitud-oficial/nuevo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo certificado
          </Button>
        </Link>
      </div>

      {certificados.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            No hay certificados registrados aún
          </p>
          <Link href="/dashboard/certificado-aptitud-oficial/nuevo">
            <Button className="mt-4" variant="outline">
              Crear primer certificado
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Usuario</th>
                <th className="px-4 py-3 text-left font-medium">
                  Fecha emisión
                </th>
                <th className="px-4 py-3 text-left font-medium">Evaluación</th>
                <th className="px-4 py-3 text-left font-medium">Profesional</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {certificados.map((c: Record<string, unknown>) => {
                const seccionA = c.seccionA as Record<string, unknown> | undefined
                const seccionB = c.seccionB as Record<string, unknown> | undefined
                const seccionF = c.seccionF as Record<string, unknown> | undefined
                const usuario = seccionA?.usuario as Record<string, unknown> | undefined
                const nombreUsuario = usuario
                  ? `${String(usuario.primer_apellido ?? '')} ${String(usuario.segundo_apellido ?? '')} ${String(usuario.primer_nombre ?? '')} ${String(usuario.segundo_nombre ?? '')}`.trim()
                  : '-'
                const fechaEmision = seccionB?.fecha_emision
                const evaluacion = String(seccionB?.evaluacion ?? '-')
                const profesional = String(seccionF?.nombre_apellido ?? '-')
                const certId = String(c._id)
                return (
                  <tr key={certId} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-3">{nombreUsuario || '-'}</td>
                    <td className="px-4 py-3">
                      {formatDate(fechaEmision)}
                    </td>
                    <td className="px-4 py-3 capitalize">{evaluacion}</td>
                    <td className="px-4 py-3">{profesional || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/certificado-aptitud-oficial/${certId}/imprimir`}
                      >
                        <Button variant="ghost" size="sm">
                          <Printer className="mr-1 h-4 w-4" />
                          Imprimir
                        </Button>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
