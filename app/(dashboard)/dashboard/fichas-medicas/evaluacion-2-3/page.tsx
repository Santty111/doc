import { connectDB } from '@/lib/db'
import { FichaMedicaEvaluacion2 } from '@/lib/models'
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

export default async function FichaEva2ListPage() {
  await connectDB()
  const fichas = await FichaMedicaEvaluacion2.find()
    .sort({ createdAt: -1 })
    .lean()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Evaluación Ocupacional 2-3
          </h1>
          <p className="text-muted-foreground">
            Fichas médicas - Factores de Riesgo (parte 2)
          </p>
        </div>
        <Link href="/dashboard/fichas-medicas/evaluacion-2-3/nuevo">
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
          <Link href="/dashboard/fichas-medicas/evaluacion-2-3/nuevo">
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
                <th className="px-4 py-3 text-left font-medium">Puesto de trabajo</th>
                <th className="px-4 py-3 text-left font-medium">
                  Fecha creación
                </th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {fichas.map((f: Record<string, unknown>) => {
                const seccionG = f.seccionG as Record<string, unknown> | undefined
                const fisicos = seccionG?.fisicos as Record<string, unknown> | undefined
                const puesto = String(fisicos?.puesto_trabajo ?? '-')
                const fichaId = String(f._id)
                return (
                  <tr key={fichaId} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-3">{puesto}</td>
                    <td className="px-4 py-3">{formatDate(f.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/fichas-medicas/evaluacion-2-3/${fichaId}`}
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
