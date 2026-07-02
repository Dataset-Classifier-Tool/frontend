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
  totalCount,
  startIndex,
  endIndex,
  onPageChange,
}: PaginationBarProps) {
  const isFirstPage = currentPage <= 1
  const isLastPage = currentPage >= totalPages

  return (
    <nav className="pagination-bar" aria-label="프레임 페이지 이동">
      <div className="pagination-info">
        <strong>{totalCount}</strong>
        <span>개 프레임 중</span>
        <strong>{totalCount === 0 ? 0 : startIndex + 1}</strong>
        <span>-</span>
        <strong>{endIndex}</strong>
        <span>표시</span>
      </div>

      <div className="pagination-actions">
        <button
          type="button"
          className="ui-button ui-button-secondary ui-button-sm"
          onClick={() => onPageChange(1)}
          disabled={isFirstPage}
        >
          처음
        </button>

        <button
          type="button"
          className="ui-button ui-button-secondary ui-button-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
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
          disabled={isLastPage}
        >
          다음
        </button>

        <button
          type="button"
          className="ui-button ui-button-secondary ui-button-sm"
          onClick={() => onPageChange(totalPages)}
          disabled={isLastPage}
        >
          마지막
        </button>
      </div>
    </nav>
  )
}

export default PaginationBar