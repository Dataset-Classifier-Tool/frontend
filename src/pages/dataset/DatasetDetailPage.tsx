import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  autoLabelDatasetApi,
  type LabelCounts,
} from '../../common/api/classifierApi'
import { getDatasetDetailApi } from '../../common/api/datasetApi'
import { downloadDatasetZipApi } from '../../common/api/exportApi'
import { useLabelStore } from '../../stores/labelStore'

import type { Dataset } from '../../types/dataset'
import type { DatasetFrame } from '../../types/frame'
import type { LabelName } from '../../types/label'

import { FrameGrid } from './components/FrameGrid'
import { FrameModal } from './components/FrameModal'
import { LabelStatsPanel } from './components/LabelStatsPanel'

const LABEL_OPTIONS: LabelName[] = [
  'fire',
  'smoke',
  'carlight',
  'negative',
  'fire_smoke',
  'fire_smoke_carlight',
]

const LABEL_TEXT: Record<LabelName, string> = {
  fire: '화재',
  smoke: '연기',
  carlight: '차량 등화류',
  negative: '정상 / 오탐 아님',
  fire_smoke: '화재 + 연기',
  fire_smoke_carlight: '화재 + 연기 + 차량 등화류',
}

const FRAMES_PER_PAGE = 20

type FrameFilter = 'all' | 'unlabeled' | LabelName

