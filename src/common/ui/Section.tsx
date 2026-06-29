import type { ReactNode } from 'react'

type SectionProps = {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

function Section({
  title,
  description,
  actions,
  children,
  className = '',
}: SectionProps) {
  return (
    <section className={`app-section ${className}`.trim()}>
      {(title || description || actions) && (
        <div className="app-section-header">
          <div>
            {title && <h2 className="app-section-title">{title}</h2>}
            {description && (
              <p className="app-section-description">{description}</p>
            )}
          </div>

          {actions && <div className="app-page-actions">{actions}</div>}
        </div>
      )}

      {children}
    </section>
  )
}

export default Section