import { useCallback, useEffect, useState } from 'react'

/**
 * Persist a piece of state to localStorage.
 * Falls back gracefully if storage is unavailable (private mode, quota, etc).
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage full or unavailable — fail silently, state still works in-memory
    }
  }, [key, value])

  const updateValue = useCallback((next) => {
    setValue((prev) => (typeof next === 'function' ? next(prev) : next))
  }, [])

  return [value, updateValue]
}
