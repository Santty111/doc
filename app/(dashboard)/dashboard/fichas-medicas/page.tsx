import Link from 'next/link'
import { ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'

const HOJAS = [
  {
    id: 'evaluacion-1-3',
    title: 'Evaluación Ocupacional 1-3',
    description: 'Formulario de evaluación médica ocupacional - Parte 1',
    href: '/dashboard/fichas-medicas/evaluacion-1-3',
    available: true,
  },
  {
    id: 'evaluacion-2-3',
    title: 'Evaluación Ocupacional 2-3',
    description: 'Formulario de evaluación médica ocupacional - Parte 2',
    href: '/dashboard/fichas-medicas/evaluacion-2-3',
    available: false,
  },
  {
    id: 'evaluacion-3-3',
    title: 'Evaluación Ocupacional 3-3',
    description: 'Formulario de evaluación médica ocupacional - Parte 3',
    href: '/dashboard/fichas-medicas/evaluacion-3-3',
    available: false,
  },
  {
    id: 'certificado',
    title: 'Certificado',
    description: 'Certificado de la ficha médica',
    href: '/dashboard/fichas-medicas/certificado',
    available: false,
  },
] as const

export default async function FichasMedicasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Fichas Médicas</h1>
        <p className="text-muted-foreground">
          Formularios de evaluación médica ocupacional (4 hojas)
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HOJAS.map((hoja) => (
          <div
            key={hoja.id}
            className={`rounded-lg border p-6 ${
              hoja.available
                ? 'border-border bg-card hover:bg-accent/50'
                : 'border-dashed bg-muted/30 opacity-75'
            }`}
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-semibold text-foreground">{hoja.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {hoja.description}
            </p>
            {hoja.available ? (
              <Link href={hoja.href} className="mt-4 block">
                <Button variant="outline" size="sm">
                  Ver fichas
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                disabled
              >
                Próximamente
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
