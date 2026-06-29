import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
}

function EmptyState({
  title,
  description,
  action,
  icon = '📂',
}: EmptyStateProps) {
  return (
    <div className="ui-empty">
      <div className="ui-empty-icon">{icon}</div>

      <h3 className="ui-empty-title">{title}</h3>

      {description && <p className="ui-empty-description">{description}</p>}

      {action && <div className="ui-empty-action">{action}</div>}
    </div>
  )
}

export default EmptyState