/**
 * Tipos para Ficha Médica - Evaluación Ocupacional 1-3.
 * Los datos se guardan como documento JSON en MongoDB.
 */
import type { WorkerSnapshot } from '@/lib/types'

/** Opciones de atención prioritaria (checkboxes) */
export interface AtencionPrioritaria {
  embarazada: boolean
  persona_discapacidad: boolean
  enfermedad_catastrofica: boolean
  lactancia: boolean
  adulto_mayor: boolean
}

/** Sexo del usuario */
export type SexoUsuario = 'hombre' | 'mujer'

/** Lateralidad */
export type Lateralidad = 'diestro' | 'zurdo' | 'ambidiestro'

/** Fecha desglosada (año, mes, día) para el formulario */
export interface FechaNacimientoDesglosada {
  ano: number
  mes: number
  dia: number
}

/** Sección A - Datos del Establecimiento y Datos del Usuario */
export interface FichaEva1SeccionA {
  /** Datos del Establecimiento */
  establecimiento: {
    /** Institución del sistema o nombre de la empresa */
    institucion_sistema: string
    /** RUC de la empresa */
    ruc: string
    /** Código CIIU (Clasificación Industrial Internacional Uniforme) */
    ciiu: string
    /** Establecimiento o centro de trabajo */
    establecimiento_centro_trabajo: string
    /** Número de historia clínica */
    numero_historia_clinica: string
    /** Número de archivo */
    numero_archivo: string
  }
  /** Datos del Usuario - Nombre */
  usuario: {
    primer_apellido: string
    segundo_apellido: string
    primer_nombre: string
    segundo_nombre: string
  }
  /** Atención prioritaria (opciones múltiples) */
  atencion_prioritaria: AtencionPrioritaria
  /** Sexo: Hombre / Mujer */
  sexo: SexoUsuario
  /** Fecha de nacimiento (dd/mm/aaaa como string ISO o desglosada) */
  fecha_nacimiento: string
  /** Edad en años */
  edad: number | null
  /** Grupo sanguíneo (ej: O+, A-, AB+) */
  grupo_sanguineo: string
  /** Lateralidad: diestro, zurdo, ambidiestro */
  lateralidad: Lateralidad
}

/** Valores por defecto para Sección A */
export const FICHA_EVA1_SECCION_A_DEFAULTS: FichaEva1SeccionA = {
  establecimiento: {
    institucion_sistema: '',
    ruc: '',
    ciiu: '',
    establecimiento_centro_trabajo: '',
    numero_historia_clinica: '',
    numero_archivo: '',
  },
  usuario: {
    primer_apellido: '',
    segundo_apellido: '',
    primer_nombre: '',
    segundo_nombre: '',
  },
  atencion_prioritaria: {
    embarazada: false,
    persona_discapacidad: false,
    enfermedad_catastrofica: false,
    lactancia: false,
    adulto_mayor: false,
  },
  sexo: 'hombre',
  fecha_nacimiento: '',
  edad: null,
  grupo_sanguineo: '',
  lateralidad: 'diestro',
}

/** Tipo de evaluación para Sección B */
export type TipoEvaluacionFicha =
  | 'ingreso'
  | 'periodico'
  | 'reintegro'
  | 'retiro'

/** Sección B - Motivo de Consulta */
export interface FichaEva1SeccionB {
  /** Puesto de trabajo según CIUO (Clasificación Internacional Uniforme de Ocupaciones) */
  puesto_trabajo_ciuo: string
  /** Fecha de atención (ISO 8601) */
  fecha_atencion: string
  /** Fecha de ingreso al trabajo (ISO 8601) */
  fecha_ingreso_trabajo: string
  /** Fecha de reintegro (ISO 8601) */
  fecha_reintegro: string
  /** Fecha del último día laboral / salida (ISO 8601) */
  fecha_ultimo_dia_laboral: string
  /** Descripción del motivo de la historia clínica */
  descripcion_motivo: string
  /** Tipo de evaluación: ingreso, periódico, reintegro, retiro */
  tipo_evaluacion: TipoEvaluacionFicha
  /** Observación */
  observacion: string
}

/** Valores por defecto para Sección B */
export const FICHA_EVA1_SECCION_B_DEFAULTS: FichaEva1SeccionB = {
  puesto_trabajo_ciuo: '',
  fecha_atencion: new Date().toISOString().split('T')[0],
  fecha_ingreso_trabajo: '',
  fecha_reintegro: '',
  fecha_ultimo_dia_laboral: '',
  descripcion_motivo: '',
  tipo_evaluacion: 'periodico',
  observacion: 'NINGUNA',
}