function DatasetDetailPage() {
  const navigate = useNavigate()
  const { datasetId } = useParams()

  const numericDatasetId = Number(datasetId)
  const isValidDatasetId =
    Number.isInteger(numericDatasetId) && numericDatasetId > 0

  const createLabel = useLabelStore((state) => state.createLabel)
  const deleteLabel = useLabelStore((state) => state.deleteLabel)
  const isLabelLoading = useLabelStore((state) => state.isLoading)

  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [selectedFrame, setSelectedFrame] = useState<DatasetFrame | null>(null)

  const [filter, setFilter] = useState<FrameFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const [isLoading, setIsLoading] = useState(false)
  const [isAutoLabeling, setIsAutoLabeling] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')
  const [autoLabelMessage, setAutoLabelMessage] = useState('')
  const [autoLabelCounts, setAutoLabelCounts] = useState<LabelCounts | null>(
    null,
  )

  const reloadDatasetDetail = async () => {
    if (!isValidDatasetId) {
      setErrorMessage('잘못된 데이터셋 주소입니다.')
      return
    }

    const response = await getDatasetDetailApi(numericDatasetId)
    setDataset(response.data)
  }

  useEffect(() => {
    const fetchDatasetDetail = async () => {
      if (!isValidDatasetId) {
        setIsLoading(false)
        setErrorMessage('잘못된 데이터셋 주소입니다.')
        return
      }

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
    setCurrentPage(1)
  }, [filter])

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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFrames.length / FRAMES_PER_PAGE),
  )

  const paginatedFrames = useMemo(() => {
    const startIndex = (currentPage - 1) * FRAMES_PER_PAGE
    return filteredFrames.slice(startIndex, startIndex + FRAMES_PER_PAGE)
  }, [filteredFrames, currentPage])

  const selectedFrameIndex = useMemo(() => {
    if (!selectedFrame) return -1
    return filteredFrames.findIndex((frame) => frame.id === selectedFrame.id)
  }, [filteredFrames, selectedFrame])

  const visibleStart =
    filteredFrames.length === 0 ? 0 : (currentPage - 1) * FRAMES_PER_PAGE + 1

  const visibleEnd = Math.min(
    currentPage * FRAMES_PER_PAGE,
    filteredFrames.length,
  )

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
      return { ...prevFrame, labels: nextLabels }
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
    if (!isValidDatasetId) {
      setErrorMessage('잘못된 데이터셋 주소입니다.')
      return
    }

    const confirmed = window.confirm(
      '현재 데이터셋의 모든 프레임에 AI 자동 라벨링을 실행할까요?',
    )

    if (!confirmed) return

    setIsAutoLabeling(true)
    setErrorMessage('')
    setAutoLabelMessage('')
    setAutoLabelCounts(null)

    try {
      const response = await autoLabelDatasetApi(numericDatasetId)

      setAutoLabelCounts(response.data.label_counts)
      setAutoLabelMessage(
        `AI 자동 라벨링 완료: 전체 ${response.data.total_frames}개 중 ${response.data.labeled_frames}개 처리`,
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

  const handleDownloadDatasetZip = async () => {
    if (!isValidDatasetId) {
      setErrorMessage('잘못된 데이터셋 주소입니다.')
      return
    }

    const labeledFrameCount = allFrames.filter(
      (frame) => frame.labels.length > 0,
    ).length

    if (labeledFrameCount === 0) {
      setErrorMessage('다운로드할 라벨링된 프레임이 없습니다.')
      return
    }

    setIsExporting(true)
    setErrorMessage('')
    setAutoLabelMessage('')

    try {
      await downloadDatasetZipApi(numericDatasetId)
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          '데이터셋 다운로드 중 오류가 발생했습니다.',
      )
    } finally {
      setIsExporting(false)
    }
  }

  const goToPage = (page: number) => {
    const safePage = Math.min(Math.max(page, 1), totalPages)
    setCurrentPage(safePage)
  }

  const moveSelectedFrame = (direction: 'prev' | 'next') => {
    if (!selectedFrame) return

    const nextIndex =
      direction === 'next' ? selectedFrameIndex + 1 : selectedFrameIndex - 1

    if (nextIndex < 0 || nextIndex >= filteredFrames.length) return

    const nextFrame = filteredFrames[nextIndex]
    const nextPage = Math.floor(nextIndex / FRAMES_PER_PAGE) + 1

    setCurrentPage(nextPage)
    setSelectedFrame(nextFrame)
  }

  if (isLoading) return <p>불러오는 중...</p>

  if (!isValidDatasetId) {
    return (
      <section>
        <article className="dataset-card empty">
          <h2>잘못된 데이터셋 주소입니다</h2>
          <p>데이터셋 목록에서 다시 접근해주세요.</p>

          <button
            type="button"
            className="button primary"
            onClick={() => navigate('/datasets')}
          >
            데이터셋 목록으로
          </button>
        </article>
      </section>
    )
  }

  if (!dataset) {
    return (
      <section>
        <article className="dataset-card empty">
          <h2>데이터셋 정보가 없습니다</h2>
          <p>{errorMessage || '데이터셋 정보를 불러오지 못했습니다.'}</p>

          <button
            type="button"
            className="button primary"
            onClick={() => navigate('/datasets')}
          >
            데이터셋 목록으로
          </button>
        </article>
      </section>
    )
  }

  return (
    <section>
      <div className="page-header dataset-detail-header">
        <div>
          <span className="eyebrow">데이터셋 작업 공간</span>
          <h1>{dataset.name}</h1>
          <p>{dataset.description || '설명이 없습니다.'}</p>
          <p>
            영상 {dataset.video_count}개 · 프레임 {dataset.frame_count}장
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

      <div className="detail-action-panel">
        <div>
          <strong>작업 메뉴</strong>
          <p>영상 업로드, AI 자동 라벨링, 데이터셋 다운로드를 실행합니다.</p>
        </div>

        <div className="detail-actions">
          <button
            type="button"
            className="button primary"
            onClick={() => navigate('/upload')}
          >
            영상 업로드
          </button>

          <button
            type="button"
            className="button secondary"
            disabled={isAutoLabeling || allFrames.length === 0}
            onClick={handleAutoLabelDataset}
          >
            {isAutoLabeling ? 'AI 라벨링 중...' : 'AI 자동 라벨링'}
          </button>

          <button
            type="button"
            className="button secondary"
            disabled={isExporting || allFrames.length === 0}
            onClick={handleDownloadDatasetZip}
          >
            {isExporting ? '압축 파일 생성 중...' : '데이터셋 다운로드'}
          </button>
        </div>
      </div>

      {errorMessage && <div className="alert error">{errorMessage}</div>}

      {autoLabelMessage && (
        <div className="alert success">{autoLabelMessage}</div>
      )}

      <LabelStatsPanel
        labelOptions={LABEL_OPTIONS}
        labelStats={labelStats}
        autoLabelCounts={autoLabelCounts}
        onRefresh={reloadDatasetDetail}
      />

      <div className="frame-toolbar">
        <div>
          <h3>프레임 목록</h3>
          <p>
            총 {filteredFrames.length}장 중 {visibleStart}~{visibleEnd}장 표시 ·
            페이지당 {FRAMES_PER_PAGE}장
          </p>
        </div>

        <div className="pagination-compact">
          <button
            type="button"
            className="pagination-button"
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
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
            onClick={() => goToPage(currentPage + 1)}
          >
            다음
          </button>
        </div>
      </div>

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
            {LABEL_TEXT[labelName]} {labelStats[labelName]}
          </button>
        ))}
      </div>

      <div className="shortcut-guide">
        F 화재 · S 연기 · C 차량 등화류 · N 정상 · ← 이전 프레임 · → 다음
        프레임 · ESC 닫기
      </div>

      <FrameGrid
        frames={paginatedFrames}
        labelOptions={LABEL_OPTIONS}
        isLabelLoading={isLabelLoading}
        onSelectFrame={setSelectedFrame}
        onCreateLabel={handleCreateLabel}
        onDeleteLabel={handleDeleteLabel}
      />

      {totalPages > 1 && (
        <div className="pagination-bar">
          <button
            type="button"
            className="pagination-button"
            disabled={currentPage <= 1}
            onClick={() => goToPage(1)}
          >
            처음
          </button>

          <button
            type="button"
            className="pagination-button"
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            이전
          </button>

          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter((page) => {
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 2
                )
              })
              .map((page) => (
                <button
                  key={page}
                  type="button"
                  className={
                    page === currentPage
                      ? 'pagination-page active'
                      : 'pagination-page'
                  }
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}
          </div>

          <button
            type="button"
            className="pagination-button"
            disabled={currentPage >= totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            다음
          </button>

          <button
            type="button"
            className="pagination-button"
            disabled={currentPage >= totalPages}
            onClick={() => goToPage(totalPages)}
          >
            마지막
          </button>
        </div>
      )}

      {selectedFrame && (
        <FrameModal
          frame={selectedFrame}
          labelOptions={LABEL_OPTIONS}
          isLabelLoading={isLabelLoading}
          selectedFrameIndex={selectedFrameIndex}
          totalFrameCount={filteredFrames.length}
          onClose={() => setSelectedFrame(null)}
          onMove={moveSelectedFrame}
          onCreateLabel={handleCreateLabel}
          onDeleteLabel={handleDeleteLabel}
          onError={setErrorMessage}
        />
      )}
    </section>
  )
}

export default DatasetDetailPage