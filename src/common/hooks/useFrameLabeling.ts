import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

import { useLabelStore } from '../../stores/labelStore'

import type { Dataset } from '../../types/dataset'
import type { DatasetFrame } from '../../types/frame'
import type { LabelName } from '../../types/label'

type UseFrameLabelingParams = {
  allFrames: DatasetFrame[]
  setDataset: Dispatch<SetStateAction<Dataset | null>>
  setSelectedFrame: Dispatch<SetStateAction<DatasetFrame | null>>
}

function useFrameLabeling({
  allFrames,
  setDataset,
  setSelectedFrame,
}: UseFrameLabelingParams) {
  const createLabel = useLabelStore((state) => state.createLabel)
  const deleteLabel = useLabelStore((state) => state.deleteLabel)
  const isLabelLoading = useLabelStore((state) => state.isLoading)

  const [labelErrorMessage, setLabelErrorMessage] = useState('')

  const updateFrameLabelsInDataset = (
    frameId: number,
    nextLabels: DatasetFrame['labels'],
  ) => {
    setDataset((prevDataset) => {
      if (!prevDataset?.videos) return prevDataset

      return {
        ...prevDataset,
        videos: prevDataset.videos.map((video) => ({
          ...video,
          frames: video.frames?.map((frame) =>
            frame.id === frameId ? { ...frame, labels: nextLabels } : frame,
          ),
        })),
      }
    })

    setSelectedFrame((prevFrame) => {
      if (!prevFrame || prevFrame.id !== frameId) return prevFrame

      return {
        ...prevFrame,
        labels: nextLabels,
      }
    })
  }

  const handleCreateLabel = async (frameId: number, labelName: LabelName) => {
    setLabelErrorMessage('')

    try {
      const createdLabel = await createLabel(frameId, {
        label_name: labelName,
        source: 'manual',
        is_verified: true,
      })

      updateFrameLabelsInDataset(frameId, [createdLabel])
    } catch {
      setLabelErrorMessage('라벨 저장에 실패했습니다.')
    }
  }

  const handleDeleteLabel = async (frameId: number, labelId: number) => {
    setLabelErrorMessage('')

    try {
      await deleteLabel(labelId)

      const targetFrame = allFrames.find((frame) => frame.id === frameId)
      const nextLabels =
        targetFrame?.labels.filter((label) => label.id !== labelId) ?? []

      updateFrameLabelsInDataset(frameId, nextLabels)
    } catch {
      setLabelErrorMessage('라벨 삭제에 실패했습니다.')
    }
  }

  return {
    isLabelLoading,
    labelErrorMessage,
    setLabelErrorMessage,
    handleCreateLabel,
    handleDeleteLabel,
  }
}

export default useFrameLabeling