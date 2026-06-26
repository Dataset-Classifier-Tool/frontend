import type { ReactNode } from 'react'

type StatCardProps = {
  label: string
  value: ReactNode
  help?: string
}

function StatCard({ label, value, help }: StatCardProps) {
  return (
    <article className="ui-stat-card">
      <p className="ui-stat-label">{label}</p>
      <h2 className="ui-stat-value">{value}</h2>
      {help && <p className="ui-stat-help">{help}</p>}
    </article>
  )
}

export default StatCard