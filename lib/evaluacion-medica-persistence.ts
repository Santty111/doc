/**
 * Formato para persistir la evaluación médica en base de datos.
 *
 * Se guarda un único documento por evaluación con:
 * - userId: quien crea/edita
 * - workerId (opcional): trabajador asociado
 * - ficha_medica: árbol completo FichaMedicaMSP (JSON)
 * - certificado_oficial (opcional): CertificadoAptitudOficial
 * - timestamps
 *
 * En MongoDB: una colección (ej. evaluaciones) con schema flexible;
 * en PostgreSQL: columna JSONB para ficha_medica y certificado_oficial.
 * Serialización: JSON.stringify(ficha) / JSON.parse al leer.
 */

import type { FichaMedicaMSP, CertificadoAptitudOficial } from './schema-medico-types'

export interface EvaluacionMedicaDocument {
  _id?: string
  userId: string
  workerId?: string
  ficha_medica: FichaMedicaMSP
  certificado_oficial?: CertificadoAptitudOficial
  createdAt: Date
  updatedAt: Date
}

/** Serializa la ficha para guardar en BD (mismo objeto, sin transformación). */
export function evaluacionToJSON(doc: EvaluacionMedicaDocument): string {
  return JSON.stringify({
    ...doc,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  })
}
