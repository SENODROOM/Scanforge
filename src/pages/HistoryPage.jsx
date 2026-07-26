import { useMemo, useState } from 'react'
import { useScanHistory } from '../context/ScanHistoryContext'
import HistoryToolbar from '../components/history/HistoryToolbar'
import HistoryTable from '../components/history/HistoryTable'
import EmptyState from '../components/history/EmptyState'
import { exportAsCsv, exportAsJson } from '../utils/exportData'
import './pages.css'

export default function HistoryPage() {
  const { history, removeScan, clearHistory } = useScanHistory()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return history
    const q = query.toLowerCase()
    return history.filter(
      (item) => item.text.toLowerCase().includes(q) || item.formatLabel.toLowerCase().includes(q)
    )
  }, [history, query])

  const handleClear = () => {
    if (window.confirm('Clear all scan history? This cannot be undone.')) {
      clearHistory()
    }
  }

  return (
    <div className="history-page">
      <header className="history-page__header">
        <span className="eyebrow">Manifest</span>
        <h1>Scan log</h1>
        <p>
          {history.length} saved {history.length === 1 ? 'entry' : 'entries'}, stored locally on this device.
        </p>
      </header>

      <HistoryToolbar
        query={query}
        onQueryChange={setQuery}
        onExportCsv={() => exportAsCsv(history)}
        onExportJson={() => exportAsJson(history)}
        onClear={handleClear}
        disabled={history.length === 0}
      />

      {filtered.length === 0 ? (
        <EmptyState message={query ? 'No matching scans' : 'No scans yet'} />
      ) : (
        <HistoryTable items={filtered} onRemove={removeScan} />
      )}
    </div>
  )
}
