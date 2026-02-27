/**
 * Tipos para Ficha Médica - Evaluación Ocupacional 2-3.
 * Sección G. Factores de Riesgo del Trabajo Actual.
 */

import type { FactorFisicoKey } from '@/lib/constants/factores-riesgo-fisicos'
import type { FactorSeguridadKey } from '@/lib/constants/factores-riesgo-seguridad'
import type { FactorQuimicoKey } from '@/lib/constants/factores-riesgo-quimicos'
import type { FactorBiologicoKey } from '@/lib/constants/factores-riesgo-biologicos'
import type { FactorErgonomicoKey } from '@/lib/constants/factores-riesgo-ergonomicos'
import type { FactorPsicosocialKey } from '@/lib/constants/factores-riesgo-psicosociales'

/** 7 campos por cada sub-item */
export interface FactorFisicoCampos {
  campo1: string
  campo2: string
  campo3: string
  campo4: string
  campo5: string
  campo6: string
  campo7: string
}

/** Sección G - Subsección FÍSICOS */
export interface FichaEva2SeccionGFisicos {
  puesto_trabajo: string
  actividades_importantes: string
  label_otros?: string
  factores: Record<FactorFisicoKey, FactorFisicoCampos>
}

const camposVacios: FactorFisicoCampos = {
  campo1: '',
  campo2: '',
  campo3: '',
  campo4: '',
  campo5: '',
  campo6: '',
  campo7: '',
}

export const FICHA_EVA2_SECCION_G_FISICOS_DEFAULTS: FichaEva2SeccionGFisicos = {
  puesto_trabajo: '',
  actividades_importantes: '',
  label_otros: 'Otros',
  factores: {
    temperaturas_altas: { ...camposVacios },
    temperaturas_bajas: { ...camposVacios },
    radiacion_ionizante: { ...camposVacios },
    radiacion_no_ionizante: { ...camposVacios },
    ruido: { ...camposVacios },
    vibracion: { ...camposVacios },
    iluminacion: { ...camposVacios },
    ventilacion: { ...camposVacios },
    fluido_electrico: { ...camposVacios },
    otros: { ...camposVacios },
  },
}

/** Sección G - Subsección DE SEGURIDAD */
export interface FichaEva2SeccionGSeguridad {
  label_otros?: string
  factores: Record<FactorSeguridadKey, FactorFisicoCampos>
}

const camposVaciosSeguridad: FactorFisicoCampos = {
  campo1: '',
  campo2: '',
  campo3: '',
  campo4: '',
  campo5: '',
  campo6: '',
  campo7: '',
}

const factoresSeguridadKeys: FactorSeguridadKey[] = [
  'falta_senalizacion_aseo_desorden',
  'atrapamiento_maquinas_superficies',
  'atrapamiento_objetos',
  'caida_objetos',
  'caidas_mismo_nivel',
  'caidas_diferente_nivel',
  'pinchazos',
  'cortes',
  'choques_colision_vehicular',
  'atropellamientos_vehiculos',
  'proyeccion_fluidos',
  'proyeccion_particulas_fragmentos',
  'contacto_superficies_trabajo',
  'contacto_electrico',
  'otros_seguridad',
]

export const FICHA_EVA2_SECCION_G_SEGURIDAD_DEFAULTS: FichaEva2SeccionGSeguridad = {
  factores: Object.fromEntries(
    factoresSeguridadKeys.map((k) => [k, { ...camposVaciosSeguridad }])
  ) as Record<FactorSeguridadKey, FactorFisicoCampos>,
}

/** Sección G - Subsección QUÍMICOS */
export interface FichaEva2SeccionGQuimicos {
  label_otros?: string
  factores: Record<FactorQuimicoKey, FactorFisicoCampos>
}

const factoresQuimicosKeys: FactorQuimicoKey[] = [
  'polvos',
  'solidos',
  'humos',
  'liquidos',
  'vapores',
  'aerosoles',
  'nieblinas',
  'gaseosos',
  'otros_quimicos',
]

