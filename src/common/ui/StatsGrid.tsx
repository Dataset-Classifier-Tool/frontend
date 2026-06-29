import type { ReactNode } from 'react'

type StatsGridProps = {
  children: ReactNode
}

function StatsGrid({ children }: StatsGridProps) {
  return <div className="app-grid app-grid-4">{children}</div>
}

export default StatsGrid