import type { ReactNode } from 'react'

type PageProps = {
  children: ReactNode
  className?: string
}

function Page({ children, className = '' }: PageProps) {
  return <section className={`app-page ${className}`.trim()}>{children}</section>
}

export default Page