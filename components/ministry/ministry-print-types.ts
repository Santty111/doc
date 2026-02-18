import type { RevisionSistema, AntecedenteLaboral, AccidenteEnfermedad, ConceptoAptitud } from '@/lib/types'

export type MinistryPrintData = {
  // Cabecera
  empresa_razon_social: string
  empresa_ruc: string
  empresa_ciiu: string
  empresa_establecimiento: string
  nro_historia_clinica: string
  nro_archivo: string
  usuario_apellidos: string
  usuario_nombres: string
  usuario_sexo: string
  usuario_cargo: string
  usuario_grupo_sanguineo: string
  usuario_fecha_nacimiento: string | null
  usuario_edad: number | null
  usuario_lateralidad: string
  grupos_prioritarios_embarazo: boolean
  grupos_prioritarios_discapacidad: boolean
  grupos_prioritarios_catastrofica: boolean
  grupos_prioritarios_lactancia: boolean
  grupos_prioritarios_adulto_mayor: boolean
  // Revisión por sistemas
  revision_ojos: RevisionSistema
  revision_oidos: RevisionSistema
  revision_oro_faringe: RevisionSistema
  revision_cuello: RevisionSistema
  revision_torax: RevisionSistema
  revision_abdomen: RevisionSistema
  revision_columna: RevisionSistema
  revision_extremidades: RevisionSistema
  revision_neurologico: RevisionSistema
  // Factores de riesgo
  riesgo_fisicos: string
  riesgo_mecanicos: string
  riesgo_quimicos: string
  riesgo_biologicos: string
  riesgo_ergonomicos: string
  riesgo_psicosociales: string
  // Historia y certificado
  antecedentes_laborales: AntecedenteLaboral[]
  accidentes_enfermedades: AccidenteEnfermedad[]
  concepto_aptitud: ConceptoAptitud | null
  recomendaciones: string
  firma_profesional_nombre: string
  firma_profesional_codigo: string
  firma_trabajador: boolean
}

export const REVISION_SISTEMAS_LABELS: Record<string, string> = {
  revision_ojos: 'Ojos (Párpados, Conjuntivas, Pupilas, Córnea, Motilidad)',
  revision_oidos: 'Oídos (Pabellón, Conducto, Tímpanos)',
  revision_oro_faringe: 'Oro-faringe (Labios, Lengua, Faringe, Amígdalas, Dentadura)',
  revision_cuello: 'Cuello (Tiroides/Masas, Movilidad)',
  revision_torax: 'Tórax (Mamas, Corazón, Pulmones, Parrilla costal)',
  revision_abdomen: 'Abdomen (Vísceras, Pared abdominal)',
  revision_columna: 'Columna (Flexibilidad, Desviación, Dolor)',
  revision_extremidades: 'Extremidades (Vascular, Miembros sup/inf)',
  revision_neurologico: 'Neurológico (Fuerza, Sensibilidad, Marcha, Reflejos)',
}
