import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  EmptyState,
  Loading,
  Page,
  PageHeader,
  StatCard,
  StatsGrid,
  useToast,
} from '../../common/ui'
import { createBoundingBoxApi } from '../../features/dataset/api/boundingBoxApi'
import { runAutoLabelApi } from '../../features/dataset/api/classifierApi'
import { getDatasetDetailApi } from '../../features/dataset/api/datasetApi'
import {
  downloadDatasetYoloApi,
  downloadDatasetZipApi,
  getYoloExportMetaApi,
  type YoloExportMeta,
} from '../../features/dataset/api/exportApi'
import { createLabelApi, deleteLabelApi } from '../../features/dataset/api/labelApi'
import {
  AutoLabelPanel,
  DatasetInfoPanel,
  ExportPanel,
  FrameGrid,
  FrameModal,
  FrameToolbar,
  LabelStatsPanel,
  PaginationBar,
} from '../../features/dataset'
import type { Dataset } from '../../types/dataset'
import type { DatasetFrame } from '../../types/frame'
import type { LabelName } from '../../types/label'

type LabelFilter = LabelName | 'all' | 'unlabeled' | 'no_bbox'

type LabelOption = {
  value: LabelName
  label: string
  className: string
  shortcut: string
}

type LabelStats = {
  fire: number
  smoke: number
  carlight: number
  negative: number
  unlabeled: number
}

const PAGE_SIZE = 24

const LABEL_OPTIONS: LabelOption[] = [
  { value: 'fire', label: '화재', className: 'dataset-label-fire', shortcut: 'F' },
  { value: 'smoke', label: '연기', className: 'dataset-label-smoke', shortcut: 'S' },
  {
    value: 'carlight',
    label: '차량 등화류',
    className: 'dataset-label-carlight',
    shortcut: 'C',
  },
  {
    value: 'negative',
    label: '일반/오탐',
    className: 'dataset-label-negative',
    shortcut: 'N',
  },
]

function getFrameLabel(frame: DatasetFrame): LabelName | null {
  return frame.labels?.[0]?.label_name ?? null
}

function getFrameBoxCount(frame: DatasetFrame) {
  return frame.bounding_boxes?.length ?? 0
}

function getMockLabel(index: number): LabelName {
  const labels: LabelName[] = ['fire', 'smoke', 'carlight', 'negative']
  return labels[index % labels.length]
}

function getMockConfidence(index: number) {
  return Math.round((0.72 + (index % 5) * 0.045) * 100) / 100
}

function createMockBox(index: number) {
  return {
    x: 0.08 + (index % 4) * 0.08,
    y: 0.12 + (index % 3) * 0.07,
    width: 0.28,
    height: 0.22,
  }
}

