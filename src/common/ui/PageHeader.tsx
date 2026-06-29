import type { ReactNode } from 'react'

type PageHeaderProps = {
  badge?: string
  title: string
  description?: string
  actions?: ReactNode
}

function PageHeader({
  badge,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <header className="app-page-header">
      <div className="app-page-title-group">
        {badge && <span className="ui-badge ui-badge-primary">{badge}</span>}

        <h1 className="app-page-title">{title}</h1>

        {description && <p className="app-page-description">{description}</p>}
      </div>

      {actions && <div className="app-page-actions">{actions}</div>}
    </header>
  )
}

export default PageHeader