import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  full?: boolean
}

type ButtonLinkProps = {
  children: ReactNode
  to: string
  variant?: ButtonVariant
  size?: ButtonSize
  full?: boolean
  className?: string
}

function getButtonClassName({
  variant,
  size,
  full,
  className = '',
}: {
  variant: ButtonVariant
  size: ButtonSize
  full?: boolean
  className?: string
}) {
  return [
    'ui-button',
    `ui-button-${variant}`,
    size !== 'md' ? `ui-button-${size}` : '',
    full ? 'ui-button-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  full = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={getButtonClassName({
        variant,
        size,
        full,
        className,
      })}
      {...props}
    >
      {children}
    </button>
  )
}

export function ButtonLink({
  children,
  to,
  variant = 'primary',
  size = 'md',
  full = false,
  className = '',
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      className={getButtonClassName({
        variant,
        size,
        full,
        className,
      })}
    >
      {children}
    </Link>
  )
}