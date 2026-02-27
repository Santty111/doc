import { FichaEva2Flow } from '@/components/fichas-medicas/evaluacion-2-3/FichaEva2Flow'
import { connectDB } from '@/lib/db'
import { Worker } from '@/lib/models'

export default async function NuevaFichaEva2Page({
  searchParams,
}: {
  searchParams: Promise<{ trabajador?: string }>
}) {
  const params = await searchParams
  await connectDB()
  const workers = await Worker.find({ status: 'active' })
    .sort({ primer_apellido: 1, first_name: 1 })
    .select(
      'first_name last_name primer_nombre segundo_nombre primer_apellido segundo_apellido position puesto_trabajo_ciuo'
    )
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
      cargo_ocupacion: (w.position as string | null) ?? null,
      puesto_trabajo_ciuo: (w.puesto_trabajo_ciuo as string | null) ?? null,
    }
  })

  return <FichaEva2Flow workers={normalized} defaultWorkerId={params.trabajador} />
}
