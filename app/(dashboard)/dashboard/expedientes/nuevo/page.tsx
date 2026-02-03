import { createClient } from '@/lib/supabase/server'
import { MedicalRecordForm } from '@/components/medical-records/medical-record-form'

export default async function NuevoExpedientePage({
  searchParams,
}: {
  searchParams: Promise<{ trabajador?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  
  const { data: workers } = await supabase
    .from('workers')
    .select('id, first_name, last_name, employee_code, company:companies(name)')
    .eq('status', 'active')
    .order('last_name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nuevo Expediente Médico</h1>
        <p className="text-muted-foreground">
          Complete la historia clínica del trabajador
        </p>
      </div>

      <MedicalRecordForm 
        workers={workers || []} 
        defaultWorkerId={params.trabajador}
      />
    </div>
  )
}
