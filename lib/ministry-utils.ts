import { toDateStr } from '@/lib/utils'
import type { MinistryPrintData } from '@/components/ministry/ministry-print-types'

export function toMinistryPrintData(raw: Record<string, unknown> | null): MinistryPrintData | null {
  if (!raw) return null
  const get = (k: string) => raw[k]
  const str = (k: string) => (get(k) != null ? String(get(k)) : '')
  const num = (k: string) => {
    const v = get(k)
    return typeof v === 'number' ? v : null
  }
  const bool = (k: string) => Boolean(get(k))
  const date = (k: string) => {
    const v = get(k)
    if (!v) return null
    return typeof v === 'string' ? v : toDateStr(v)
  }
  const rev = (k: string) => {
    const v = get(k)
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const r = v as { estado?: string; observacion?: string }
      return {
        estado: (r.estado === 'anormal' ? 'anormal' : 'normal') as 'normal' | 'anormal',
        observacion: r.observacion ?? '',
      }
    }
    return { estado: 'normal' as const, observacion: '' }
  }
  const arrAnt = (): { empresa: string; puesto: string; tiempo: string; riesgos: string }[] => {
    const a = get('antecedentes_laborales')
    if (!Array.isArray(a)) return [{ empresa: '', puesto: '', tiempo: '', riesgos: '' }]
    return a.map((x) =>
      typeof x === 'object' && x
        ? {
            empresa: String((x as Record<string, unknown>).empresa ?? ''),
            puesto: String((x as Record<string, unknown>).puesto ?? ''),
            tiempo: String((x as Record<string, unknown>).tiempo ?? ''),
            riesgos: String((x as Record<string, unknown>).riesgos ?? ''),
          }
        : { empresa: '', puesto: '', tiempo: '', riesgos: '' }
    )
  }
  const arrAcc = (): { tipo: string; fecha: string; observaciones: string }[] => {
    const a = get('accidentes_enfermedades')
    if (!Array.isArray(a)) return [{ tipo: '', fecha: '', observaciones: '' }]
    return a.map((x) =>
      typeof x === 'object' && x
        ? {
            tipo: String((x as Record<string, unknown>).tipo ?? ''),
            fecha: String((x as Record<string, unknown>).fecha ?? ''),
            observaciones: String((x as Record<string, unknown>).observaciones ?? ''),
          }
        : { tipo: '', fecha: '', observaciones: '' }
    )
  }
  const concepto = get('concepto_aptitud')
  const conceptoVal =
    concepto === 'apto' || concepto === 'apto_observacion' || concepto === 'apto_limitaciones' || concepto === 'no_apto'
      ? concepto
      : null
  return {
    empresa_razon_social: str('empresa_razon_social'),
    empresa_ruc: str('empresa_ruc'),
    empresa_ciiu: str('empresa_ciiu'),
    empresa_establecimiento: str('empresa_establecimiento'),
    nro_historia_clinica: str('nro_historia_clinica'),
    nro_archivo: str('nro_archivo'),
    usuario_apellidos: str('usuario_apellidos'),
    usuario_nombres: str('usuario_nombres'),
    usuario_sexo: str('usuario_sexo'),
    usuario_cargo: str('usuario_cargo'),
    usuario_grupo_sanguineo: str('usuario_grupo_sanguineo'),
    usuario_fecha_nacimiento: date('usuario_fecha_nacimiento'),
    usuario_edad: num('usuario_edad'),
    usuario_lateralidad: str('usuario_lateralidad'),
    grupos_prioritarios_embarazo: bool('grupos_prioritarios_embarazo'),
    grupos_prioritarios_discapacidad: bool('grupos_prioritarios_discapacidad'),
    grupos_prioritarios_catastrofica: bool('grupos_prioritarios_catastrofica'),
    grupos_prioritarios_lactancia: bool('grupos_prioritarios_lactancia'),
    grupos_prioritarios_adulto_mayor: bool('grupos_prioritarios_adulto_mayor'),
    revision_ojos: rev('revision_ojos'),
    revision_oidos: rev('revision_oidos'),
    revision_oro_faringe: rev('revision_oro_faringe'),
    revision_cuello: rev('revision_cuello'),
    revision_torax: rev('revision_torax'),
    revision_abdomen: rev('revision_abdomen'),
    revision_columna: rev('revision_columna'),
    revision_extremidades: rev('revision_extremidades'),
    revision_neurologico: rev('revision_neurologico'),
    riesgo_fisicos: str('riesgo_fisicos'),
    riesgo_mecanicos: str('riesgo_mecanicos'),
    riesgo_quimicos: str('riesgo_quimicos'),
    riesgo_biologicos: str('riesgo_biologicos'),
    riesgo_ergonomicos: str('riesgo_ergonomicos'),
    riesgo_psicosociales: str('riesgo_psicosociales'),
    antecedentes_laborales: arrAnt(),
    accidentes_enfermedades: arrAcc(),
    concepto_aptitud: conceptoVal,
    recomendaciones: str('recomendaciones'),
    firma_profesional_nombre: str('firma_profesional_nombre'),
    firma_profesional_codigo: str('firma_profesional_codigo'),
    firma_trabajador: bool('firma_trabajador'),
  }
}
