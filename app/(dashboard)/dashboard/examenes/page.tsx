import { connectDB } from '@/lib/db'
import { MedicalExam, Worker } from '@/lib/models'
import { ExamsTable } from '@/components/exams/exams-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { toStr } from '@/lib/utils'
import { toPlainExam } from '@/lib/exams'
import { getProfile } from '@/lib/auth-server'

export default async function ExamenesPage() {
  const profile = await getProfile()
  await connectDB()
  const workerFilter = profile?.company_id ? { company_id: profile.company_id } : {}
  const workerIds = profile?.company_id
    ? await Worker.find(workerFilter).distinct('_id')
    : null
  const workerIdStrings = workerIds?.map((id) => String(id)) ?? []
  const examFilter =
    workerIds !== null
      ? {
          $or: [
            { worker_id: { $in: workerIds } },
            { worker_id: { $in: workerIdStrings } },
          ],
        }
      : {}
  const [exams, workers] = await Promise.all([
    MedicalExam.find(examFilter)
      .sort({ exam_date: -1 })
      .populate({
        path: 'worker_id',
        select: 'first_name last_name employee_code',
        populate: { path: 'company_id', select: 'name' },
      })
      .lean(),
    Worker.find({ ...workerFilter, status: 'active' })
      .sort({ last_name: 1 })
      .select('first_name last_name employee_code')
      .lean(),
  ])

  const examsNorm = (exams as Record<string, unknown>[]).map((e) =>
    toPlainExam(e as Parameters<typeof toPlainExam>[0])
  )

  const workersNorm = (workers as Record<string, unknown>[]).map((w) => ({
    id: toStr(w._id),
    first_name: toStr(w.first_name),
    last_name: toStr(w.last_name),
    employee_code: toStr(w.employee_code),
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
