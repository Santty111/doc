import { connectDB } from '@/lib/db'
import { FichaMedicaEvaluacion3 } from '@/lib/models'
import { Button } from '@/components/ui/button'
import { Plus, FileText } from 'lucide-react'
import Link from 'next/link'

function formatDate(date: unknown): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : (date as Date)
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default async function FichaEva3ListPage() {
  await connectDB()
  const fichas = await FichaMedicaEvaluacion3.find()
    .sort({ createdAt: -1 })
    .lean()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Evaluación Ocupacional 3-3
          </h1>
          <p className="text-muted-foreground">
            Fichas médicas - Actividad laboral / Incidentes / Accidentes (parte 3)
          </p>
        </div>
        <Link href="/dashboard/fichas-medicas/evaluacion-3-3/nuevo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva ficha
          </Button>
        </Link>
      </div>

      {fichas.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            No hay fichas registradas aún
          </p>
          <Link href="/dashboard/fichas-medicas/evaluacion-3-3/nuevo">
            <Button className="mt-4" variant="outline">
              Crear primera ficha
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Registros</th>
                <th className="px-4 py-3 text-left font-medium">
                  Fecha creación
                </th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {fichas.map((f: Record<string, unknown>) => {
                const seccionH = f.seccionH as Record<string, unknown> | undefined
                const antecedentes = (seccionH?.antecedentes ?? []) as unknown[]
                const count = antecedentes.length
                const fichaId = String(f._id)
                return (
                  <tr key={fichaId} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-3">{count} empleo(s)</td>
                    <td className="px-4 py-3">{formatDate(f.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/fichas-medicas/evaluacion-3-3/${fichaId}`}
                      >
                        <Button variant="outline" size="sm">
                          Ver
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
