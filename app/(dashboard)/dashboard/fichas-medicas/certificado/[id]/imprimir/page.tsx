import { connectDB } from '@/lib/db'
import { CertificadoFichaMedica } from '@/lib/models'
import { notFound } from 'next/navigation'
import type { CertificadoFichaMedicaDocument } from '@/lib/types/certificado-ficha-medica'
import { CertificadoFichaMedicaPrintViewDynamic } from '@/components/certificates/certificado-ficha-medica/CertificadoFichaMedicaPrintViewDynamic'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ print?: string }>
}

export default async function CertificadoFichaMedicaImprimirPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params
  const { print } = await searchParams
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
    <CertificadoFichaMedicaPrintViewDynamic
      data={docForView}
      autoPrint={print === '1'}
    />
  )
}
