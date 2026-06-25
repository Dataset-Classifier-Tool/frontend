import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  autoLabelDatasetApi,
  type LabelCounts,
} from '../../common/api/classifierApi'
import { getDatasetDetailApi } from '../../common/api/datasetApi'
import {
  downloadDatasetYoloApi,
  downloadDatasetZipApi,
  getYoloExportMetaApi,
  type YoloExportMeta,
} from '../../common/api/exportApi'

import type { Dataset } from '../../types/dataset'
import type { DatasetFrame } from '../../types/frame'
import type { LabelName } from '../../types/label'

import AutoLabelPanel from './components/AutoLabelPanel'
import ExportPanel from './components/ExportPanel'
import { FrameGrid } from './components/FrameGrid'
import { FrameModal } from './components/FrameModal'
import FrameToolbar from './components/FrameToolbar'
import LabelFilterBar from './components/LabelFilterBar'
import { LabelStatsPanel } from './components/LabelStatsPanel'
import PaginationBar from './components/PaginationBar'

import useDatasetFrames from '../../common/hooks/useDatasetFrames'
import useFrameFilter from '../../common/hooks/useFrameFilter'
import useFrameLabeling from '../../common/hooks/useFrameLabeling'
import useFramePagination from '../../common/hooks/useFramePagination'
import useLabelStats from '../../common/hooks/useLabelStats'

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

type EmptyStateProps = {
  title: string
  description: string
  buttonText: string
  onClick: () => void
}

function EmptyState({
  title,
  description,
  buttonText,
  onClick,
}: EmptyStateProps) {
  return (
    <section>
      <article className="dataset-card empty">
        <h2>{title}</h2>
        <p>{description}</p>

        <button type="button" className="button primary" onClick={onClick}>
          {buttonText}
        </button>
      </article>
    </section>
  )
}

