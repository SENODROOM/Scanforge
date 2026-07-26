import { useCallback, useState } from 'react'
import QRCode from 'qrcode'

/**
 * Wraps the `qrcode` package to render a QR code onto a canvas element and
 * to produce a standalone SVG string for download. Colors are intentionally
 * fixed to black-on-white by callers for real-world scan reliability — this
 * hook stays agnostic and just forwards whatever options it's given.
 */
export function useQrGenerator() {
  const [error, setError] = useState(null)

  const renderToCanvas = useCallback(async (canvas, text, options) => {
    if (!canvas || !text) return
    setError(null)
    try {
      await QRCode.toCanvas(canvas, text, options)
    } catch (err) {
      const message = err?.message || 'Unable to generate a QR code for this text'
      setError(message)
      throw err
    }
  }, [])

  const toSvgString = useCallback(async (text, options) => {
    return QRCode.toString(text, { ...options, type: 'svg' })
  }, [])

  return { renderToCanvas, toSvgString, error }
}