/** Detalle de consumo de una sustancia */
export interface ConsumoSustanciaDetalle {
  /** Tiempo de consumo en meses (numérico) */
  tiempo_consumo_meses: number | null
  ex_consumidor: boolean
  /** Tiempo de abstinencia en meses (numérico) */
  tiempo_abstinencia_meses: number | null
  no_consume: boolean
}

/** Método de planificación familiar */
export type MetodoPlanificacion = 'si' | 'no' | 'no_responde'

/** Un examen realizado (¿Cuál? + tiempo en años) */
export interface ExamenRealizado {
  cual: string
  tiempo_anos: number | null
}

/** Sección C - Antecedentes Personales */
export interface FichaEva1SeccionC {
  /** Antecedentes clínicos y quirúrgicos */
  antecedentes_clinicos_quirurgicos: string
  /** Antecedentes familiares */
  antecedentes_familiares: string
  /** En caso de requerir transfusiones, ¿autoriza? */
  transfusiones_autoriza: 'si' | 'no'
  /** Si transfusiones = no, observación/descripción del rechazo */
  transfusiones_no_observacion: string
  /** ¿Se encuentra bajo algún tratamiento hormonal? */
  tratamiento_hormonal: 'si' | 'no'
  /** Si tratamiento hormonal = si, especificar cuál */
  tratamiento_hormonal_cual: string
  /** Si tratamiento hormonal = no, observación opcional */
  tratamiento_hormonal_no_observacion: string
  /** Antecedentes gineco obstétricos (mujeres) */
  gineco_obstetricos: {
    fecha_ultima_menstruacion: string
    gestas: number | null
    partos: number | null
    cesareas: number | null
    abortos: number | null
    metodo_planificacion: MetodoPlanificacion
    metodo_planificacion_cual: string
    examenes_realizados: string
    /** Tiempo en años (según formulario oficial) */
    examenes_tiempo_anos: number | null
    examenes_resultado: string
  }
  /** Antecedentes reproductivos masculinos */
  reproductivos_masculinos: {
    /** Lista de exámenes realizados (puede haber varios) */
    examenes: ExamenRealizado[]
    metodo_planificacion: MetodoPlanificacion
    metodo_planificacion_cual: string
  }
  /** Consumo de sustancias */
  consumo: {
    tabaco: ConsumoSustanciaDetalle
    alcohol: ConsumoSustanciaDetalle
    otras_cual: string
    otras: ConsumoSustanciaDetalle
  }
  /** Estilo de vida */
  estilo_vida: {
    actividad_fisica_cual: string
    actividad_fisica_tiempo: string
    medicacion_habitual: string
  }
  /** Condición preexistente */
  condicion_preexistente: {
    cual: string
    cantidad: string
  }
  /** Observación */
  observacion: string
}

const CONSUMO_DEFAULT: ConsumoSustanciaDetalle = {
  tiempo_consumo_meses: null,
  ex_consumidor: false,
  tiempo_abstinencia_meses: null,
  no_consume: false,
}

/** Valores por defecto para Sección C */
export const FICHA_EVA1_SECCION_C_DEFAULTS: FichaEva1SeccionC = {
  antecedentes_clinicos_quirurgicos: '',
  antecedentes_familiares: '',
  transfusiones_autoriza: 'no',
  transfusiones_no_observacion: '',
  tratamiento_hormonal: 'no',
  tratamiento_hormonal_cual: '',
  tratamiento_hormonal_no_observacion: '',
  gineco_obstetricos: {
    fecha_ultima_menstruacion: '',
    gestas: null,
    partos: null,
    cesareas: null,
    abortos: null,
    metodo_planificacion: 'no_responde',
    metodo_planificacion_cual: '',
    examenes_realizados: '',
    examenes_tiempo_anos: null,
    examenes_resultado: '',
  },
  reproductivos_masculinos: {
    examenes: [{ cual: '', tiempo_anos: null }],
    metodo_planificacion: 'no_responde',
    metodo_planificacion_cual: '',
  },
  consumo: {
    tabaco: { ...CONSUMO_DEFAULT },
    alcohol: { ...CONSUMO_DEFAULT },
    otras_cual: '',
    otras: { ...CONSUMO_DEFAULT },
  },
  estilo_vida: {
    actividad_fisica_cual: '',
    actividad_fisica_tiempo: '',
    medicacion_habitual: '',
  },
  condicion_preexistente: {
    cual: '',
    cantidad: '',
  },
  observacion: '',
}

