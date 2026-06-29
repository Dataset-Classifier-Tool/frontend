import type { ReactNode } from 'react'

type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'muted'
  | 'info'

type BadgeProps = {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  const variantClassName =
    variant === 'default' ? '' : `ui-badge-${variant}`

  return (
    <span className={`ui-badge ${variantClassName} ${className}`.trim()}>
      {children}
    </span>
  )
}