function DatasetDetailPage() {
  const navigate = useNavigate()
  const { datasetId } = useParams()

  const numericDatasetId = Number(datasetId)
  const isValidDatasetId =
    Number.isInteger(numericDatasetId) && numericDatasetId > 0

  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [selectedFrame, setSelectedFrame] = useState<DatasetFrame | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isAutoLabeling, setIsAutoLabeling] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isYoloExporting, setIsYoloExporting] = useState(false)
  const [isYoloMetaLoading, setIsYoloMetaLoading] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')
  const [autoLabelMessage, setAutoLabelMessage] = useState('')
  const [autoLabelCounts, setAutoLabelCounts] = useState<LabelCounts | null>(
    null,
  )
  const [yoloExportMeta, setYoloExportMeta] = useState<YoloExportMeta | null>(
    null,
  )

  const { allFrames } = useDatasetFrames(dataset)
  const { filter, setFilter, filteredFrames } = useFrameFilter(allFrames)
  const { labelStats, labeledFrameCount } = useLabelStats(allFrames)

  const {
    currentPage,
    totalPages,
    paginatedFrames,
    visibleStart,
    visibleEnd,
    goToPage,
  } = useFramePagination({
    filteredFrames,
    framesPerPage: FRAMES_PER_PAGE,
    resetKey: filter,
  })

  const {
    isLabelLoading,
    labelErrorMessage,
    setLabelErrorMessage,
    handleCreateLabel,
    handleDeleteLabel,
  } = useFrameLabeling({
    allFrames,
    setDataset,
    setSelectedFrame,
  })

  const selectedFrameIndex = useMemo(() => {
    if (!selectedFrame) return -1

    return filteredFrames.findIndex((frame) => frame.id === selectedFrame.id)
  }, [filteredFrames, selectedFrame])

  const reloadYoloExportMeta = async () => {
    if (!isValidDatasetId) return

    setIsYoloMetaLoading(true)

    try {
      const response = await getYoloExportMetaApi(numericDatasetId)
      setYoloExportMeta(response.data)
    } catch {
      setYoloExportMeta(null)
    } finally {
      setIsYoloMetaLoading(false)
    }
  }

  const reloadDatasetDetail = async () => {
    if (!isValidDatasetId) {
      setErrorMessage('잘못된 데이터셋 주소입니다.')
      return
    }

    const response = await getDatasetDetailApi(numericDatasetId)
    setDataset(response.data)

    await reloadYoloExportMeta()
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
    if (!labelErrorMessage) return

    setErrorMessage(labelErrorMessage)
    setLabelErrorMessage('')
  }, [labelErrorMessage, setLabelErrorMessage])

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

  const handleDownloadDatasetYolo = async () => {
    if (!isValidDatasetId) {
      setErrorMessage('잘못된 데이터셋 주소입니다.')
      return
    }

    if (!yoloExportMeta?.available) {
      setErrorMessage(
        'YOLO Export 가능한 Bounding Box가 없습니다. 먼저 박스를 생성해주세요.',
      )
      return
    }

    setIsYoloExporting(true)
    setErrorMessage('')
    setAutoLabelMessage('')

    try {
      await downloadDatasetYoloApi(numericDatasetId)
      await reloadYoloExportMeta()
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          'YOLO Export 다운로드 중 오류가 발생했습니다.',
      )
    } finally {
      setIsYoloExporting(false)
    }
  }

  const moveSelectedFrame = (direction: 'prev' | 'next') => {
    if (!selectedFrame) return

    const nextIndex =
      direction === 'next' ? selectedFrameIndex + 1 : selectedFrameIndex - 1

    if (nextIndex < 0 || nextIndex >= filteredFrames.length) return

    const nextFrame = filteredFrames[nextIndex]
    const nextPage = Math.floor(nextIndex / FRAMES_PER_PAGE) + 1

    goToPage(nextPage)
    setSelectedFrame(nextFrame)
  }

  if (isLoading) {
    return <p>불러오는 중...</p>
  }

  if (!isValidDatasetId) {
    return (
      <EmptyState
        title="잘못된 데이터셋 주소입니다"
        description="데이터셋 목록에서 다시 접근해주세요."
        buttonText="데이터셋 목록으로"
        onClick={() => navigate('/datasets')}
      />
    )
  }

  if (!dataset) {
    return (
      <EmptyState
        title="데이터셋 정보가 없습니다"
        description={errorMessage || '데이터셋 정보를 불러오지 못했습니다.'}
        buttonText="데이터셋 목록으로"
        onClick={() => navigate('/datasets')}
      />
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
            onClick={() => navigate('/datasets')}
          >
            목록으로
          </button>
        </div>
      </div>

      {errorMessage && <div className="alert error">{errorMessage}</div>}

      <div className="dataset-side-layout">
        <AutoLabelPanel
          isAutoLabeling={isAutoLabeling}
          hasFrames={allFrames.length > 0}
          autoLabelMessage={autoLabelMessage}
          autoLabelCounts={autoLabelCounts}
          onAutoLabelClick={handleAutoLabelDataset}
        />

        <ExportPanel
          isExporting={isExporting}
          isYoloExporting={isYoloExporting}
          isYoloMetaLoading={isYoloMetaLoading}
          labeledFrameCount={labeledFrameCount}
          totalFrameCount={allFrames.length}
          yoloExportFrameCount={yoloExportMeta?.export_frame_count ?? 0}
          yoloExportBoxCount={yoloExportMeta?.export_box_count ?? 0}
          yoloTrainFrameCount={yoloExportMeta?.train_frame_count ?? 0}
          yoloValFrameCount={yoloExportMeta?.val_frame_count ?? 0}
          yoloClassCounts={yoloExportMeta?.class_counts ?? {}}
          onExportClick={handleDownloadDatasetZip}
          onYoloExportClick={handleDownloadDatasetYolo}
          onRefreshYoloMeta={reloadYoloExportMeta}
        />
      </div>

      <LabelStatsPanel
        labelOptions={LABEL_OPTIONS}
        labelStats={labelStats}
        autoLabelCounts={autoLabelCounts}
        onRefresh={reloadDatasetDetail}
      />

      <FrameToolbar
        filteredFrameCount={filteredFrames.length}
        visibleStart={visibleStart}
        visibleEnd={visibleEnd}
        currentPage={currentPage}
        totalPages={totalPages}
        framesPerPage={FRAMES_PER_PAGE}
        onPrevPage={() => goToPage(currentPage - 1)}
        onNextPage={() => goToPage(currentPage + 1)}
      />

      <LabelFilterBar
        filter={filter}
        allFrameCount={allFrames.length}
        labelOptions={LABEL_OPTIONS}
        labelText={LABEL_TEXT}
        labelStats={labelStats}
        onChangeFilter={setFilter}
      />

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

      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onGoToPage={goToPage}
      />

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