import { connectDB } from '@/lib/db'
import { FichaMedicaEvaluacion1, Worker, User } from '@/lib/models'
import { Button } from '@/components/ui/button'
import { Plus, FileText, Printer } from 'lucide-react'
import Link from 'next/link'
import { getProfile } from '@/lib/auth-server'

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function formatDate(date: unknown): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : (date as Date)
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default async function FichaEva1ListPage() {
  const profile = await getProfile()
  await connectDB()
  const workerFilter = profile?.company_id ? { company_id: profile.company_id } : {}
  const workerIds = profile?.company_id
    ? await Worker.find(workerFilter).distinct('_id')
    : null
  const hasWorkersInCompany = (workerIds?.length ?? 0) > 0
  const companyUserIds = profile?.company_id
    ? await User.find({ company_id: profile.company_id }).distinct('_id')
    : null
  const workerIdStrings = workerIds?.map((id) => String(id)) ?? []
  const strictWorkerFilter =
    workerIds !== null
      ? {
          $or: [
            { worker_id: { $in: workerIds } },
            { worker_id: { $in: workerIdStrings } },
            { 'worker_snapshot.worker_id': { $in: workerIdStrings } },
          ],
        }
      : {}
  const companyName = profile?.company?.name?.trim()
  const legacyByCompanyName =
    profile?.company_id && companyName
      ? {
          $or: [
            { 'seccionA.establecimiento.institucion_sistema': { $regex: `^${escapeRegex(companyName)}$`, $options: 'i' } },
            { 'seccionA.institucion_sistema': { $regex: `^${escapeRegex(companyName)}$`, $options: 'i' } },
          ],
        }
      : null
  const legacyByCreator =
    companyUserIds !== null && hasWorkersInCompany
      ? {
          $and: [
            { created_by: { $in: companyUserIds } },
            {
              $or: [
                { worker_id: { $exists: false } },
                { worker_id: null },
              ],
            },
            {
              $or: [
                { 'worker_snapshot.worker_id': { $exists: false } },
                { 'worker_snapshot.worker_id': null },
              ],
            },
          ],
        }
      : null
  const fichaFilter =
    legacyByCompanyName || legacyByCreator
      ? {
          $or: [
            strictWorkerFilter,
            ...(legacyByCompanyName ? [legacyByCompanyName] : []),
            ...(legacyByCreator ? [legacyByCreator] : []),
          ],
        }
      : strictWorkerFilter

  const fichas = await FichaMedicaEvaluacion1.find(fichaFilter)
    .sort({ createdAt: -1 })
    .lean()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Evaluación Ocupacional 1-3
          </h1>
          <p className="text-muted-foreground">
            Fichas médicas - Formulario de evaluación (parte 1)
          </p>
        </div>
        <Link href="/dashboard/fichas-medicas/evaluacion-1-3/nuevo">
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
          <Link href="/dashboard/fichas-medicas/evaluacion-1-3/nuevo">
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
                <th className="px-4 py-3 text-left font-medium">Usuario</th>
                <th className="px-4 py-3 text-left font-medium">
                  Institución
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Tipo eval.
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Fecha creación
                </th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {fichas.map((f: Record<string, unknown>) => {
                const seccionA = f.seccionA as Record<string, unknown> | undefined
                const seccionB = f.seccionB as Record<string, unknown> | undefined
                const usuario = seccionA?.usuario as Record<string, unknown> | undefined
                const establecimiento = seccionA?.establecimiento as Record<string, unknown> | undefined
                const nombreUsuario = usuario
                  ? `${String(usuario.primer_apellido ?? '')} ${String(usuario.segundo_apellido ?? '')} ${String(usuario.primer_nombre ?? '')} ${String(usuario.segundo_nombre ?? '')}`.trim()
                  : '-'
                const institucion = String(establecimiento?.institucion_sistema ?? '-')
                const tipoEval = seccionB?.tipo_evaluacion
                  ? String(seccionB.tipo_evaluacion).charAt(0).toUpperCase() + String(seccionB.tipo_evaluacion).slice(1)
                  : '-'
                const fichaId = String(f._id)
                return (
                  <tr key={fichaId} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-3">{nombreUsuario || '-'}</td>
                    <td className="px-4 py-3">{institucion}</td>
                    <td className="px-4 py-3 capitalize">{tipoEval}</td>
                    <td className="px-4 py-3">{formatDate(f.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/fichas-medicas/evaluacion-1-3/${fichaId}/imprimir`}
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
