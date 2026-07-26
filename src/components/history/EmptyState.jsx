import { ScanLine } from 'lucide-react'
import './history.css'

export default function EmptyState({ message = 'No scans yet' }) {
  return (
    <div className="empty-state">
      <ScanLine size={30} />
      <p>{message}</p>
      <span>Scanned barcodes and QR codes will show up here.</span>
    </div>
  )
}
