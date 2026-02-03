import { createClient } from '@/lib/supabase/server'
import { ExamsTable } from '@/components/exams/exams-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function ExamenesPage() {
  const supabase = await createClient()
  
  const { data: exams } = await supabase
    .from('medical_exams')
    .select('*, worker:workers(id, first_name, last_name, employee_code, company:companies(name))')
    .order('exam_date', { ascending: false })

  const { data: workers } = await supabase
    .from('workers')
    .select('id, first_name, last_name, employee_code')
    .eq('status', 'active')
    .order('last_name')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Exámenes Médicos</h1>
          <p className="text-muted-foreground">
            Registro de exámenes de laboratorio y estudios médicos
          </p>
        </div>
        <Link href="/dashboard/examenes/nuevo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Examen
          </Button>
        </Link>
      </div>

      <ExamsTable exams={exams || []} workers={workers || []} />
    </div>
  )
}
