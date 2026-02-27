/**
 * Factores de riesgo DE SEGURIDAD - Sección G.
 * Cada sub-item tiene 7 campos para escribir.
 */
export const FACTORES_SEGURIDAD = [
  // LOCATIVOS
  { key: 'falta_senalizacion_aseo_desorden', label: 'Falta de señalización, aseo, desorden', categoria: 'LOCATIVOS' as const },
  // MECÁNICOS
  { key: 'atrapamiento_maquinas_superficies', label: 'Atrapamiento entre Máquinas y o superficies', categoria: 'MECÁNICOS' as const },
  { key: 'atrapamiento_objetos', label: 'Atrapamiento entre objetos', categoria: 'MECÁNICOS' as const },
  { key: 'caida_objetos', label: 'Caída de objetos', categoria: 'MECÁNICOS' as const },
  { key: 'caidas_mismo_nivel', label: 'Caídas al mismo nivel', categoria: 'MECÁNICOS' as const },
  { key: 'caidas_diferente_nivel', label: 'Caídas a diferente nivel', categoria: 'MECÁNICOS' as const },
  { key: 'pinchazos', label: 'Pinchazos', categoria: 'MECÁNICOS' as const },
  { key: 'cortes', label: 'Cortes', categoria: 'MECÁNICOS' as const },
  { key: 'choques_colision_vehicular', label: 'Choques/colisión vehicular', categoria: 'MECÁNICOS' as const },
  { key: 'atropellamientos_vehiculos', label: 'Atropellamientos por vehículos', categoria: 'MECÁNICOS' as const },
  { key: 'proyeccion_fluidos', label: 'Proyección de fluidos', categoria: 'MECÁNICOS' as const },
  { key: 'proyeccion_particulas_fragmentos', label: 'Proyección de partículas - fragmentos', categoria: 'MECÁNICOS' as const },
  { key: 'contacto_superficies_trabajo', label: 'Contacto con superficies de trabajos', categoria: 'MECÁNICOS' as const },
  // ELÉCTRICOS
  { key: 'contacto_electrico', label: 'Contacto eléctrico', categoria: 'ELÉCTRICOS' as const },
  // OTROS
  { key: 'otros_seguridad', label: 'Otros', categoria: 'OTROS' as const },
] as const

export type FactorSeguridadKey = (typeof FACTORES_SEGURIDAD)[number]['key']
