/**
 * Factores de riesgo QUÍMICOS - Sección G.
 * Cada sub-item tiene 7 campos para escribir.
 */
export const FACTORES_QUIMICOS = [
  { key: 'polvos', label: 'Polvos' },
  { key: 'solidos', label: 'Sólidos' },
  { key: 'humos', label: 'Humos' },
  { key: 'liquidos', label: 'Líquidos' },
  { key: 'vapores', label: 'Vapores' },
  { key: 'aerosoles', label: 'Aerosoles' },
  { key: 'nieblinas', label: 'Nieblinas' },
  { key: 'gaseosos', label: 'Gaseosos' },
  { key: 'otros_quimicos', label: 'Otros' },
] as const

export type FactorQuimicoKey = (typeof FACTORES_QUIMICOS)[number]['key']