export const FICHA_EVA2_SECCION_G_QUIMICOS_DEFAULTS: FichaEva2SeccionGQuimicos = {
  label_otros: 'Otros',
  factores: Object.fromEntries(
    factoresQuimicosKeys.map((k) => [k, { ...camposVaciosSeguridad }])
  ) as Record<FactorQuimicoKey, FactorFisicoCampos>,
}

/** Sección G - Subsección BIOLÓGICOS */
export interface FichaEva2SeccionGBiologicos {
  factores: Record<FactorBiologicoKey, FactorFisicoCampos>
}

const factoresBiologicosKeys: FactorBiologicoKey[] = [
  'virus',
  'hongos',
  'bacterias',
  'parasitos',
  'exposicion_vectores',
  'exposicion_animales_selvaticos',
  'otros_biologicos',
]

export const FICHA_EVA2_SECCION_G_BIOLOGICOS_DEFAULTS: FichaEva2SeccionGBiologicos = {
  label_otros: 'Otros',
  factores: Object.fromEntries(
    factoresBiologicosKeys.map((k) => [k, { ...camposVaciosSeguridad }])
  ) as Record<FactorBiologicoKey, FactorFisicoCampos>,
}

/** Sección G - Subsección ERGONÓMICOS */
export interface FichaEva2SeccionGErgonomicos {
  label_otros?: string
  factores: Record<FactorErgonomicoKey, FactorFisicoCampos>
}

const factoresErgonomicosKeys: FactorErgonomicoKey[] = [
  'manejo_manual_cargas',
  'movimientos_repetitivos',
  'posturas_forzadas',
  'trabajos_con_pvd',
  'diseno_inadecuado_puesto',
  'otros_ergonomicos',
]

export const FICHA_EVA2_SECCION_G_ERGONOMICOS_DEFAULTS: FichaEva2SeccionGErgonomicos = {
  label_otros: 'Otros',
  factores: Object.fromEntries(
    factoresErgonomicosKeys.map((k) => [k, { ...camposVaciosSeguridad }])
  ) as Record<FactorErgonomicoKey, FactorFisicoCampos>,
}

/** Sección G - Subsección PSICOSOCIALES */
export interface FichaEva2SeccionGPsicosociales {
  label_otros?: string
  factores: Record<FactorPsicosocialKey, FactorFisicoCampos>
}

const factoresPsicosocialesKeys: FactorPsicosocialKey[] = [
  'monotonia_trabajo',
  'sobrecarga_laboral',
  'minuciosidad_tarea',
  'alta_responsabilidad',
  'autonomia_toma_decisiones',
  'supervision_estilos_direccion_deficiente',
  'conflicto_rol',
  'falta_claridad_funciones',
  'incorrecta_distribucion_trabajo',
  'turnos_rotativos',
  'relaciones_interpersonales',
  'inestabilidad_laboral',
  'amenaza_delincuencial',
  'otros_psicosociales',
]

export const FICHA_EVA2_SECCION_G_PSICOSOCIALES_DEFAULTS: FichaEva2SeccionGPsicosociales = {
  label_otros: 'Otros',
  factores: Object.fromEntries(
    factoresPsicosocialesKeys.map((k) => [k, { ...camposVaciosSeguridad }])
  ) as Record<FactorPsicosocialKey, FactorFisicoCampos>,
}

/** Documento completo almacenado en MongoDB */
export interface FichaMedicaEvaluacion2Document {
  _id: string
  seccionG?: {
    fisicos?: Partial<FichaEva2SeccionGFisicos>
    seguridad?: Partial<FichaEva2SeccionGSeguridad>
    quimicos?: Partial<FichaEva2SeccionGQuimicos>
    biologicos?: Partial<FichaEva2SeccionGBiologicos>
    ergonomicos?: Partial<FichaEva2SeccionGErgonomicos>
    psicosociales?: Partial<FichaEva2SeccionGPsicosociales>
    medidas_preventivas?: Partial<FichaEva2MedidasPreventivas>
  }
  created_at?: string
  updated_at?: string
}
