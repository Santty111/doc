import { createClient } from '@/lib/supabase/server'
import { CertificatesTable } from '@/components/certificates/certificates-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function ConstanciasPage() {
  const supabase = await createClient()
  
  const { data: certificates } = await supabase
    .from('certificates')
    .select('*, worker:workers(id, first_name, last_name, employee_code, company:companies(name))')
    .order('issue_date', { ascending: false })

  const { data: workers } = await supabase
    .from('workers')
    .select('id, first_name, last_name, employee_code')
    .eq('status', 'active')
    .order('last_name')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Constancias de Aptitud</h1>
          <p className="text-muted-foreground">
            Gestión de constancias médicas y certificados de aptitud laboral
          </p>
        </div>
        <Link href="/dashboard/constancias/nueva">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Constancia
          </Button>
        </Link>
      </div>

      <CertificatesTable certificates={certificates || []} workers={workers || []} />
    </div>
  )
}
