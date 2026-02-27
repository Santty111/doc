/**
 * Factores de riesgo BIOLÓGICOS - Sección G.
 * Cada sub-item tiene 7 campos para escribir.
 */
export const FACTORES_BIOLOGICOS = [
  { key: 'virus', label: 'Virus' },
  { key: 'hongos', label: 'Hongos' },
  { key: 'bacterias', label: 'Bacterias' },
  { key: 'parasitos', label: 'Parásitos' },
  { key: 'exposicion_vectores', label: 'Exposición a vectores' },
  { key: 'exposicion_animales_selvaticos', label: 'Exposición a animales selváticos' },
  { key: 'otros_biologicos', label: 'Otros' },
] as const

export type FactorBiologicoKey = (typeof FACTORES_BIOLOGICOS)[number]['key']
