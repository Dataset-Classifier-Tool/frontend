type SkeletonProps = {
  rows?: number
}

function Skeleton({ rows = 4 }: SkeletonProps) {
  return (
    <div className="ui-skeleton-list">
      {Array.from({ length: rows }).map((_, index) => (
        <div className="ui-skeleton-card" key={index}>
          <div className="ui-skeleton-line short" />
          <div className="ui-skeleton-line" />
          <div className="ui-skeleton-line medium" />
        </div>
      ))}
    </div>
  )
}

export default Skeleton