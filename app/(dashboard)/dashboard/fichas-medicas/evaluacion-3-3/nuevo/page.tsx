import { FichaEva3Flow } from '@/components/fichas-medicas/evaluacion-3-3/FichaEva3Flow'
import { connectDB } from '@/lib/db'
import { Worker } from '@/lib/models'

export default async function NuevaFichaEva3Page({
  searchParams,
}: {
  searchParams: Promise<{ trabajador?: string }>
}) {
  const params = await searchParams
  await connectDB()
  const workers = await Worker.find({ status: 'active' })
    .sort({ primer_apellido: 1, first_name: 1 })
    .select('first_name last_name primer_nombre segundo_nombre primer_apellido segundo_apellido')
    .lean()

  const normalized = (workers as Record<string, unknown>[]).map((w) => {
    const firstNameLegacy = String(w.first_name ?? '').trim()
    const lastNameLegacy = String(w.last_name ?? '').trim()
    const firstNameParts = firstNameLegacy ? firstNameLegacy.split(/\s+/) : []
    const lastNameParts = lastNameLegacy ? lastNameLegacy.split(/\s+/) : []
    return {
      id: String(w._id),
      primer_nombre: String(w.primer_nombre ?? firstNameParts[0] ?? ''),
      segundo_nombre: String(w.segundo_nombre ?? firstNameParts.slice(1).join(' ') ?? ''),
      primer_apellido: String(w.primer_apellido ?? lastNameParts[0] ?? ''),
      segundo_apellido: String(w.segundo_apellido ?? lastNameParts.slice(1).join(' ') ?? ''),
    }
  })

  return <FichaEva3Flow workers={normalized} defaultWorkerId={params.trabajador} />
}
