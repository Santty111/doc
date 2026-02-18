/**
 * Tipos derivados exclusivamente de src/data/schema_medico.json.
 * Fuente de verdad: sistema_medico_ocupacional_unificado.
 */

// --- FICHA MÉDICA MSP ---

export type Sexo = 'M' | 'F'
export type Lateralidad = 'Diestro' | 'Zurdo' | 'Ambidiestro'
export type EstadoRevision = 'Normal' | 'Anormal'
export type TipoAntecedente = 'Anterior' | 'Actual'
export type TipoAccidente = 'Incidente' | 'Accidente' | 'Enfermedad Profesional'
export type EstadoDiagnostico = 'Presuntivo' | 'Definitivo'
export type TipoEvaluacion = 'Ingreso' | 'Periodico' | 'Reintegro' | 'Retiro'
export type ConceptoAptitudMSP = 'Apto' | 'Apto en Observacion' | 'Apto con Limitaciones' | 'No Apto'

export interface SeccionAEstablecimientoUsuario {
  empresa: {
    institucion_del_sistema: string
    ruc: string
    ciiu: string
    establecimiento_salud: string
    numero_historia_clinica: string
    numero_archivo: string
  }
  trabajador: {
    apellidos: string
    nombres: string
    sexo: Sexo
    puesto_trabajo_cargo: string
    area_departamento: string
  }
  atencion_prioritaria: {
    embarazada: boolean
    persona_con_discapacidad: boolean
    enfermedad_catastrofica: boolean
    lactancia: boolean
    adulto_mayor: boolean
  }
  datos_biograficos: {
    fecha_nacimiento: string // date ISO
    edad: number
    grupo_sanguineo: string
    lateralidad: Lateralidad
  }
}

export interface SeccionBMotivoConsulta {
  puesto_trabajo_ciuo: string
  fecha_atencion: string // date ISO
  fecha_ingreso_trabajo: string // date ISO
  fecha_reintegro: string // date ISO
  fecha_ultimo_dia_laboral_salida: string // date ISO
  tipo_evaluacion_check: {
    ingreso: boolean
    periodico: boolean
    reintegro: boolean
    retiro: boolean
  }
  observacion: string
}

export type SiNo = 'si' | 'no'
export type SiNoNoResponde = 'si' | 'no' | 'no_responde'

export interface GinecoObstetricos {
  fecha_ultima_menstruacion: string
  gestas: number
  partos: number
  cesareas: number
  abortos: number
  metodo_planificacion: SiNoNoResponde
  metodo_planificacion_cual: string
}

export interface SeccionCAntecedentesPersonales {
  antecedentes_clinicos_quirurgicos: string
  antecedentes_familiares: string
  transfusiones_autoriza: SiNo
  transfusiones_observacion: string
  tratamiento_hormonal: SiNoNoResponde
  tratamiento_hormonal_cual: string
  gineco_obstetricos: GinecoObstetricos
  examenes_realizados_cual: string
  examenes_realizados_tiempo_anos: number
  registro_resultado_autorizacion_titular: string
  reproductivos_masculinos_examenes_cual: string
  reproductivos_masculinos_tiempo_anos: number
  reproductivos_masculinos_metodo_planificacion: SiNoNoResponde
  reproductivos_masculinos_metodo_cual: string
  consumo_tabaco_tiempo: string
  consumo_tabaco_ex_consumidor: boolean
  consumo_tabaco_abstinencia: string
  consumo_tabaco_no_consume: boolean
  consumo_alcohol_tiempo: string
  consumo_alcohol_ex_consumidor: boolean
  consumo_alcohol_abstinencia: string
  consumo_alcohol_no_consume: boolean
  consumo_otras_cual: string
  consumo_otras_tiempo: string
  consumo_otras_ex_consumidor: boolean
  consumo_otras_abstinencia: string
  consumo_otras_no_consume: boolean
  actividad_fisica_cual: string
  actividad_fisica_tiempo: string
  medicacion_habitual: string
  condicion_preexistente_cual: string
  condicion_preexistente_cantidad: string
  observacion: string
}

export interface ItemRevision {
  estado: EstadoRevision
  observacion: string
}

export type KeyRevision =
  | 'piel_y_faneras'
  | '2_ojos'
  | '3_oidos'
  | '4_oro_faringe'
  | 'senos_paranasales'
  | '6_cuello'
  | '7_torax'
  | 'pulmones'
  | 'corazon'
  | '9_abdomen'
  | 'genitales'
  | '10_columna'
  | '12_extremidades'
  | '13_neurologico'

