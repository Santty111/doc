'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import { CONCEPTO_APTITUD_LABELS } from '@/lib/types'
import { saveMinistryFormData } from '@/lib/actions'
import { REVISION_SISTEMAS_LABELS } from './ministry-print-types'

const defaultRevision = () => ({ estado: 'normal' as const, observacion: '' })
const defaultAntecedente = () => ({ empresa: '', puesto: '', tiempo: '', riesgos: '' })
const defaultAccidente = () => ({ tipo: '', fecha: '', observaciones: '' })

function emptyForm(worker?: {
  first_name?: string
  last_name?: string
  gender?: string
  position?: string
  blood_type?: string
  birth_date?: string | null
  lateralidad?: string | null
}): Record<string, unknown> {
  const edad = worker?.birth_date
    ? Math.floor((Date.now() - new Date(worker.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null
  return {
    empresa_razon_social: '',
    empresa_ruc: '',
    empresa_ciiu: '',
    empresa_establecimiento: '',
    nro_historia_clinica: '',
    nro_archivo: '',
    usuario_apellidos: worker?.last_name ?? '',
    usuario_nombres: worker?.first_name ?? '',
    usuario_sexo: worker?.gender ?? '',
    usuario_cargo: worker?.position ?? '',
    usuario_grupo_sanguineo: worker?.blood_type ?? '',
    usuario_fecha_nacimiento: worker?.birth_date ?? null,
    usuario_edad: edad,
    usuario_lateralidad: worker?.lateralidad ?? '',
    grupos_prioritarios_embarazo: false,
    grupos_prioritarios_discapacidad: false,
    grupos_prioritarios_catastrofica: false,
    grupos_prioritarios_lactancia: false,
    grupos_prioritarios_adulto_mayor: false,
    revision_ojos: defaultRevision(),
    revision_oidos: defaultRevision(),
    revision_oro_faringe: defaultRevision(),
    revision_cuello: defaultRevision(),
    revision_torax: defaultRevision(),
    revision_abdomen: defaultRevision(),
    revision_columna: defaultRevision(),
    revision_extremidades: defaultRevision(),
    revision_neurologico: defaultRevision(),
    riesgo_fisicos: '',
    riesgo_mecanicos: '',
    riesgo_quimicos: '',
    riesgo_biologicos: '',
    riesgo_ergonomicos: '',
    riesgo_psicosociales: '',
    antecedentes_laborales: [defaultAntecedente()],
    accidentes_enfermedades: [defaultAccidente()],
    concepto_aptitud: null,
    recomendaciones: '',
    firma_profesional_nombre: '',
    firma_profesional_codigo: '',
    firma_trabajador: false,
  }
}

export function MinistryForm({
  initialData,
  worker,
  company,
  workerId,
  medicalRecordId,
  certificateId,
  onSaved,
}: {
  initialData?: Record<string, unknown> | null
  worker?: {
    first_name?: string
    last_name?: string
    gender?: string
    position?: string
    blood_type?: string
    birth_date?: string | null
    lateralidad?: string | null
  }
  company?: { name?: string; razon_social?: string; ruc?: string; ciiu?: string; establecimiento?: string }
  workerId: string
  medicalRecordId?: string | null
  certificateId?: string | null
  onSaved?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    if (initialData) {
      const d = { ...initialData }
      if (d._id && !d.id) d.id = d._id
      if (d.usuario_fecha_nacimiento && typeof d.usuario_fecha_nacimiento === 'string') {
        const birth = new Date(d.usuario_fecha_nacimiento)
        if (!isNaN(birth.getTime()))
          d.usuario_edad = Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      }
      return d
    }
    const base = emptyForm(worker)
    if (company) {
      base.empresa_razon_social = company.razon_social ?? company.name ?? ''
      base.empresa_ruc = company.ruc ?? ''
      base.empresa_ciiu = company.ciiu ?? ''
      base.empresa_establecimiento = company.establecimiento ?? ''
    }
    return base
  })

  const set = (key: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const setRevision = (key: string, field: 'estado' | 'observacion', value: string) => {
    setFormData((prev) => {
      const r = (prev[key] as { estado: string; observacion: string }) || defaultRevision()
      return { ...prev, [key]: { ...r, [field]: value } }
    })
  }

  const addAntecedente = () => {
    setFormData((prev) => ({
      ...prev,
      antecedentes_laborales: [...(prev.antecedentes_laborales as object[]), defaultAntecedente()],
    }))
  }
  const setAntecedente = (i: number, field: string, value: string) => {
    setFormData((prev) => {
      const arr = [...(prev.antecedentes_laborales as Record<string, string>[])]
      arr[i] = { ...arr[i], [field]: value }
      return { ...prev, antecedentes_laborales: arr }
    })
  }
  const removeAntecedente = (i: number) => {
    setFormData((prev) => ({
      ...prev,
      antecedentes_laborales: (prev.antecedentes_laborales as object[]).filter((_, idx) => idx !== i),
    }))
  }

  const addAccidente = () => {
    setFormData((prev) => ({
      ...prev,
      accidentes_enfermedades: [...(prev.accidentes_enfermedades as object[]), defaultAccidente()],
    }))
  }
  const setAccidente = (i: number, field: string, value: string) => {
    setFormData((prev) => {
      const arr = [...(prev.accidentes_enfermedades as Record<string, string>[])]
      arr[i] = { ...arr[i], [field]: value }
      return { ...prev, accidentes_enfermedades: arr }
    })
  }
  const removeAccidente = (i: number) => {
    setFormData((prev) => ({
      ...prev,
      accidentes_enfermedades: (prev.accidentes_enfermedades as object[]).filter((_, idx) => idx !== i),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = {
        ...formData,
        worker_id: workerId,
        medical_record_id: medicalRecordId || null,
        certificate_id: certificateId || null,
      }
      await saveMinistryFormData(payload)
      onSaved?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const revisionKeys = Object.keys(REVISION_SISTEMAS_LABELS)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
      )}
      <Tabs defaultValue="cabecera">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cabecera">Cabecera</TabsTrigger>
          <TabsTrigger value="revision">Revisión sistemas</TabsTrigger>
          <TabsTrigger value="riesgos">Factores riesgo</TabsTrigger>
          <TabsTrigger value="historia">Historia / Certificado</TabsTrigger>
        </TabsList>
        <TabsContent value="cabecera">
          <Card>
            <CardHeader><CardTitle>Cabecera (Empresa y Usuario)</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label>Razón Social</Label>
                <Input
                  value={String(formData.empresa_razon_social ?? '')}
                  onChange={(e) => set('empresa_razon_social', e.target.value)}
                />
              </div>
              <div><Label>RUC</Label><Input value={String(formData.empresa_ruc ?? '')} onChange={(e) => set('empresa_ruc', e.target.value)} /></div>
              <div><Label>CIIU</Label><Input value={String(formData.empresa_ciiu ?? '')} onChange={(e) => set('empresa_ciiu', e.target.value)} /></div>
              <div><Label>Establecimiento</Label><Input value={String(formData.empresa_establecimiento ?? '')} onChange={(e) => set('empresa_establecimiento', e.target.value)} /></div>
              <div><Label>Nro Historia Clínica</Label><Input value={String(formData.nro_historia_clinica ?? '')} onChange={(e) => set('nro_historia_clinica', e.target.value)} /></div>
              <div><Label>Nro Archivo</Label><Input value={String(formData.nro_archivo ?? '')} onChange={(e) => set('nro_archivo', e.target.value)} /></div>
              <div><Label>Apellidos</Label><Input value={String(formData.usuario_apellidos ?? '')} onChange={(e) => set('usuario_apellidos', e.target.value)} /></div>
              <div><Label>Nombres</Label><Input value={String(formData.usuario_nombres ?? '')} onChange={(e) => set('usuario_nombres', e.target.value)} /></div>
              <div><Label>Sexo</Label>
                <Select value={String(formData.usuario_sexo ?? '')} onValueChange={(v) => set('usuario_sexo', v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Cargo</Label><Input value={String(formData.usuario_cargo ?? '')} onChange={(e) => set('usuario_cargo', e.target.value)} /></div>
              <div><Label>Grupo Sanguíneo</Label>
                <Select value={String(formData.usuario_grupo_sanguineo ?? '')} onValueChange={(v) => set('usuario_grupo_sanguineo', v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Fecha Nacimiento</Label><Input type="date" value={formData.usuario_fecha_nacimiento ? String(formData.usuario_fecha_nacimiento).slice(0,10) : ''} onChange={(e) => { set('usuario_fecha_nacimiento', e.target.value || null); const d = e.target.value; if (d) set('usuario_edad', Math.floor((Date.now() - new Date(d).getTime()) / (365.25*24*60*60*1000))); }} /></div>
              <div><Label>Edad</Label><Input type="number" value={String(formData.usuario_edad ?? '')} onChange={(e) => set('usuario_edad', e.target.value ? parseInt(e.target.value,10) : null)} /></div>
              <div><Label>Lateralidad</Label>
                <Select value={String(formData.usuario_lateralidad ?? '')} onValueChange={(v) => set('usuario_lateralidad', v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="derecho">Derecho</SelectItem>
                    <SelectItem value="izquierdo">Izquierdo</SelectItem>
                    <SelectItem value="ambidiestro">Ambidiestro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Grupos Prioritarios</Label>
                <div className="flex flex-wrap gap-4 pt-2">
                  {(['embarazo','discapacidad','catastrofica','lactancia','adulto_mayor'] as const).map((g) => (
                    <label key={g} className="flex items-center gap-2">
                      <Checkbox checked={Boolean(formData[`grupos_prioritarios_${g}`])} onCheckedChange={(c) => set(`grupos_prioritarios_${g}`, !!c)} />
                      <span className="capitalize">{g.replace('_',' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="revision">
          <Card>
            <CardHeader><CardTitle>Revisión por Sistemas</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {revisionKeys.map((key) => {
                const r = (formData[key] as { estado?: string; observacion?: string }) || defaultRevision()
                return (
                  <div key={key} className="grid gap-2 md:grid-cols-3 border-b pb-3">
                    <Label className="md:col-span-1">{REVISION_SISTEMAS_LABELS[key]}</Label>
                    <Select value={r.estado ?? 'normal'} onValueChange={(v) => setRevision(key, 'estado', v)}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="normal">Normal</SelectItem><SelectItem value="anormal">Anormal</SelectItem></SelectContent>
                    </Select>
                    <Input placeholder="Observación" value={r.observacion ?? ''} onChange={(e) => setRevision(key, 'observacion', e.target.value)} />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="riesgos">
          <Card>
            <CardHeader><CardTitle>Factores de Riesgo</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {(['fisicos','mecanicos','quimicos','biologicos','ergonomicos','psicosociales'] as const).map((r) => (
                <div key={r}>
                  <Label className="capitalize">{r}</Label>
                  <Textarea value={String(formData[`riesgo_${r}`] ?? '')} onChange={(e) => set(`riesgo_${r}`, e.target.value)} rows={2} className="mt-1" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="historia">
          <Card>
            <CardHeader><CardTitle>Antecedentes Laborales</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {(formData.antecedentes_laborales as Record<string, string>[]).map((a, i) => (
                <div key={i} className="grid gap-2 grid-cols-5 items-end">
                  <Input placeholder="Empresa" value={a.empresa} onChange={(e) => setAntecedente(i, 'empresa', e.target.value)} />
                  <Input placeholder="Puesto" value={a.puesto} onChange={(e) => setAntecedente(i, 'puesto', e.target.value)} />
                  <Input placeholder="Tiempo" value={a.tiempo} onChange={(e) => setAntecedente(i, 'tiempo', e.target.value)} />
                  <Input placeholder="Riesgos" value={a.riesgos} onChange={(e) => setAntecedente(i, 'riesgos', e.target.value)} />
                  <Button type="button" variant="outline" size="icon" onClick={() => removeAntecedente(i)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addAntecedente}><Plus className="mr-2 h-4 w-4" />Añadir</Button>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader><CardTitle>Accidentes / Enfermedades</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {(formData.accidentes_enfermedades as Record<string, string>[]).map((a, i) => (
                <div key={i} className="grid gap-2 grid-cols-4 items-end">
                  <Input placeholder="Tipo" value={a.tipo} onChange={(e) => setAccidente(i, 'tipo', e.target.value)} />
                  <Input placeholder="Fecha" value={a.fecha} onChange={(e) => setAccidente(i, 'fecha', e.target.value)} />
                  <Input placeholder="Observaciones" value={a.observaciones} onChange={(e) => setAccidente(i, 'observaciones', e.target.value)} />
                  <Button type="button" variant="outline" size="icon" onClick={() => removeAccidente(i)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addAccidente}><Plus className="mr-2 h-4 w-4" />Añadir</Button>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader><CardTitle>Concepto de Aptitud y Firmas</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Concepto de Aptitud</Label>
                <RadioGroup value={String(formData.concepto_aptitud ?? '')} onValueChange={(v) => set('concepto_aptitud', v || null)} className="flex flex-wrap gap-4 pt-2">
                  {(Object.keys(CONCEPTO_APTITUD_LABELS) as (keyof typeof CONCEPTO_APTITUD_LABELS)[]).map((k) => (
                    <label key={k} className="flex items-center gap-2">
                      <RadioGroupItem value={k} />
                      {CONCEPTO_APTITUD_LABELS[k]}
                    </label>
                  ))}
                </RadioGroup>
              </div>
              <div><Label>Recomendaciones</Label><Textarea value={String(formData.recomendaciones ?? '')} onChange={(e) => set('recomendaciones', e.target.value)} rows={4} /></div>
              <div className="grid gap-4 md:grid-cols-2">
                <div><Label>Firma Profesional (Nombre)</Label><Input value={String(formData.firma_profesional_nombre ?? '')} onChange={(e) => set('firma_profesional_nombre', e.target.value)} /></div>
                <div><Label>Código Profesional</Label><Input value={String(formData.firma_profesional_codigo ?? '')} onChange={(e) => set('firma_profesional_codigo', e.target.value)} /></div>
              </div>
              <label className="flex items-center gap-2">
                <Checkbox checked={Boolean(formData.firma_trabajador)} onCheckedChange={(c) => set('firma_trabajador', !!c)} />
                Firma del Trabajador registrada
              </label>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Guardar
        </Button>
      </div>
    </form>
  )
}
