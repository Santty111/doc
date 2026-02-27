import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { CertificadoFichaMedicaFlow } from '@/components/certificates/certificado-ficha-medica/CertificadoFichaMedicaFlow'
import { connectDB } from '@/lib/db'
import { Worker } from '@/lib/models'

export default async function NuevoCertificadoFichaMedicaPage({
  searchParams,
}: {
  searchParams: Promise<{ trabajador?: string }>
}) {
  const params = await searchParams
  await connectDB()
  const workers = await Worker.find({ status: 'active' })
    .sort({ primer_apellido: 1, first_name: 1 })
    .select('first_name last_name primer_nombre segundo_nombre primer_apellido segundo_apellido sexo gender puesto_trabajo_ciuo')
    .populate('company_id', 'name')
    .lean()

  const normalized = (workers as Record<string, unknown>[]).map((w) => {
    const firstNameLegacy = String(w.first_name ?? '').trim()
    const lastNameLegacy = String(w.last_name ?? '').trim()
    const firstNameParts = firstNameLegacy ? firstNameLegacy.split(/\s+/) : []
    const lastNameParts = lastNameLegacy ? lastNameLegacy.split(/\s+/) : []
    const sexo =
      (w.sexo as 'hombre' | 'mujer' | null) ||
      (w.gender === 'M' ? 'hombre' : w.gender === 'F' ? 'mujer' : null)
    return {
      id: String(w._id),
      primer_nombre: String(w.primer_nombre ?? firstNameParts[0] ?? ''),
      segundo_nombre: String(w.segundo_nombre ?? firstNameParts.slice(1).join(' ') ?? ''),
      primer_apellido: String(w.primer_apellido ?? lastNameParts[0] ?? ''),
      segundo_apellido: String(w.segundo_apellido ?? lastNameParts.slice(1).join(' ') ?? ''),
      sexo,
      puesto_trabajo_ciuo: (w.puesto_trabajo_ciuo as string | null) ?? null,
      institucion_sistema:
        ((w.company_id as { name?: string } | null)?.name as string | undefined) ?? null,
    }
  })

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
      <CertificadoFichaMedicaFlow workers={normalized} defaultWorkerId={params.trabajador} />
    </div>
  )
}
