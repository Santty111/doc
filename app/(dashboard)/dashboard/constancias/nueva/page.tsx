import { createClient } from '@/lib/supabase/server'
import { CertificateForm } from '@/components/certificates/certificate-form'

export default async function NuevaConstanciaPage({
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

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nueva Constancia de Aptitud</h1>
        <p className="text-muted-foreground">
          Complete el formulario para emitir una nueva constancia médica
        </p>
      </div>

      <CertificateForm 
        workers={workers || []} 
        defaultWorkerId={params.trabajador}
        doctorName={profile?.full_name || ''}
      />
    </div>
  )
}
