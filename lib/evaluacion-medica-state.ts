/**
 * Estado inicial del formulario según schema_medico.json.
 * Única fuente de verdad para valores por defecto.
 */

import type {
  FichaMedicaMSP,
  CertificadoAptitudOficial,
  EstadoEvaluacionCompleta,
  KeyRevision,
} from './schema-medico-types'
import { FACTORES_RIESGO, TEXTOS_LEGALES_OBLIGATORIOS } from './schema-medico-types'

const emptyItemRevision = () => ({ estado: 'Normal' as const, observacion: '' })

function createItemsRevision(): Record<KeyRevision, { estado: 'Normal' | 'Anormal'; observacion: string }> {
  return {
    piel_y_faneras: emptyItemRevision(),
    '2_ojos': emptyItemRevision(),
    '3_oidos': emptyItemRevision(),
    '4_oro_faringe': emptyItemRevision(),
    senos_paranasales: emptyItemRevision(),
    '6_cuello': emptyItemRevision(),
    '7_torax': emptyItemRevision(),
    pulmones: emptyItemRevision(),
    corazon: emptyItemRevision(),
    '9_abdomen': emptyItemRevision(),
    genitales: emptyItemRevision(),
    '10_columna': emptyItemRevision(),
    '12_extremidades': emptyItemRevision(),
    '13_neurologico': emptyItemRevision(),
  }
}

function createMatrizRiesgo() {
  const matriz: Record<string, Record<string, number | string>> = {}
  for (const [cat, factores] of Object.entries(FACTORES_RIESGO)) {
    matriz[cat] = {}
    for (const f of factores) {
      matriz[cat][f] = ''
    }
  }
  return matriz
}

export function createEstadoFichaVacio(): FichaMedicaMSP {
  return {
    pagina_1_identificacion_y_examen: {
      seccion_A_establecimiento_usuario: {
        empresa: {
          institucion_del_sistema: '',
          ruc: '',
          ciiu: '',
          establecimiento_salud: '',
          numero_historia_clinica: '',
          numero_archivo: '',
        },
        trabajador: {
          apellidos: '',
          nombres: '',
          sexo: 'M',
          puesto_trabajo_cargo: '',
          area_departamento: '',
        },
        atencion_prioritaria: {
          embarazada: false,
          persona_con_discapacidad: false,
          enfermedad_catastrofica: false,
          lactancia: false,
          adulto_mayor: false,
        },
        datos_biograficos: {
          fecha_nacimiento: '',
          edad: 0,
          grupo_sanguineo: '',
          lateralidad: 'Diestro',
        },
      },
      seccion_B_motivo_consulta: {
        puesto_trabajo_ciuo: '',
        fecha_atencion: '',
        fecha_ingreso_trabajo: '',
        fecha_reintegro: '',
        fecha_ultimo_dia_laboral_salida: '',
        tipo_evaluacion_check: {
          ingreso: false,
          periodico: false,
          reintegro: false,
          retiro: false,
        },
        observacion: '',
      },
      seccion_C_antecedentes_personales: {
        antecedentes_clinicos_quirurgicos: '',
        antecedentes_familiares: '',
        transfusiones_autoriza: 'no',
        transfusiones_observacion: '',
        tratamiento_hormonal: 'no',
        tratamiento_hormonal_cual: '',
        gineco_obstetricos: {
          fecha_ultima_menstruacion: '',
          gestas: 0,
          partos: 0,
          cesareas: 0,
          abortos: 0,
          metodo_planificacion: 'no',
          metodo_planificacion_cual: '',
        },
        examenes_realizados_cual: '',
        examenes_realizados_tiempo_anos: 0,
        registro_resultado_autorizacion_titular: '',
        reproductivos_masculinos_examenes_cual: '',
        reproductivos_masculinos_tiempo_anos: 0,
        reproductivos_masculinos_metodo_planificacion: 'no',
        reproductivos_masculinos_metodo_cual: '',
        consumo_tabaco_tiempo: '',
        consumo_tabaco_ex_consumidor: false,
        consumo_tabaco_abstinencia: '',
        consumo_tabaco_no_consume: false,
        consumo_alcohol_tiempo: '',
        consumo_alcohol_ex_consumidor: false,
        consumo_alcohol_abstinencia: '',
        consumo_alcohol_no_consume: false,
        consumo_otras_cual: '',
        consumo_otras_tiempo: '',
        consumo_otras_ex_consumidor: false,
        consumo_otras_abstinencia: '',
        consumo_otras_no_consume: false,
        actividad_fisica_cual: '',
        actividad_fisica_tiempo: '',
        medicacion_habitual: '',
        condicion_preexistente_cual: '',
        condicion_preexistente_cantidad: '',
        observacion: '',
      },
      seccion_revision_organos_sistemas: {
        items: createItemsRevision(),
      },
      signos_vitales_y_antropometria: {
        presion_arterial: '',
        frecuencia_cardiaca: 0,
        frecuencia_respiratoria: 0,
        temperatura: 0,
        peso_kg: 0,
        talla_cm: 0,
        indice_masa_corporal: 0,
      },
    },
    pagina_2_riesgos_laborales: {
      seccion_G_factores_riesgo: {
        matriz: createMatrizRiesgo(),
      },
    },
    pagina_3_historia_y_diagnostico: {
      seccion_H_actividad_laboral: {
        tabla_antecedentes: [],
        tabla_accidentes_enfermedades: [],
      },
      seccion_J_diagnostico: {
        tabla_diagnosticos: [],
      },
      seccion_N_retiro: {
        se_realiza_evaluacion: false,
        condicion_salud_relacionada_trabajo: false,
        observacion_retiro: '',
      },
      seccion_firmas_ficha: {
        profesional: { nombre: '', codigo: '', firma_url: '' },
        trabajador: { nombre: '', cedula: '', firma_url: '' },
      },
    },
    pagina_4_certificado: {
      tipo_evaluacion: 'Ingreso',
      concepto_aptitud: {
        seleccion: 'Apto',
        detalle_observaciones: '',
      },
      recomendaciones: {
        descripcion: '',
        observaciones_adicionales: '',
      },
      firmas_certificado: {
        profesional: { nombre: '', codigo: '', firma_url: '' },
        usuario: { nombre: '', cedula: '', firma_url: '' },
      },
    },
  }
}

