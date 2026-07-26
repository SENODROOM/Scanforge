import { Copy, Trash2 } from 'lucide-react'
import Badge from '../ui/Badge'
import { formatTimestamp } from '../../utils/formatTimestamp'
import { useToast } from '../../context/ToastContext'
import './history.css'

export default function HistoryTable({ items, onRemove }) {
  const { pushToast } = useToast()

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text)
    pushToast('Copied to clipboard', 'success')
  }

  return (
    <div className="history-table">
      <div className="history-table__head">
        <span>#</span>
        <span>Value</span>
        <span>Format</span>
        <span>Source</span>
        <span>Scanned</span>
        <span />
      </div>
      {items.map((item, index) => (
        <div className="history-table__row" key={item.id}>
          <span className="history-table__index">{String(items.length - index).padStart(5, '0')}</span>
          <span className="history-table__value" title={item.text}>
            {item.text}
          </span>
          <span>
            <Badge tone="accent">{item.formatLabel}</Badge>
          </span>
          <span className="history-table__source">{item.source}</span>
          <span className="history-table__time">{formatTimestamp(item.timestamp)}</span>
          <span className="history-table__row-actions">
            <button onClick={() => handleCopy(item.text)} aria-label="Copy value">
              <Copy size={14} />
            </button>
            <button onClick={() => onRemove(item.id)} aria-label="Delete entry">
              <Trash2 size={14} />
            </button>
          </span>
        </div>
      ))}
    </div>
  )
}
