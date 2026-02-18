import { connectDB } from '@/lib/db'
import { MedicalRecord as MedicalRecordModel } from '@/lib/models'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, User, ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'
import { toStr, toDateStr } from '@/lib/utils'

export default async function ExpedienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await connectDB()

  const record = await MedicalRecordModel.findById(id)
    .populate({
      path: 'worker_id',
      select: 'first_name last_name employee_code',
      populate: { path: 'company_id', select: 'name' },
    })
    .lean()

  if (!record) notFound()

  const w = (record as { worker_id?: { _id?: unknown; first_name?: string; last_name?: string; employee_code?: string; company_id?: { name: string } } }).worker_id
  const workerId = w && typeof w === 'object' && '_id' in w ? toStr((w as { _id: unknown })._id) : toStr((record as { worker_id?: unknown }).worker_id)

  const plain = {
    id: toStr((record as { _id: unknown })._id),
    worker_id: workerId,
    record_date: toDateStr((record as { record_date: unknown }).record_date) ?? '',
    medical_history: (record as { medical_history?: string }).medical_history ?? null,
    family_history: (record as { family_history?: string }).family_history ?? null,
    allergies: (record as { allergies?: string }).allergies ?? null,
    current_medications: (record as { current_medications?: string }).current_medications ?? null,
    blood_type: (record as { blood_type?: string }).blood_type ?? null,
    height_cm: (record as { height_cm?: number }).height_cm ?? null,
    weight_kg: (record as { weight_kg?: number }).weight_kg ?? null,
    blood_pressure: (record as { blood_pressure?: string }).blood_pressure ?? null,
    heart_rate: (record as { heart_rate?: number }).heart_rate ?? null,
    observations: (record as { observations?: string }).observations ?? null,
  }

  const workerName =
    w && typeof w === 'object'
      ? `${(w as { first_name?: string }).first_name ?? ''} ${(w as { last_name?: string }).last_name ?? ''}`.trim()
      : ''
  const employeeCode = w && typeof w === 'object' ? (w as { employee_code?: string }).employee_code ?? '' : ''
  const companyName = w && typeof w === 'object' && (w as { company_id?: { name: string } }).company_id
    ? (w as { company_id: { name: string } }).company_id.name
    : ''

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/expedientes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Expediente Médico</h1>
            <p className="text-muted-foreground">
              {workerName} · {employeeCode}
              {companyName ? ` · ${companyName}` : ''}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/expedientes/${id}/ficha-ministerio`}>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Formato Ministerio
            </Button>
          </Link>
          <Link href={`/dashboard/expedientes/${id}/editar`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
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
            <CardTitle>Fecha de registro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">
              {plain.record_date
                ? new Date(plain.record_date).toLocaleDateString('es-MX')
                : '-'}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Antecedentes y signos vitales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo de sangre</p>
                <p className="font-medium">{plain.blood_type || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estatura (cm)</p>
                <p className="font-medium">{plain.height_cm ?? '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Peso (kg)</p>
                <p className="font-medium">{plain.weight_kg ?? '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Presión arterial</p>
                <p className="font-medium">{plain.blood_pressure || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Frecuencia cardíaca (lpm)</p>
                <p className="font-medium">{plain.heart_rate ?? '-'}</p>
              </div>
            </div>

            {plain.medical_history && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Antecedentes personales</p>
                <p className="text-sm whitespace-pre-wrap">{plain.medical_history}</p>
              </div>
            )}
            {plain.family_history && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Antecedentes familiares</p>
                <p className="text-sm whitespace-pre-wrap">{plain.family_history}</p>
              </div>
            )}
            {plain.allergies && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Alergias</p>
                <p className="text-sm whitespace-pre-wrap">{plain.allergies}</p>
              </div>
            )}
            {plain.current_medications && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Medicamentos actuales</p>
                <p className="text-sm whitespace-pre-wrap">{plain.current_medications}</p>
              </div>
            )}
            {plain.observations && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Observaciones</p>
                <p className="text-sm whitespace-pre-wrap">{plain.observations}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
