import type { FichaEva1SeccionF } from '@/lib/types/ficha-medica-evaluacion-1'

/** Configuración de regiones para Examen Físico Regional: número, nombre, subitems con letra */
export const REGIONES_EXAMEN_FISICO_CONFIG: {
  key: keyof FichaEva1SeccionF['regiones']
  numero: number
  nombre: string
  items: {
    key: keyof FichaEva1SeccionF['regiones'][keyof FichaEva1SeccionF['regiones']]
    letra: string
    descripcion: string
  }[]
}[] = [
  {
    key: 'piel',
    numero: 1,
    nombre: 'Piel',
    items: [
      { key: 'cicatrices', letra: 'a', descripcion: 'Cicatrices' },
      { key: 'piel_faneras', letra: 'c', descripcion: 'Piel y Faneras' },
    ],
  },
  {
    key: 'ojos',
    numero: 2,
    nombre: 'Ojos',
    items: [
      { key: 'parpados', letra: 'a', descripcion: 'Párpados' },
      { key: 'conjuntivas', letra: 'b', descripcion: 'Conjuntivas' },
      { key: 'pupilas', letra: 'c', descripcion: 'Pupilas' },
      { key: 'cornea', letra: 'd', descripcion: 'Córnea' },
      { key: 'motilidad', letra: 'e', descripcion: 'Motilidad' },
    ],
  },
  {
    key: 'oido',
    numero: 3,
    nombre: 'Oído',
    items: [
      { key: 'canal_auditivo_externo', letra: 'a', descripcion: 'C. auditivo externo' },
      { key: 'pabellon', letra: 'b', descripcion: 'Pabellón' },
      { key: 'timpanos', letra: 'c', descripcion: 'Tímpanos' },
    ],
  },
  {
    key: 'orofaringe',
    numero: 4,
    nombre: 'Oro faringe',
    items: [
      { key: 'labios', letra: 'a', descripcion: 'Labios' },
      { key: 'lengua', letra: 'b', descripcion: 'Lengua' },
      { key: 'faringe', letra: 'c', descripcion: 'Faringe' },
      { key: 'amigdalas', letra: 'd', descripcion: 'Amígdalas' },
      { key: 'dentadura', letra: 'e', descripcion: 'Dentadura' },
    ],
  },
  {
    key: 'nariz',
    numero: 5,
    nombre: 'Nariz',
    items: [
      { key: 'tabique', letra: 'a', descripcion: 'Tabique' },
      { key: 'cornetes', letra: 'b', descripcion: 'Cornetes' },
      { key: 'mucosas', letra: 'c', descripcion: 'Mucosas' },
      { key: 'senos', letra: 'd', descripcion: 'Senos' },
    ],
  },
  {
    key: 'cuello',
    numero: 6,
    nombre: 'Cuello',
    items: [
      { key: 'tiroides_masas', letra: 'a', descripcion: 'Tiroides / masas' },
      { key: 'movilidad', letra: 'b', descripcion: 'Movilidad' },
    ],
  },
  {
    key: 'torax_mamas',
    numero: 7,
    nombre: 'Tórax',
    items: [{ key: 'mamas', letra: 'a', descripcion: 'Mamas' }],
  },
  {
    key: 'torax',
    numero: 8,
    nombre: 'Tórax',
    items: [
      { key: 'pulmones', letra: 'a', descripcion: 'Pulmones' },
      { key: 'corazon', letra: 'b', descripcion: 'Corazón' },
      { key: 'parrilla_costal', letra: 'c', descripcion: 'Parrilla costal' },
    ],
  },
  {
    key: 'abdomen',
    numero: 9,
    nombre: 'Abdomen',
    items: [
      { key: 'visceras', letra: 'a', descripcion: 'Vísceras' },
      { key: 'pared_abdominal', letra: 'b', descripcion: 'Pared abdominal' },
    ],
  },
  {
    key: 'columna',
    numero: 10,
    nombre: 'Columna',
    items: [
      { key: 'flexibilidad', letra: 'a', descripcion: 'Flexibilidad' },
      { key: 'desviacion', letra: 'b', descripcion: 'Desviación' },
      { key: 'dolor', letra: 'c', descripcion: 'Dolor' },
    ],
  },
  {
    key: 'pelvis',
    numero: 11,
    nombre: 'Pelvis',
    items: [
      { key: 'pelvis', letra: 'a', descripcion: 'Pelvis' },
      { key: 'genitales', letra: 'b', descripcion: 'Genitales' },
    ],
  },
  {
    key: 'extremidades',
    numero: 12,
    nombre: 'Extremidades',
    items: [
      { key: 'vascular', letra: 'a', descripcion: 'Vascular' },
      { key: 'miembros_superiores', letra: 'b', descripcion: 'Miembros superiores' },
      { key: 'miembros_inferiores', letra: 'c', descripcion: 'Miembros inferiores' },
    ],
  },
  {
    key: 'neurologico',
    numero: 13,
    nombre: 'Neurológico',
    items: [
      { key: 'fuerza', letra: 'a', descripcion: 'Fuerza' },
      { key: 'sensibilidad', letra: 'b', descripcion: 'Sensibilidad' },
      { key: 'marcha', letra: 'c', descripcion: 'Marcha' },
      { key: 'reflejos', letra: 'd', descripcion: 'Reflejos' },
    ],
  },
]
