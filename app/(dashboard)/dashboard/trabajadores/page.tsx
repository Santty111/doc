import { createClient } from '@/lib/supabase/server'
import { WorkersTable } from '@/components/workers/workers-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function TrabajadoresPage() {
  const supabase = await createClient()
  
  const { data: workers, error } = await supabase
    .from('workers')
    .select('*, company:companies(name)')
    .order('last_name', { ascending: true })

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

      <WorkersTable workers={workers || []} />
    </div>
  )
}
