// Center-logo overlay for generated QR codes. Kept separate from the qrcode
// wrapper hook since it's pure canvas/SVG post-processing, not QR generation.

const LOGO_SIZE_RATIO = 0.22
const LOGO_PADDING_RATIO = 0.18
const LOGO_CLIP_ID = 'qr-logo-clip'

export function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Unable to load that image'))
    img.src = dataUrl
  })
}

function circlePath(ctx, center, radius) {
  ctx.beginPath()
  ctx.arc(center, center, radius, 0, Math.PI * 2)
  ctx.closePath()
}

export function drawLogoOnCanvas(canvas, image) {
  const ctx = canvas.getContext('2d')
  const canvasSize = canvas.width
  const logoSize = canvasSize * LOGO_SIZE_RATIO
  const padding = logoSize * LOGO_PADDING_RATIO
  const center = canvasSize / 2

  ctx.fillStyle = '#ffffff'
  circlePath(ctx, center, logoSize / 2 + padding)
  ctx.fill()

  // Cover-fit the logo into a circle so it reads as a round badge.
  const scale = Math.max(logoSize / image.width, logoSize / image.height)
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  ctx.save()
  circlePath(ctx, center, logoSize / 2)
  ctx.clip()
  ctx.drawImage(image, center - drawWidth / 2, center - drawHeight / 2, drawWidth, drawHeight)
  ctx.restore()
}

export function embedLogoInSvg(svgMarkup, dataUrl) {
  const viewBoxMatch = svgMarkup.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)
  if (!viewBoxMatch) return svgMarkup

  const modules = parseFloat(viewBoxMatch[1])
  const logoSize = modules * LOGO_SIZE_RATIO
  const padding = logoSize * LOGO_PADDING_RATIO
  const center = modules / 2
  const imageOrigin = (modules - logoSize) / 2

  const overlay =
    `<defs><clipPath id="${LOGO_CLIP_ID}"><circle cx="${center}" cy="${center}" r="${logoSize / 2}"/></clipPath></defs>` +
    `<circle cx="${center}" cy="${center}" r="${logoSize / 2 + padding}" fill="#ffffff"/>` +
    `<image x="${imageOrigin}" y="${imageOrigin}" width="${logoSize}" height="${logoSize}" ` +
    `href="${dataUrl}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${LOGO_CLIP_ID})"/>`

  return svgMarkup.replace('</svg>', `${overlay}</svg>`)
}
