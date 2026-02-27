import { connectDB } from '@/lib/db'
import { CertificadoFichaMedica, Worker, User } from '@/lib/models'
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

export default async function CertificadoFichaMedicaListPage() {
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
  const certFilter =
    legacyByCompanyName || legacyByCreator
      ? {
          $or: [
            strictWorkerFilter,
            ...(legacyByCompanyName ? [legacyByCompanyName] : []),
            ...(legacyByCreator ? [legacyByCreator] : []),
          ],
        }
      : strictWorkerFilter

  const certificados = await CertificadoFichaMedica.find(certFilter)
    .sort({ createdAt: -1 })
    .lean()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Certificado - Evaluación Médica Ocupacional
          </h1>
          <p className="text-muted-foreground">
            Certificados generados desde la ficha médica
          </p>
        </div>
        <Link href="/dashboard/fichas-medicas/certificado/nuevo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo certificado
          </Button>
        </Link>
      </div>

      {certificados.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            No hay certificados registrados aún
          </p>
          <Link href="/dashboard/fichas-medicas/certificado/nuevo">
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
                  Fecha creación
                </th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {certificados.map((c: Record<string, unknown>) => {
                const seccionA = c.seccionA as Record<string, unknown> | undefined
                const usuario = (seccionA?.usuario ?? {}) as Record<string, unknown>
                const nombre = [
                  usuario.primer_apellido,
                  usuario.segundo_apellido,
                  usuario.primer_nombre,
                  usuario.segundo_nombre,
                ]
                  .filter(Boolean)
                  .join(' ') || '—'
                const certId = String(c._id)
                return (
                  <tr key={certId} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-3">{nombre}</td>
                    <td className="px-4 py-3">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/fichas-medicas/certificado/${certId}/imprimir`}
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
