import type { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
}

function PageContainer({ children }: PageContainerProps) {
  return <div className="app-content">{children}</div>
}

export default PageContainer