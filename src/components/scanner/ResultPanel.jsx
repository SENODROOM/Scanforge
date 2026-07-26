import { useState } from 'react'
import { Check, Copy, ScanLine } from 'lucide-react'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import { formatTimestamp } from '../../utils/formatTimestamp'
import './scanner.css'

export default function ResultPanel({ result }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Card className="result-panel">
      <span className="eyebrow">Result slip</span>

      {!result ? (
        <div className="result-panel__empty">
          <ScanLine size={26} />
          <p>No read yet — point a camera or drop an image to begin.</p>
        </div>
      ) : (
        <>
          <div className="result-panel__head">
            <Badge tone="accent">{result.formatLabel}</Badge>
            <span className="result-panel__time">{formatTimestamp(result.timestamp)}</span>
          </div>
          <p className="result-panel__text">{result.text}</p>
          <button className="result-panel__copy" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy value'}
          </button>
        </>
      )}
    </Card>
  )
}