export interface SeccionRevisionOrganosSistemas {
  items: Record<KeyRevision, ItemRevision>
}

export interface SignosVitalesYAntropometria {
  presion_arterial: string
  frecuencia_cardiaca: number
  frecuencia_respiratoria: number
  temperatura: number
  peso_kg: number
  talla_cm: number
  indice_masa_corporal: number
}

export interface Pagina1IdentificacionYExamen {
  seccion_A_establecimiento_usuario: SeccionAEstablecimientoUsuario
  seccion_B_motivo_consulta: SeccionBMotivoConsulta
  seccion_C_antecedentes_personales: SeccionCAntecedentesPersonales
  seccion_revision_organos_sistemas: SeccionRevisionOrganosSistemas
  signos_vitales_y_antropometria: SignosVitalesYAntropometria
}

// Matriz de riesgos: clave = categoría, valor = objeto con cada factor y nivel (1-7) o tiempo
export type CategoriaRiesgo =
  | 'fisico'
  | 'seguridad_mecanicos'
  | 'quimico'
  | 'biologico'
  | 'ergonomico'
  | 'psicosocial'

export interface MatrizRiesgo {
  [categoria: string]: Record<string, number | string> // factor -> nivel 1-7 o tiempo
}

export interface SeccionGFactoresRiesgo {
  matriz: MatrizRiesgo
}

export interface Pagina2RiesgosLaborales {
  seccion_G_factores_riesgo: SeccionGFactoresRiesgo
}

export interface AntecedenteLaboral {
  empresa_centro_trabajo: string
  actividades_desempenadas: string
  tipo: TipoAntecedente
  tiempo_trabajo: string
  riesgos: string
}

export interface AccidenteEnfermedad {
  tipo: TipoAccidente
  calificado_IESS: boolean
  fecha: string
  especificar_diagnostico: string
  observaciones: string
}

export interface DiagnosticoCIE10 {
  descripcion_diagnostica: string
  CIE_10: string
  estado: EstadoDiagnostico
}

export interface SeccionNRetiro {
  se_realiza_evaluacion: boolean
  condicion_salud_relacionada_trabajo: boolean
  observacion_retiro: string
}

export interface SeccionFirmasFicha {
  profesional: { nombre: string; codigo: string; firma_url: string }
  trabajador: { nombre: string; cedula: string; firma_url: string }
}

export interface Pagina3HistoriaYDiagnostico {
  seccion_H_actividad_laboral: {
    tabla_antecedentes: AntecedenteLaboral[]
    tabla_accidentes_enfermedades: AccidenteEnfermedad[]
  }
  seccion_J_diagnostico: { tabla_diagnosticos: DiagnosticoCIE10[] }
  seccion_N_retiro: SeccionNRetiro
  seccion_firmas_ficha: SeccionFirmasFicha
}

export interface Pagina4Certificado {
  tipo_evaluacion: TipoEvaluacion
  concepto_aptitud: {
    seleccion: ConceptoAptitudMSP
    detalle_observaciones: string
  }
  recomendaciones: {
    descripcion: string
    observaciones_adicionales: string
  }
  firmas_certificado: {
    profesional: { nombre: string; codigo: string; firma_url: string }
    usuario: { nombre: string; cedula: string; firma_url: string }
  }
}

export interface FichaMedicaMSP {
  pagina_1_identificacion_y_examen: Pagina1IdentificacionYExamen
  pagina_2_riesgos_laborales: Pagina2RiesgosLaborales
  pagina_3_historia_y_diagnostico: Pagina3HistoriaYDiagnostico
  pagina_4_certificado: Pagina4Certificado
}

// --- CERTIFICADO APTITUD OFICIAL (documento independiente) ---

