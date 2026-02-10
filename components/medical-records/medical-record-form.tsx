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
import type { MedicalRecord, Worker } from '@/lib/types'
import { createMedicalRecord, updateMedicalRecord } from '@/lib/actions'

interface MedicalRecordFormProps {
  workers: (Pick<Worker, 'id' | 'first_name' | 'last_name' | 'employee_code'> & {
    company: { name: string } | null
  })[]
  record?: MedicalRecord
  defaultWorkerId?: string
}

export function MedicalRecordForm({
  workers,
  record,
  defaultWorkerId,
}: MedicalRecordFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    worker_id: record?.worker_id || defaultWorkerId || '',
    record_date:
      record?.record_date?.toString().split('T')[0] ||
      new Date().toISOString().split('T')[0],
    medical_history: record?.medical_history || '',
    family_history: record?.family_history || '',
    allergies: record?.allergies || '',
    current_medications: record?.current_medications || '',
    blood_type: record?.blood_type || '',
    height_cm: record?.height_cm?.toString() || '',
    weight_kg: record?.weight_kg?.toString() || '',
    blood_pressure: record?.blood_pressure || '',
    heart_rate: record?.heart_rate?.toString() || '',
    observations: record?.observations || '',
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
        worker_id: formData.worker_id,
        record_date: formData.record_date,
        medical_history: formData.medical_history || null,
        family_history: formData.family_history || null,
        allergies: formData.allergies || null,
        current_medications: formData.current_medications || null,
        blood_type: formData.blood_type || null,
        height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        blood_pressure: formData.blood_pressure || null,
        heart_rate: formData.heart_rate ? parseInt(formData.heart_rate) : null,
        observations: formData.observations || null,
      }

      if (record) {
        await updateMedicalRecord(record.id, dataToSave)
      } else {
        await createMedicalRecord(dataToSave)
      }

      router.push('/dashboard/expedientes')
      router.refresh()
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Error al guardar el expediente'
      )
    } finally {
      setLoading(false)
    }
  }

  const calculateBMI = () => {
    if (formData.height_cm && formData.weight_kg) {
      const heightM = parseFloat(formData.height_cm) / 100
      const weight = parseFloat(formData.weight_kg)
      const bmi = weight / (heightM * heightM)
      return bmi.toFixed(1)
    }
    return null
  }

  const bmi = calculateBMI()

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
          <CardDescription>Seleccione el trabajador para el expediente</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
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
                    {worker.first_name} {worker.last_name} ({worker.employee_code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="record_date">Fecha de Registro *</Label>
            <Input
              id="record_date"
              type="date"
              value={formData.record_date}
              onChange={(e) => handleChange('record_date', e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Antecedentes Médicos</CardTitle>
          <CardDescription>Historia clínica y antecedentes personales</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="medical_history">Antecedentes Personales Patológicos</Label>
            <Textarea
              id="medical_history"
              value={formData.medical_history}
              onChange={(e) => handleChange('medical_history', e.target.value)}
              placeholder="Enfermedades previas, cirugías, hospitalizaciones..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="family_history">Antecedentes Familiares</Label>
            <Textarea
              id="family_history"
              value={formData.family_history}
              onChange={(e) => handleChange('family_history', e.target.value)}
              placeholder="Enfermedades hereditarias en la familia..."
              rows={3}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="allergies">Alergias</Label>
              <Textarea
                id="allergies"
                value={formData.allergies}
                onChange={(e) => handleChange('allergies', e.target.value)}
                placeholder="Alergias a medicamentos, alimentos, etc..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_medications">Medicamentos Actuales</Label>
              <Textarea
                id="current_medications"
                value={formData.current_medications}
                onChange={(e) =>
                  handleChange('current_medications', e.target.value)
                }
                placeholder="Medicamentos que toma actualmente..."
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Signos Vitales y Medidas</CardTitle>
          <CardDescription>Datos de la exploración física</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="blood_type">Tipo de Sangre</Label>
            <Select
              value={formData.blood_type}
              onValueChange={(v) => handleChange('blood_type', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="height_cm">Estatura (cm)</Label>
            <Input
              id="height_cm"
              type="number"
              step="0.1"
              value={formData.height_cm}
              onChange={(e) => handleChange('height_cm', e.target.value)}
              placeholder="170"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight_kg">Peso (kg)</Label>
            <Input
              id="weight_kg"
              type="number"
              step="0.1"
              value={formData.weight_kg}
              onChange={(e) => handleChange('weight_kg', e.target.value)}
              placeholder="70"
            />
          </div>
          {bmi && (
            <div className="space-y-2">
              <Label>IMC (Calculado)</Label>
              <div className="flex h-10 items-center rounded-md border border-input bg-secondary px-3 text-sm">
                {bmi} kg/m²
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="blood_pressure">Presión Arterial</Label>
            <Input
              id="blood_pressure"
              value={formData.blood_pressure}
              onChange={(e) => handleChange('blood_pressure', e.target.value)}
              placeholder="120/80"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heart_rate">Frecuencia Cardíaca (lpm)</Label>
            <Input
              id="heart_rate"
              type="number"
              value={formData.heart_rate}
              onChange={(e) => handleChange('heart_rate', e.target.value)}
              placeholder="72"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Observaciones</CardTitle>
          <CardDescription>Notas adicionales del expediente</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id="observations"
            value={formData.observations}
            onChange={(e) => handleChange('observations', e.target.value)}
            placeholder="Observaciones generales..."
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Link href="/dashboard/expedientes">
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
          {record ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}
