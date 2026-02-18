import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/auth-server'
import { EvaluacionNuevaClient } from './EvaluacionNuevaClient'

export default async function EvaluacionNuevaPage() {
  const profile = await getProfile()
  if (!profile?.id) redirect('/auth/login')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nueva evaluación médica ocupacional</h1>
      <EvaluacionNuevaClient />
    </div>
  )
}
