export default function BarcodeMark({ size = 18 }) {
  return (
    <svg
      width={size * 1.3}
      height={size}
      viewBox="0 0 26 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="0" y="0" width="2" height="20" />
      <rect x="4" y="0" width="1" height="20" />
      <rect x="7" y="0" width="3" height="20" />
      <rect x="12" y="0" width="1" height="20" />
      <rect x="15" y="0" width="2" height="20" />
      <rect x="19" y="0" width="1" height="20" />
      <rect x="22" y="0" width="3" height="20" />
    </svg>
  )
}
