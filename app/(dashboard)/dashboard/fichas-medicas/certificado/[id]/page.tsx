import { connectDB } from '@/lib/db'
import { CertificadoFichaMedica } from '@/lib/models'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { CertificadoFichaMedicaDocument } from '@/lib/types/certificado-ficha-medica'
import { CertificadoFichaMedicaPrintViewDynamic } from '@/components/certificates/certificado-ficha-medica/CertificadoFichaMedicaPrintViewDynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CertificadoFichaMedicaDetailPage({
  params,
}: PageProps) {
  const { id } = await params
  await connectDB()
  const doc = await CertificadoFichaMedica.findById(id).lean()
  if (!doc) notFound()

  const docForView: CertificadoFichaMedicaDocument = {
    seccionA: doc.seccionA as CertificadoFichaMedicaDocument['seccionA'],
    seccionB: (doc.seccionB ?? { fecha_emision: new Date().toISOString().split('T')[0], evaluacion: 'ingreso' }) as CertificadoFichaMedicaDocument['seccionB'],
    seccionC: (doc.seccionC ?? { concepto_aptitud: 'apto', detalle_observaciones: '' }) as CertificadoFichaMedicaDocument['seccionC'],
    seccionD: (doc.seccionD ?? { descripcion: '', observacion: '' }) as CertificadoFichaMedicaDocument['seccionD'],
    seccionE: (doc.seccionE ?? { nombre_apellido: '', codigo_medico: '' }) as CertificadoFichaMedicaDocument['seccionE'],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/fichas-medicas/certificado">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          Certificado - Evaluación Médica Ocupacional
        </h1>
      </div>

      <CertificadoFichaMedicaPrintViewDynamic data={docForView} />
    </div>
  )
}
