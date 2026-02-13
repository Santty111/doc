import { connectDB } from '@/lib/db'
import { Worker } from '@/lib/models'
import { getProfile } from '@/lib/auth-server'
import { CertificateForm } from '@/components/certificates/certificate-form'

export default async function NuevaConstanciaPage({
  searchParams,
}: {
  searchParams: Promise<{ trabajador?: string }>
}) {
  const params = await searchParams
  const profile = await getProfile()
  await connectDB()
  const workers = await Worker.find({ status: 'active' })
    .sort({ last_name: 1 })
    .select('first_name last_name employee_code')
    .populate('company_id', 'name')
    .lean()

  const normalized = (
    workers as {
      _id: string
      first_name: string
      last_name: string
      employee_code: string
      company_id?: { name: string }
    }[]
  ).map((w) => ({
    id: String(w._id),
    first_name: w.first_name,
    last_name: w.last_name,
    employee_code: w.employee_code,
    company: w.company_id ? { name: w.company_id.name } : null,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Nueva Constancia de Aptitud
        </h1>
        <p className="text-muted-foreground">
          Complete el formulario para emitir una nueva constancia médica
        </p>
      </div>

      <CertificateForm
        workers={normalized}
        defaultWorkerId={params.trabajador}
        doctorName={profile?.full_name || ''}
      />
    </div>
  )
}
