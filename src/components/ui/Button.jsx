import './ui.css'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  full = false,
  className = '',
  ...rest
}) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${full ? 'btn--full' : ''} ${className}`}
      {...rest}
    >
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : 17} />}
      {children && <span>{children}</span>}
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 17} />}
    </button>
  )
}
