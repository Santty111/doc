import { connectDB } from '@/lib/db'
import {
  Worker,
  FichaMedicaEvaluacion1,
  FichaMedicaEvaluacion2,
  FichaMedicaEvaluacion3,
  CertificadoFichaMedica,
  CertificadoAptitudOficial,
  MedicalExam,
} from '@/lib/models'
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
  ClipboardList,
  FileCheck,
  TestTube,
  Edit,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function formatDateOnlyEsMx(value: unknown): string {
  if (!value) return '-'
  const raw =
    typeof value === 'string'
      ? value
      : value instanceof Date
        ? value.toISOString()
        : String(value)

  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return '-'
  const [, y, m, d] = match
  return `${d}/${m}/${y}`
}

export default async function TrabajadorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await connectDB()

  const worker = await Worker.findById(id).populate('company_id', 'name').lean()
  if (!worker) notFound()
  const w = worker as Record<string, unknown>
  const companyId = ((w.company_id as { _id?: unknown } | null)?._id ?? w.company_id) as
    | string
    | { toString?: () => string }
    | null
  const companyName = ((w.company_id as { name?: string } | null)?.name ?? '') as string
  const workerIdFilter = {
    $or: [{ worker_id: id }, { 'worker_snapshot.worker_id': id }],
  }
  const companyWorkersCount =
    companyId != null ? await Worker.countDocuments({ company_id: companyId }) : 0
  const legacyByCreatorForSingleWorker =
    companyWorkersCount === 1 && w.created_by
      ? {
          $and: [
            { created_by: w.created_by },
            {
              $or: [{ worker_id: { $exists: false } }, { worker_id: null }],
            },
            {
              $or: [
                { 'worker_snapshot.worker_id': { $exists: false } },
                { 'worker_snapshot.worker_id': null },
              ],
            },
          ],
        }
      : null

  const firstName = String(w.first_name ?? '').trim()
  const lastName = String(w.last_name ?? '').trim()
  const firstParts = firstName.split(/\s+/).filter(Boolean)
  const lastParts = lastName.split(/\s+/).filter(Boolean)
  const primerNombre = String(w.primer_nombre ?? firstParts[0] ?? '').trim()
  const segundoNombre = String(w.segundo_nombre ?? firstParts.slice(1).join(' ') ?? '').trim()
  const primerApellido = String(w.primer_apellido ?? lastParts[0] ?? '').trim()
  const segundoApellido = String(w.segundo_apellido ?? lastParts.slice(1).join(' ') ?? '').trim()

  const legacyByUserAndCompany =
    companyName && primerNombre && primerApellido
      ? {
          $and: [
            {
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
            },
            {
              'seccionA.usuario.primer_nombre': {
                $regex: `^${escapeRegex(primerNombre)}$`,
                $options: 'i',
              },
            },
            {
              'seccionA.usuario.primer_apellido': {
                $regex: `^${escapeRegex(primerApellido)}$`,
                $options: 'i',
              },
            },
            ...(segundoNombre
              ? [
                  {
                    'seccionA.usuario.segundo_nombre': {
                      $regex: `^${escapeRegex(segundoNombre)}$`,
                      $options: 'i',
                    },
                  },
                ]
              : []),
            ...(segundoApellido
              ? [
                  {
                    'seccionA.usuario.segundo_apellido': {
                      $regex: `^${escapeRegex(segundoApellido)}$`,
                      $options: 'i',
                    },
                  },
                ]
              : []),
          ],
        }
      : null

  const ficha1Filter = {
    $or: [
      workerIdFilter,
      ...(legacyByUserAndCompany ? [legacyByUserAndCompany] : []),
      ...(legacyByCreatorForSingleWorker ? [legacyByCreatorForSingleWorker] : []),
    ],
  }
  const ficha2Filter = {
    $or: [workerIdFilter, ...(legacyByCreatorForSingleWorker ? [legacyByCreatorForSingleWorker] : [])],
  }
  const ficha3Filter = {
    $or: [workerIdFilter, ...(legacyByCreatorForSingleWorker ? [legacyByCreatorForSingleWorker] : [])],
  }
  const certFichaFilter = {
    $or: [
      workerIdFilter,
      ...(legacyByUserAndCompany ? [legacyByUserAndCompany] : []),
      ...(legacyByCreatorForSingleWorker ? [legacyByCreatorForSingleWorker] : []),
    ],
  }
  const certAptitudFilter = {
    $or: [workerIdFilter, ...(legacyByCreatorForSingleWorker ? [legacyByCreatorForSingleWorker] : [])],
  }
  const examFilter = {
    $or: [{ worker_id: id }, ...(legacyByCreatorForSingleWorker ? [legacyByCreatorForSingleWorker] : [])],
  }

  const [ficha1, ficha2, ficha3, certFicha, certAptitud, exams] = await Promise.all([
    FichaMedicaEvaluacion1.find(ficha1Filter).sort({ createdAt: -1 }).limit(3).lean(),
    FichaMedicaEvaluacion2.find(ficha2Filter).sort({ createdAt: -1 }).limit(3).lean(),
    FichaMedicaEvaluacion3.find(ficha3Filter).sort({ createdAt: -1 }).limit(3).lean(),
    CertificadoFichaMedica.find(certFichaFilter).sort({ createdAt: -1 }).limit(3).lean(),
    CertificadoAptitudOficial.find(certAptitudFilter).sort({ createdAt: -1 }).limit(3).lean(),
    MedicalExam.find(examFilter).sort({ exam_date: -1 }).limit(3).lean(),
  ])

  const companyNameLabel = companyName || '-'
  const firstNameLabel = String(w.first_name ?? '')
  const lastNameLabel = String(w.last_name ?? '')
  const status = (w.status ?? 'active') as 'active' | 'inactive' | 'terminated'

  const getStatusBadge = () => {
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
              {firstNameLabel} {lastNameLabel}
            </h1>
            <p className="text-muted-foreground">
              {String(w.employee_code ?? '')} - {companyNameLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
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
                <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                <p className="font-medium">
                  {formatDateOnlyEsMx(w.birth_date)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Sexo</p>
                <p className="font-medium">
                  {w.sexo === 'hombre' ? 'Hombre' : w.sexo === 'mujer' ? 'Mujer' : '-'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Grupo Sanguíneo</p>
                <p className="font-medium">{String(w.grupo_sanguineo ?? w.blood_type ?? '-')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Lateralidad</p>
                <p className="font-medium">{String(w.lateralidad ?? '-')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {w.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{String(w.phone)}</span>
              </div>
            )}
            {w.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{String(w.email)}</span>
              </div>
            )}
            {w.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{String(w.address)}</span>
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
              <p className="font-medium">{String(w.department ?? '-')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Cargo / Ocupación</p>
              <p className="font-medium">{String(w.position ?? '-')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Puesto CIUO</p>
              <p className="font-medium">{String(w.puesto_trabajo_ciuo ?? '-')}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Fichas Médicas
            </CardTitle>
            <Link href={`/dashboard/fichas-medicas/evaluacion-1-3/nuevo?trabajador=${id}`}>
              <Button size="sm" variant="outline">
                Nueva 1-3
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>1-3: {ficha1.length} registro(s)</p>
            <p>2-3: {ficha2.length} registro(s)</p>
            <p>3-3: {ficha3.length} registro(s)</p>
            <div className="flex gap-2">
              {ficha1[0] && (
                <Link href={`/dashboard/fichas-medicas/evaluacion-1-3/${String((ficha1[0] as { _id: unknown })._id)}/imprimir`}>
                  <Button size="sm" variant="ghost">Ver última 1-3</Button>
                </Link>
              )}
              {ficha2[0] && (
                <Link href={`/dashboard/fichas-medicas/evaluacion-2-3/${String((ficha2[0] as { _id: unknown })._id)}/imprimir`}>
                  <Button size="sm" variant="ghost">Ver última 2-3</Button>
                </Link>
              )}
              {ficha3[0] && (
                <Link href={`/dashboard/fichas-medicas/evaluacion-3-3/${String((ficha3[0] as { _id: unknown })._id)}/imprimir`}>
                  <Button size="sm" variant="ghost">Ver última 3-3</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Certificados
            </CardTitle>
            <Link href={`/dashboard/certificado-aptitud-oficial/nuevo?trabajador=${id}`}>
              <Button size="sm" variant="outline">
                Nuevo aptitud
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>Cert. ficha médica: {certFicha.length} registro(s)</p>
            <p>Cert. aptitud oficial: {certAptitud.length} registro(s)</p>
            <div className="flex gap-2">
              {certFicha[0] && (
                <Link href={`/dashboard/fichas-medicas/certificado/${String((certFicha[0] as { _id: unknown })._id)}/imprimir`}>
                  <Button size="sm" variant="ghost">Ver último cert. ficha</Button>
                </Link>
              )}
              {certAptitud[0] && (
                <Link href={`/dashboard/certificado-aptitud-oficial/${String((certAptitud[0] as { _id: unknown })._id)}/imprimir`}>
                  <Button size="sm" variant="ghost">Ver último cert. aptitud</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Exámenes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Últimos exámenes registrados: {exams.length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
