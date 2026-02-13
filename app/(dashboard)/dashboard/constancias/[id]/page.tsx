import { connectDB } from '@/lib/db'
import { Certificate as CertificateModel } from '@/lib/models'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Award, User, ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'
import { toStr, toDateStr } from '@/lib/utils'
import { CERTIFICATE_TYPE_LABELS, CERTIFICATE_RESULT_LABELS } from '@/lib/types'

export default async function ConstanciaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await connectDB()

  const cert = await CertificateModel.findById(id)
    .populate({
      path: 'worker_id',
      select: 'first_name last_name employee_code',
      populate: { path: 'company_id', select: 'name' },
    })
    .lean()

  if (!cert) notFound()

  const w = (cert as { worker_id?: { _id?: unknown; first_name?: string; last_name?: string; employee_code?: string; company_id?: { name: string } } }).worker_id
  const workerId = w && typeof w === 'object' && '_id' in w ? toStr((w as { _id: unknown })._id) : toStr((cert as { worker_id?: unknown }).worker_id)

  const plain = {
    id: toStr((cert as { _id: unknown })._id),
    worker_id: workerId,
    certificate_type: (cert as { certificate_type: string }).certificate_type,
    issue_date: toDateStr((cert as { issue_date: unknown }).issue_date) ?? '',
    expiry_date: (cert as { expiry_date?: unknown }).expiry_date ? toDateStr((cert as { expiry_date: unknown }).expiry_date) ?? '' : null,
    result: (cert as { result: string }).result,
    restrictions: (cert as { restrictions?: string }).restrictions ?? null,
    recommendations: (cert as { recommendations?: string }).recommendations ?? null,
    doctor_name: (cert as { doctor_name?: string }).doctor_name ?? null,
    doctor_license: (cert as { doctor_license?: string }).doctor_license ?? null,
    observations: (cert as { observations?: string }).observations ?? null,
  }

  const workerName =
    w && typeof w === 'object'
      ? `${(w as { first_name?: string }).first_name ?? ''} ${(w as { last_name?: string }).last_name ?? ''}`.trim()
      : ''
  const employeeCode = w && typeof w === 'object' ? (w as { employee_code?: string }).employee_code ?? '' : ''
  const companyName = w && typeof w === 'object' && (w as { company_id?: { name: string } }).company_id
    ? (w as { company_id: { name: string } }).company_id.name
    : ''

  const typeLabel = CERTIFICATE_TYPE_LABELS[plain.certificate_type as keyof typeof CERTIFICATE_TYPE_LABELS] ?? plain.certificate_type
  const resultLabel = CERTIFICATE_RESULT_LABELS[plain.result as keyof typeof CERTIFICATE_RESULT_LABELS] ?? plain.result

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/constancias">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Constancia de Aptitud</h1>
            <p className="text-muted-foreground">
              {typeLabel} · {workerName}
              {companyName ? ` · ${companyName}` : ''}
            </p>
          </div>
        </div>
        <Link href={`/dashboard/constancias/${id}/editar`}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Trabajador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{workerName || '-'}</p>
            <p className="text-sm text-muted-foreground">Código: {employeeCode || '-'}</p>
            {companyName && (
              <p className="text-sm text-muted-foreground">Empresa: {companyName}</p>
            )}
            <Link href={`/dashboard/trabajadores/${workerId}`}>
              <Button variant="link" className="px-0 mt-2">
                Ver ficha del trabajador
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Datos de la constancia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo</p>
              <p className="font-medium">{typeLabel}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Resultado</p>
              <p className="font-medium">{resultLabel}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha de emisión</p>
              <p className="font-medium">
                {plain.issue_date ? new Date(plain.issue_date).toLocaleDateString('es-MX') : '-'}
              </p>
            </div>
            {plain.expiry_date && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fecha de vigencia</p>
                <p className="font-medium">{new Date(plain.expiry_date).toLocaleDateString('es-MX')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {(plain.restrictions || plain.recommendations || plain.observations) && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Restricciones, recomendaciones y observaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {plain.restrictions && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Restricciones</p>
                  <p className="text-sm whitespace-pre-wrap">{plain.restrictions}</p>
                </div>
              )}
              {plain.recommendations && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recomendaciones</p>
                  <p className="text-sm whitespace-pre-wrap">{plain.recommendations}</p>
                </div>
              )}
              {plain.observations && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Observaciones</p>
                  <p className="text-sm whitespace-pre-wrap">{plain.observations}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {(plain.doctor_name || plain.doctor_license) && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Médico responsable</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-6">
              {plain.doctor_name && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                  <p className="font-medium">{plain.doctor_name}</p>
                </div>
              )}
              {plain.doctor_license && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cédula profesional</p>
                  <p className="font-medium">{plain.doctor_license}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
