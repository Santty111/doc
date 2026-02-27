import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { CertificadoFichaMedicaFlow } from '@/components/certificates/certificado-ficha-medica/CertificadoFichaMedicaFlow'

export default function NuevoCertificadoFichaMedicaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/fichas-medicas/certificado">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
      </div>
      <CertificadoFichaMedicaFlow />
    </div>
  )
}
