import { createClient } from '@/lib/supabase/server'
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
  Building2
} from 'lucide-react'

export default async function ReportesPage() {
  const supabase = await createClient()
  
  // Get workers by status
  const { data: workersByStatus } = await supabase
    .from('workers')
    .select('status, company:companies(name)')

  // Get certificates by result
  const { data: certificatesByResult } = await supabase
    .from('certificates')
    .select('result, certificate_type')

  // Get exams by type
  const { data: examsByType } = await supabase
    .from('medical_exams')
    .select('exam_type')

  // Calculate stats
  const activeWorkers = workersByStatus?.filter(w => w.status === 'active').length || 0
  const inactiveWorkers = workersByStatus?.filter(w => w.status === 'inactive').length || 0
  const terminatedWorkers = workersByStatus?.filter(w => w.status === 'terminated').length || 0

  const aptoCerts = certificatesByResult?.filter(c => c.result === 'apto').length || 0
  const restriccionesCerts = certificatesByResult?.filter(c => c.result === 'apto_con_restricciones').length || 0
  const noAptoCerts = certificatesByResult?.filter(c => c.result === 'no_apto').length || 0
  const pendienteCerts = certificatesByResult?.filter(c => c.result === 'pendiente').length || 0

  const ingresoCerts = certificatesByResult?.filter(c => c.certificate_type === 'ingreso').length || 0
  const periodicoCerts = certificatesByResult?.filter(c => c.certificate_type === 'periodico').length || 0
  const egresoCerts = certificatesByResult?.filter(c => c.certificate_type === 'egreso').length || 0

  // Count exams by type
  const examCounts = examsByType?.reduce((acc, exam) => {
    acc[exam.exam_type] = (acc[exam.exam_type] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // Count workers by company
  const workersByCompany = workersByStatus?.reduce((acc, worker) => {
    const companyName = worker.company?.name || 'Sin empresa'
    acc[companyName] = (acc[companyName] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reportes y Estadísticas</h1>
        <p className="text-muted-foreground">
          Análisis de datos del sistema de salud ocupacional
        </p>
      </div>

      {/* Workers Stats */}
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
            <div className="text-3xl font-bold text-destructive">{terminatedWorkers}</div>
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
        {/* Certificates by Result */}
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
                      style={{ width: `${(aptoCerts / (certificatesByResult?.length || 1)) * 100}%` }}
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
                      style={{ width: `${(restriccionesCerts / (certificatesByResult?.length || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="font-medium w-8 text-right">{restriccionesCerts}</span>
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
                      style={{ width: `${(noAptoCerts / (certificatesByResult?.length || 1)) * 100}%` }}
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
                      style={{ width: `${(pendienteCerts / (certificatesByResult?.length || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="font-medium w-8 text-right">{pendienteCerts}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificates by Type */}
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

        {/* Workers by Company */}
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
                <div key={company} className="flex items-center justify-between p-3 rounded-lg border border-border">
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

        {/* Exams by Type */}
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
                .sort(([,a], [,b]) => b - a)
                .slice(0, 6)
                .map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between py-2 border-b border-border last:border-0">
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
