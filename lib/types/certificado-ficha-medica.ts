/**
 * Tipos para el Certificado de Evaluación Médica Ocupacional (de la ficha médica).
 * No confundir con el Certificado de Aptitud Oficial.
 */
import type { WorkerSnapshot } from '@/lib/types'

/** Sección A - Datos del Establecimiento y Datos del Usuario */
export interface CertificadoFichaMedicaSeccionA {
  /** Datos del Establecimiento */
  establecimiento: {
    /** Institución del sistema */
    institucion_sistema: string
    /** RUC de la empresa */
    ruc: string
    /** Código CIIU */
    ciiu: string
    /** Establecimiento / Centro de trabajo */
    establecimiento_centro_trabajo: string
    /** Número de formulario */
    numero_formulario: string
    /** Número de archivo */
    numero_archivo: string
  }
  /** Datos del Usuario */
  usuario: {
    /** Primer apellido */
    primer_apellido: string
    /** Segundo apellido */
    segundo_apellido: string
    /** Primer nombre */
    primer_nombre: string
    /** Segundo nombre */
    segundo_nombre: string
    /** Sexo: M = Masculino, F = Femenino */
    sexo: 'M' | 'F'
    /** Puesto de trabajo (CIUO) */
    puesto_trabajo_ciuo: string
  }
}

/** Valores por defecto para Sección A */
export const CERTIFICADO_FICHA_MEDICA_SECCION_A_DEFAULTS: CertificadoFichaMedicaSeccionA =
  {
    establecimiento: {
      institucion_sistema: '',
      ruc: '',
      ciiu: '',
      establecimiento_centro_trabajo: '',
      numero_formulario: '',
      numero_archivo: '',
    },
    usuario: {
      primer_apellido: '',
      segundo_apellido: '',
      primer_nombre: '',
      segundo_nombre: '',
      sexo: 'M',
      puesto_trabajo_ciuo: '',
    },
  }

/** Opciones de evaluación para Sección B */
export type CertificadoFichaMedicaEvaluacion =
  | 'ingreso'
  | 'periodico'
  | 'reintegro'
  | 'retiro'

/** Sección B - Datos Generales */
export interface CertificadoFichaMedicaSeccionB {
  /** Fecha de emisión (ISO 8601 o string dd/mm/aaaa) */
  fecha_emision: string
  /** Tipo de evaluación */
  evaluacion: CertificadoFichaMedicaEvaluacion
}

/** Valores por defecto para Sección B */
export const CERTIFICADO_FICHA_MEDICA_SECCION_B_DEFAULTS: CertificadoFichaMedicaSeccionB =
  {
    fecha_emision: new Date().toISOString().split('T')[0],
    evaluacion: 'ingreso',
  }

/** Opciones de aptitud laboral para Sección C */
export type CertificadoFichaMedicaAptitud =
  | 'apto'
  | 'apto_en_observacion'
  | 'apto_con_limitaciones'
  | 'no_apto'

/** Sección C - Aptitud Médica para el Trabajo */
export interface CertificadoFichaMedicaSeccionC {
  /** Calificación de aptitud */
  concepto_aptitud: CertificadoFichaMedicaAptitud
  /** Detalle de observaciones */
  detalle_observaciones: string
}

/** Valores por defecto para Sección C */
export const CERTIFICADO_FICHA_MEDICA_SECCION_C_DEFAULTS: CertificadoFichaMedicaSeccionC =
  {
    concepto_aptitud: 'apto',
    detalle_observaciones: '',
  }

/** Sección D - Recomendaciones / Observaciones */
export interface CertificadoFichaMedicaSeccionD {
  /** Descripción de recomendaciones */
  descripcion: string
  /** Observación */
  observacion: string
}

/** Valores por defecto para Sección D */
export const CERTIFICADO_FICHA_MEDICA_SECCION_D_DEFAULTS: CertificadoFichaMedicaSeccionD = {
  descripcion: '',
  observacion: '',
}

/** Sección E - Datos del Profesional */
export interface CertificadoFichaMedicaSeccionE {
  /** Nombre y apellido del profesional */
  nombre_apellido: string
  /** Código médico */
  codigo_medico: string
}

/** Valores por defecto para Sección E */
export const CERTIFICADO_FICHA_MEDICA_SECCION_E_DEFAULTS: CertificadoFichaMedicaSeccionE = {
  nombre_apellido: '',
  codigo_medico: '',
}

/** Documento completo del Certificado de la Ficha Médica */
export interface CertificadoFichaMedicaDocument {
  worker_id?: string
  worker_snapshot?: WorkerSnapshot
  seccionA: CertificadoFichaMedicaSeccionA
  /** Opcional para compatibilidad con certificados creados antes de agregar sección B */
  seccionB?: CertificadoFichaMedicaSeccionB
  /** Opcional para compatibilidad con certificados creados antes de agregar sección C */
  seccionC?: CertificadoFichaMedicaSeccionC
  /** Opcional para compatibilidad con certificados creados antes de agregar sección D */
  seccionD?: CertificadoFichaMedicaSeccionD
  /** Opcional para compatibilidad con certificados creados antes de agregar sección E */
  seccionE?: CertificadoFichaMedicaSeccionE
}
