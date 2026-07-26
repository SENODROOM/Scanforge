import { Camera } from 'lucide-react'
import './scanner.css'

export default function DeviceSelector({ devices, activeDeviceId, onChange, disabled }) {
  if (devices.length === 0) return null

  return (
    <label className="device-selector">
      <Camera size={15} />
      <select value={activeDeviceId || ''} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
        {devices.map((device, i) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${i + 1}`}
          </option>
        ))}
      </select>
    </label>
  )
}
