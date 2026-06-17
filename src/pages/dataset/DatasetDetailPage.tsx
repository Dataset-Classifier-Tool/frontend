import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  autoLabelDatasetApi,
  type LabelCounts,
} from '../../common/api/classifierApi'
import { getDatasetDetailApi } from '../../common/api/datasetApi'
import { getFrameImageUrl } from '../../common/api/uploadApi'
import {
  createBoundingBoxApi,
  getFrameBoundingBoxesApi,
} from '../../common/api/boundingBoxApi'
import { useLabelStore } from '../../stores/labelStore'

import type { BoundingBox } from '../../types/boundingBox'
import type { Dataset } from '../../types/dataset'
import type { DatasetFrame } from '../../types/frame'
import type { LabelName } from '../../types/label'

const LABEL_OPTIONS: LabelName[] = [
  'fire',
  'smoke',
  'carlight',
  'negative',
  'fire_smoke',
  'fire_smoke_carlight',
]

type FrameFilter = 'all' | 'unlabeled' | LabelName

const SHORTCUT_LABEL_MAP: Record<string, LabelName> = {
  f: 'fire',
  s: 'smoke',
  c: 'carlight',
  n: 'negative',
}

function DatasetDetailPage() {
  const navigate = useNavigate()
  const { datasetId } = useParams()

  const imageRef = useRef<HTMLImageElement | null>(null)

  const createLabel = useLabelStore((state) => state.createLabel)
  const deleteLabel = useLabelStore((state) => state.deleteLabel)
  const isLabelLoading = useLabelStore((state) => state.isLoading)

  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [selectedFrame, setSelectedFrame] = useState<DatasetFrame | null>(null)

  const [filter, setFilter] = useState<FrameFilter>('all')
  const [selectedBoxLabel, setSelectedBoxLabel] = useState<LabelName>('fire')

  const [boxes, setBoxes] = useState<BoundingBox[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [drawPreview, setDrawPreview] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isAutoLabeling, setIsAutoLabeling] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [autoLabelMessage, setAutoLabelMessage] = useState('')
  const [autoLabelCounts, setAutoLabelCounts] = useState<LabelCounts | null>(
    null,
  )

  const reloadDatasetDetail = async () => {
    if (!datasetId) return

    const response = await getDatasetDetailApi(Number(datasetId))
    setDataset(response.data)
  }

  useEffect(() => {
    const fetchDatasetDetail = async () => {
      if (!datasetId) return

      setIsLoading(true)
      setErrorMessage('')

      try {
        await reloadDatasetDetail()
      } catch {
        setErrorMessage('데이터셋 상세 정보를 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDatasetDetail()
  }, [datasetId])

  useEffect(() => {
    if (!selectedFrame) {
      setBoxes([])
      return
    }

    getFrameBoundingBoxesApi(selectedFrame.id)
      .then((response) => setBoxes(response.data))
      .catch(() => setBoxes([]))
  }, [selectedFrame])

  const allFrames = useMemo(() => {
    if (!dataset?.videos) return []
    return dataset.videos.flatMap((video) => video.frames ?? [])
  }, [dataset])

  const filteredFrames = useMemo(() => {
    if (filter === 'all') return allFrames

    if (filter === 'unlabeled') {
      return allFrames.filter((frame) => frame.labels.length === 0)
    }

    return allFrames.filter((frame) =>
      frame.labels.some((label) => label.label_name === filter),
    )
  }, [allFrames, filter])

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

  const boxStats = useMemo(() => {
    const stats: Record<LabelName | 'total', number> = {
      total: boxes.length,
      fire: 0,
      smoke: 0,
      carlight: 0,
      negative: 0,
      fire_smoke: 0,
      fire_smoke_carlight: 0,
    }

    boxes.forEach((box) => {
      stats[box.label_name] += 1
    })

    return stats
  }, [boxes])

  const selectedFrameIndex = useMemo(() => {
    if (!selectedFrame) return -1
    return filteredFrames.findIndex((frame) => frame.id === selectedFrame.id)
  }, [filteredFrames, selectedFrame])

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
          frames: video.frames?.map((frame) => {
            if (frame.id !== frameId) return frame

            return {
              ...frame,
              labels: nextLabels,
            }
          }),
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
    setErrorMessage('')
    setAutoLabelMessage('')

    try {
      const createdLabel = await createLabel(frameId, {
        label_name: labelName,
        source: 'manual',
        is_verified: true,
      })

      updateFrameLabelsInDataset(frameId, [createdLabel])
    } catch {
      setErrorMessage('라벨 저장에 실패했습니다.')
    }
  }

  const handleDeleteLabel = async (frameId: number, labelId: number) => {
    setErrorMessage('')
    setAutoLabelMessage('')

    try {
      await deleteLabel(labelId)

      const targetFrame = allFrames.find((frame) => frame.id === frameId)
      const nextLabels =
        targetFrame?.labels.filter((label) => label.id !== labelId) ?? []

      updateFrameLabelsInDataset(frameId, nextLabels)
    } catch {
      setErrorMessage('라벨 삭제에 실패했습니다.')
    }
  }

  const handleAutoLabelDataset = async () => {
    if (!datasetId) return

    const confirmed = window.confirm(
      '현재 데이터셋의 모든 프레임에 AI 자동 라벨링을 실행할까요?',
    )

    if (!confirmed) return

    setIsAutoLabeling(true)
    setErrorMessage('')
    setAutoLabelMessage('')
    setAutoLabelCounts(null)

    try {
      const response = await autoLabelDatasetApi(Number(datasetId))

      setAutoLabelCounts(response.data.label_counts)
      setAutoLabelMessage(
        `AI 자동 라벨링 완료: 전체 ${response.data.total_frames}개 중 ${response.data.labeled_frames}개 처리 / 박스 ${response.data.created_box_count ?? 0}개 생성`,
      )

      await reloadDatasetDetail()
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          'AI 자동 라벨링 실행 중 오류가 발생했습니다.',
      )
    } finally {
      setIsAutoLabeling(false)
    }
  }

  const moveSelectedFrame = (direction: 'prev' | 'next') => {
    if (!selectedFrame) return

    const nextIndex =
      direction === 'next' ? selectedFrameIndex + 1 : selectedFrameIndex - 1

    if (nextIndex < 0 || nextIndex >= filteredFrames.length) return

    setSelectedFrame(filteredFrames[nextIndex])
  }

  const getNormalizedPoint = (event: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return null

    const rect = imageRef.current.getBoundingClientRect()

    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height

    return {
      x: Math.min(Math.max(x, 0), 1),
      y: Math.min(Math.max(y, 0), 1),
    }
  }

  const handleBoxMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (!selectedFrame) return

    const point = getNormalizedPoint(event)
    if (!point) return

    setIsDrawing(true)
    setDrawStart(point)
    setDrawPreview({
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
    })
  }

  const handleBoxMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !drawStart) return

    const point = getNormalizedPoint(event)
    if (!point) return

    const x = Math.min(drawStart.x, point.x)
    const y = Math.min(drawStart.y, point.y)
    const width = Math.abs(point.x - drawStart.x)
    const height = Math.abs(point.y - drawStart.y)

    setDrawPreview({ x, y, width, height })
  }

  const handleBoxMouseUp = async () => {
    if (!selectedFrame || !drawPreview) return

    setIsDrawing(false)
    setDrawStart(null)

    if (drawPreview.width < 0.01 || drawPreview.height < 0.01) {
      setDrawPreview(null)
      return
    }

    try {
      const response = await createBoundingBoxApi({
        frame_id: selectedFrame.id,
        label_name: selectedBoxLabel,
        x: drawPreview.x,
        y: drawPreview.y,
        width: drawPreview.width,
        height: drawPreview.height,
      })

      setBoxes((prev) => [response.data, ...prev])
      setDrawPreview(null)
    } catch {
      setErrorMessage('라벨링 박스 저장에 실패했습니다.')
      setDrawPreview(null)
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedFrame) return

      const key = event.key.toLowerCase()

      if (key === 'escape') {
        setSelectedFrame(null)
        return
      }

      if (key === 'arrowleft') {
        event.preventDefault()
        moveSelectedFrame('prev')
        return
      }

      if (key === 'arrowright') {
        event.preventDefault()
        moveSelectedFrame('next')
        return
      }

      const shortcutLabel = SHORTCUT_LABEL_MAP[key]

      if (shortcutLabel) {
        event.preventDefault()
        handleCreateLabel(selectedFrame.id, shortcutLabel)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedFrame, selectedFrameIndex, filteredFrames])

  if (isLoading) return <p>불러오는 중...</p>
  if (!dataset) return <p>데이터셋 정보가 없습니다.</p>

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>{dataset.name}</h1>
          <p>{dataset.description || '설명이 없습니다.'}</p>
          <p>
            영상 {dataset.video_count}개 · 프레임 {dataset.frame_count}개
          </p>
        </div>

        <button
          type="button"
          className="button secondary"
          onClick={() => navigate('/datasets')}
        >
          목록으로
        </button>
      </div>

      <div className="detail-actions">
        <button
          type="button"
          className="button primary"
          onClick={() => navigate('/upload')}
        >
          영상 업로드하기
        </button>

        <button
          type="button"
          className="button secondary"
          disabled={isAutoLabeling || allFrames.length === 0}
          onClick={handleAutoLabelDataset}
        >
          {isAutoLabeling ? 'AI 자동 라벨링 중...' : 'AI 자동 라벨링 실행'}
        </button>
      </div>

      {errorMessage && <div className="alert error">{errorMessage}</div>}
      {autoLabelMessage && <div className="alert success">{autoLabelMessage}</div>}

      <div className="dataset-stats-card">
        <h3>데이터셋 라벨 현황</h3>

        <div className="dataset-stats-grid">
          <div className="dataset-stats-item">
            전체 프레임
            <strong>{labelStats.total}장</strong>
          </div>

          <div className="dataset-stats-item">
            미분류
            <strong>{labelStats.unlabeled}장</strong>
          </div>

          {LABEL_OPTIONS.map((labelName) => (
            <div className="dataset-stats-item" key={labelName}>
              {labelName}
              <strong>{labelStats[labelName]}장</strong>
            </div>
          ))}
        </div>
      </div>

      {autoLabelCounts && (
        <div className="auto-label-summary">
          <h3>방금 실행한 AI 자동 라벨링 결과</h3>

          <div className="auto-label-count-grid">
            {LABEL_OPTIONS.map((labelName) => (
              <div className="auto-label-count-item" key={labelName}>
                {labelName}
                <strong>{autoLabelCounts[labelName] ?? 0}장</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="label-filter-bar">
        <button
          type="button"
          className={filter === 'all' ? 'filter-button active' : 'filter-button'}
          onClick={() => setFilter('all')}
        >
          전체 {allFrames.length}
        </button>

        <button
          type="button"
          className={
            filter === 'unlabeled' ? 'filter-button active' : 'filter-button'
          }
          onClick={() => setFilter('unlabeled')}
        >
          미분류 {labelStats.unlabeled}
        </button>

        {LABEL_OPTIONS.map((labelName) => (
          <button
            key={labelName}
            type="button"
            className={
              filter === labelName ? 'filter-button active' : 'filter-button'
            }
            onClick={() => setFilter(labelName)}
          >
            {labelName} {labelStats[labelName]}
          </button>
        ))}
      </div>

      <div className="shortcut-guide">
        F Fire · S Smoke · C CarLight · N Negative · ← 이전 · → 다음 · ESC 닫기
      </div>

      {filteredFrames.length === 0 ? (
        <article className="dataset-card empty">
          <h2>조건에 맞는 프레임이 없습니다</h2>
          <p>필터를 변경하거나 영상을 추가로 업로드해보세요.</p>
        </article>
      ) : (
        <div className="frame-preview-grid">
          {filteredFrames.map((frame) => (
            <article className="frame-preview-card" key={frame.id}>
              <button
                type="button"
                className="frame-image-button"
                onClick={() => setSelectedFrame(frame)}
              >
                <img
                  className="frame-image"
                  src={getFrameImageUrl(frame.id)}
                  alt={`Frame ${frame.frame_number}`}
                />
              </button>

              <small>
                {frame.timestamp !== null
                  ? `${frame.timestamp.toFixed(1)}초`
                  : '시간 정보 없음'}
              </small>

              <div className="frame-label-row">
                {frame.labels.length === 0 ? (
                  <span className="label-chip empty">미분류</span>
                ) : (
                  frame.labels.map((label) => (
                    <span className="label-chip removable" key={label.id}>
                      {label.label_name}
                      <button
                        type="button"
                        className="label-remove-button"
                        onClick={() => handleDeleteLabel(frame.id, label.id)}
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>

              <div className="label-button-grid">
                {LABEL_OPTIONS.map((labelName) => (
                  <button
                    key={labelName}
                    type="button"
                    className="label-button"
                    disabled={isLabelLoading}
                    onClick={() => handleCreateLabel(frame.id, labelName)}
                  >
                    {labelName}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedFrame && (
        <div
          className="frame-modal-backdrop"
          onClick={() => setSelectedFrame(null)}
        >
          <div
            className="frame-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="frame-modal-header">
              <div>
                <h2>Frame {selectedFrame.frame_number}</h2>
                <p>
                  {selectedFrame.timestamp !== null
                    ? `${selectedFrame.timestamp.toFixed(1)}초`
                    : '시간 정보 없음'}
                </p>
              </div>

              <button
                type="button"
                className="text-button"
                onClick={() => setSelectedFrame(null)}
              >
                닫기
              </button>
            </div>

            <label>
              박스 라벨 선택
              <select
                value={selectedBoxLabel}
                onChange={(event) =>
                  setSelectedBoxLabel(event.target.value as LabelName)
                }
              >
                {LABEL_OPTIONS.map((labelName) => (
                  <option key={labelName} value={labelName}>
                    {labelName}
                  </option>
                ))}
              </select>
            </label>

            <div className="box-stats-card">
              <span>현재 프레임 박스</span>
              <strong>{boxStats.total}개</strong>
              {LABEL_OPTIONS.map((labelName) => (
                <small key={labelName}>
                  {labelName}: {boxStats[labelName]}개
                </small>
              ))}
            </div>

            <div
              className="box-draw-area"
              onMouseDown={handleBoxMouseDown}
              onMouseMove={handleBoxMouseMove}
              onMouseUp={handleBoxMouseUp}
            >
              <img
                ref={imageRef}
                className="frame-modal-image"
                src={getFrameImageUrl(selectedFrame.id)}
                alt={`Frame ${selectedFrame.frame_number}`}
                draggable={false}
              />

              {boxes.map((box) => (
                <div
                  key={box.id}
                  className={
                    box.source === 'ai'
                      ? 'box-overlay ai-box'
                      : 'box-overlay manual-box'
                  }
                  style={{
                    left: `${box.x * 100}%`,
                    top: `${box.y * 100}%`,
                    width: `${box.width * 100}%`,
                    height: `${box.height * 100}%`,
                  }}
                >
                  <span className="box-label">
                    {box.label_name} · {box.source}
                  </span>
                </div>
              ))}

              {drawPreview && (
                <div
                  className="box-overlay manual-box"
                  style={{
                    left: `${drawPreview.x * 100}%`,
                    top: `${drawPreview.y * 100}%`,
                    width: `${drawPreview.width * 100}%`,
                    height: `${drawPreview.height * 100}%`,
                  }}
                />
              )}
            </div>

            <div className="frame-modal-labels">
              {selectedFrame.labels.length === 0 ? (
                <span className="label-chip empty">미분류</span>
              ) : (
                selectedFrame.labels.map((label) => (
                  <span className="label-chip removable" key={label.id}>
                    {label.label_name}
                    <button
                      type="button"
                      className="label-remove-button"
                      onClick={() =>
                        handleDeleteLabel(selectedFrame.id, label.id)
                      }
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>

            <div className="label-button-grid modal-label-grid">
              {LABEL_OPTIONS.map((labelName) => (
                <button
                  key={labelName}
                  type="button"
                  className="label-button"
                  disabled={isLabelLoading}
                  onClick={() => handleCreateLabel(selectedFrame.id, labelName)}
                >
                  {labelName}
                </button>
              ))}
            </div>

            <div className="frame-modal-actions">
              <button
                type="button"
                className="button secondary"
                disabled={selectedFrameIndex <= 0}
                onClick={() => moveSelectedFrame('prev')}
              >
                ← 이전
              </button>

              <button
                type="button"
                className="button primary"
                disabled={selectedFrameIndex >= filteredFrames.length - 1}
                onClick={() => moveSelectedFrame('next')}
              >
                다음 →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default DatasetDetailPage