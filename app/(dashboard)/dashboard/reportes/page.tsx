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
import {
  Users,
  ClipboardList,
  FileCheck,
  TestTube,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
} from 'lucide-react'

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default async function ReportesPage() {
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
  const scopedFilter =
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
            scopedFilter,
            ...(legacyCompanyFilter ? [legacyCompanyFilter] : []),
            ...(legacyCreatorFilter ? [legacyCreatorFilter] : []),
          ],
        }
      : scopedFilter
  const ficha2Filter = legacyCreatorFilter != null ? { $or: [scopedFilter, legacyCreatorFilter] } : scopedFilter
  const ficha3Filter = legacyCreatorFilter != null ? { $or: [scopedFilter, legacyCreatorFilter] } : scopedFilter
  const certFichaFilter =
    legacyCompanyFilter != null || legacyCreatorFilter != null
      ? {
          $or: [
            scopedFilter,
            ...(legacyCompanyFilter ? [legacyCompanyFilter] : []),
            ...(legacyCreatorFilter ? [legacyCreatorFilter] : []),
          ],
        }
      : scopedFilter

  const [workersByStatus, ficha1, ficha2, ficha3, certFicha, certAptitudDocs, examsByType] = await Promise.all([
    Worker.find(workerFilter).populate('company_id', 'name').lean(),
    FichaMedicaEvaluacion1.find(ficha1Filter).select('_id seccionB').lean(),
    FichaMedicaEvaluacion2.find(ficha2Filter).select('_id').lean(),
    FichaMedicaEvaluacion3.find(ficha3Filter).select('_id seccionL').lean(),
    CertificadoFichaMedica.find(certFichaFilter).select('_id').lean(),
    CertificadoAptitudOficial.find(scopedFilter).select('_id').lean(),
    MedicalExam.find(examFilter).select('exam_type').lean(),
  ])

  const activeWorkers =
    (workersByStatus as { status: string }[]).filter((w) => w.status === 'active')
      .length || 0
  const inactiveWorkers =
    (workersByStatus as { status: string }[]).filter((w) => w.status === 'inactive')
      .length || 0
  const terminatedWorkers =
    (workersByStatus as { status: string }[]).filter(
      (w) => w.status === 'terminated'
    ).length || 0

  const ficha1Count = ficha1.length
  const ficha2Count = ficha2.length
  const ficha3Count = ficha3.length
  const certFichaCount = certFicha.length
  const certAptitudCount = certAptitudDocs.length

  const ficha1Stats = ficha1 as { seccionB?: { tipo_evaluacion?: string } }[]
  const ficha3Stats = ficha3 as { seccionL?: { aptitud?: string } }[]

  // "Constancias por tipo" ahora se alimenta de Ficha 1-3 (seccionB.tipo_evaluacion)
  const ingresoCerts = ficha1Stats.filter((f) => f.seccionB?.tipo_evaluacion === 'ingreso').length
  const periodicoCerts = ficha1Stats.filter((f) => f.seccionB?.tipo_evaluacion === 'periodico').length
  const egresoCerts = ficha1Stats.filter((f) =>
    f.seccionB?.tipo_evaluacion === 'retiro' || f.seccionB?.tipo_evaluacion === 'egreso'
  ).length

  // "Constancias por resultado" ahora se alimenta de Ficha 3-3 (seccionL.aptitud)
  const aptoCerts = ficha3Stats.filter((f) => f.seccionL?.aptitud === 'apto').length
  const aptoObservacionCerts = ficha3Stats.filter((f) => f.seccionL?.aptitud === 'apto_observacion').length
  const aptoLimitacionesCerts = ficha3Stats.filter((f) => f.seccionL?.aptitud === 'apto_limitaciones').length
  const noAptoCerts = ficha3Stats.filter((f) => f.seccionL?.aptitud === 'no_apto').length
  const totalResultados = ficha3Stats.length || 1

  const examCounts = (examsByType as { exam_type: string }[]).reduce(
    (acc, exam) => {
      acc[exam.exam_type] = (acc[exam.exam_type] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const workersWithCompany = workersByStatus as {
    status: string
    company_id?: { name: string }
  }[]
  const workersByCompany = workersWithCompany.reduce(
    (acc, worker) => {
      const companyName = worker.company_id?.name || 'Sin empresa'
      acc[companyName] = (acc[companyName] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Reportes y Estadísticas
        </h1>
        <p className="text-muted-foreground">
          Análisis de datos del sistema de salud ocupacional
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Trabajadores Activos
            </CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{activeWorkers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Trabajadores Inactivos
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inactiveWorkers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bajas
            </CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {terminatedWorkers}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fichas Médicas Totales
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {ficha1Count + ficha2Count + ficha3Count}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              <CardTitle>Constancias por Resultado</CardTitle>
            </div>
            <CardDescription>
              Distribución de resultados de aptitud médica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>Apto</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${(aptoCerts / totalResultados) * 100}%` }} />
                  </div>
                  <span className="font-medium w-8 text-right">{aptoCerts}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span>Apto en observación</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-warning" style={{ width: `${(aptoObservacionCerts / totalResultados) * 100}%` }} />
                  </div>
                  <span className="font-medium w-8 text-right">{aptoObservacionCerts}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span>Apto con limitaciones</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-warning" style={{ width: `${(aptoLimitacionesCerts / totalResultados) * 100}%` }} />
                  </div>
                  <span className="font-medium w-8 text-right">{aptoLimitacionesCerts}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span>No Apto</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-destructive" style={{ width: `${(noAptoCerts / totalResultados) * 100}%` }} />
                  </div>
                  <span className="font-medium w-8 text-right">{noAptoCerts}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-chart-4" />
              <CardTitle>Constancias por Tipo</CardTitle>
            </div>
            <CardDescription>
              Clasificación de exámenes médicos ocupacionales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span>Ingreso</span>
                <span className="text-2xl font-bold">{ingresoCerts}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span>Periódico</span>
                <span className="text-2xl font-bold">{periodicoCerts}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span>Egreso</span>
                <span className="text-2xl font-bold">{egresoCerts}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <CardTitle>Fichas por Tipo</CardTitle>
            </div>
            <CardDescription>
              Distribución de evaluaciones médicas ocupacionales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Ficha 1-3</span>
                <span className="text-2xl font-bold">{ficha1Count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Ficha 2-3</span>
                <span className="text-2xl font-bold">{ficha2Count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Ficha 3-3</span>
                <span className="text-2xl font-bold">{ficha3Count}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-chart-4" />
              <CardTitle>Certificados Nuevos por Tipo</CardTitle>
            </div>
            <CardDescription>
              Certificado de ficha médica y certificado de aptitud oficial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span>Certificado ficha médica</span>
                <span className="text-2xl font-bold">{certFichaCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span>Certificado aptitud oficial</span>
                <span className="text-2xl font-bold">{certAptitudCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-chart-2" />
              <CardTitle>Trabajadores por Empresa</CardTitle>
            </div>
            <CardDescription>
              Distribución de personal por empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(workersByCompany).map(([company, count]) => (
                <div
                  key={company}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <span className="font-medium">{company}</span>
                  <span className="text-xl font-bold text-chart-2">{count}</span>
                </div>
              ))}
              {Object.keys(workersByCompany).length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No hay datos disponibles
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-chart-3" />
              <CardTitle>Exámenes por Tipo</CardTitle>
            </div>
            <CardDescription>
              Estudios de laboratorio realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(examCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6)
                .map(([type, count]) => (
                  <div
                    key={type}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span className="text-sm">{type}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              {Object.keys(examCounts).length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No hay exámenes registrados
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
