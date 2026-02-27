import Link from 'next/link'
import { connectDB } from '@/lib/db'
import { getProfile } from '@/lib/auth-server'
import {
  Worker,
  User,
  FichaMedicaEvaluacion1,
  FichaMedicaEvaluacion2,
  FichaMedicaEvaluacion3,
  CertificadoFichaMedica,
  CertificadoAptitudOficial,
} from '@/lib/models'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default async function BusquedaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = (q ?? '').trim()
  const profile = await getProfile()

  await connectDB()

  if (!query) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Búsqueda</h1>
        <p className="text-muted-foreground">Escribe un texto en el buscador superior.</p>
      </div>
    )
  }

  const regex = new RegExp(escapeRegex(query), 'i')
  const workerFilter = profile?.company_id ? { company_id: profile.company_id } : {}
  const workerIds = profile?.company_id
    ? await Worker.find(workerFilter).distinct('_id')
    : null
  const hasWorkersInCompany = (workerIds?.length ?? 0) > 0
  const workerIdStrings = workerIds?.map((id) => String(id)) ?? []
  const companyUserIds = profile?.company_id
    ? await User.find({ company_id: profile.company_id }).distinct('_id')
    : null

  const scopedByWorker =
    workerIds !== null
      ? {
          $or: [
            { worker_id: { $in: workerIds } },
            { worker_id: { $in: workerIdStrings } },
            { 'worker_snapshot.worker_id': { $in: workerIdStrings } },
          ],
        }
      : {}

  const legacyCreator =
    companyUserIds !== null && hasWorkersInCompany
      ? {
          $and: [
            { created_by: { $in: companyUserIds } },
            { $or: [{ worker_id: { $exists: false } }, { worker_id: null }] },
            {
              $or: [
                { 'worker_snapshot.worker_id': { $exists: false } },
                { 'worker_snapshot.worker_id': null },
              ],
            },
          ],
        }
      : null

  const companyName = profile?.company?.name?.trim() ?? ''
  const legacyCompany =
    profile?.company_id && companyName
      ? {
          $or: [
            { 'seccionA.establecimiento.institucion_sistema': { $regex: `^${escapeRegex(companyName)}$`, $options: 'i' } },
            { 'seccionA.institucion_sistema': { $regex: `^${escapeRegex(companyName)}$`, $options: 'i' } },
          ],
        }
      : null

  const workers = await Worker.find({
    ...workerFilter,
    $or: [
      { first_name: { $regex: regex } },
      { last_name: { $regex: regex } },
      { employee_code: { $regex: regex } },
      { position: { $regex: regex } },
      { department: { $regex: regex } },
    ],
  })
    .select('first_name last_name employee_code created_by')
    .sort({ last_name: 1 })
    .limit(10)
    .lean()

  const matchedWorkerRawIds = (workers as Record<string, unknown>[]).map((w) => w._id)
  const matchedWorkerIds = matchedWorkerRawIds.map((id) => String(id))
  const relationMatch =
    matchedWorkerIds.length > 0
      ? {
          $or: [
            { worker_id: { $in: matchedWorkerRawIds } },
            { worker_id: { $in: matchedWorkerIds } },
            { 'worker_snapshot.worker_id': { $in: matchedWorkerIds } },
          ],
        }
      : null
  const matchedCreatorIds = (workers as Record<string, unknown>[])
    .map((w) => w.created_by)
    .filter((v) => v != null)
  const relationByMatchedCreator =
    matchedCreatorIds.length > 0
      ? {
          $and: [
            { created_by: { $in: matchedCreatorIds } },
            { $or: [{ worker_id: { $exists: false } }, { worker_id: null }] },
            {
              $or: [
                { 'worker_snapshot.worker_id': { $exists: false } },
                { 'worker_snapshot.worker_id': null },
              ],
            },
          ],
        }
      : null
  const legacySingleWorkerMatch =
    hasWorkersInCompany && workerIdStrings.length === 1 && matchedWorkerIds.length > 0
      ? legacyCreator
      : null

  const ficha1Filter = {
    $and: [
      {
        $or: [
          scopedByWorker,
          ...(legacyCreator ? [legacyCreator] : []),
          ...(legacyCompany ? [legacyCompany] : []),
        ],
      },
      {
        $or: [
          { 'seccionA.usuario.primer_nombre': { $regex: regex } },
          { 'seccionA.usuario.segundo_nombre': { $regex: regex } },
          { 'seccionA.usuario.primer_apellido': { $regex: regex } },
          { 'seccionA.usuario.segundo_apellido': { $regex: regex } },
          { 'seccionB.puesto_trabajo_ciuo': { $regex: regex } },
          { 'seccionB.tipo_evaluacion': { $regex: regex } },
          ...(relationMatch ? [relationMatch] : []),
          ...(legacySingleWorkerMatch ? [legacySingleWorkerMatch] : []),
          ...(relationByMatchedCreator ? [relationByMatchedCreator] : []),
        ],
      },
    ],
  }
  const ficha2Filter = {
    $and: [
      { $or: [scopedByWorker, ...(legacyCreator ? [legacyCreator] : [])] },
      {
        $or: [
          { 'seccionG.fisicos.puesto_trabajo': { $regex: regex } },
          ...(relationMatch ? [relationMatch] : []),
          ...(legacySingleWorkerMatch ? [legacySingleWorkerMatch] : []),
          ...(relationByMatchedCreator ? [relationByMatchedCreator] : []),
        ],
      },
    ],
  }
  const ficha3Filter = {
    $and: [
      { $or: [scopedByWorker, ...(legacyCreator ? [legacyCreator] : [])] },
      {
        $or: [
          { 'seccionL.aptitud': { $regex: regex } },
          { 'seccionK.diagnosticos.descripcion': { $regex: regex } },
          ...(relationMatch ? [relationMatch] : []),
          ...(legacySingleWorkerMatch ? [legacySingleWorkerMatch] : []),
          ...(relationByMatchedCreator ? [relationByMatchedCreator] : []),
        ],
      },
    ],
  }
  const certFichaFilter = {
    $and: [
      {
        $or: [
          scopedByWorker,
          ...(legacyCreator ? [legacyCreator] : []),
          ...(legacyCompany ? [legacyCompany] : []),
        ],
      },
      {
        $or: [
          { 'seccionA.usuario.primer_nombre': { $regex: regex } },
          { 'seccionA.usuario.segundo_nombre': { $regex: regex } },
          { 'seccionA.usuario.primer_apellido': { $regex: regex } },
          { 'seccionA.usuario.segundo_apellido': { $regex: regex } },
          ...(relationMatch ? [relationMatch] : []),
          ...(legacySingleWorkerMatch ? [legacySingleWorkerMatch] : []),
          ...(relationByMatchedCreator ? [relationByMatchedCreator] : []),
        ],
      },
    ],
  }
  const certAptitudFilter = {
    $and: [
      { $or: [scopedByWorker, ...(legacyCreator ? [legacyCreator] : [])] },
      {
        $or: [
          { 'seccionA.usuario.primer_nombre': { $regex: regex } },
          { 'seccionA.usuario.segundo_nombre': { $regex: regex } },
          { 'seccionA.usuario.primer_apellido': { $regex: regex } },
          { 'seccionA.usuario.segundo_apellido': { $regex: regex } },
          { 'seccionB.evaluacion': { $regex: regex } },
          ...(relationMatch ? [relationMatch] : []),
          ...(legacySingleWorkerMatch ? [legacySingleWorkerMatch] : []),
          ...(relationByMatchedCreator ? [relationByMatchedCreator] : []),
        ],
      },
    ],
  }

  const [f1, f2, f3, cf, ca] = await Promise.all([
    FichaMedicaEvaluacion1.find(ficha1Filter).select('_id createdAt').sort({ createdAt: -1 }).limit(8).lean(),
    FichaMedicaEvaluacion2.find(ficha2Filter).select('_id createdAt').sort({ createdAt: -1 }).limit(8).lean(),
    FichaMedicaEvaluacion3.find(ficha3Filter).select('_id createdAt').sort({ createdAt: -1 }).limit(8).lean(),
    CertificadoFichaMedica.find(certFichaFilter).select('_id createdAt').sort({ createdAt: -1 }).limit(8).lean(),
    CertificadoAptitudOficial.find(certAptitudFilter).select('_id createdAt').sort({ createdAt: -1 }).limit(8).lean(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Resultados de búsqueda</h1>
        <p className="text-muted-foreground">Término: "{query}"</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Trabajadores ({workers.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {workers.length === 0 ? 'Sin resultados' : workers.map((w: Record<string, unknown>) => (
              <div key={String(w._id)}>
                <Link className="hover:underline" href={`/dashboard/trabajadores/${String(w._id)}`}>
                  {String(w.first_name)} {String(w.last_name)} ({String(w.employee_code)})
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Fichas 1-3 ({f1.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {f1.length === 0 ? 'Sin resultados' : f1.map((d: Record<string, unknown>) => (
              <div key={String(d._id)}>
                <Link className="hover:underline" href={`/dashboard/fichas-medicas/evaluacion-1-3/${String(d._id)}/imprimir`}>
                  Ver ficha 1-3 #{String(d._id).slice(-6)}
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Fichas 2-3 ({f2.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {f2.length === 0 ? 'Sin resultados' : f2.map((d: Record<string, unknown>) => (
              <div key={String(d._id)}>
                <Link className="hover:underline" href={`/dashboard/fichas-medicas/evaluacion-2-3/${String(d._id)}/imprimir`}>
                  Ver ficha 2-3 #{String(d._id).slice(-6)}
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Fichas 3-3 ({f3.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {f3.length === 0 ? 'Sin resultados' : f3.map((d: Record<string, unknown>) => (
              <div key={String(d._id)}>
                <Link className="hover:underline" href={`/dashboard/fichas-medicas/evaluacion-3-3/${String(d._id)}/imprimir`}>
                  Ver ficha 3-3 #{String(d._id).slice(-6)}
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Certificado ficha ({cf.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {cf.length === 0 ? 'Sin resultados' : cf.map((d: Record<string, unknown>) => (
              <div key={String(d._id)}>
                <Link className="hover:underline" href={`/dashboard/fichas-medicas/certificado/${String(d._id)}/imprimir`}>
                  Ver certificado ficha #{String(d._id).slice(-6)}
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Certificado aptitud ({ca.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {ca.length === 0 ? 'Sin resultados' : ca.map((d: Record<string, unknown>) => (
              <div key={String(d._id)}>
                <Link className="hover:underline" href={`/dashboard/certificado-aptitud-oficial/${String(d._id)}/imprimir`}>
                  Ver certificado aptitud #{String(d._id).slice(-6)}
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
