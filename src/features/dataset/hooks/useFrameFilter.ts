import { useMemo, useState } from 'react'

import type { DatasetFrame } from '../../../types/frame.ts'
import type { LabelName } from '../../../types/label.ts'

export type FrameFilter = 'all' | 'unlabeled' | LabelName

function useFrameFilter(allFrames: DatasetFrame[]) {
  const [filter, setFilter] = useState<FrameFilter>('all')

  const filteredFrames = useMemo(() => {
    if (filter === 'all') return allFrames

    if (filter === 'unlabeled') {
      return allFrames.filter((frame) => frame.labels.length === 0)
    }

    return allFrames.filter((frame) =>
      frame.labels.some((label) => label.label_name === filter),
    )
  }, [allFrames, filter])

  return {
    filter,
    setFilter,
    filteredFrames,
  }
}

export default useFrameFilter