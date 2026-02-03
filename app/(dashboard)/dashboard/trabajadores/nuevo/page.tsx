import { createClient } from '@/lib/supabase/server'
import { WorkerForm } from '@/components/workers/worker-form'

export default async function NuevoTrabajadorPage() {
  const supabase = await createClient()
  
  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nuevo Trabajador</h1>
        <p className="text-muted-foreground">
          Complete el formulario para registrar un nuevo trabajador
        </p>
      </div>

      <WorkerForm companies={companies || []} />
    </div>
  )
}
