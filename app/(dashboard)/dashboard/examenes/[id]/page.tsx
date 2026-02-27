import { connectDB } from '@/lib/db'
import { MedicalExam as MedicalExamModel } from '@/lib/models'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, ArrowLeft, Edit, FileText, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { toPlainExam } from '@/lib/exams'

export default async function ExamenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await connectDB()

  const exam = await MedicalExamModel.findById(id)
    .populate({
      path: 'worker_id',
      select: 'first_name last_name employee_code',
      populate: { path: 'company_id', select: 'name' },
    })
    .lean()

  if (!exam) notFound()

  const plain = toPlainExam(exam as Parameters<typeof toPlainExam>[0])
  const workerName = plain.worker
    ? `${plain.worker.first_name} ${plain.worker.last_name}`.trim()
    : ''
  const employeeCode = plain.worker?.employee_code ?? ''
  const companyName = plain.worker?.company?.name ?? ''
  const typeLabel = plain.exam_type || 'Examen médico'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/examenes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Examen Médico</h1>
            <p className="text-muted-foreground">
              {typeLabel} · {workerName}
              {companyName ? ` · ${companyName}` : ''}
            </p>
          </div>
        </div>
        <Link href={`/dashboard/examenes/${id}/editar`}>
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
            <Link href={`/dashboard/trabajadores/${plain.worker_id}`}>
              <Button variant="link" className="px-0 mt-2">
                Ver ficha del trabajador
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Datos del examen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo</p>
              <p className="font-medium">{typeLabel}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha del examen</p>
              <p className="font-medium">
                {plain.exam_date
                  ? new Date(plain.exam_date).toLocaleDateString('es-MX')
                  : '-'}
              </p>
            </div>
            {plain.lab_name && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Laboratorio</p>
                <p className="font-medium">{plain.lab_name}</p>
              </div>
            )}
            {plain.results && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resultados</p>
                <p className="text-sm whitespace-pre-wrap">{plain.results}</p>
              </div>
            )}
            {plain.file_url && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Archivo</p>
                <a
                  href={plain.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  {plain.file_name ?? 'Ver archivo'}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
            {plain.consentimiento_informado_url && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Consentimiento informado</p>
                <a
                  href={plain.consentimiento_informado_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  {plain.consentimiento_informado_name ?? 'Ver consentimiento informado'}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {plain.observations && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{plain.observations}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
