/**
 * Factores de riesgo FÍSICOS - Sección G.
 * Cada sub-item tiene 7 campos para escribir.
 */
export const FACTORES_FISICOS = [
  { key: 'temperaturas_altas', label: 'Temperaturas altas' },
  { key: 'temperaturas_bajas', label: 'Temperaturas bajas' },
  { key: 'radiacion_ionizante', label: 'Radiación Ionizante' },
  { key: 'radiacion_no_ionizante', label: 'Radiación No Ionizante' },
  { key: 'ruido', label: 'Ruido' },
  { key: 'vibracion', label: 'Vibración' },
  { key: 'iluminacion', label: 'Iluminación' },
  { key: 'ventilacion', label: 'Ventilación' },
  { key: 'fluido_electrico', label: 'Fluido eléctrico' },
  { key: 'otros', label: 'Otros' },
] as const

export type FactorFisicoKey = (typeof FACTORES_FISICOS)[number]['key']
