import type { HTMLAttributes, ReactNode } from 'react'

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  hover?: boolean
}

export function Card({
  children,
  className = '',
  hover = false,
  ...props
}: CardProps) {
  return (
    <article
      className={`ui-card ${hover ? 'ui-card-hover' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </article>
  )
}