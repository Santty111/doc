import { connectDB } from '@/lib/db'
import { Worker } from '@/lib/models'
import { WorkersTable } from '@/components/workers/workers-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

function normalizeWorker(d: { _id: unknown; [k: string]: unknown }) {
  return { ...d, id: String(d._id) }
}

export default async function TrabajadoresPage() {
  await connectDB()
  const workers = await Worker.find()
    .sort({ last_name: 1 })
    .populate('company_id', 'name')
    .lean()

  const normalized = workers.map((w) => {
    const row = normalizeWorker(w as { _id: unknown; [k: string]: unknown })
    const c = (w as { company_id?: { name: string } }).company_id
    return { ...row, company: c ? { name: c.name } : null }
  })

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
