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

export function WorkerForm({ companies, worker }: WorkerFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    company_id: worker?.company_id || '',
    employee_code: worker?.employee_code || '',
    first_name: worker?.first_name || '',
    last_name: worker?.last_name || '',
    birth_date: worker?.birth_date?.toString().split('T')[0] || '',
    gender: worker?.gender || '',
    curp: worker?.curp || '',
    rfc: worker?.rfc || '',
    nss: worker?.nss || '',
    phone: worker?.phone || '',
    email: worker?.email || '',
    address: worker?.address || '',
    department: worker?.department || '',
    position: worker?.position || '',
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
      const dataToSave = {
        ...formData,
        birth_date: formData.birth_date || null,
        hire_date: formData.hire_date || null,
        gender: formData.gender || null,
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
          {/* rest of form unchanged - same as before */}
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
            <Label htmlFor="first_name">Nombre(s) *</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Apellidos *</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => handleChange('birth_date', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Género</Label>
            <Select
              value={formData.gender}
              onValueChange={(v) => handleChange('gender', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Femenino</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="curp">CURP</Label>
            <Input
              id="curp"
              value={formData.curp}
              onChange={(e) =>
                handleChange('curp', e.target.value.toUpperCase())
              }
              maxLength={18}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rfc">RFC</Label>
            <Input
              id="rfc"
              value={formData.rfc}
              onChange={(e) =>
                handleChange('rfc', e.target.value.toUpperCase())
              }
              maxLength={13}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nss">NSS (IMSS)</Label>
            <Input
              id="nss"
              value={formData.nss}
              onChange={(e) => handleChange('nss', e.target.value)}
              maxLength={11}
            />
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
          <CardDescription>Datos del puesto y departamento</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Puesto</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
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
