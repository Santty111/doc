'use client'

import { useCallback, useRef, useEffect } from 'react'

/**
 * Devuelve una versión debounced del callback y una función flush para ejecutar
 * de inmediato el último valor pendiente (útil al cambiar de paso o desmontar).
 */
export function useDebouncedCallback<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delayMs: number
): [T, () => void] {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingArgsRef = useRef<Parameters<T> | null>(null)
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (pendingArgsRef.current) {
      const args = pendingArgsRef.current
      pendingArgsRef.current = null
      callbackRef.current(...args)
    }
  }, [])

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      pendingArgsRef.current = args
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null
        pendingArgsRef.current = null
        callbackRef.current(...args)
      }, delayMs)
    },
    [delayMs]
  ) as T

  useEffect(() => () => flush(), [flush])

  return [debounced, flush]
}