export interface CertificadoAptitudOficial {
  seccion_A_datos_establecimiento_usuario: {
    empresa: {
      institucion_sistema: string
      ruc: string
      ciiu: string
      establecimiento_salud: string
      numero_historia_clinica: string
      numero_archivo: string
    }
    usuario: {
      primer_apellido: string
      segundo_apellido: string
      primer_nombre: string
      segundo_nombre: string
      sexo: Sexo
      cargo_ocupacion: string
    }
  }
  seccion_B_datos_generales: {
    fecha_emision: { aaaa: number; mm: number; dd: number }
    tipo_evaluacion_check: { ingreso: boolean; periodico: boolean; reintegro: boolean; salida: boolean }
  }
  seccion_C_concepto_aptitud: {
    detalle_observaciones: string
    opcion_seleccionada: 'Apto' | 'Apto en Observación' | 'Apto con Limitaciones' | 'No Apto'
  }
  /** Sin sección D. Salto directo a E. */
  seccion_E_recomendaciones: {
    campo_texto_abierto: string
  }
  textos_legales_obligatorios: {
    nota_1: string
    nota_2: string
  }
  seccion_F_datos_profesional: {
    nombre_y_apellido: string
    codigo: string
    firma: string
  }
  seccion_G_firma_usuario: {
    firma: string
  }
}

// Estado unificado del wizard: ficha + certificado oficial
export interface EstadoEvaluacionCompleta {
  ficha_medica_MSP: FichaMedicaMSP
  certificado_aptitud_oficial: CertificadoAptitudOficial | null
}

// Labels para UI (según schema)
export const LABELS_REVISION: Record<KeyRevision, string> = {
  piel_y_faneras: 'Piel y faneras',
  '2_ojos': 'Ojos',
  '3_oidos': 'Oídos',
  '4_oro_faringe': 'Oro-faringe',
  senos_paranasales: 'Senos paranasales',
  '6_cuello': 'Cuello',
  '7_torax': 'Tórax',
  pulmones: 'Pulmones',
  corazon: 'Corazón',
  '9_abdomen': 'Abdomen',
  genitales: 'Genitales',
  '10_columna': 'Columna',
  '12_extremidades': 'Extremidades',
  '13_neurologico': 'Neurológico',
}

export const CONCEPTO_APTITUD_OPCIONES: ConceptoAptitudMSP[] = [
  'Apto',
  'Apto en Observacion',
  'Apto con Limitaciones',
  'No Apto',
]

export const TIPOS_EVALUACION: TipoEvaluacion[] = ['Ingreso', 'Periodico', 'Reintegro', 'Retiro']

/** Categorías y factores de riesgo (schema pagina_2_riesgos_laborales) para la matriz. */
export const FACTORES_RIESGO: Record<CategoriaRiesgo, string[]> = {
  fisico: [
    'Temperaturas altas',
    'Temperaturas bajas',
    'Radiacion Ionizante',
    'Radiacion No Ionizante',
    'Ruido',
    'Vibracion',
    'Iluminacion',
    'Ventilacion',
    'Fluido electrico',
  ],
  seguridad_mecanicos: [
    'Locativos (Senalizacion, aseo, desorden)',
    'Atrapamiento (Maquinas/Superficies)',
    'Atrapamiento (Objetos)',
    'Caida de objetos',
    'Caidas al mismo nivel',
    'Caidas a diferente nivel',
    'Pinchazos',
    'Cortes',
    'Choques/Colision vehicular',
    'Atropellamientos',
    'Proyeccion de fluidos',
    'Proyeccion de particulas',
  ],
  quimico: ['Polvos', 'Solidos', 'Humos', 'Liquidos', 'Vapores', 'Aerosoles', 'Neblinas', 'Gaseosos'],
  biologico: [
    'Virus',
    'Hongos',
    'Bacterias',
    'Parasitos',
    'Exposicion a vectores',
    'Animales selvaticos',
  ],
  ergonomico: [
    'Manejo manual de cargas',
    'Movimientos repetitivos',
    'Posturas forzadas',
    'Trabajos con PVD',
    'Diseno inadecuado puesto',
  ],
  psicosocial: [
    'Monotonia',
    'Sobrecarga laboral',
    'Minuciosidad',
    'Alta responsabilidad',
    'Autonomia decisiones',
    'Supervision deficiente',
    'Conflicto de rol',
    'Turnos rotativos',
    'Relaciones interpersonales',
  ],
}

/** Textos legales obligatorios al pie del certificado oficial (schema). */
export const TEXTOS_LEGALES_OBLIGATORIOS = {
  nota_1:
    'Con este documento certifico que el trabajador se ha sometido a la evaluación médica requerida para (el ingreso /la ejecución/ el reintegro y retiro) al puesto laboral y se ha informado sobre los riesgos relacionados con el trabajo emitiendo recomendaciones relacionadas con su estado de salud.',
  nota_2:
    'La presente certificación se expide con base en la historia ocupacional del usuario (a), la cual tiene carácter de confidencial.',
}
