// Center-logo overlay for generated QR codes. Kept separate from the qrcode
// wrapper hook since it's pure canvas/SVG post-processing, not QR generation.

const LOGO_SIZE_RATIO = 0.22
const LOGO_PADDING_RATIO = 0.18
const LOGO_CORNER_RATIO = 0.18

export function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Unable to load that image'))
    img.src = dataUrl
  })
}

function roundedRectPath(ctx, x, y, size, radius) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + size, y, x + size, y + size, radius)
  ctx.arcTo(x + size, y + size, x, y + size, radius)
  ctx.arcTo(x, y + size, x, y, radius)
  ctx.arcTo(x, y, x + size, y, radius)
  ctx.closePath()
}

export function drawLogoOnCanvas(canvas, image) {
  const ctx = canvas.getContext('2d')
  const canvasSize = canvas.width
  const logoSize = canvasSize * LOGO_SIZE_RATIO
  const padding = logoSize * LOGO_PADDING_RATIO
  const boxSize = logoSize + padding * 2
  const boxOrigin = (canvasSize - boxSize) / 2

  ctx.fillStyle = '#ffffff'
  roundedRectPath(ctx, boxOrigin, boxOrigin, boxSize, boxSize * LOGO_CORNER_RATIO)
  ctx.fill()

  const scale = Math.min(logoSize / image.width, logoSize / image.height)
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  ctx.drawImage(
    image,
    (canvasSize - drawWidth) / 2,
    (canvasSize - drawHeight) / 2,
    drawWidth,
    drawHeight
  )
}

export function embedLogoInSvg(svgMarkup, dataUrl) {
  const viewBoxMatch = svgMarkup.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)
  if (!viewBoxMatch) return svgMarkup

  const modules = parseFloat(viewBoxMatch[1])
  const logoSize = modules * LOGO_SIZE_RATIO
  const padding = logoSize * LOGO_PADDING_RATIO
  const boxSize = logoSize + padding * 2
  const boxOrigin = (modules - boxSize) / 2
  const imageOrigin = (modules - logoSize) / 2
  const radius = boxSize * LOGO_CORNER_RATIO

  const overlay =
    `<rect x="${boxOrigin}" y="${boxOrigin}" width="${boxSize}" height="${boxSize}" rx="${radius}" fill="#ffffff"/>` +
    `<image x="${imageOrigin}" y="${imageOrigin}" width="${logoSize}" height="${logoSize}" ` +
    `href="${dataUrl}" preserveAspectRatio="xMidYMid meet"/>`

  return svgMarkup.replace('</svg>', `${overlay}</svg>`)
}
