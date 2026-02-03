import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { WorkerForm } from '@/components/workers/worker-form'

export default async function EditarTrabajadorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: worker } = await supabase
    .from('workers')
    .select('*')
    .eq('id', id)
    .single()

  if (!worker) {
    notFound()
  }

  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Editar Trabajador</h1>
        <p className="text-muted-foreground">
          {worker.first_name} {worker.last_name} - {worker.employee_code}
        </p>
      </div>

      <WorkerForm companies={companies || []} worker={worker} />
    </div>
  )
}
