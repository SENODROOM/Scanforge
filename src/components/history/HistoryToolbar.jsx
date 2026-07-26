import { Download, Search, Trash2 } from 'lucide-react'
import Button from '../ui/Button'
import './history.css'

export default function HistoryToolbar({ query, onQueryChange, onExportCsv, onExportJson, onClear, disabled }) {
  return (
    <div className="history-toolbar">
      <label className="history-toolbar__search">
        <Search size={15} />
        <input
          type="text"
          placeholder="Search scanned values..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </label>
      <div className="history-toolbar__actions">
        <Button variant="ghost" size="sm" icon={Download} onClick={onExportCsv} disabled={disabled}>
          CSV
        </Button>
        <Button variant="ghost" size="sm" icon={Download} onClick={onExportJson} disabled={disabled}>
          JSON
        </Button>
        <Button variant="danger" size="sm" icon={Trash2} onClick={onClear} disabled={disabled}>
          Clear
        </Button>
      </div>
    </div>
  )
}