/** Sección D - Enfermedad o Problema Actual */
export interface FichaEva1SeccionD {
  /** Descripción del problema o enfermedad actual */
  descripcion: string
}

/** Valores por defecto para Sección D */
export const FICHA_EVA1_SECCION_D_DEFAULTS: FichaEva1SeccionD = {
  descripcion: '',
}

/** Sección E - Constantes Vitales y Antropometría */
export interface FichaEva1SeccionE {
  /** Temperatura en °C */
  temperatura: number | null
  /** Presión arterial en mmHg (ej: "120/80") */
  presion_arterial: string
  /** Frecuencia cardíaca en lat/min */
  frecuencia_cardiaca: number | null
  /** Frecuencia respiratoria en fr/min */
  frecuencia_respiratoria: number | null
  /** Saturación de oxígeno en % */
  saturacion_oxigeno: number | null
  /** Peso en Kg */
  peso: number | null
  /** Talla en cm */
  talla: number | null
  /** Índice de masa corporal en kg/m² (puede calcularse o ingresarse) */
  imc: number | null
  /** Perímetro abdominal en cm */
  perimetro_abdominal: number | null
}

/** Valores por defecto para Sección E */
export const FICHA_EVA1_SECCION_E_DEFAULTS: FichaEva1SeccionE = {
  temperatura: null,
  presion_arterial: '',
  frecuencia_cardiaca: null,
  frecuencia_respiratoria: null,
  saturacion_oxigeno: null,
  peso: null,
  talla: null,
  imc: null,
  perimetro_abdominal: null,
}

/** Sección F - Examen Físico Regional. Si existe patología marcar con "X" (patologia: true) */
export interface FichaEva1SeccionF {
  regiones: {
    piel: { cicatrices: boolean; piel_faneras: boolean }
    ojos: { parpados: boolean; conjuntivas: boolean; pupilas: boolean; cornea: boolean; motilidad: boolean }
    oido: { canal_auditivo_externo: boolean; pabellon: boolean; timpanos: boolean }
    orofaringe: { labios: boolean; lengua: boolean; faringe: boolean; amigdalas: boolean; dentadura: boolean }
    nariz: { tabique: boolean; cornetes: boolean; mucosas: boolean; senos: boolean }
    cuello: { tiroides_masas: boolean; movilidad: boolean }
    torax_mamas: { mamas: boolean }
    torax: { pulmones: boolean; corazon: boolean; parrilla_costal: boolean }
    abdomen: { visceras: boolean; pared_abdominal: boolean }
    columna: { flexibilidad: boolean; desviacion: boolean; dolor: boolean }
    pelvis: { pelvis: boolean; genitales: boolean }
    extremidades: { vascular: boolean; miembros_superiores: boolean; miembros_inferiores: boolean }
    neurologico: { fuerza: boolean; sensibilidad: boolean; marcha: boolean; reflejos: boolean }
  }
  descripcion_patologias: string
  observacion: string
}

export const FICHA_EVA1_SECCION_F_DEFAULTS: FichaEva1SeccionF = {
  regiones: {
    piel: { cicatrices: false, piel_faneras: false },
    ojos: { parpados: false, conjuntivas: false, pupilas: false, cornea: false, motilidad: false },
    oido: { canal_auditivo_externo: false, pabellon: false, timpanos: false },
    orofaringe: { labios: false, lengua: false, faringe: false, amigdalas: false, dentadura: false },
    nariz: { tabique: false, cornetes: false, mucosas: false, senos: false },
    cuello: { tiroides_masas: false, movilidad: false },
    torax_mamas: { mamas: false },
    torax: { pulmones: false, corazon: false, parrilla_costal: false },
    abdomen: { visceras: false, pared_abdominal: false },
    columna: { flexibilidad: false, desviacion: false, dolor: false },
    pelvis: { pelvis: false, genitales: false },
    extremidades: { vascular: false, miembros_superiores: false, miembros_inferiores: false },
    neurologico: { fuerza: false, sensibilidad: false, marcha: false, reflejos: false },
  },
  descripcion_patologias: '',
  observacion: '',
}

/** Documento de Evaluación Ocupacional 1-3 */
export interface FichaMedicaEvaluacion1Document {
  worker_id?: string
  worker_snapshot?: WorkerSnapshot
  seccionA: FichaEva1SeccionA
  seccionB?: FichaEva1SeccionB
  seccionC?: FichaEva1SeccionC
  seccionD?: FichaEva1SeccionD
  seccionE?: FichaEva1SeccionE
  seccionF?: FichaEva1SeccionF
}
