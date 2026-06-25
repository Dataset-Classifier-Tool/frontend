type PaginationBarProps = {
  currentPage: number
  totalPages: number
  onGoToPage: (page: number) => void
}

function PaginationBar({
  currentPage,
  totalPages,
  onGoToPage,
}: PaginationBarProps) {
  if (totalPages <= 1) return null

  const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter((page) => {
      return (
        page === 1 ||
        page === totalPages ||
        Math.abs(page - currentPage) <= 2
      )
    })

  return (
    <div className="pagination-bar">
      <button
        type="button"
        className="pagination-button"
        disabled={currentPage <= 1}
        onClick={() => onGoToPage(1)}
      >
        처음
      </button>

      <button
        type="button"
        className="pagination-button"
        disabled={currentPage <= 1}
        onClick={() => onGoToPage(currentPage - 1)}
      >
        이전
      </button>

      <div className="pagination-pages">
        {visiblePages.map((page) => (
          <button
            key={page}
            type="button"
            className={
              page === currentPage
                ? 'pagination-page active'
                : 'pagination-page'
            }
            onClick={() => onGoToPage(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="pagination-button"
        disabled={currentPage >= totalPages}
        onClick={() => onGoToPage(currentPage + 1)}
      >
        다음
      </button>

      <button
        type="button"
        className="pagination-button"
        disabled={currentPage >= totalPages}
        onClick={() => onGoToPage(totalPages)}
      >
        마지막
      </button>
    </div>
  )
}

export default PaginationBar