import { useCallback, useEffect, useState } from 'react'

/**
 * Lists available video input devices and manages the camera permission flow.
 * Device labels are only populated by the browser once permission is granted,
 * so we request a throwaway stream first, then enumerate.
 */
export function useCameraDevices() {
  const [devices, setDevices] = useState([])
  const [permissionState, setPermissionState] = useState('idle') // idle | granted | denied
  const [error, setError] = useState(null)

  const requestPermissionAndList = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera access is not supported in this browser')
      return []
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach((track) => track.stop())
      const allDevices = await navigator.mediaDevices.enumerateDevices()
      const videoInputs = allDevices.filter((d) => d.kind === 'videoinput')
      setDevices(videoInputs)
      setPermissionState('granted')
      return videoInputs
    } catch (err) {
      setPermissionState('denied')
      setError(err.message || 'Camera permission was denied')
      return []
    }
  }, [])

  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices) return undefined

    const handleChange = async () => {
      const allDevices = await navigator.mediaDevices.enumerateDevices()
      setDevices(allDevices.filter((d) => d.kind === 'videoinput'))
    }

    navigator.mediaDevices.addEventListener?.('devicechange', handleChange)
    return () => navigator.mediaDevices.removeEventListener?.('devicechange', handleChange)
  }, [])

  return { devices, permissionState, error, requestPermissionAndList }
}
