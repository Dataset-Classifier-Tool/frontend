import { useMemo } from 'react'

import type { DatasetFrame } from '../../types/frame'
import type { LabelName } from '../../types/label'

function useLabelStats(allFrames: DatasetFrame[]) {
  const labelStats = useMemo(() => {
    const stats: Record<LabelName | 'total' | 'unlabeled', number> = {
      total: allFrames.length,
      unlabeled: 0,
      fire: 0,
      smoke: 0,
      carlight: 0,
      negative: 0,
      fire_smoke: 0,
      fire_smoke_carlight: 0,
    }

    allFrames.forEach((frame) => {
      if (frame.labels.length === 0) {
        stats.unlabeled += 1
        return
      }

      frame.labels.forEach((label) => {
        stats[label.label_name] += 1
      })
    })

    return stats
  }, [allFrames])

  const labeledFrameCount = useMemo(() => {
    return allFrames.filter((frame) => frame.labels.length > 0).length
  }, [allFrames])

  return {
    labelStats,
    labeledFrameCount,
  }
}

export default useLabelStats