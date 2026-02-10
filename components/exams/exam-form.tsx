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
import { Loader2, Save, ArrowLeft, Upload, X } from 'lucide-react'
import Link from 'next/link'
import type { MedicalExam, Worker } from '@/lib/types'
import { EXAM_TYPES } from '@/lib/types'
import { createMedicalExam, updateMedicalExam } from '@/lib/actions'

interface ExamFormProps {
  workers: (Pick<Worker, 'id' | 'first_name' | 'last_name' | 'employee_code'> & {
    company: { name: string } | null
  })[]
  exam?: MedicalExam
  defaultWorkerId?: string
}

export function ExamForm({
  workers,
  exam,
  defaultWorkerId,
}: ExamFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    worker_id: exam?.worker_id || defaultWorkerId || '',
    exam_type: exam?.exam_type || '',
    exam_date:
      exam?.exam_date?.toString().split('T')[0] ||
      new Date().toISOString().split('T')[0],
    lab_name: exam?.lab_name || '',
    results: exam?.results || '',
    observations: exam?.observations || '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0])
  }

  const removeFile = () => setFile(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let fileUrl = exam?.file_url || null
      let fileName = exam?.file_name || null

      if (file) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('workerId', formData.worker_id || '')
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (res.ok) {
          const data = await res.json()
          fileUrl = data.url
          fileName = data.fileName
        }
      }

      const dataToSave = {
        worker_id: formData.worker_id,
        exam_type: formData.exam_type,
        exam_date: formData.exam_date,
        lab_name: formData.lab_name || null,
        results: formData.results || null,
        observations: formData.observations || null,
        file_url: fileUrl,
        file_name: fileName,
      }

      if (exam) {
        await updateMedicalExam(exam.id, dataToSave)
      } else {
        await createMedicalExam(dataToSave)
      }

      router.push('/dashboard/examenes')
      router.refresh()
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Error al guardar el examen'
      )
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
          <CardTitle>Información del Examen</CardTitle>
          <CardDescription>Datos del estudio o examen médico</CardDescription>
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
            <Label htmlFor="exam_type">Tipo de Examen *</Label>
            <Select
              value={formData.exam_type}
              onValueChange={(v) => handleChange('exam_type', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {EXAM_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="exam_date">Fecha del Examen *</Label>
            <Input
              id="exam_date"
              type="date"
              value={formData.exam_date}
              onChange={(e) => handleChange('exam_date', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lab_name">Laboratorio / Clínica</Label>
            <Input
              id="lab_name"
              value={formData.lab_name}
              onChange={(e) => handleChange('lab_name', e.target.value)}
              placeholder="Nombre del laboratorio"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultados</CardTitle>
          <CardDescription>Detalle de los resultados del examen</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="results">Resultados del Examen</Label>
            <Textarea
              id="results"
              value={formData.results}
              onChange={(e) => handleChange('results', e.target.value)}
              placeholder="Describa los resultados del examen..."
              rows={4}
            />
          </div>
          <div className="space-y-2">
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
          <CardTitle>Archivo Adjunto</CardTitle>
          <CardDescription>Adjunte el documento del examen (PDF, imagen)</CardDescription>
        </CardHeader>
        <CardContent>
          {file ? (
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary/50">
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">Haga clic para seleccionar un archivo</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  PDF, JPG o PNG (máx. 10MB)
                </p>
              </div>
            </div>
          )}
          {exam?.file_url && !file && (
            <div className="mt-4 rounded-lg bg-secondary p-4">
              <p className="text-sm text-muted-foreground">
                Archivo actual: {exam.file_name || 'Archivo adjunto'}
              </p>
              <a
                href={exam.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Ver archivo actual
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Link href="/dashboard/examenes">
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
          {exam ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}
