import { connectDB } from '@/lib/db'
import { Worker } from '@/lib/models'
import { WorkersTable } from '@/components/workers/workers-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { toStr, toDateStr } from '@/lib/utils'
import { getProfile } from '@/lib/auth-server'

function normalizeWorker(w: Record<string, unknown> & { company_id?: { _id?: unknown; name: string } | unknown }) {
  const company =
    typeof w.company_id === 'object' && w.company_id !== null && 'name' in w.company_id
      ? { name: (w.company_id as { name: string }).name }
      : null

  return {
    id: toStr(w._id),
    company_id:
      typeof w.company_id === 'object' && w.company_id !== null && '_id' in w.company_id
        ? toStr((w.company_id as { _id: unknown })._id)
        : toStr(w.company_id),
    employee_code: toStr(w.employee_code),
    first_name: toStr(w.first_name),
    last_name: toStr(w.last_name),
    primer_nombre: (w.primer_nombre as string) || null,
    segundo_nombre: (w.segundo_nombre as string) || null,
    primer_apellido: (w.primer_apellido as string) || null,
    segundo_apellido: (w.segundo_apellido as string) || null,
    birth_date: toDateStr(w.birth_date) || null,
    gender: w.gender || null,
    sexo: (w.sexo as 'hombre' | 'mujer' | null) || null,
    grupo_sanguineo:
      (w.grupo_sanguineo as string) || (w.blood_type as string) || null,
    lateralidad: (w.lateralidad as 'diestro' | 'zurdo' | 'ambidiestro' | null) || null,
    puesto_trabajo_ciuo: (w.puesto_trabajo_ciuo as string) || null,
    curp: w.curp || null,
    rfc: w.rfc || null,
    nss: w.nss || null,
    phone: w.phone || null,
    email: w.email || null,
    address: w.address || null,
    department: w.department || null,
    position: w.position || null,
    hire_date: toDateStr(w.hire_date) || null,
    status: (w.status || 'active') as 'active' | 'inactive' | 'terminated',
    created_by: w.created_by ? toStr(w.created_by) : null,
    created_at: toDateStr(w.createdAt) ?? toStr(w.createdAt),
    updated_at: toDateStr(w.updatedAt) ?? toStr(w.updatedAt),
    company,
  }
}

export default async function TrabajadoresPage() {
  const profile = await getProfile()
  await connectDB()
  const workerFilter = profile?.company_id ? { company_id: profile.company_id } : {}
  const workers = await Worker.find(workerFilter)
    .sort({ last_name: 1 })
    .populate('company_id', 'name')
    .lean()

  const normalized = workers.map((w) => normalizeWorker(w as Record<string, unknown> & { company_id?: { _id?: unknown; name: string } | unknown }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trabajadores</h1>
          <p className="text-muted-foreground">
            Gestión de trabajadores registrados en el sistema
          </p>
        </div>
        <Link href="/dashboard/trabajadores/nuevo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Trabajador
          </Button>
        </Link>
      </div>

      <WorkersTable workers={normalized} />
    </div>
  )
}
