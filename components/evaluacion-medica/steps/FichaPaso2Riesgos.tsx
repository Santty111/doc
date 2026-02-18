'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useDebouncedCallback } from '@/lib/hooks/useDebouncedCallback'
import { Input } from '@/components/ui/input'
import type { Pagina2RiesgosLaborales } from '@/lib/schema-medico-types'
import { FACTORES_RIESGO, type CategoriaRiesgo } from '@/lib/schema-medico-types'

const CATEGORIA_LABEL: Record<CategoriaRiesgo, string> = {
  fisico: 'Físico',
  seguridad_mecanicos: 'Seguridad / Mecánicos',
  quimico: 'Químico',
  biologico: 'Biológico',
  ergonomico: 'Ergonómico',
  psicosocial: 'Psicosocial',
}

interface Props {
  data: Pagina2RiesgosLaborales
  onChange: (data: Pagina2RiesgosLaborales) => void
}

const DEBOUNCE_MS = 250

function FichaPaso2RiesgosInner({ data, onChange }: Props) {
  const [localData, setLocalData] = useState(data)
  const [debouncedOnChange, flush] = useDebouncedCallback(onChange, DEBOUNCE_MS)

  useEffect(() => {
    setLocalData(data)
  }, [data])

  useEffect(() => () => flush(), [flush])

  const matriz = localData.seccion_G_factores_riesgo.matriz

  const setMatriz = useCallback(
    (cat: string, factor: string, value: number | string) => {
      const next = {
        ...localData,
        seccion_G_factores_riesgo: {
          ...localData.seccion_G_factores_riesgo,
          matriz: {
            ...matriz,
            [cat]: {
              ...(matriz[cat] || {}),
              [factor]: value,
            },
          },
        },
      }
      setLocalData(next)
      debouncedOnChange(next)
    },
    [localData, matriz, debouncedOnChange]
  )

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Matriz de exposición laboral actual. Nivel de riesgo 1-7 o Tiempo de exposición.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-border text-sm">
          <thead>
            <tr>
              <th className="border border-border bg-muted p-2 text-left">Categoría</th>
              <th className="border border-border bg-muted p-2 text-left">Factor</th>
              <th className="border border-border bg-muted p-2 w-24">Nivel / Tiempo</th>
            </tr>
          </thead>
          <tbody>
            {(Object.entries(FACTORES_RIESGO) as [CategoriaRiesgo, string[]][]).map(
              ([cat, factores]) =>
                factores.map((factor, i) => (
                  <tr key={cat + factor}>
                    {i === 0 ? (
                      <td
                        className="border border-border p-2 font-medium"
                        rowSpan={factores.length}
                      >
                        {CATEGORIA_LABEL[cat]}
                      </td>
                    ) : null}
                    <td className="border border-border p-2">{factor}</td>
                    <td className="border border-border p-1">
                      <Input
                        type="text"
                        className="h-8 text-center"
                        value={String(matriz[cat]?.[factor] ?? '')}
                        onChange={(e) => setMatriz(cat, factor, e.target.value)}
                      />
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const FichaPaso2Riesgos = React.memo(FichaPaso2RiesgosInner)
