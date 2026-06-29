type PaginationBarProps = {
  currentPage: number
  totalPages: number
  pageSize: number
  totalCount: number
  startIndex: number
  endIndex: number
  onPageChange: (page: number) => void
}

function PaginationBar({
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  startIndex,
  endIndex,
  onPageChange,
}: PaginationBarProps) {
  if (totalCount === 0) return null

  return (
    <div className="pagination-bar">
      <div className="pagination-info">
        <span className="ui-badge ui-badge-primary">Page</span>

        <div>
          <strong>
            {startIndex + 1} - {endIndex}
          </strong>

          <span>
            / 전체 {totalCount}개 · 페이지당 {pageSize}개
          </span>
        </div>
      </div>

      <div className="pagination-actions">
        <button
          type="button"
          className="ui-button ui-button-secondary ui-button-sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
        >
          처음
        </button>

        <button
          type="button"
          className="ui-button ui-button-secondary ui-button-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          이전
        </button>

        <span className="pagination-current">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          className="ui-button ui-button-secondary ui-button-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          다음
        </button>

        <button
          type="button"
          className="ui-button ui-button-secondary ui-button-sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
        >
          마지막
        </button>
      </div>
    </div>
  )
}

export default PaginationBar