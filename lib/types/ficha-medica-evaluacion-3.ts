/**
 * Tipos para Ficha Médica - Evaluación Ocupacional 3-3.
 * Sección H. Actividad Laboral / Incidentes / Accidentes / Enfermedades Ocupacionales.
 */
import type { WorkerSnapshot } from '@/lib/types'

/** Una fila de antecedentes de empleos anteriores y/o trabajo actual */
export interface FichaEva3AntecedenteEmpleo {
  centro_trabajo: string
  actividades_desempenadas: string
  trabajo_anterior: boolean
  trabajo_actual: boolean
  tiempo_trabajo: string
  incidente: boolean
  accidente: boolean
  enfermedad_profesional: boolean
  calificado_si: boolean
  calificado_no: boolean
  calificado_fecha: string
  calificado_especificar: string
  observaciones: string
}

/** Sección H - Antecedentes de empleos anteriores y/o trabajo actual */
export interface FichaEva3SeccionH {
  antecedentes: FichaEva3AntecedenteEmpleo[]
}

/** Una fila de actividades extra laborales */
export interface FichaEva3ActividadExtra {
  tipo_actividad: string
  fecha: string
}

/** Sección I - Actividades extra laborales */
export interface FichaEva3SeccionI {
  actividades: FichaEva3ActividadExtra[]
}

/** Una fila de resultados de exámenes */
export interface FichaEva3ResultadoExamen {
  nombre_examen: string
  fecha: string
  resultados: string
}

/** Sección J - Resultados de exámenes */
export interface FichaEva3SeccionJ {
  resultados: FichaEva3ResultadoExamen[]
  observaciones: string
}

/** Una fila de diagnóstico */
export interface FichaEva3Diagnostico {
  cie10: string
  descripcion: string
  presuntivo: boolean
  definitivo: boolean
}

/** Sección K - Diagnóstico */
export interface FichaEva3SeccionK {
  diagnosticos: FichaEva3Diagnostico[]
}

export const FICHA_EVA3_DIAGNOSTICO_DEFAULT: FichaEva3Diagnostico = {
  cie10: '',
  descripcion: '',
  presuntivo: false,
  definitivo: false,
}

export const EXAMENES_DEFAULT: FichaEva3ResultadoExamen[] = [
  { nombre_examen: 'BIOMETRÍA HEMÁTICA', fecha: '', resultados: '' },
  { nombre_examen: 'GLUCOSA', fecha: '', resultados: '' },
  { nombre_examen: 'EMO', fecha: '', resultados: '' },
  { nombre_examen: 'COPRO', fecha: '', resultados: '' },
  { nombre_examen: 'RX LUMBO SACRA', fecha: '', resultados: '' },
  { nombre_examen: 'AUDIOMETRÍA', fecha: '', resultados: '' },
]

export const FICHA_EVA3_ACTIVIDAD_DEFAULT: FichaEva3ActividadExtra = {
  tipo_actividad: '',
  fecha: '',
}

export const FICHA_EVA3_ANTECEDENTE_DEFAULT: FichaEva3AntecedenteEmpleo = {
  centro_trabajo: '',
  actividades_desempenadas: '',
  trabajo_anterior: false,
  trabajo_actual: false,
  tiempo_trabajo: '',
  incidente: false,
  accidente: false,
  enfermedad_profesional: false,
  calificado_si: false,
  calificado_no: false,
  calificado_fecha: '',
  calificado_especificar: '',
  observaciones: '',
}

/** Documento completo almacenado en MongoDB */
export interface FichaMedicaEvaluacion3Document {
  _id: string
  worker_id?: string
  worker_snapshot?: WorkerSnapshot
  seccionH?: {
    antecedentes?: FichaEva3AntecedenteEmpleo[]
  }
  seccionI?: {
    actividades?: FichaEva3ActividadExtra[]
  }
  seccionJ?: {
    resultados?: FichaEva3ResultadoExamen[]
    observaciones?: string
  }
  seccionK?: {
    diagnosticos?: FichaEva3Diagnostico[]
  }
  seccionL?: {
    aptitud?: string
    observaciones?: string
  }
  seccionM?: {
    descripcion?: string
  }
  seccionN?: {
    se_realiza_evaluacion?: boolean
    condicion_salud_relacionada_trabajo?: boolean
    observacion?: string
  }
  seccionO?: {
    nombres_apellidos_profesional?: string
    codigo_medico?: string
  }
  created_at?: string
  updated_at?: string
}