function DatasetDetailPage() {
  const params = useParams()
  const datasetId = Number(params.id)
  const { showToast } = useToast()

  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [isLoadingYoloMeta, setIsLoadingYoloMeta] = useState(false)
  const [yoloMeta, setYoloMeta] = useState<YoloExportMeta | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedLabel, setSelectedLabel] = useState<LabelFilter>('all')
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isRunningMockAutoLabel, setIsRunningMockAutoLabel] = useState(false)
  const [mockBoxCount, setMockBoxCount] = useState(0)

  const fetchDataset = useCallback(async () => {
    if (!datasetId || Number.isNaN(datasetId)) {
      setErrorMessage('잘못된 데이터셋 주소입니다.')
      setIsLoading(false)
      showToast('잘못된 데이터셋 주소입니다.', 'error')
      return
    }

    try {
      setIsLoading(true)
      setErrorMessage('')
      const response = await getDatasetDetailApi(datasetId)
      setDataset(response.data)
    } catch {
      setErrorMessage('데이터셋 상세 정보를 불러오지 못했습니다.')
      showToast('데이터셋 상세 정보를 불러오지 못했습니다.', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [datasetId, showToast])

  const fetchYoloMeta = useCallback(async () => {
    if (!datasetId || Number.isNaN(datasetId)) {
      setYoloMeta(null)
      return
    }

    try {
      setIsLoadingYoloMeta(true)
      const response = await getYoloExportMetaApi(datasetId)
      setYoloMeta(response.data)
    } catch {
      setYoloMeta(null)
    } finally {
      setIsLoadingYoloMeta(false)
    }
  }, [datasetId])

  useEffect(() => {
    fetchDataset()
  }, [fetchDataset])

  useEffect(() => {
    fetchYoloMeta()
  }, [fetchYoloMeta])

  const frames = useMemo(() => {
    if (!dataset?.videos) return []
    return dataset.videos.flatMap((video) => video.frames ?? [])
  }, [dataset])

  const labelStats = useMemo<LabelStats>(() => {
    const stats: LabelStats = {
      fire: 0,
      smoke: 0,
      carlight: 0,
      negative: 0,
      unlabeled: 0,
    }

    frames.forEach((frame) => {
      const label = getFrameLabel(frame)

      if (!label) {
        stats.unlabeled += 1
        return
      }

      if (
        label === 'fire' ||
        label === 'smoke' ||
        label === 'carlight' ||
        label === 'negative'
      ) {
        stats[label] += 1
      } else {
        stats.unlabeled += 1
      }
    })

    return stats
  }, [frames])

  const noBoxCount = useMemo(() => {
    return frames.filter((frame) => getFrameBoxCount(frame) === 0).length
  }, [frames])

  const boxedFrameCount = frames.length - noBoxCount
  const bboxProgress =
    frames.length === 0 ? 0 : Math.round((boxedFrameCount / frames.length) * 100)

  const labeledCount = frames.length - labelStats.unlabeled
  const progress =
    frames.length === 0 ? 0 : Math.round((labeledCount / frames.length) * 100)

  const filteredFrames = useMemo(() => {
    if (selectedLabel === 'all') return frames

    if (selectedLabel === 'unlabeled') {
      return frames.filter((frame) => !getFrameLabel(frame))
    }

    if (selectedLabel === 'no_bbox') {
      return frames.filter((frame) => getFrameBoxCount(frame) === 0)
    }

    return frames.filter((frame) => getFrameLabel(frame) === selectedLabel)
  }, [frames, selectedLabel])

  const totalPages = Math.max(1, Math.ceil(filteredFrames.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
  const endIndex = Math.min(startIndex + PAGE_SIZE, filteredFrames.length)

  const pagedFrames = useMemo(() => {
    return filteredFrames.slice(startIndex, endIndex)
  }, [filteredFrames, startIndex, endIndex])

  const selectedFrame =
    selectedFrameIndex === null ? null : pagedFrames[selectedFrameIndex] ?? null

  useEffect(() => {
    setCurrentPage(1)
    setSelectedFrameIndex(null)
  }, [selectedLabel])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleOpenFrame = (frameIndex: number) => {
    setSelectedFrameIndex(frameIndex)
  }

  const handleCloseFrame = () => {
    setSelectedFrameIndex(null)
    fetchDataset()
    fetchYoloMeta()
  }

  const handleMoveFrame = (direction: 'prev' | 'next') => {
    setSelectedFrameIndex((prevIndex) => {
      if (prevIndex === null) return prevIndex
      if (direction === 'prev') return Math.max(0, prevIndex - 1)
      return Math.min(pagedFrames.length - 1, prevIndex + 1)
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages))
    setSelectedFrameIndex(null)
  }

  const handleLabel = async (frame: DatasetFrame, labelName: LabelName) => {
    try {
      setErrorMessage('')

      const currentLabel = frame.labels?.[0]

      if (currentLabel) {
        await deleteLabelApi(currentLabel.id)
      }

      await createLabelApi(frame.id, {
        label_name: labelName,
        source: 'manual',
        is_verified: true,
        confidence: null,
      })

      await fetchDataset()
      showToast('라벨이 저장되었습니다.', 'success')
    } catch {
      setErrorMessage('라벨 저장에 실패했습니다.')
      showToast('라벨 저장에 실패했습니다.', 'error')
    }
  }

  const handleDownloadZip = async () => {
    if (!dataset) return

    try {
      setIsExporting(true)
      setErrorMessage('')
      await downloadDatasetZipApi(dataset.id)
      showToast('ZIP Export 다운로드를 시작했습니다.', 'success')
    } catch {
      setErrorMessage('ZIP Export 다운로드에 실패했습니다.')
      showToast('ZIP Export 다운로드에 실패했습니다.', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadYolo = async () => {
    if (!dataset) return

    try {
      setIsExporting(true)
      setErrorMessage('')
      await downloadDatasetYoloApi(dataset.id)
      showToast('YOLO Export 다운로드를 시작했습니다.', 'success')
    } catch {
      setErrorMessage('YOLO Export 다운로드에 실패했습니다.')
      showToast('YOLO Export 다운로드에 실패했습니다.', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  const handleRefreshYoloMeta = async () => {
    await fetchYoloMeta()
    showToast('YOLO Export 상태를 새로고침했습니다.', 'success')
  }

  const createMockBoxesFallback = async () => {
    const targetFrames = frames
      .filter((frame) => getFrameBoxCount(frame) === 0)
      .slice(0, 12)

    if (targetFrames.length === 0) return 0

    await Promise.all(
      targetFrames.map((frame, index) => {
        const mockBox = createMockBox(index)

        return createBoundingBoxApi({
          frame_id: frame.id,
          label_id: null,
          label_name: getMockLabel(index),
          x: mockBox.x,
          y: mockBox.y,
          width: mockBox.width,
          height: mockBox.height,
          source: 'mock',
          confidence: getMockConfidence(index),
          is_verified: false,
        })
      }),
    )

    return targetFrames.length
  }

  const handleRunMockAutoLabel = async () => {
    if (!dataset) return

    try {
      setIsRunningMockAutoLabel(true)
      setErrorMessage('')

      let createdBoxCount = 0

      try {
        const response = await runAutoLabelApi({
          target: 'dataset',
          dataset_id: dataset.id,
          mode: 'mock',
          confidence_threshold: 0.5,
        })

        createdBoxCount = response.data.created_box_count
      } catch {
        createdBoxCount = await createMockBoxesFallback()
      }

      if (createdBoxCount === 0) {
        showToast('Mock Auto Label을 적용할 프레임이 없습니다.', 'info')
        return
      }

      setMockBoxCount((prevCount) => prevCount + createdBoxCount)

      await fetchDataset()
      await fetchYoloMeta()

      showToast(`Mock Auto Label 박스 ${createdBoxCount}개가 생성되었습니다.`, 'success')
    } catch {
      setErrorMessage('Mock Auto Label 실행에 실패했습니다.')
      showToast('Mock Auto Label 실행에 실패했습니다.', 'error')
    } finally {
      setIsRunningMockAutoLabel(false)
    }
  }

  if (isLoading) {
    return (
      <Page className="dataset-page">
        <Loading
          title="데이터셋을 불러오는 중입니다"
          description="프레임, 라벨, 영상 정보를 확인하고 있습니다."
        />
      </Page>
    )
  }

  if (!dataset) {
    return (
      <Page className="dataset-page">
        <EmptyState
          icon="⚠️"
          title="데이터셋을 찾을 수 없습니다"
          description={errorMessage || '요청한 데이터셋 정보를 확인할 수 없습니다.'}
          action={
            <Link to="/datasets" className="ui-button ui-button-secondary">
              데이터셋 목록으로
            </Link>
          }
        />
      </Page>
    )
  }

  return (
    <Page className="dataset-page">
      <PageHeader
        badge="Labeling Studio"
        title={dataset.name}
        description={dataset.description || '데이터셋 설명이 없습니다.'}
        actions={
          <>
            <Link
              to={`/upload?datasetId=${dataset.id}`}
              className="ui-button ui-button-secondary"
            >
              영상 추가
            </Link>

            <button
              type="button"
              className="ui-button ui-button-secondary"
              onClick={handleDownloadZip}
              disabled={isExporting}
            >
              ZIP Export
            </button>

            <button
              type="button"
              className="ui-button ui-button-primary"
              onClick={handleDownloadYolo}
              disabled={isExporting || !yoloMeta?.available}
            >
              YOLO Export
            </button>
          </>
        }
      />

      {errorMessage && <div className="dataset-alert">{errorMessage}</div>}

      <section className="dataset-detail-hero ui-card">
        <div className="dataset-detail-hero-content">
          <span className="ui-badge ui-badge-primary">Annotation Workspace</span>

          <h2>
            프레임을 검수하고
            <br />
            학습 가능한 데이터셋으로 정리합니다.
          </h2>

          <p>
            현재 {frames.length}개의 프레임 중 {labeledCount}개가
            라벨링되었고, {boxedFrameCount}개 프레임에 Bounding Box가 있습니다.
            미분류 또는 박스 없는 프레임을 우선 처리한 뒤 YOLO Export를 진행하세요.
          </p>

          <div className="dataset-detail-hero-actions">
            <button
              type="button"
              className="ui-button ui-button-primary ui-button-lg"
              onClick={() => setSelectedLabel('unlabeled')}
            >
              미분류 먼저 보기
            </button>

            <button
              type="button"
              className="ui-button ui-button-secondary ui-button-lg"
              onClick={() => setSelectedLabel('no_bbox')}
            >
              박스 없는 프레임 보기
            </button>

            <button
              type="button"
              className="ui-button ui-button-secondary ui-button-lg"
              onClick={() => setSelectedLabel('all')}
            >
              전체 프레임 보기
            </button>
          </div>
        </div>

        <div className="dataset-detail-progress-card">
          <div
            className="dataset-detail-progress-ring"
            style={{
              background: `conic-gradient(var(--primary-color) ${
                progress * 3.6
              }deg, rgba(255, 255, 255, 0.08) 0deg)`,
            }}
          >
            <div>
              <strong>{progress}%</strong>
              <span>Labeling</span>
            </div>
          </div>

          <div className="dataset-detail-mini-metrics">
            <div>
              <span>라벨 완료</span>
              <strong>{labeledCount}</strong>
            </div>

            <div>
              <span>BBox 완료</span>
              <strong>{bboxProgress}%</strong>
            </div>

            <div>
              <span>박스 없음</span>
              <strong>{noBoxCount}</strong>
            </div>
          </div>
        </div>
      </section>

      <StatsGrid>
        <StatCard label="전체 프레임" value={frames.length} help="학습 후보 이미지" />
        <StatCard label="라벨 완료" value={labeledCount} help="수동 검수 완료" />
        <StatCard label="BBox 프레임" value={boxedFrameCount} help="박스 포함 프레임" />
        <StatCard
          label="YOLO 박스"
          value={yoloMeta?.export_box_count ?? 0}
          help="Export 대상 박스"
        />
      </StatsGrid>

      <div className="dataset-detail-layout">
        <main className="dataset-detail-main">
          <FrameToolbar
            totalCount={frames.length}
            filteredCount={filteredFrames.length}
            selectedLabel={selectedLabel}
            labelOptions={LABEL_OPTIONS}
            onChangeLabel={setSelectedLabel}
          />

          <FrameGrid
            datasetId={dataset.id}
            frames={pagedFrames}
            labelOptions={LABEL_OPTIONS}
            onOpenFrame={handleOpenFrame}
            onLabelFrame={handleLabel}
          />

          <PaginationBar
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            pageSize={PAGE_SIZE}
            totalCount={filteredFrames.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={handlePageChange}
          />
        </main>

        <aside className="dataset-detail-side">
          <LabelStatsPanel
            stats={labelStats}
            totalCount={frames.length}
            labeledCount={labeledCount}
            progress={progress}
          />

          <DatasetInfoPanel dataset={dataset} frameCount={frames.length} />

          <AutoLabelPanel
            disabled={frames.length === 0}
            isRunningMock={isRunningMockAutoLabel}
            mockBoxCount={mockBoxCount}
            onRunMock={handleRunMockAutoLabel}
          />

          <ExportPanel
            isExporting={isExporting}
            yoloMeta={yoloMeta}
            isLoadingYoloMeta={isLoadingYoloMeta}
            onDownloadZip={handleDownloadZip}
            onDownloadYolo={handleDownloadYolo}
            onRefreshYoloMeta={handleRefreshYoloMeta}
          />
        </aside>
      </div>

      {selectedFrame && (
        <FrameModal
          datasetId={dataset.id}
          frame={selectedFrame}
          frameIndex={selectedFrameIndex ?? 0}
          totalFrames={pagedFrames.length}
          labelOptions={LABEL_OPTIONS}
          onClose={handleCloseFrame}
          onMove={handleMoveFrame}
          onLabel={handleLabel}
        />
      )}
    </Page>
  )
}

export default DatasetDetailPage