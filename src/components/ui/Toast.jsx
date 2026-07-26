import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import './ui.css'

const ICONS = {
  default: Info,
  success: CheckCircle2,
  error: AlertTriangle
}

export default function Toast({ toast, onDismiss }) {
  const Icon = ICONS[toast.variant] || Info
  return (
    <div className={`toast toast--${toast.variant}`}>
      <Icon size={16} />
      <span>{toast.message}</span>
      <button className="toast__close" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification">
        <X size={14} />
      </button>
    </div>
  )
}
