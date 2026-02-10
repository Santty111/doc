import { connectDB } from '@/lib/db'
import {
  Worker,
  MedicalRecord,
  Certificate,
  MedicalExam,
} from '@/lib/models'
import { getProfile } from '@/lib/auth-server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, Award, TestTube, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const profile = await getProfile()

  await connectDB()

  const [workersCount, recordsCount, certificatesCount, examsCount] =
    await Promise.all([
      Worker.countDocuments({ status: 'active' }),
      MedicalRecord.countDocuments(),
      Certificate.countDocuments(),
      MedicalExam.countDocuments(),
    ])

  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
  const now = new Date()

  const [expiringCertificates, recentWorkers] = await Promise.all([
    Certificate.find({
      expiry_date: { $gte: now, $lte: thirtyDaysFromNow },
    })
      .sort({ expiry_date: 1 })
      .limit(5)
      .populate('worker_id', 'first_name last_name employee_code')
      .lean(),
    Worker.find()
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
      name: 'Expedientes Médicos',
      value: recordsCount,
      icon: FileText,
      href: '/dashboard/expedientes',
      color: 'bg-accent/10 text-accent',
    },
    {
      name: 'Constancias Emitidas',
      value: certificatesCount,
      icon: Award,
      href: '/dashboard/constancias',
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
              <AlertTriangle className="h-5 w-5 text-warning" />
              <CardTitle>Constancias por Vencer</CardTitle>
            </div>
            <CardDescription>
              Constancias que vencen en los próximos 30 días
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expiringCertificates && expiringCertificates.length > 0 ? (
              <div className="space-y-3">
                {expiringCertificates.map((cert: { _id: string; expiry_date: Date; worker_id: { first_name: string; last_name: string; employee_code: string } }) => (
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
                        Vence:{' '}
                        {new Date(cert.expiry_date).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-10 w-10 text-accent mb-2" />
                <p className="text-muted-foreground">
                  No hay constancias por vencer próximamente
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
