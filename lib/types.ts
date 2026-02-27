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
  primer_nombre: string | null
  segundo_nombre: string | null
  primer_apellido: string | null
  segundo_apellido: string | null
  birth_date: string | null
  gender: 'M' | 'F' | 'Otro' | null
  sexo: 'hombre' | 'mujer' | null
  grupo_sanguineo: string | null
  lateralidad: 'diestro' | 'zurdo' | 'ambidiestro' | null
  puesto_trabajo_ciuo: string | null
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

export interface WorkerSnapshot {
  worker_id: string
  primer_nombre: string
  segundo_nombre: string
  primer_apellido: string
  segundo_apellido: string
  sexo: 'hombre' | 'mujer' | null
  fecha_nacimiento: string | null
  edad: number | null
  grupo_sanguineo: string | null
  lateralidad: 'diestro' | 'zurdo' | 'ambidiestro' | null
  cargo_ocupacion: string | null
  puesto_trabajo_ciuo: string | null
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
  consentimiento_informado_url: string | null
  consentimiento_informado_name: string | null
  observations: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  worker?: Worker
}

export const EXAM_TYPES = [
  'Audiometría',
  'Radiografía',
  'Biometría Hemática',
  'Química Sanguínea',
] as const
