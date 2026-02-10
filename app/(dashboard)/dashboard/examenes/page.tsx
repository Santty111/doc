import { connectDB } from '@/lib/db'
import { MedicalExam, Worker } from '@/lib/models'
import { ExamsTable } from '@/components/exams/exams-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

function norm(d: { _id: unknown; [k: string]: unknown }) {
  return { ...d, id: String(d._id) }
}

export default async function ExamenesPage() {
  await connectDB()
  const [exams, workers] = await Promise.all([
    MedicalExam.find()
      .sort({ exam_date: -1 })
      .populate({
        path: 'worker_id',
        select: 'first_name last_name employee_code',
        populate: { path: 'company_id', select: 'name' },
      })
      .lean(),
    Worker.find({ status: 'active' })
      .sort({ last_name: 1 })
      .select('first_name last_name employee_code')
      .lean(),
  ])

  const examsNorm = (
    exams as {
      _id: unknown
      worker_id: {
        _id: string
        first_name: string
        last_name: string
        employee_code: string
        company_id?: { name: string }
      }
      [k: string]: unknown
    }[]
  ).map((e) => {
    const row = norm(e) as { id: string; worker?: { id: string; first_name: string; last_name: string; employee_code: string; company?: { name: string } }; [k: string]: unknown }
    const w = e.worker_id
    if (w) {
      row.worker = {
        id: String(w._id),
        first_name: w.first_name,
        last_name: w.last_name,
        employee_code: w.employee_code,
        company: w.company_id ? { name: w.company_id.name } : undefined,
      }
    }
    return row
  })

  const workersNorm = (
    workers as { _id: string; first_name: string; last_name: string; employee_code: string }[]
  ).map((w) => ({
    id: String(w._id),
    first_name: w.first_name,
    last_name: w.last_name,
    employee_code: w.employee_code,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Exámenes Médicos
          </h1>
          <p className="text-muted-foreground">
            Registro de exámenes de laboratorio y estudios médicos
          </p>
        </div>
        <Link href="/dashboard/examenes/nuevo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Examen
          </Button>
        </Link>
      </div>

      <ExamsTable exams={examsNorm} workers={workersNorm} />
    </div>
  )
}
