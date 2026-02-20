import { connectDB } from '@/lib/db'
import { CertificadoAptitudOficial } from '@/lib/models'
import { notFound } from 'next/navigation'
import { CertificadoAptitudOficialPrintView } from '@/components/certificates/certificado-aptitud/CertificadoAptitudOficialPrintView'
import type { CertificadoAptitudOficialDocument } from '@/lib/types/certificado-aptitud'

export default async function CertificadoAptitudImprimirPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ print?: string }>
}) {
  const { id } = await params
  const { print } = await searchParams
  await connectDB()

  const doc = await CertificadoAptitudOficial.findById(id).lean()
  if (!doc) notFound()

  // Convertir a objeto plano para poder pasarlo al Client Component
  const data = JSON.parse(
    JSON.stringify({
      seccionA: doc.seccionA,
      seccionB: doc.seccionB,
      seccionC: doc.seccionC,
      seccionD: doc.seccionD,
      seccionE: doc.seccionE,
      seccionF: doc.seccionF,
      seccionG: doc.seccionG,
    })
  ) as CertificadoAptitudOficialDocument

  return (
    <CertificadoAptitudOficialPrintView
      id={id}
      data={data}
      autoPrint={print === '1'}
    />
  )
}
