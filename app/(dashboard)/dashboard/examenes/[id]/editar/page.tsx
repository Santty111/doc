import { connectDB } from '@/lib/db'
import { MedicalExam as MedicalExamModel, Worker } from '@/lib/models'
import { notFound } from 'next/navigation'
import { ExamForm } from '@/components/exams/exam-form'
import { toStr } from '@/lib/utils'
import { toPlainExam } from '@/lib/exams'

export default async function EditarExamenPage({
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

  const workers = await Worker.find({ status: 'active' })
    .sort({ last_name: 1 })
    .select('first_name last_name employee_code')
    .populate('company_id', 'name')
    .lean()

  const examPlain = toPlainExam(exam as Parameters<typeof toPlainExam>[0])
  const workersNorm = (workers as Record<string, unknown>[]).map((w) => ({
    id: toStr(w._id),
    first_name: toStr(w.first_name),
    last_name: toStr(w.last_name),
    employee_code: toStr(w.employee_code),
    company:
      w.company_id && typeof w.company_id === 'object' && 'name' in w.company_id
        ? { name: (w.company_id as { name: string }).name }
        : null,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Editar Examen Médico</h1>
        <p className="text-muted-foreground">
          Modifique los datos del examen de laboratorio o estudio médico
        </p>
      </div>

      <ExamForm workers={workersNorm} exam={examPlain} />
    </div>
  )
}
