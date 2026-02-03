import { createClient } from '@/lib/supabase/server'
import { MedicalRecordsTable } from '@/components/medical-records/medical-records-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function ExpedientesPage() {
  const supabase = await createClient()
  
  const { data: records } = await supabase
    .from('medical_records')
    .select('*, worker:workers(id, first_name, last_name, employee_code, company:companies(name))')
    .order('record_date', { ascending: false })

  const { data: workers } = await supabase
    .from('workers')
    .select('id, first_name, last_name, employee_code')
    .eq('status', 'active')
    .order('last_name')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Expedientes Médicos</h1>
          <p className="text-muted-foreground">
            Historia clínica y antecedentes médicos de los trabajadores
          </p>
        </div>
        <Link href="/dashboard/expedientes/nuevo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Expediente
          </Button>
        </Link>
      </div>

      <MedicalRecordsTable records={records || []} workers={workers || []} />
    </div>
  )
}
