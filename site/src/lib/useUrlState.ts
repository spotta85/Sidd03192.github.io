import { useCallback, useEffect, useState } from 'react'

function read(key: string) {
  return new URLSearchParams(window.location.search).get(key)
}

/**
 * Search-param state, so every variant + background combo is a shareable URL
 * and survives a reload. Prototype-grade: no router dependency.
 */
export function useUrlState(key: string, fallback: string) {
  const [value, setValue] = useState(() => read(key) ?? fallback)

  useEffect(() => {
    const sync = () => setValue(read(key) ?? fallback)
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [key, fallback])

  const set = useCallback(
    (next: string) => {
      const params = new URLSearchParams(window.location.search)
      params.set(key, next)
      window.history.replaceState({}, '', `${window.location.pathname}?${params}`)
      setValue(next)
    },
    [key],
  )

  return [value, set] as const
}
