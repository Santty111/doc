import { connectDB } from '@/lib/db'
import { Worker, Certificate, MedicalExam } from '@/lib/models'
import { getProfile } from '@/lib/auth-server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  FileText,
  Award,
  TestTube,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
} from 'lucide-react'

export default async function ReportesPage() {
  const profile = await getProfile()
  await connectDB()
  const workerFilter = profile?.company_id ? { company_id: profile.company_id } : {}
  const workerIds = profile?.company_id
    ? await Worker.find(workerFilter).distinct('_id')
    : null
  const certFilter = workerIds !== null ? { worker_id: { $in: workerIds } } : {}
  const examFilter = workerIds !== null ? { worker_id: { $in: workerIds } } : {}

  const [workersByStatus, certificatesByResult, examsByType] = await Promise.all([
    Worker.find(workerFilter).populate('company_id', 'name').lean(),
    Certificate.find(certFilter).select('result certificate_type').lean(),
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

  const certs = certificatesByResult as { result: string; certificate_type: string }[]
  const aptoCerts = certs.filter((c) => c.result === 'apto').length || 0
  const restriccionesCerts =
    certs.filter((c) => c.result === 'apto_con_restricciones').length || 0
  const noAptoCerts = certs.filter((c) => c.result === 'no_apto').length || 0
  const pendienteCerts = certs.filter((c) => c.result === 'pendiente').length || 0

  const ingresoCerts = certs.filter((c) => c.certificate_type === 'ingreso').length || 0
  const periodicoCerts =
    certs.filter((c) => c.certificate_type === 'periodico').length || 0
  const egresoCerts = certs.filter((c) => c.certificate_type === 'egreso').length || 0

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

  const totalCerts = certs.length || 1

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
              Total Trabajadores
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {activeWorkers + inactiveWorkers + terminatedWorkers}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
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
                    <div
                      className="h-full bg-accent"
                      style={{
                        width: `${(aptoCerts / totalCerts) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-medium w-8 text-right">{aptoCerts}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span>Con Restricciones</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-warning"
                      style={{
                        width: `${(restriccionesCerts / totalCerts) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-medium w-8 text-right">
                    {restriccionesCerts}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span>No Apto</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-destructive"
                      style={{
                        width: `${(noAptoCerts / totalCerts) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-medium w-8 text-right">{noAptoCerts}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Pendiente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-muted-foreground"
                      style={{
                        width: `${(pendienteCerts / totalCerts) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-medium w-8 text-right">
                    {pendienteCerts}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-chart-4" />
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
