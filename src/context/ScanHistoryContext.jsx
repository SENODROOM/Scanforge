import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const ScanHistoryContext = createContext(null)
const STORAGE_KEY = 'scanforge:log'
const MAX_ENTRIES = 500
const DUPLICATE_WINDOW_MS = 3000

export function ScanHistoryProvider({ children }) {
  const [history, setHistory] = useLocalStorage(STORAGE_KEY, [])

  const addScan = useCallback(
    (scan) => {
      setHistory((prev) => {
        const last = prev[0]
        // ignore back-to-back duplicate reads from a live camera feed
        if (last && last.text === scan.text && Date.now() - last.timestamp < DUPLICATE_WINDOW_MS) {
          return prev
        }
        const entry = { id: crypto.randomUUID(), timestamp: Date.now(), ...scan }
        return [entry, ...prev].slice(0, MAX_ENTRIES)
      })
    },
    [setHistory]
  )

  const removeScan = useCallback(
    (id) => {
      setHistory((prev) => prev.filter((item) => item.id !== id))
    },
    [setHistory]
  )

  const clearHistory = useCallback(() => setHistory([]), [setHistory])

  const value = useMemo(
    () => ({ history, addScan, removeScan, clearHistory }),
    [history, addScan, removeScan, clearHistory]
  )

  return <ScanHistoryContext.Provider value={value}>{children}</ScanHistoryContext.Provider>
}

export function useScanHistory() {
  const ctx = useContext(ScanHistoryContext)
  if (!ctx) throw new Error('useScanHistory must be used within a ScanHistoryProvider')
  return ctx
}
