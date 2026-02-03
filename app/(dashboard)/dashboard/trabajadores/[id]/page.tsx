import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  Award, 
  TestTube,
  Edit,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import type { Worker, MedicalRecord, Certificate, MedicalExam } from '@/lib/types'
import { CERTIFICATE_TYPE_LABELS, CERTIFICATE_RESULT_LABELS } from '@/lib/types'

export default async function TrabajadorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: worker } = await supabase
    .from('workers')
    .select('*, company:companies(name)')
    .eq('id', id)
    .single()

  if (!worker) {
    notFound()
  }

  const { data: records } = await supabase
    .from('medical_records')
    .select('*')
    .eq('worker_id', id)
    .order('record_date', { ascending: false })
    .limit(3)

  const { data: certificates } = await supabase
    .from('certificates')
    .select('*')
    .eq('worker_id', id)
    .order('issue_date', { ascending: false })
    .limit(3)

  const { data: exams } = await supabase
    .from('medical_exams')
    .select('*')
    .eq('worker_id', id)
    .order('exam_date', { ascending: false })
    .limit(3)

  const getStatusBadge = (status: Worker['status']) => {
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

  const getResultBadge = (result: Certificate['result']) => {
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
              {worker.first_name} {worker.last_name}
            </h1>
            <p className="text-muted-foreground">
              {worker.employee_code} - {(worker as any).company?.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(worker.status)}
          <Link href={`/dashboard/trabajadores/${id}/editar`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Personal Info */}
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
                <p className="font-medium font-mono">{worker.curp || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">RFC</p>
                <p className="font-medium font-mono">{worker.rfc || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">NSS (IMSS)</p>
                <p className="font-medium font-mono">{worker.nss || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                <p className="font-medium">
                  {worker.birth_date 
                    ? new Date(worker.birth_date).toLocaleDateString('es-MX') 
                    : '-'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Género</p>
                <p className="font-medium">
                  {worker.gender === 'M' ? 'Masculino' : worker.gender === 'F' ? 'Femenino' : worker.gender || '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {worker.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{worker.phone}</span>
              </div>
            )}
            {worker.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{worker.email}</span>
              </div>
            )}
            {worker.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{worker.address}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Work Info */}
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
              <p className="font-medium">{worker.department || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Puesto</p>
              <p className="font-medium">{worker.position || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Fecha de Ingreso</p>
              <p className="font-medium">
                {worker.hire_date 
                  ? new Date(worker.hire_date).toLocaleDateString('es-MX') 
                  : '-'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Medical Records */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Expedientes
            </CardTitle>
            <Link href={`/dashboard/expedientes/nuevo?trabajador=${id}`}>
              <Button size="sm" variant="outline">Nuevo</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {records && records.length > 0 ? (
              <div className="space-y-3">
                {records.map((record: MedicalRecord) => (
                  <div key={record.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(record.record_date).toLocaleDateString('es-MX')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tipo: {record.blood_type || 'N/A'}
                      </p>
                    </div>
                    <Link href={`/dashboard/expedientes/${record.id}`}>
                      <Button size="sm" variant="ghost">Ver</Button>
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

        {/* Recent Certificates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Constancias
            </CardTitle>
            <Link href={`/dashboard/constancias/nueva?trabajador=${id}`}>
              <Button size="sm" variant="outline">Nueva</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {certificates && certificates.length > 0 ? (
              <div className="space-y-3">
                {certificates.map((cert: Certificate) => (
                  <div key={cert.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-medium">
                        {CERTIFICATE_TYPE_LABELS[cert.certificate_type]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(cert.issue_date).toLocaleDateString('es-MX')}
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
