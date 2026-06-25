type FrameToolbarProps = {
  filteredFrameCount: number
  visibleStart: number
  visibleEnd: number
  currentPage: number
  totalPages: number
  framesPerPage: number
  onPrevPage: () => void
  onNextPage: () => void
}

function FrameToolbar({
  filteredFrameCount,
  visibleStart,
  visibleEnd,
  currentPage,
  totalPages,
  framesPerPage,
  onPrevPage,
  onNextPage,
}: FrameToolbarProps) {
  return (
    <div className="frame-toolbar">
      <div>
        <h3>프레임 목록</h3>
        <p>
          총 {filteredFrameCount}장 중 {visibleStart}~{visibleEnd}장 표시 ·
          페이지당 {framesPerPage}장
        </p>
      </div>

      <div className="pagination-compact">
        <button
          type="button"
          className="pagination-button"
          disabled={currentPage <= 1}
          onClick={onPrevPage}
        >
          이전
        </button>

        <strong>
          {currentPage} / {totalPages}
        </strong>

        <button
          type="button"
          className="pagination-button"
          disabled={currentPage >= totalPages}
          onClick={onNextPage}
        >
          다음
        </button>
      </div>
    </div>
  )
}

export default FrameToolbar