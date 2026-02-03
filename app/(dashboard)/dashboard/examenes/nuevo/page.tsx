import { createClient } from '@/lib/supabase/server'
import { ExamForm } from '@/components/exams/exam-form'

export default async function NuevoExamenPage({
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
        <h1 className="text-2xl font-bold text-foreground">Nuevo Examen Médico</h1>
        <p className="text-muted-foreground">
          Registre un nuevo estudio de laboratorio o examen médico
        </p>
      </div>

      <ExamForm 
        workers={workers || []} 
        defaultWorkerId={params.trabajador}
      />
    </div>
  )
}
