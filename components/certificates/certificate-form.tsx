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
import type { Certificate, Worker } from '@/lib/types'
import { createCertificate, updateCertificate } from '@/lib/actions'

interface CertificateFormProps {
  workers: (Pick<Worker, 'id' | 'first_name' | 'last_name' | 'employee_code'> & {
    company: { name: string } | null
  })[]
  certificate?: Certificate
  defaultWorkerId?: string
  doctorName?: string
}

export function CertificateForm({
  workers,
  certificate,
  defaultWorkerId,
  doctorName,
}: CertificateFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    worker_id: certificate?.worker_id || defaultWorkerId || '',
    certificate_type: certificate?.certificate_type || 'ingreso',
    issue_date:
      certificate?.issue_date?.toString().split('T')[0] ||
      new Date().toISOString().split('T')[0],
    expiry_date: certificate?.expiry_date?.toString().split('T')[0] || '',
    result: certificate?.result || 'pendiente',
    restrictions: certificate?.restrictions || '',
    recommendations: certificate?.recommendations || '',
    doctor_name: certificate?.doctor_name || doctorName || '',
    doctor_license: certificate?.doctor_license || '',
    observations: certificate?.observations || '',
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
        expiry_date: formData.expiry_date || null,
      }

      if (certificate) {
        await updateCertificate(certificate.id, dataToSave)
      } else {
        await createCertificate(dataToSave)
      }

      router.push('/dashboard/constancias')
      router.refresh()
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Error al guardar la constancia'
      )
    } finally {
      setLoading(false)
    }
  }

  const setDefaultExpiry = () => {
    if (formData.issue_date) {
      const date = new Date(formData.issue_date)
      date.setFullYear(date.getFullYear() + 1)
      handleChange('expiry_date', date.toISOString().split('T')[0])
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
          <CardTitle>Información del Trabajador</CardTitle>
          <CardDescription>Seleccione el trabajador para la constancia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="worker_id">Trabajador *</Label>
            <Select
              value={formData.worker_id}
              onValueChange={(v) => handleChange('worker_id', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar trabajador" />
              </SelectTrigger>
              <SelectContent>
                {workers.map((worker) => (
                  <SelectItem key={worker.id} value={worker.id}>
                    {worker.first_name} {worker.last_name} ({worker.employee_code}) -{' '}
                    {worker.company?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datos de la Constancia</CardTitle>
          <CardDescription>Información del examen médico y resultado</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="certificate_type">Tipo de Examen *</Label>
            <Select
              value={formData.certificate_type}
              onValueChange={(v) => handleChange('certificate_type', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ingreso">Ingreso</SelectItem>
                <SelectItem value="periodico">Periódico</SelectItem>
                <SelectItem value="egreso">Egreso</SelectItem>
                <SelectItem value="especial">Especial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="result">Resultado *</Label>
            <Select
              value={formData.result}
              onValueChange={(v) => handleChange('result', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apto">Apto</SelectItem>
                <SelectItem value="apto_con_restricciones">
                  Apto con Restricciones
                </SelectItem>
                <SelectItem value="no_apto">No Apto</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="issue_date">Fecha de Emisión *</Label>
            <Input
              id="issue_date"
              type="date"
              value={formData.issue_date}
              onChange={(e) => handleChange('issue_date', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiry_date">Fecha de Vigencia</Label>
            <div className="flex gap-2">
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => handleChange('expiry_date', e.target.value)}
              />
              <Button type="button" variant="outline" onClick={setDefaultExpiry}>
                +1 año
              </Button>
            </div>
          </div>
          {formData.result === 'apto_con_restricciones' && (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="restrictions">Restricciones</Label>
              <Textarea
                id="restrictions"
                value={formData.restrictions}
                onChange={(e) => handleChange('restrictions', e.target.value)}
                placeholder="Describa las restricciones laborales..."
                rows={3}
              />
            </div>
          )}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="recommendations">Recomendaciones</Label>
            <Textarea
              id="recommendations"
              value={formData.recommendations}
              onChange={(e) => handleChange('recommendations', e.target.value)}
              placeholder="Recomendaciones médicas para el trabajador..."
              rows={3}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="observations">Observaciones</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => handleChange('observations', e.target.value)}
              placeholder="Observaciones adicionales..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Médico Responsable</CardTitle>
          <CardDescription>Datos del médico que emite la constancia</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="doctor_name">Nombre del Médico</Label>
            <Input
              id="doctor_name"
              value={formData.doctor_name}
              onChange={(e) => handleChange('doctor_name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor_license">Cédula Profesional</Label>
            <Input
              id="doctor_license"
              value={formData.doctor_license}
              onChange={(e) => handleChange('doctor_license', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Link href="/dashboard/constancias">
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
          {certificate ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}
