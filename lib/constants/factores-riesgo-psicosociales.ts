/**
 * Factores de riesgo PSICOSOCIALES - Sección G.
 * Cada sub-item tiene 7 campos para escribir.
 */
export const FACTORES_PSICOSOCIALES = [
  { key: 'monotonia_trabajo', label: 'Monotonía del trabajo' },
  { key: 'sobrecarga_laboral', label: 'Sobrecarga laboral' },
  { key: 'minuciosidad_tarea', label: 'Minuciosidad de la tarea' },
  { key: 'alta_responsabilidad', label: 'Alta responsabilidad' },
  {
    key: 'autonomia_toma_decisiones',
    label: 'Autonomía en la toma de decisiones',
  },
  {
    key: 'supervision_estilos_direccion_deficiente',
    label: 'Supervisión y estilos de dirección deficiente',
  },
  { key: 'conflicto_rol', label: 'Conflicto de rol' },
  { key: 'falta_claridad_funciones', label: 'Falta de claridad en las funciones' },
  {
    key: 'incorrecta_distribucion_trabajo',
    label: 'Incorrecta distribución del trabajo',
  },
  { key: 'turnos_rotativos', label: 'Turnos rotativos' },
  { key: 'relaciones_interpersonales', label: 'Relaciones interpersonales' },
  { key: 'inestabilidad_laboral', label: 'Inestabilidad laboral' },
  { key: 'amenaza_delincuencial', label: 'Amenaza delincuencial' },
  { key: 'otros_psicosociales', label: 'Otros' },
] as const

export type FactorPsicosocialKey =
  (typeof FACTORES_PSICOSOCIALES)[number]['key']
