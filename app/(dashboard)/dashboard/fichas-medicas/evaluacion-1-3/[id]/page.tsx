import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/db'
import { FichaMedicaEvaluacion1 } from '@/lib/models'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer } from 'lucide-react'
import type { FichaEva1SeccionA, FichaEva1SeccionB, FichaEva1SeccionC, FichaEva1SeccionD, FichaEva1SeccionE, FichaEva1SeccionF } from '@/lib/types/ficha-medica-evaluacion-1'
import { REGIONES_EXAMEN_FISICO_CONFIG } from '@/lib/constants/examen-fisico-regional'

function formatDate(iso: string | undefined): string {
  if (!iso) return '-'
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default async function FichaEva1DetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await connectDB()
  const doc = await FichaMedicaEvaluacion1.findById(id).lean()
  if (!doc) notFound()

  const seccionA = doc.seccionA as FichaEva1SeccionA
  const seccionB = doc.seccionB as FichaEva1SeccionB | undefined
  const seccionC = doc.seccionC as FichaEva1SeccionC | undefined
  const seccionD = doc.seccionD as FichaEva1SeccionD | undefined
  const seccionE = doc.seccionE as FichaEva1SeccionE | undefined
  const seccionF = doc.seccionF as FichaEva1SeccionF | undefined
  const est = seccionA.establecimiento
  const usu = seccionA.usuario
  const ap = seccionA.atencion_prioritaria

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/fichas-medicas/evaluacion-1-3">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <Link
          href={`/dashboard/fichas-medicas/evaluacion-1-3/${id}/imprimir`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Ficha - Evaluación Ocupacional 1-3
        </h1>
        <p className="text-muted-foreground">
          Secciones A, B, C, D, E y F
        </p>
      </div>

      <div className="rounded-lg border">
        <div className="border-b bg-muted/50 px-4 py-3 font-medium">
          A. Datos del Establecimiento
        </div>
        <dl className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">Institución del Sistema</dt>
            <dd className="font-medium">{est.institucion_sistema || '-'}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">RUC</dt>
            <dd className="font-medium">{est.ruc || '-'}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">CIIU</dt>
            <dd className="font-medium">{est.ciiu || '-'}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-muted-foreground">Establecimiento / Centro de Trabajo</dt>
            <dd className="font-medium">{est.establecimiento_centro_trabajo || '-'}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Nº Historia Clínica</dt>
            <dd className="font-medium">{est.numero_historia_clinica || '-'}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Nº Archivo</dt>
            <dd className="font-medium">{est.numero_archivo || '-'}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border">
        <div className="border-b bg-muted/50 px-4 py-3 font-medium">
          Datos del Usuario
        </div>
        <dl className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">Primer Apellido</dt>
            <dd className="font-medium">{usu.primer_apellido || '-'}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Segundo Apellido</dt>
            <dd className="font-medium">{usu.segundo_apellido || '-'}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Primer Nombre</dt>
            <dd className="font-medium">{usu.primer_nombre || '-'}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Segundo Nombre</dt>
            <dd className="font-medium">{usu.segundo_nombre || '-'}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border">
        <div className="border-b bg-muted/50 px-4 py-3 font-medium">
          Atención Prioritaria y Datos Demográficos
        </div>
        <dl className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">Atención Prioritaria</dt>
            <dd className="text-sm">
              {[
                ap.embarazada && 'Embarazada',
                ap.persona_discapacidad && 'Persona con Discapacidad',
                ap.enfermedad_catastrofica && 'E. Catastrófica',
                ap.lactancia && 'Lactancia',
                ap.adulto_mayor && 'Adulto Mayor',
              ]
                .filter(Boolean)
                .join(', ') || 'Ninguna'}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Sexo</dt>
            <dd className="font-medium capitalize">{seccionA.sexo || '-'}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Fecha de Nacimiento</dt>
            <dd className="font-medium">{formatDate(seccionA.fecha_nacimiento)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Edad</dt>
            <dd className="font-medium">{seccionA.edad ?? '-'}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Grupo Sanguíneo</dt>
            <dd className="font-medium">{seccionA.grupo_sanguineo || '-'}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Lateralidad</dt>
            <dd className="font-medium capitalize">{seccionA.lateralidad || '-'}</dd>
          </div>
        </dl>
      </div>

      {seccionB && (
        <div className="rounded-lg border">
          <div className="border-b bg-muted/50 px-4 py-3 font-medium">
            B. Motivo de Consulta
          </div>
          <dl className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2">
              <dt className="text-xs text-muted-foreground">Puesto de Trabajo CIUO</dt>
              <dd className="font-medium">{seccionB.puesto_trabajo_ciuo || '-'}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Fecha de Atención</dt>
              <dd className="font-medium">{formatDate(seccionB.fecha_atencion)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Fecha de Ingreso al trabajo</dt>
              <dd className="font-medium">{formatDate(seccionB.fecha_ingreso_trabajo)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Fecha de Reintegro</dt>
              <dd className="font-medium">{formatDate(seccionB.fecha_reintegro)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Último día laboral/salida</dt>
              <dd className="font-medium">{formatDate(seccionB.fecha_ultimo_dia_laboral)}</dd>
            </div>
            <div className="sm:col-span-3">
              <dt className="text-xs text-muted-foreground">Descripción del Motivo</dt>
              <dd className="font-medium">{seccionB.descripcion_motivo || '-'}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Tipo de Evaluación</dt>
              <dd className="font-medium capitalize">{seccionB.tipo_evaluacion || '-'}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Observación</dt>
              <dd className="font-medium">{seccionB.observacion || '-'}</dd>
            </div>
          </dl>
        </div>
      )}

      {seccionC && (
        <div className="rounded-lg border">
          <div className="border-b bg-muted/50 px-4 py-3 font-medium">
            C. Antecedentes Personales
          </div>
          <div className="space-y-6 p-4">
            <div>
              <dt className="text-xs text-muted-foreground">Antecedentes clínicos y quirúrgicos</dt>
              <dd className="mt-1 whitespace-pre-wrap text-sm">{seccionC.antecedentes_clinicos_quirurgicos || '-'}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Antecedentes familiares</dt>
              <dd className="mt-1 whitespace-pre-wrap text-sm">{seccionC.antecedentes_familiares || '-'}</dd>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Transfusiones autoriza</dt>
                <dd className="font-medium capitalize">{seccionC.transfusiones_autoriza || '-'}</dd>
                {seccionC.transfusiones_autoriza === 'no' && seccionC.transfusiones_no_observacion && (
                  <dd className="mt-1 text-sm text-muted-foreground">{seccionC.transfusiones_no_observacion}</dd>
                )}
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Tratamiento hormonal</dt>
                <dd className="font-medium capitalize">{seccionC.tratamiento_hormonal || '-'}</dd>
                {seccionC.tratamiento_hormonal === 'si' && (
                  <dd className="mt-1 text-sm">{seccionC.tratamiento_hormonal_cual || '-'}</dd>
                )}
                {seccionC.tratamiento_hormonal === 'no' && seccionC.tratamiento_hormonal_no_observacion && (
                  <dd className="mt-1 text-sm text-muted-foreground">{seccionC.tratamiento_hormonal_no_observacion}</dd>
                )}
              </div>
            </div>
            {seccionA.sexo === 'mujer' && seccionC.gineco_obstetricos && (
              <div className="rounded border p-4">
                <h4 className="mb-2 font-medium">Antecedentes gineco obstétricos</h4>
                <dl className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div><dt className="text-xs text-muted-foreground">Última menstruación</dt><dd>{formatDate(seccionC.gineco_obstetricos.fecha_ultima_menstruacion)}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Gestas</dt><dd>{seccionC.gineco_obstetricos.gestas ?? '-'}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Partos</dt><dd>{seccionC.gineco_obstetricos.partos ?? '-'}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Cesáreas</dt><dd>{seccionC.gineco_obstetricos.cesareas ?? '-'}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Abortos</dt><dd>{seccionC.gineco_obstetricos.abortos ?? '-'}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Planificación familiar</dt><dd className="capitalize">{String(seccionC.gineco_obstetricos.metodo_planificacion).replace('_', ' ')}</dd></div>
                  {seccionC.gineco_obstetricos.metodo_planificacion === 'si' && (
                    <div><dt className="text-xs text-muted-foreground">¿Cuál?</dt><dd>{seccionC.gineco_obstetricos.metodo_planificacion_cual}</dd></div>
                  )}
                  <div><dt className="text-xs text-muted-foreground">Exámenes realizados</dt><dd>{seccionC.gineco_obstetricos.examenes_realizados || '-'}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Tiempo (años)</dt><dd>{(seccionC.gineco_obstetricos as { examenes_tiempo_anos?: number; examenes_tiempo_meses?: number }).examenes_tiempo_anos ?? (seccionC.gineco_obstetricos as { examenes_tiempo_meses?: number }).examenes_tiempo_meses ?? '-'}</dd></div>
                  {seccionC.gineco_obstetricos.examenes_resultado && (
                    <div className="sm:col-span-2"><dt className="text-xs text-muted-foreground">Resultado</dt><dd className="whitespace-pre-wrap">{seccionC.gineco_obstetricos.examenes_resultado}</dd></div>
                  )}
                </dl>
              </div>
            )}
            {seccionA.sexo === 'hombre' && seccionC.reproductivos_masculinos && (
              <div className="rounded border p-4">
                <h4 className="mb-2 font-medium">Antecedentes reproductivos masculinos</h4>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Exámenes realizados</dt>
                    <dd>
                      {(() => {
                        const rm = seccionC.reproductivos_masculinos as {
                          examenes?: { cual: string; tiempo_anos: number | null }[]
                          examenes_realizados?: string
                          examenes_tiempo_anos?: number | null
                        }
                        if (rm.examenes && rm.examenes.length > 0) {
                          return (
                            <ul className="mt-1 list-inside list-disc space-y-1">
                              {rm.examenes.map((e, i) => (
                                <li key={i}>
                                  {e.cual || '-'}
                                  {e.tiempo_anos != null ? ` (${e.tiempo_anos} años)` : ''}
                                </li>
                              ))}
                            </ul>
                          )
                        }
                        if (rm.examenes_realizados || rm.examenes_tiempo_anos != null) {
                          return `${rm.examenes_realizados || '-'}${rm.examenes_tiempo_anos != null ? ` (${rm.examenes_tiempo_anos} años)` : ''}`
                        }
                        return '-'
                      })()}
                    </dd>
                  </div>
                  <div><dt className="text-xs text-muted-foreground">Planificación familiar</dt><dd className="capitalize">{String(seccionC.reproductivos_masculinos.metodo_planificacion).replace('_', ' ')}</dd></div>
                  {seccionC.reproductivos_masculinos.metodo_planificacion === 'si' && (
                    <div><dt className="text-xs text-muted-foreground">¿Cuál?</dt><dd>{seccionC.reproductivos_masculinos.metodo_planificacion_cual || '-'}</dd></div>
                  )}
                </dl>
              </div>
            )}
            <div className="rounded border p-4">
              <h4 className="mb-2 font-medium">Consumo de sustancias</h4>
              <dl className="space-y-2 text-sm">
                {(['tabaco', 'alcohol'] as const).map((s) => {
                  const d = seccionC.consumo?.[s] as { no_consume?: boolean; tiempo_consumo_meses?: number; tiempo_consumo?: string; ex_consumidor?: boolean; tiempo_abstinencia_meses?: number; tiempo_abstinencia?: string } | undefined
                  const tc = d?.tiempo_consumo_meses ?? (d as { tiempo_consumo?: string })?.tiempo_consumo
                  const ta = d?.tiempo_abstinencia_meses ?? (d as { tiempo_abstinencia?: string })?.tiempo_abstinencia
                  const fmt = (v: number | string | undefined) => (typeof v === 'number' ? `${v} meses` : v)
                  const parts = d?.no_consume ? ['No consume'] : [fmt(tc), d?.ex_consumidor && 'Ex consumidor', ta != null ? `Abstinencia ${fmt(ta)}` : null].filter(Boolean)
                  return <div key={s}>{s === 'tabaco' ? 'Tabaco' : 'Alcohol'}: {parts.join(' · ') || '-'}</div>
                })}
                {seccionC.consumo?.otras_cual && (() => {
                  const d = seccionC.consumo?.otras as { no_consume?: boolean; tiempo_consumo_meses?: number; tiempo_consumo?: string; ex_consumidor?: boolean } | undefined
                  const tc = d?.tiempo_consumo_meses ?? (d as { tiempo_consumo?: string })?.tiempo_consumo
                  const fmt = (v: number | string | undefined) => (typeof v === 'number' ? `${v} meses` : v)
                  const parts = d?.no_consume ? ['No consume'] : [fmt(tc), d?.ex_consumidor && 'Ex consumidor'].filter(Boolean)
                  return <div>Otras ({seccionC.consumo?.otras_cual}): {parts.join(' · ') || '-'}</div>
                })()}
              </dl>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Actividad física</dt>
                <dd className="font-medium">{seccionC.estilo_vida?.actividad_fisica_cual || '-'} {seccionC.estilo_vida?.actividad_fisica_tiempo ? `(${seccionC.estilo_vida.actividad_fisica_tiempo})` : ''}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Medicación habitual</dt>
                <dd className="font-medium">{seccionC.estilo_vida?.medicacion_habitual || '-'}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Condición preexistente</dt>
                <dd className="font-medium">{seccionC.condicion_preexistente?.cual || '-'} {seccionC.condicion_preexistente?.cantidad ? `- ${seccionC.condicion_preexistente.cantidad}` : ''}</dd>
              </div>
            </div>
            {seccionC.observacion && (
              <div>
                <dt className="text-xs text-muted-foreground">Observación</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm">{seccionC.observacion}</dd>
              </div>
            )}
          </div>
        </div>
      )}

      {seccionD && (
        <div className="rounded-lg border">
          <div className="border-b bg-muted/50 px-4 py-3 font-medium">
            D. Enfermedad o Problema Actual
          </div>
          <div className="p-4">
            <dt className="text-xs text-muted-foreground">Descripción</dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm">{seccionD.descripcion || '-'}</dd>
          </div>
        </div>
      )}

      {seccionE && (
        <div className="rounded-lg border">
          <div className="border-b bg-muted/50 px-4 py-3 font-medium">
            E. Constantes Vitales y Antropometría
          </div>
          <dl className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <div><dt className="text-xs text-muted-foreground">Temperatura (°C)</dt><dd className="font-medium">{seccionE.temperatura ?? '-'}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Presión arterial (mmHg)</dt><dd className="font-medium">{seccionE.presion_arterial || '-'}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Frecuencia cardíaca (Lat/min)</dt><dd className="font-medium">{seccionE.frecuencia_cardiaca ?? '-'}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Frecuencia respiratoria (fr/min)</dt><dd className="font-medium">{seccionE.frecuencia_respiratoria ?? '-'}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Saturación de oxígeno (O2%)</dt><dd className="font-medium">{seccionE.saturacion_oxigeno ?? '-'}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Peso (Kg)</dt><dd className="font-medium">{seccionE.peso ?? '-'}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Talla (cm)</dt><dd className="font-medium">{seccionE.talla ?? '-'}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Índice de masa corporal (kg/m²)</dt><dd className="font-medium">{seccionE.imc ?? '-'}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Perímetro abdominal (cm)</dt><dd className="font-medium">{seccionE.perimetro_abdominal ?? '-'}</dd></div>
          </dl>
        </div>
      )}

      {seccionF && (
        <div className="rounded-lg border">
          <div className="border-b bg-muted/50 px-4 py-3 font-medium">
            F. Examen Físico Regional
          </div>
          <div className="p-4 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="w-16 px-3 py-2 text-center font-medium">Nº</th>
                    <th className="w-12 px-2 py-2 text-center font-medium">Letra</th>
                    <th className="px-4 py-2 text-left font-medium">REGIONES</th>
                    <th className="w-24 px-4 py-2 text-center font-medium">Patología</th>
                  </tr>
                </thead>
                <tbody>
                  {seccionF.regiones && REGIONES_EXAMEN_FISICO_CONFIG.map(({ key: regionKey, numero, nombre, items }) =>
                    items.map((item) => {
                      const regionData = seccionF.regiones?.[regionKey] as Record<string, boolean> | undefined
                      const val = regionData?.[item.key] ?? false
                      return (
                        <tr key={`${regionKey}-${String(item.key)}`} className="border-b">
                          <td className="px-3 py-1.5 text-center font-medium">{numero}</td>
                          <td className="px-2 py-1.5 text-center font-medium">{item.letra}.</td>
                          <td className="px-4 py-1.5">{nombre} — {item.descripcion}</td>
                          <td className="px-4 py-1.5 text-center">{val ? 'X' : '-'}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
            {seccionF.descripcion_patologias && (
              <div>
                <dt className="text-xs text-muted-foreground">Descripción de patologías</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm">{seccionF.descripcion_patologias}</dd>
              </div>
            )}
            {seccionF.observacion && (
              <div>
                <dt className="text-xs text-muted-foreground">Observación</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm">{seccionF.observacion}</dd>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
