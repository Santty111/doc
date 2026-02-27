import { FichaEva1Flow } from '@/components/fichas-medicas/evaluacion-1-3/FichaEva1Flow'
import { connectDB } from '@/lib/db'
import { Worker } from '@/lib/models'

function toDateOnly(value: unknown): string | null {
  if (!value) return null
  const d = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().split('T')[0]
}

function calcAge(dateOnly: string | null): number | null {
  if (!dateOnly) return null
  const birth = new Date(dateOnly)
  if (Number.isNaN(birth.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const monthDiff = now.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1
  }
  return age >= 0 ? age : null
}

export default async function NuevaFichaEva1Page({
  searchParams,
}: {
  searchParams: Promise<{ trabajador?: string }>
}) {
  const params = await searchParams
  await connectDB()
  const workers = await Worker.find({ status: 'active' })
    .sort({ primer_apellido: 1, first_name: 1 })
    .select(
      'first_name last_name primer_nombre segundo_nombre primer_apellido segundo_apellido sexo gender birth_date position grupo_sanguineo blood_type lateralidad puesto_trabajo_ciuo'
    )
    .populate('company_id', 'name')
    .lean()

  const normalized = (workers as Record<string, unknown>[]).map((w) => {
    const firstNameLegacy = String(w.first_name ?? '').trim()
    const lastNameLegacy = String(w.last_name ?? '').trim()
    const firstNameParts = firstNameLegacy ? firstNameLegacy.split(/\s+/) : []
    const lastNameParts = lastNameLegacy ? lastNameLegacy.split(/\s+/) : []
    const fechaNacimiento = toDateOnly(w.birth_date)
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
      fecha_nacimiento: fechaNacimiento,
      edad: calcAge(fechaNacimiento),
      grupo_sanguineo:
        (w.grupo_sanguineo as string | null) ??
        (w.blood_type as string | null) ??
        null,
      lateralidad: (w.lateralidad as 'diestro' | 'zurdo' | 'ambidiestro' | null) ?? null,
      cargo_ocupacion: (w.position as string | null) ?? null,
      puesto_trabajo_ciuo: (w.puesto_trabajo_ciuo as string | null) ?? null,
      institucion_sistema:
        ((w.company_id as { name?: string } | null)?.name as string | undefined) ?? null,
    }
  })

  return <FichaEva1Flow workers={normalized} defaultWorkerId={params.trabajador} />
}