export function createEstadoCertificadoOficialVacio(): CertificadoAptitudOficial {
  const today = new Date()
  return {
    seccion_A_datos_establecimiento_usuario: {
      empresa: {
        institucion_sistema: '',
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
    },
    seccion_B_datos_generales: {
      fecha_emision: {
        aaaa: today.getFullYear(),
        mm: today.getMonth() + 1,
        dd: today.getDate(),
      },
      tipo_evaluacion_check: {
        ingreso: false,
        periodico: false,
        reintegro: false,
        salida: false,
      },
    },
    seccion_C_concepto_aptitud: {
      detalle_observaciones: '',
      opcion_seleccionada: 'Apto',
    },
    seccion_E_recomendaciones: {
      campo_texto_abierto: '',
    },
    textos_legales_obligatorios: {
      nota_1: TEXTOS_LEGALES_OBLIGATORIOS.nota_1,
      nota_2: TEXTOS_LEGALES_OBLIGATORIOS.nota_2,
    },
    seccion_F_datos_profesional: {
      nombre_y_apellido: '',
      codigo: '',
      firma: '',
    },
    seccion_G_firma_usuario: {
      firma: '',
    },
  }
}

export function createEstadoEvaluacionCompleto(): EstadoEvaluacionCompleta {
  return {
    ficha_medica_MSP: createEstadoFichaVacio(),
    certificado_aptitud_oficial: null,
  }
}

/**
 * Rellena el certificado oficial con datos de la ficha (empresa y usuario).
 * Útil al finalizar el wizard para pre-cargar el formulario del certificado.
 */
export function certificadoDesdeFicha(ficha: FichaMedicaMSP): CertificadoAptitudOficial {
  const cert = createEstadoCertificadoOficialVacio()
  const A = ficha.pagina_1_identificacion_y_examen.seccion_A_establecimiento_usuario
  const emp = A.empresa
  const trab = A.trabajador

  cert.seccion_A_datos_establecimiento_usuario = {
    empresa: {
      institucion_sistema: emp.institucion_del_sistema ?? '',
      ruc: emp.ruc ?? '',
      ciiu: emp.ciiu ?? '',
      establecimiento_salud: emp.establecimiento_salud ?? '',
      numero_historia_clinica: emp.numero_historia_clinica ?? '',
      numero_archivo: emp.numero_archivo ?? '',
    },
    usuario: {
      primer_apellido: trab.apellidos?.split(' ')[0] ?? '',
      segundo_apellido: trab.apellidos?.split(' ').slice(1).join(' ') ?? '',
      primer_nombre: trab.nombres?.split(' ')[0] ?? '',
      segundo_nombre: trab.nombres?.split(' ').slice(1).join(' ') ?? '',
      sexo: trab.sexo ?? 'M',
      cargo_ocupacion: trab.puesto_trabajo_cargo ?? '',
    },
  }

  const p4 = ficha.pagina_4_certificado
  if (p4?.concepto_aptitud?.opcion_seleccionada) {
    const op = p4.concepto_aptitud.opcion_seleccionada
    cert.seccion_C_concepto_aptitud.opcion_seleccionada =
      op === 'Apto en Observacion' ? 'Apto en Observación' : op
    cert.seccion_C_concepto_aptitud.detalle_observaciones =
      p4.concepto_aptitud.detalle_observaciones ?? ''
  }
  if (p4?.recomendaciones?.campo_texto_abierto) {
    cert.seccion_E_recomendaciones.campo_texto_abierto = p4.recomendaciones.campo_texto_abierto
  }

  return cert
}
