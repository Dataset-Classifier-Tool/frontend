import type { ReactNode } from 'react'

type StatsGridProps = {
  children: ReactNode
  className?: string
}

function StatsGrid({ children, className = '' }: StatsGridProps) {
  return (
    <div className={`app-grid app-grid-4 ${className}`.trim()}>
      {children}
    </div>
  )
}

export default StatsGrid