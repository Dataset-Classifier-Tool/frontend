import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { getDatasetsApi } from '../../features/dataset/api/datasetApi'
import { uploadVideoApi } from '../../features/upload/api/uploadApi'
import {
  Page,
  PageHeader,
  StatCard,
  StatsGrid,
  useToast,
} from '../../common/ui'
import type { Dataset } from '../../types/dataset'

import {
  UploadDropZone,
  UploadFlowPanel,
  UploadSettingsGrid,
  UploadSummaryPanel,
} from '../../features/upload'

const ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'avi', 'mov', 'mkv', 'webm']
const MAX_FILE_SIZE_MB = 500
const MIN_FRAME_INTERVAL = 1
const MAX_FRAME_INTERVAL = 60

type TargetWidthOption = 'original' | '640' | '960' | '1280' | '1920'

function UploadPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [datasetId, setDatasetId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [frameIntervalSeconds, setFrameIntervalSeconds] = useState(3)
  const [targetWidth, setTargetWidth] = useState<TargetWidthOption>('640')
  const [autoLabel, setAutoLabel] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    getDatasetsApi()
      .then((response) => {
        const datasetList = response.data
        const queryDatasetId = searchParams.get('datasetId')

        setDatasets(datasetList)

        if (queryDatasetId) {
          setDatasetId(queryDatasetId)
          return
        }

        if (datasetList.length > 0) {
          setDatasetId(String(datasetList[0].id))
        }
      })
      .catch(() => {
        setErrorMessage('데이터셋 목록을 불러오지 못했습니다.')
        showToast('데이터셋 목록을 불러오지 못했습니다.', 'error')
      })
  }, [searchParams, showToast])

  const selectedDataset = datasets.find((dataset) => dataset.id === Number(datasetId))

  const selectedFileSizeMb = useMemo(() => {
    return file ? file.size / 1024 / 1024 : 0
  }, [file])

  const selectedFileExtension = useMemo(() => {
    return file?.name.split('.').pop()?.toUpperCase() || '선택 전'
  }, [file])

  const estimatedFramesText = useMemo(() => {
    return file ? `${frameIntervalSeconds}초마다 1장 추출` : '영상 선택 후 확인 가능'
  }, [file, frameIntervalSeconds])

  const validateFile = (selectedFile: File | null) => {
    if (!selectedFile) return '업로드할 영상 파일을 선택해주세요.'

    const extension = selectedFile.name.split('.').pop()?.toLowerCase()

    if (!extension || !ALLOWED_VIDEO_EXTENSIONS.includes(extension)) {
      return '지원하지 않는 영상 파일 형식입니다.'
    }

    const fileSizeMb = selectedFile.size / 1024 / 1024

    if (fileSizeMb > MAX_FILE_SIZE_MB) {
      return `영상 파일은 최대 ${MAX_FILE_SIZE_MB}MB까지 업로드할 수 있습니다.`
    }

    if (selectedFile.size <= 0) {
      return '비어 있는 파일은 업로드할 수 없습니다.'
    }

    return null
  }

  const validateFrameInterval = () => {
    if (frameIntervalSeconds < MIN_FRAME_INTERVAL) {
      return `프레임 추출 간격은 최소 ${MIN_FRAME_INTERVAL}초 이상이어야 합니다.`
    }

    if (frameIntervalSeconds > MAX_FRAME_INTERVAL) {
      return `프레임 추출 간격은 최대 ${MAX_FRAME_INTERVAL}초 이하여야 합니다.`
    }

    return null
  }

  const applySelectedFile = (selectedFile: File | null) => {
    setErrorMessage('')
    setSuccessMessage('')

    const fileError = validateFile(selectedFile)

    if (fileError) {
      setFile(null)
      setErrorMessage(fileError)
      showToast(fileError, 'warning')
      return
    }

    setFile(selectedFile)
    showToast('영상 파일이 선택되었습니다.', 'success')
  }

  const clearSelectedFile = () => {
    setFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFrameIntervalChange = (value: number) => {
    if (Number.isNaN(value)) return

    setFrameIntervalSeconds(
      Math.min(MAX_FRAME_INTERVAL, Math.max(MIN_FRAME_INTERVAL, value)),
    )
  }

  const handleUpload = async () => {
    setErrorMessage('')
    setSuccessMessage('')

    if (!datasetId) {
      setErrorMessage('영상을 업로드할 데이터셋을 선택해주세요.')
      showToast('영상을 업로드할 데이터셋을 선택해주세요.', 'warning')
      return
    }

    const fileError = validateFile(file)

    if (fileError) {
      setErrorMessage(fileError)
      showToast(fileError, 'warning')
      return
    }

    const intervalError = validateFrameInterval()

    if (intervalError) {
      setErrorMessage(intervalError)
      showToast(intervalError, 'warning')
      return
    }

    if (!file) return

    const formData = new FormData()

    formData.append('file', file)
    formData.append('frame_interval_seconds', String(frameIntervalSeconds))
    formData.append('auto_label', String(autoLabel))
    formData.append('target_width', targetWidth === 'original' ? '' : targetWidth)

    setIsLoading(true)

    try {
      const response = await uploadVideoApi(Number(datasetId), formData)

      const autoLabelText = response.data.auto_label_result
        ? ` / 자동 라벨링 ${response.data.auto_label_result.labeled_frames}개 완료`
        : ''

      const widthText = response.data.target_width
        ? ` / 저장 해상도 ${response.data.target_width}px`
        : ' / 원본 해상도 유지'

      const message = `영상 업로드 성공! 추출 프레임 ${response.data.extracted_frame_count}개${widthText}${autoLabelText}`

      setSuccessMessage(message)
      showToast('영상 업로드가 완료되었습니다.', 'success')

      clearSelectedFile()

      window.setTimeout(() => {
        navigate(`/datasets/${datasetId}`)
      }, 1000)
    } catch (error: any) {
      const message =
        error.response?.data?.message || '영상 업로드 중 오류가 발생했습니다.'

      setErrorMessage(message)
      showToast(message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Page className="upload-page">
      <PageHeader
        badge="Upload Studio"
        title="영상 업로드"
        description="원천 영상을 선택한 데이터셋에 업로드하고, 일정 간격으로 프레임을 추출해 학습 후보 이미지로 저장합니다."
        actions={
          <>
            <Link to="/datasets" className="ui-button ui-button-secondary">
              데이터셋 목록
            </Link>

            <Link to="/" className="ui-button ui-button-secondary">
              대시보드
            </Link>
          </>
        }
      />

      {errorMessage && <div className="dataset-alert">{errorMessage}</div>}
      {successMessage && <div className="upload-success">{successMessage}</div>}

      <StatsGrid>
        <StatCard
          label="선택 데이터셋"
          value={selectedDataset?.name || '선택 필요'}
          help="프레임이 저장될 프로젝트"
        />

        <StatCard
          label="파일 형식"
          value={selectedFileExtension}
          help="지원 영상 포맷"
        />

        <StatCard
          label="파일 크기"
          value={file ? `${selectedFileSizeMb.toFixed(1)}MB` : '선택 필요'}
          help={`최대 ${MAX_FILE_SIZE_MB}MB`}
        />

        <StatCard
          label="추출 간격"
          value={`${frameIntervalSeconds}초`}
          help={estimatedFramesText}
        />
      </StatsGrid>

      <div className="upload-layout">
        <main className="upload-main-panel ui-card">
          <div className="upload-section-head">
            <span className="ui-badge ui-badge-primary">업로드 설정</span>
            <h2>원천 영상 선택</h2>
            <p>
              데이터셋, 추출 간격, 저장 해상도, 자동 라벨링 여부를 설정한 뒤
              업로드를 시작합니다.
            </p>
          </div>

          <div className="ui-form-group">
            <label className="ui-label" htmlFor="upload-dataset">
              저장할 데이터셋 <span className="ui-required">*</span>
            </label>

            <select
              id="upload-dataset"
              className="ui-select"
              value={datasetId}
              onChange={(event) => setDatasetId(event.target.value)}
              required
            >
              {datasets.length === 0 ? (
                <option value="">데이터셋이 없습니다</option>
              ) : (
                datasets.map((dataset) => (
                  <option key={dataset.id} value={dataset.id}>
                    {dataset.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <UploadDropZone
            file={file}
            fileInputRef={fileInputRef}
            isDragging={isDragging}
            selectedFileSizeMb={selectedFileSizeMb}
            maxFileSizeMb={MAX_FILE_SIZE_MB}
            onFileChange={applySelectedFile}
            onClearFile={clearSelectedFile}
            onDraggingChange={setIsDragging}
          />

          <UploadSettingsGrid
            frameIntervalSeconds={frameIntervalSeconds}
            targetWidth={targetWidth}
            autoLabel={autoLabel}
            isUploading={isLoading}
            onFrameIntervalChange={handleFrameIntervalChange}
            onTargetWidthChange={(value) => setTargetWidth(value as TargetWidthOption)}
            onAutoLabelChange={setAutoLabel}
            onUpload={handleUpload}
          />
        </main>

        <aside className="upload-side-panel">
          <UploadSummaryPanel
            selectedDataset={selectedDataset}
            file={file}
            selectedFileSizeMb={selectedFileSizeMb}
            frameIntervalSeconds={frameIntervalSeconds}
            targetWidth={targetWidth}
            autoLabel={autoLabel}
          />

          <UploadFlowPanel />
        </aside>
      </div>
    </Page>
  )
}

export default UploadPage