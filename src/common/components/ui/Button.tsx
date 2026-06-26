import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
  full?: boolean
}

type ButtonLinkProps = {
  children: ReactNode
  to: string
  variant?: ButtonVariant
  full?: boolean
}

function getButtonClassName(variant: ButtonVariant, full?: boolean) {
  return ['ui-button', `ui-button-${variant}`, full ? 'ui-button-full' : '']
    .filter(Boolean)
    .join(' ')
}

export function Button({
  children,
  variant = 'primary',
  full = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${getButtonClassName(variant, full)} ${className}`.trim()}
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
  full = false,
}: ButtonLinkProps) {
  return (
    <Link to={to} className={getButtonClassName(variant, full)}>
      {children}
    </Link>
  )
}