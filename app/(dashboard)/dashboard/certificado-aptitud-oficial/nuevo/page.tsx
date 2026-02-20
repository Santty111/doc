import { getProfile } from '@/lib/auth-server'
import { CertificadoAptitudFlow } from '@/components/certificates/certificado-aptitud/CertificadoAptitudFlow'

export default async function NuevoCertificadoAptitudOficialPage() {
  const profile = await getProfile()

  return (
    <CertificadoAptitudFlow
      defaultProfessionalName={profile?.full_name ?? undefined}
    />
  )
}
