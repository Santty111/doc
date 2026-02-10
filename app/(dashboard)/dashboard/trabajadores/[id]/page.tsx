import { connectDB } from '@/lib/db'
import { Worker, MedicalRecord, Certificate, MedicalExam } from '@/lib/models'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Award,
  TestTube,
  Edit,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import type { Worker as WorkerType, MedicalRecord as MRType, Certificate as CertType, MedicalExam as ExamType } from '@/lib/types'
import { CERTIFICATE_TYPE_LABELS } from '@/lib/types'

function norm(d: { _id: unknown; [k: string]: unknown }) {
  return { ...d, id: String(d._id) }
}

export default async function TrabajadorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await connectDB()

  const worker = await Worker.findById(id)
    .populate('company_id', 'name')
    .lean()
  if (!worker) notFound()

  const [records, certificates, exams] = await Promise.all([
    MedicalRecord.find({ worker_id: id })
      .sort({ record_date: -1 })
      .limit(3)
      .lean(),
    Certificate.find({ worker_id: id })
      .sort({ issue_date: -1 })
      .limit(3)
      .lean(),
    MedicalExam.find({ worker_id: id })
      .sort({ exam_date: -1 })
      .limit(3)
      .lean(),
  ])

  const workerNorm = norm(worker as { _id: unknown; [k: string]: unknown }) as WorkerType & {
    company?: { name: string }
  }
  workerNorm.company = (worker as { company_id?: { name: string } }).company_id
    ? { name: (worker as { company_id: { name: string } }).company_id.name }
    : undefined

  const getStatusBadge = (status: WorkerType['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-accent text-accent-foreground">Activo</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inactivo</Badge>
      case 'terminated':
        return <Badge variant="destructive">Baja</Badge>
      default:
        return null
    }
  }

  const getResultBadge = (result: CertType['result']) => {
    switch (result) {
      case 'apto':
        return <Badge className="bg-accent text-accent-foreground">Apto</Badge>
      case 'apto_con_restricciones':
        return <Badge className="bg-warning text-warning-foreground">Con Restricciones</Badge>
      case 'no_apto':
        return <Badge variant="destructive">No Apto</Badge>
      case 'pendiente':
        return <Badge variant="secondary">Pendiente</Badge>
      default:
        return null
    }
  }

  const recordsNorm = records.map((r) => norm(r as { _id: unknown; [k: string]: unknown }) as MRType)
  const certsNorm = certificates.map((c) => norm(c as { _id: unknown; [k: string]: unknown }) as CertType)
  const examsNorm = exams.map((e) => norm(e as { _id: unknown; [k: string]: unknown }) as ExamType)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/trabajadores">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {workerNorm.first_name} {workerNorm.last_name}
            </h1>
            <p className="text-muted-foreground">
              {workerNorm.employee_code} - {workerNorm.company?.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(workerNorm.status)}
          <Link href={`/dashboard/trabajadores/${id}/editar`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">CURP</p>
                <p className="font-medium font-mono">{workerNorm.curp || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">RFC</p>
                <p className="font-medium font-mono">{workerNorm.rfc || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">NSS (IMSS)</p>
                <p className="font-medium font-mono">{workerNorm.nss || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                <p className="font-medium">
                  {workerNorm.birth_date
                    ? new Date(workerNorm.birth_date as string).toLocaleDateString('es-MX')
                    : '-'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Género</p>
                <p className="font-medium">
                  {workerNorm.gender === 'M'
                    ? 'Masculino'
                    : workerNorm.gender === 'F'
                      ? 'Femenino'
                      : workerNorm.gender || '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workerNorm.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{workerNorm.phone}</span>
              </div>
            )}
            {workerNorm.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{workerNorm.email}</span>
              </div>
            )}
            {workerNorm.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{workerNorm.address}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información Laboral
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Departamento</p>
              <p className="font-medium">{workerNorm.department || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Puesto</p>
              <p className="font-medium">{workerNorm.position || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Fecha de Ingreso</p>
              <p className="font-medium">
                {workerNorm.hire_date
                  ? new Date(workerNorm.hire_date as string).toLocaleDateString('es-MX')
                  : '-'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Expedientes
            </CardTitle>
            <Link href={`/dashboard/expedientes/nuevo?trabajador=${id}`}>
              <Button size="sm" variant="outline">
                Nuevo
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recordsNorm.length > 0 ? (
              <div className="space-y-3">
                {recordsNorm.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(record.record_date as string).toLocaleDateString('es-MX')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tipo: {record.blood_type || 'N/A'}
                      </p>
                    </div>
                    <Link href={`/dashboard/expedientes/${record.id}`}>
                      <Button size="sm" variant="ghost">
                        Ver
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-4">
                Sin expedientes
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Constancias
            </CardTitle>
            <Link href={`/dashboard/constancias/nueva?trabajador=${id}`}>
              <Button size="sm" variant="outline">
                Nueva
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {certsNorm.length > 0 ? (
              <div className="space-y-3">
                {certsNorm.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {CERTIFICATE_TYPE_LABELS[cert.certificate_type]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(cert.issue_date as string).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                    {getResultBadge(cert.result)}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-4">
                Sin constancias
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
