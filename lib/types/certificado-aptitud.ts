/**
 * Tipos para el flujo de Certificado de Aptitud Oficial.
 * Los datos se guardan como un único documento JSON en MongoDB.
 */

/** Sección A - Datos del Establecimiento, Empresa y Usuario */
export interface CertificadoAptitudSeccionA {
  /** Datos de la Empresa */
  empresa: {
    /** Institución del sistema o nombre de la empresa */
    institucion_nombre: string
    /** RUC de la empresa */
    ruc: string
    /** Código CIIU (Clasificación Industrial Internacional Uniforme) */
    ciiu: string
    /** Tipo de establecimiento de salud (ej: PRIVADO, PÚBLICO) */
    establecimiento_salud: string
    /** Número de historia clínica */
    numero_historia_clinica: string
    /** Número de archivo */
    numero_archivo: string
  }
  /** Datos del Usuario / Trabajador */
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
    /** Cargo u ocupación */
    cargo_ocupacion: string
  }
}

/** Valores por defecto para inicializar el formulario de Sección A */
export const CERTIFICADO_APTITUD_SECCION_A_DEFAULTS: CertificadoAptitudSeccionA =
  {
    empresa: {
      institucion_nombre: '',
      ruc: '',
      ciiu: '',
      establecimiento_salud: '',
      numero_historia_clinica: '',
      numero_archivo: '',
    },
    usuario: {
      primer_apellido: '',
      segundo_apellido: '',
      primer_nombre: '',
      segundo_nombre: '',
      sexo: 'M',
      cargo_ocupacion: '',
    },
  }

/** Opciones de evaluación para Sección B */
export type CertificadoAptitudEvaluacion =
  | 'ingreso'
  | 'periodico'
  | 'reintegro'
  | 'salida'

/** Sección B - Datos Generales */
export interface CertificadoAptitudSeccionB {
  /** Fecha de emisión (ISO 8601) */
  fecha_emision: string
  /** Tipo de evaluación */
  evaluacion: CertificadoAptitudEvaluacion
}

/** Valores por defecto para Sección B */
export const CERTIFICADO_APTITUD_SECCION_B_DEFAULTS: CertificadoAptitudSeccionB =
  {
    fecha_emision: new Date().toISOString().split('T')[0],
    evaluacion: 'ingreso',
  }

/** Opciones de aptitud laboral para Sección C */
export type CertificadoAptitudConcepto =
  | 'apto'
  | 'apto_en_observacion'
  | 'apto_con_limitaciones'
  | 'no_apto'

/** Sección C - Concepto para Aptitud Laboral */
export interface CertificadoAptitudSeccionC {
  /** Calificación de aptitud */
  concepto_aptitud: CertificadoAptitudConcepto
  /** Detalle de observaciones o conclusión */
  detalle_observaciones: string
}

/** Valores por defecto para Sección C */
export const CERTIFICADO_APTITUD_SECCION_C_DEFAULTS: CertificadoAptitudSeccionC =
  {
    concepto_aptitud: 'apto_en_observacion',
    detalle_observaciones: '',
  }

/** Opciones de condiciones de salud al retiro para Sección D */
export type CertificadoAptitudSaludRetiro =
  | 'satisfactorio'
  | 'no_satisfactorio'

/** Sección D - Condiciones de Salud al Momento del Retiro */
export interface CertificadoAptitudSeccionD {
  /** Certificación de condiciones de salud: satisfactorio o no satisfactorio */
  condiciones_salud_retiro: CertificadoAptitudSaludRetiro
  /** Observaciones relacionadas con las condiciones de salud al momento del retiro */
  observaciones_salud_retiro: string
}

/** Valores por defecto para Sección D */
export const CERTIFICADO_APTITUD_SECCION_D_DEFAULTS: CertificadoAptitudSeccionD =
  {
    condiciones_salud_retiro: 'satisfactorio',
    observaciones_salud_retiro: '',
  }

/** Sección E - Recomendaciones */
export interface CertificadoAptitudSeccionE {
  /** Recomendaciones de salud y seguridad para el trabajador */
  recomendaciones: string
}

/** Valores por defecto para Sección E */
export const CERTIFICADO_APTITUD_SECCION_E_DEFAULTS: CertificadoAptitudSeccionE =
  {
    recomendaciones: '',
  }

/** Sección F - Datos del Profesional de Salud */
export interface CertificadoAptitudSeccionF {
  /** Nombre y apellido del profesional de salud */
  nombre_apellido: string
  /** Código del profesional (ej: cédula) */
  codigo: string
}

/** Valores por defecto para Sección F */
export const CERTIFICADO_APTITUD_SECCION_F_DEFAULTS: CertificadoAptitudSeccionF =
  {
    nombre_apellido: '',
    codigo: '',
  }

/** Sección G - Firma del Usuario */
export interface CertificadoAptitudSeccionG {
  /** Indica que el espacio está reservado para firma física del usuario al imprimir */
  firma_fisica: true
}

/** Valores por defecto para Sección G */
export const CERTIFICADO_APTITUD_SECCION_G_DEFAULTS: CertificadoAptitudSeccionG =
  {
    firma_fisica: true,
  }

/** Documento completo del Certificado de Aptitud Oficial (para persistencia) */
export interface CertificadoAptitudOficialDocument {
  seccionA: CertificadoAptitudSeccionA
  seccionB: CertificadoAptitudSeccionB
  seccionC: CertificadoAptitudSeccionC
  seccionD: CertificadoAptitudSeccionD
  seccionE: CertificadoAptitudSeccionE
  seccionF: CertificadoAptitudSeccionF
  seccionG: CertificadoAptitudSeccionG
}
