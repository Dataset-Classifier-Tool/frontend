import { useEffect, useMemo, useState } from 'react'

import type { DatasetFrame } from '../../types/frame'

type UseFramePaginationParams = {
  filteredFrames: DatasetFrame[]
  framesPerPage: number
  resetKey?: string
}

function useFramePagination({
  filteredFrames,
  framesPerPage,
  resetKey,
}: UseFramePaginationParams) {
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [resetKey])

  const totalPages = Math.max(1, Math.ceil(filteredFrames.length / framesPerPage))

  const paginatedFrames = useMemo(() => {
    const startIndex = (currentPage - 1) * framesPerPage

    return filteredFrames.slice(startIndex, startIndex + framesPerPage)
  }, [filteredFrames, currentPage, framesPerPage])

  const visibleStart =
    filteredFrames.length === 0 ? 0 : (currentPage - 1) * framesPerPage + 1

  const visibleEnd = Math.min(currentPage * framesPerPage, filteredFrames.length)

  const goToPage = (page: number) => {
    const safePage = Math.min(Math.max(page, 1), totalPages)

    setCurrentPage(safePage)
  }

  return {
    currentPage,
    totalPages,
    paginatedFrames,
    visibleStart,
    visibleEnd,
    goToPage,
  }
}

export default useFramePagination