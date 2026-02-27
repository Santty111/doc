/**
 * Factores de riesgo ERGONÓMICOS - Sección G.
 * Cada sub-item tiene 7 campos para escribir.
 */
export const FACTORES_ERGONOMICOS = [
  { key: 'manejo_manual_cargas', label: 'Manejo manual de cargas' },
  { key: 'movimientos_repetitivos', label: 'Movimientos repetitivos' },
  { key: 'posturas_forzadas', label: 'Posturas forzadas' },
  { key: 'trabajos_con_pvd', label: 'Trabajos con PVD' },
  { key: 'diseno_inadecuado_puesto', label: 'Diseño Inadecuado del puesto' },
  { key: 'otros_ergonomicos', label: 'Otros' },
] as const

export type FactorErgonomicoKey = (typeof FACTORES_ERGONOMICOS)[number]['key']
