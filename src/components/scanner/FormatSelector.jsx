import { BARCODE_FORMATS } from '../../utils/barcodeFormats'
import './scanner.css'

export default function FormatSelector({ activeFormats, onToggle, onSelectAll, onSelectNone }) {
  return (
    <div className="format-selector">
      <div className="format-selector__header">
        <span>Formats to detect</span>
        <div className="format-selector__actions">
          <button type="button" onClick={onSelectAll}>
            All
          </button>
          <button type="button" onClick={onSelectNone}>
            None
          </button>
        </div>
      </div>
      <div className="format-selector__chips">
        {BARCODE_FORMATS.map((format) => {
          const isActive = activeFormats.includes(format.value)
          return (
            <button
              key={format.value}
              type="button"
              className={`format-chip ${isActive ? 'format-chip--active' : ''}`}
              onClick={() => onToggle(format.value)}
              aria-pressed={isActive}
            >
              {format.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
