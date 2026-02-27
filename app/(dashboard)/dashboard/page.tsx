import { connectDB } from '@/lib/db'
import {
  Worker,
  User,
  FichaMedicaEvaluacion1,
  FichaMedicaEvaluacion2,
  FichaMedicaEvaluacion3,
  CertificadoFichaMedica,
  CertificadoAptitudOficial,
  MedicalExam,
} from '@/lib/models'
import { getProfile } from '@/lib/auth-server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ClipboardList, FileCheck, TestTube, Activity, CheckCircle } from 'lucide-react'
import Link from 'next/link'

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default async function DashboardPage() {
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
  const workerScopedFilter =
    workerIds !== null
      ? {
          $or: [
            { worker_id: { $in: workerIds } },
            { worker_id: { $in: workerIdStrings } },
            { 'worker_snapshot.worker_id': { $in: workerIdStrings } },
          ],
        }
      : {}
  const examFilter =
    workerIds !== null
      ? {
          $or: [
            { worker_id: { $in: workerIds } },
            { worker_id: { $in: workerIdStrings } },
          ],
        }
      : {}
  const companyName = profile?.company?.name?.trim() ?? ''
  const legacyCompanyFilter =
    profile?.company_id && companyName
      ? {
          $or: [
            {
              'seccionA.establecimiento.institucion_sistema': {
                $regex: `^${escapeRegex(companyName)}$`,
                $options: 'i',
              },
            },
            {
              'seccionA.institucion_sistema': {
                $regex: `^${escapeRegex(companyName)}$`,
                $options: 'i',
              },
            },
          ],
        }
      : null
  const legacyCreatorFilter =
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
                { 'worker_snapshot.worker_id': '' },
              ],
            },
          ],
        }
      : null
  const ficha1Filter =
    legacyCompanyFilter != null || legacyCreatorFilter != null
      ? {
          $or: [
            workerScopedFilter,
            ...(legacyCompanyFilter ? [legacyCompanyFilter] : []),
            ...(legacyCreatorFilter ? [legacyCreatorFilter] : []),
          ],
        }
      : workerScopedFilter
  const ficha2Filter =
    legacyCreatorFilter != null
      ? { $or: [workerScopedFilter, legacyCreatorFilter] }
      : workerScopedFilter
  const ficha3Filter =
    legacyCreatorFilter != null
      ? { $or: [workerScopedFilter, legacyCreatorFilter] }
      : workerScopedFilter
  const certFichaFilter =
    legacyCompanyFilter != null || legacyCreatorFilter != null
      ? {
          $or: [
            workerScopedFilter,
            ...(legacyCompanyFilter ? [legacyCompanyFilter] : []),
            ...(legacyCreatorFilter ? [legacyCreatorFilter] : []),
          ],
        }
      : workerScopedFilter

  const [
    workersCount,
    ficha1Count,
    ficha2Count,
    ficha3Count,
    certFichaCount,
    certAptitudCount,
    examsCount,
  ] =
    await Promise.all([
      Worker.countDocuments({ ...workerFilter, status: 'active' }),
      FichaMedicaEvaluacion1.countDocuments(ficha1Filter),
      FichaMedicaEvaluacion2.countDocuments(ficha2Filter),
      FichaMedicaEvaluacion3.countDocuments(ficha3Filter),
      CertificadoFichaMedica.countDocuments(certFichaFilter),
      CertificadoAptitudOficial.countDocuments(workerScopedFilter),
      MedicalExam.countDocuments(examFilter),
    ])

  const [recentAptitud, recentWorkers] = await Promise.all([
    CertificadoAptitudOficial.find(workerScopedFilter)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('worker_id', 'first_name last_name employee_code')
      .lean(),
    Worker.find(workerFilter)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('company_id', 'name')
      .lean(),
  ])

  const stats = [
    {
      name: 'Trabajadores Activos',
      value: workersCount,
      icon: Users,
      href: '/dashboard/trabajadores',
      color: 'bg-primary/10 text-primary',
    },
    {
      name: 'Fichas Médicas',
      value: ficha1Count + ficha2Count + ficha3Count,
      icon: ClipboardList,
      href: '/dashboard/fichas-medicas',
      color: 'bg-accent/10 text-accent',
    },
    {
      name: 'Certificados Emitidos',
      value: certFichaCount + certAptitudCount,
      icon: FileCheck,
      href: '/dashboard/certificado-aptitud-oficial',
      color: 'bg-chart-4/20 text-chart-4',
    },
    {
      name: 'Exámenes Registrados',
      value: examsCount,
      icon: TestTube,
      href: '/dashboard/examenes',
      color: 'bg-chart-3/20 text-chart-3',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Bienvenido, {profile?.full_name || 'Usuario'}
        </h1>
        <p className="text-muted-foreground">
          Panel de control del sistema de salud ocupacional
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-warning" />
              <CardTitle>Actividad Reciente de Certificados</CardTitle>
            </div>
            <CardDescription>
              Últimos certificados de aptitud oficial generados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentAptitud && recentAptitud.length > 0 ? (
              <div className="space-y-3">
                {recentAptitud.map((cert: { _id: string; createdAt: Date; worker_id: { first_name: string; last_name: string; employee_code: string } }) => (
                  <div
                    key={String(cert._id)}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="font-medium">
                        {cert.worker_id?.first_name} {cert.worker_id?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {cert.worker_id?.employee_code}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-warning">
                        Creado:{' '}
                        {new Date(cert.createdAt).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-10 w-10 text-accent mb-2" />
                <p className="text-muted-foreground">
                  No hay certificados recientes
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Trabajadores Recientes</CardTitle>
            </div>
            <CardDescription>
              Últimos trabajadores registrados en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentWorkers && recentWorkers.length > 0 ? (
              <div className="space-y-3">
                {recentWorkers.map((worker: { _id: string; first_name: string; last_name: string; position?: string; company_id?: { name: string } }) => (
                  <div
                    key={String(worker._id)}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {worker.first_name?.charAt(0)}
                        {worker.last_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">
                          {worker.first_name} {worker.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {worker.position || 'Sin puesto asignado'}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                      {worker.company_id?.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-10 w-10 text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">
                  No hay trabajadores registrados
                </p>
                <Link
                  href="/dashboard/trabajadores/nuevo"
                  className="mt-2 text-sm text-primary hover:underline"
                >
                  Registrar primer trabajador
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
