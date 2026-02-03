export interface Company {
  id: string
  name: string
  code: string
  created_at: string
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  role: 'admin' | 'doctor' | 'viewer'
  company_id: string | null
  created_at: string
  updated_at: string
  company?: Company
}

export interface Worker {
  id: string
  company_id: string
  employee_code: string
  first_name: string
  last_name: string
  birth_date: string | null
  gender: 'M' | 'F' | 'Otro' | null
  curp: string | null
  rfc: string | null
  nss: string | null
  phone: string | null
  email: string | null
  address: string | null
  department: string | null
  position: string | null
  hire_date: string | null
  status: 'active' | 'inactive' | 'terminated'
  created_at: string
  updated_at: string
  created_by: string | null
  company?: Company
}

export interface MedicalRecord {
  id: string
  worker_id: string
  record_date: string
  medical_history: string | null
  family_history: string | null
  allergies: string | null
  current_medications: string | null
  blood_type: string | null
  height_cm: number | null
  weight_kg: number | null
  blood_pressure: string | null
  heart_rate: number | null
  observations: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  worker?: Worker
}

export interface Certificate {
  id: string
  worker_id: string
  certificate_type: 'ingreso' | 'periodico' | 'egreso' | 'especial'
  issue_date: string
  expiry_date: string | null
  result: 'apto' | 'apto_con_restricciones' | 'no_apto' | 'pendiente'
  restrictions: string | null
  recommendations: string | null
  doctor_name: string | null
  doctor_license: string | null
  observations: string | null
  pdf_url: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  worker?: Worker
}

export interface MedicalExam {
  id: string
  worker_id: string
  exam_type: string
  exam_date: string
  lab_name: string | null
  results: string | null
  file_url: string | null
  file_name: string | null
  observations: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  worker?: Worker
}

export type CertificateTypeLabel = {
  [key in Certificate['certificate_type']]: string
}

export type CertificateResultLabel = {
  [key in Certificate['result']]: string
}

export const CERTIFICATE_TYPE_LABELS: CertificateTypeLabel = {
  ingreso: 'Ingreso',
  periodico: 'Periódico',
  egreso: 'Egreso',
  especial: 'Especial'
}

export const CERTIFICATE_RESULT_LABELS: CertificateResultLabel = {
  apto: 'Apto',
  apto_con_restricciones: 'Apto con Restricciones',
  no_apto: 'No Apto',
  pendiente: 'Pendiente'
}

export const EXAM_TYPES = [
  'Biometría Hemática',
  'Química Sanguínea',
  'Examen General de Orina',
  'Audiometría',
  'Espirometría',
  'Electrocardiograma',
  'Rayos X de Tórax',
  'Examen de Vista',
  'Prueba de Drogas',
  'Otro'
] as const
