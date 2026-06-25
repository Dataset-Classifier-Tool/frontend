import { useMemo } from 'react'

import type { Dataset } from '../../types/dataset'

function useDatasetFrames(dataset: Dataset | null) {
  const allFrames = useMemo(() => {
    if (!dataset?.videos) return []

    return dataset.videos.flatMap((video) => video.frames ?? [])
  }, [dataset])

  return {
    allFrames,
  }
}

export default useDatasetFrames