'use client'

import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Company, Worker } from '@/lib/types'
import { createWorker, updateWorker } from '@/lib/actions'

interface WorkerFormProps {
  companies: Company[]
  worker?: Worker
}

const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as const
const LATERALIDAD_VALUES = ['diestro', 'zurdo', 'ambidiestro'] as const

function normalizeBloodType(value: string | null | undefined): string {
  const normalized = (value ?? '').trim().toUpperCase()
  return BLOOD_TYPES.includes(normalized as (typeof BLOOD_TYPES)[number])
    ? normalized
    : ''
}

function normalizeLateralidad(value: string | null | undefined): string {
  const normalized = (value ?? '').trim().toLowerCase()
  return LATERALIDAD_VALUES.includes(
    normalized as (typeof LATERALIDAD_VALUES)[number]
  )
    ? normalized
    : ''
}

export function WorkerForm({ companies, worker }: WorkerFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const legacyFirstName = worker?.first_name?.trim() || ''
  const legacyLastName = worker?.last_name?.trim() || ''
  const firstNameParts = legacyFirstName ? legacyFirstName.split(/\s+/) : []
  const lastNameParts = legacyLastName ? legacyLastName.split(/\s+/) : []
  const fallbackPrimerNombre = firstNameParts[0] || ''
  const fallbackSegundoNombre = firstNameParts.slice(1).join(' ')
  const fallbackPrimerApellido = lastNameParts[0] || ''
  const fallbackSegundoApellido = lastNameParts.slice(1).join(' ')
  const fallbackSexo =
    worker?.sexo ||
    (worker?.gender === 'M' ? 'hombre' : worker?.gender === 'F' ? 'mujer' : '')
  const legacyBloodType = (worker as Worker & { blood_type?: string | null })
    ?.blood_type

  const [formData, setFormData] = useState({
    company_id: worker?.company_id || '',
    employee_code: worker?.employee_code || '',
    primer_nombre: worker?.primer_nombre || fallbackPrimerNombre,
    segundo_nombre: worker?.segundo_nombre || fallbackSegundoNombre,
    primer_apellido: worker?.primer_apellido || fallbackPrimerApellido,
    segundo_apellido: worker?.segundo_apellido || fallbackSegundoApellido,
    birth_date: worker?.birth_date?.toString().split('T')[0] || '',
    sexo: fallbackSexo,
    grupo_sanguineo: normalizeBloodType(worker?.grupo_sanguineo ?? legacyBloodType),
    lateralidad: normalizeLateralidad(worker?.lateralidad),
    phone: worker?.phone || '',
    email: worker?.email || '',
    address: worker?.address || '',
    department: worker?.department || '',
    position: worker?.position || '',
    puesto_trabajo_ciuo: worker?.puesto_trabajo_ciuo || '',
    hire_date: worker?.hire_date?.toString().split('T')[0] || '',
    status: worker?.status || 'active',
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const first_name = [formData.primer_nombre, formData.segundo_nombre]
        .map((v) => v.trim())
        .filter(Boolean)
        .join(' ')
      const last_name = [formData.primer_apellido, formData.segundo_apellido]
        .map((v) => v.trim())
        .filter(Boolean)
        .join(' ')
      const gender =
        formData.sexo === 'hombre'
          ? 'M'
          : formData.sexo === 'mujer'
            ? 'F'
            : null
      const dataToSave = {
        ...formData,
        first_name,
        last_name,
        birth_date: formData.birth_date || null,
        hire_date: formData.hire_date || null,
        gender,
        sexo: formData.sexo || null,
        lateralidad: normalizeLateralidad(formData.lateralidad) || null,
        grupo_sanguineo: normalizeBloodType(formData.grupo_sanguineo) || null,
        puesto_trabajo_ciuo: formData.puesto_trabajo_ciuo.trim() || null,
      }

      if (worker) {
        await updateWorker(worker.id, dataToSave)
      } else {
        await createWorker(dataToSave)
      }

      router.push('/dashboard/trabajadores')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar el trabajador')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>Datos personales del trabajador</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="primer_nombre">Primer nombre *</Label>
            <Input
              id="primer_nombre"
              value={formData.primer_nombre}
              onChange={(e) => handleChange('primer_nombre', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="segundo_nombre">Segundo nombre</Label>
            <Input
              id="segundo_nombre"
              value={formData.segundo_nombre}
              onChange={(e) => handleChange('segundo_nombre', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="primer_apellido">Primer apellido *</Label>
            <Input
              id="primer_apellido"
              value={formData.primer_apellido}
              onChange={(e) => handleChange('primer_apellido', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="segundo_apellido">Segundo apellido</Label>
            <Input
              id="segundo_apellido"
              value={formData.segundo_apellido}
              onChange={(e) => handleChange('segundo_apellido', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birth_date">Fecha de nacimiento</Label>
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => handleChange('birth_date', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sexo">Sexo</Label>
            <Select
              value={formData.sexo}
              onValueChange={(v) => handleChange('sexo', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hombre">Hombre</SelectItem>
                <SelectItem value="mujer">Mujer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="grupo_sanguineo">Grupo sanguíneo</Label>
            <Select
              value={formData.grupo_sanguineo}
              onValueChange={(v) => handleChange('grupo_sanguineo', v)}
            >
              <SelectTrigger id="grupo_sanguineo">
                <SelectValue placeholder="Seleccionar tipo de sangre" />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lateralidad">Lateralidad</Label>
            <Select
              value={formData.lateralidad}
              onValueChange={(v) => handleChange('lateralidad', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diestro">Diestro</SelectItem>
                <SelectItem value="zurdo">Zurdo</SelectItem>
                <SelectItem value="ambidiestro">Ambidiestro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Dirección</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información Laboral</CardTitle>
          <CardDescription>Datos de empresa, puesto y departamento</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company_id">Empresa *</Label>
            <Select
              value={formData.company_id}
              onValueChange={(v) => handleChange('company_id', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employee_code">Número de Empleado *</Label>
            <Input
              id="employee_code"
              value={formData.employee_code}
              onChange={(e) => handleChange('employee_code', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Cargo / Ocupación</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="puesto_trabajo_ciuo">Puesto de trabajo (CIUO)</Label>
            <Input
              id="puesto_trabajo_ciuo"
              value={formData.puesto_trabajo_ciuo}
              onChange={(e) => handleChange('puesto_trabajo_ciuo', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hire_date">Fecha de Ingreso</Label>
            <Input
              id="hire_date"
              type="date"
              value={formData.hire_date}
              onChange={(e) => handleChange('hire_date', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={(v) => handleChange('status', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
                <SelectItem value="terminated">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Link href="/dashboard/trabajadores">
          <Button type="button" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
        </Link>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {worker ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}
