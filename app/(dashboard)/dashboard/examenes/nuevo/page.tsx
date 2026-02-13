import { connectDB } from '@/lib/db'
import { Worker } from '@/lib/models'
import { ExamForm } from '@/components/exams/exam-form'

export default async function NuevoExamenPage({
  searchParams,
}: {
  searchParams: Promise<{ trabajador?: string }>
}) {
  const params = await searchParams
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
          Nuevo Examen Médico
        </h1>
        <p className="text-muted-foreground">
          Registre un nuevo estudio de laboratorio o examen médico
        </p>
      </div>

      <ExamForm workers={normalized} defaultWorkerId={params.trabajador} />
    </div>
  )
}
