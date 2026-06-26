import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getDatasetDetailApi } from '../../common/api/datasetApi'
import {
  downloadDatasetYoloApi,
  downloadDatasetZipApi,
} from '../../common/api/exportApi'
import { createLabelApi, deleteLabelApi } from '../../common/api/labelApi'
import {
  EmptyState,
  Page,
  PageHeader,
  StatCard,
  StatsGrid,
} from '../../common/components/ui'
import type { Dataset } from '../../types/dataset'
import type { DatasetFrame } from '../../types/frame'
import type { LabelName } from '../../types/label'

import AutoLabelPanel from './components/AutoLabelPanel'
import DatasetInfoPanel from './components/DatasetInfoPanel'
import ExportPanel from './components/ExportPanel'
import FrameGrid from './components/FrameGrid'
import FrameModal from './components/FrameModal'
import FrameToolbar from './components/FrameToolbar'
import LabelStatsPanel from './components/LabelStatsPanel'
import PaginationBar from './components/PaginationBar'

type LabelFilter = LabelName | 'all' | 'unlabeled'

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
  {
    value: 'fire',
    label: '화재',
    className: 'dataset-label-fire',
    shortcut: 'F',
  },
  {
    value: 'smoke',
    label: '연기',
    className: 'dataset-label-smoke',
    shortcut: 'S',
  },
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

function DatasetDetailPage() {
  const params = useParams()
  const datasetId = Number(params.id)

  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedLabel, setSelectedLabel] = useState<LabelFilter>('all')
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchDataset = async () => {
    if (!datasetId || Number.isNaN(datasetId)) {
      setErrorMessage('잘못된 데이터셋 주소입니다.')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setErrorMessage('')

      const response = await getDatasetDetailApi(datasetId)
      setDataset(response.data)
    } catch {
      setErrorMessage('데이터셋 상세 정보를 불러오지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDataset()
  }, [datasetId])

  const frames = useMemo(() => {
    if (!dataset?.videos) return []

    return dataset.videos.flatMap((video) => video.frames ?? [])
  }, [dataset])

  const filteredFrames = useMemo(() => {
    if (selectedLabel === 'all') return frames

    if (selectedLabel === 'unlabeled') {
      return frames.filter((frame) => !getFrameLabel(frame))
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

      if (label === 'fire') stats.fire += 1
      if (label === 'smoke') stats.smoke += 1
      if (label === 'carlight') stats.carlight += 1
      if (label === 'negative') stats.negative += 1
    })

    return stats
  }, [frames])

  const labeledCount = frames.length - labelStats.unlabeled
  const progress =
    frames.length === 0 ? 0 : Math.round((labeledCount / frames.length) * 100)

  const handleOpenFrame = (frameIndex: number) => {
    setSelectedFrameIndex(frameIndex)
  }

  const handleCloseFrame = () => {
    setSelectedFrameIndex(null)
  }

  const handleMoveFrame = (direction: 'prev' | 'next') => {
    setSelectedFrameIndex((prevIndex) => {
      if (prevIndex === null) return prevIndex

      if (direction === 'prev') {
        return Math.max(0, prevIndex - 1)
      }

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
    } catch {
      setErrorMessage('라벨 저장에 실패했습니다.')
    }
  }

  const handleDownloadZip = async () => {
    if (!dataset) return

    try {
      setIsExporting(true)
      setErrorMessage('')

      await downloadDatasetZipApi(dataset.id)
    } catch {
      setErrorMessage('ZIP Export 다운로드에 실패했습니다.')
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
    } catch {
      setErrorMessage('YOLO Export 다운로드에 실패했습니다.')
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return (
      <Page className="dataset-page">
        <EmptyState
          title="데이터셋을 불러오는 중입니다"
          description="프레임과 라벨 정보를 확인하고 있습니다."
        />
      </Page>
    )
  }

  if (!dataset) {
    return (
      <Page className="dataset-page">
        <EmptyState
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
              disabled={isExporting}
            >
              YOLO Export
            </button>
          </>
        }
      />

      {errorMessage && <div className="dataset-alert">{errorMessage}</div>}

      <StatsGrid>
        <StatCard label="전체 프레임" value={frames.length} help="학습 후보 이미지" />
        <StatCard label="라벨 완료" value={labeledCount} help="수동 검수 완료" />
        <StatCard label="미분류" value={labelStats.unlabeled} help="작업 필요 프레임" />
        <StatCard label="진행률" value={`${progress}%`} help="라벨링 완성도" />
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

          <AutoLabelPanel disabled />

          <ExportPanel
            isExporting={isExporting}
            onDownloadZip={handleDownloadZip}
            onDownloadYolo={handleDownloadYolo}
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