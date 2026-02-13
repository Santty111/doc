import { toStr, toDateStr } from '@/lib/utils'
import type { MedicalExam } from '@/lib/types'

type RawExam = Record<string, unknown> & {
  worker_id?: {
    _id?: unknown
    first_name?: string
    last_name?: string
    employee_code?: string
    company_id?: { name: string }
  }
}

/** Convierte documento de exámen (Mongoose/lean) a objeto plano para Client Components. */
export function toPlainExam(e: RawExam): MedicalExam {
  const w = e.worker_id
  const workerId =
    w && typeof w === 'object' && w !== null && '_id' in w
      ? toStr((w as { _id: unknown })._id)
      : toStr(e.worker_id)
  const worker =
    w && typeof w === 'object'
      ? {
          id: workerId,
          first_name: String((w as { first_name?: string }).first_name ?? ''),
          last_name: String((w as { last_name?: string }).last_name ?? ''),
          employee_code: String((w as { employee_code?: string }).employee_code ?? ''),
          company: (w as { company_id?: { name: string } }).company_id
            ? { name: (w as { company_id: { name: string } }).company_id.name }
            : undefined,
        }
      : undefined

  return {
    id: toStr(e._id),
    worker_id: workerId,
    exam_type: toStr(e.exam_type),
    exam_date: toDateStr(e.exam_date) ?? toStr(e.exam_date),
    lab_name: (e.lab_name as string) ?? null,
    results: (e.results as string) ?? null,
    file_url: (e.file_url as string) ?? null,
    file_name: (e.file_name as string) ?? null,
    observations: (e.observations as string) ?? null,
    created_at: toDateStr(e.createdAt) ?? toStr(e.createdAt),
    updated_at: toDateStr(e.updatedAt) ?? toStr(e.updatedAt),
    created_by: e.created_by ? toStr(e.created_by) : null,
    worker,
  }
}
