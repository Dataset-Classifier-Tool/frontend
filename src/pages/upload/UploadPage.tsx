import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { getDatasetsApi } from '../../common/api/datasetApi'
import { uploadVideoApi } from '../../common/api/uploadApi'

import type { Dataset } from '../../types/dataset'

const ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'avi', 'mov', 'mkv', 'webm']
const MAX_FILE_SIZE_MB = 500
const MIN_FRAME_INTERVAL = 1
const MAX_FRAME_INTERVAL = 60

type TargetWidthOption = 'original' | '640' | '960' | '1280'

function UploadPage() {
  const navigate = useNavigate()

  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [datasetId, setDatasetId] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const [frameIntervalSeconds, setFrameIntervalSeconds] = useState(3)
  const [targetWidth, setTargetWidth] = useState<TargetWidthOption>('640')
  const [autoLabel, setAutoLabel] = useState(true)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    getDatasetsApi()
      .then((response) => {
        setDatasets(response.data)

        if (response.data.length > 0) {
          setDatasetId(String(response.data[0].id))
        }
      })
      .catch(() => {
        setErrorMessage('데이터셋 목록을 불러오지 못했습니다.')
      })
  }, [])

  const selectedDataset = datasets.find(
    (dataset) => dataset.id === Number(datasetId),
  )

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

  const decreaseInterval = () => {
    setFrameIntervalSeconds((prev) => Math.max(MIN_FRAME_INTERVAL, prev - 1))
  }

  const increaseInterval = () => {
    setFrameIntervalSeconds((prev) => Math.min(MAX_FRAME_INTERVAL, prev + 1))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setErrorMessage('')
    setSuccessMessage('')

    if (!datasetId) {
      setErrorMessage('영상을 업로드할 데이터셋을 선택해주세요.')
      return
    }

    const fileError = validateFile(file)

    if (fileError) {
      setErrorMessage(fileError)
      return
    }

    const intervalError = validateFrameInterval()

    if (intervalError) {
      setErrorMessage(intervalError)
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

      setSuccessMessage(
        `영상 업로드 성공! 추출 프레임 ${response.data.extracted_frame_count}개${widthText}${autoLabelText}`,
      )

      setFile(null)

      setTimeout(() => {
        navigate(`/datasets/${datasetId}`)
      }, 1200)
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || '영상 업로드 중 오류가 발생했습니다.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="upload-modern-page">
      <div className="upload-modern-header">
        <div>
          <span className="eyebrow">영상 업로드</span>
          <h1>학습 후보 프레임 추출</h1>
          <p>
            원본 영상에서 일정 간격으로 프레임을 추출하고, 선택한 데이터셋에
            학습 후보 이미지로 저장합니다.
          </p>
        </div>

        <Link to="/datasets" className="button secondary">
          ← 데이터셋 목록
        </Link>
      </div>

      {errorMessage && <div className="alert error">{errorMessage}</div>}
      {successMessage && <div className="alert success">{successMessage}</div>}

      <div className="upload-modern-layout">
        <form className="upload-modern-card" onSubmit={handleSubmit}>
          <div className="panel-header">
            <div>
              <span className="eyebrow">업로드 설정</span>
              <h2>영상 파일 선택</h2>
              <p>
                데이터셋을 선택한 뒤 영상을 업로드하면 프레임 추출과 자동
                라벨링을 한 번에 실행할 수 있습니다.
              </p>
            </div>
          </div>

          <label>
            저장할 데이터셋
            <select
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
          </label>

          <label>
            영상 파일 선택 <span className="field-hint">(MP4 권장)</span>
            <div className={file ? 'modern-dropzone selected' : 'modern-dropzone'}>
              <input
                type="file"
                accept=".mp4,.avi,.mov,.mkv,.webm"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0] ?? null
                  setFile(selectedFile)
                  setErrorMessage('')
                  setSuccessMessage('')
                }}
              />

              <div className="dropzone-icon">⬆</div>

              <strong>
                {file
                  ? file.name
                  : '여기에 영상을 드래그하거나 클릭해서 선택하세요'}
              </strong>

              <p>MP4, MOV, AVI, MKV, WEBM 파일을 지원합니다.</p>
            </div>
          </label>

          {file && (
            <div className="selected-file-row">
              <span>선택된 파일</span>
              <strong>{file.name}</strong>
              <em>{(file.size / 1024 / 1024).toFixed(2)}MB</em>
            </div>
          )}

          <label>
            프레임 추출 간격
            <div className="interval-control">
              <button type="button" onClick={decreaseInterval}>
                −
              </button>

              <input
                type="number"
                min={MIN_FRAME_INTERVAL}
                max={MAX_FRAME_INTERVAL}
                value={frameIntervalSeconds}
                onChange={(event) =>
                  setFrameIntervalSeconds(Number(event.target.value))
                }
              />

              <button type="button" onClick={increaseInterval}>
                +
              </button>
            </div>
            <small>
              예: 3초로 설정하면 영상에서 3초마다 1장의 프레임을 추출합니다.
            </small>
          </label>

          <label>
            프레임 저장 해상도
            <select
              value={targetWidth}
              onChange={(event) =>
                setTargetWidth(event.target.value as TargetWidthOption)
              }
            >
              <option value="original">원본 유지</option>
              <option value="640">640px</option>
              <option value="960">960px</option>
              <option value="1280">1280px</option>
            </select>
          </label>

          <label className="modern-check-row">
            <input
              type="checkbox"
              checked={autoLabel}
              onChange={(event) => setAutoLabel(event.target.checked)}
            />
            <span>업로드 후 AI 자동 라벨링 실행</span>
          </label>

          <button
            type="submit"
            className="button primary full"
            disabled={isLoading || datasets.length === 0}
          >
            {isLoading ? '업로드 및 프레임 추출 중...' : '영상 업로드 시작'}
          </button>
        </form>

        <aside className="upload-side-stack">
          <article className="upload-side-card">
            <span className="eyebrow">작업 흐름 안내</span>
            <h2>프레임 추출 흐름</h2>

            <div className="upload-step-list">
              <div className="upload-step-item">
                <strong>1</strong>
                <div>
                  <h3>데이터셋 선택</h3>
                  <p>업로드한 영상을 저장할 프로젝트를 선택합니다.</p>
                </div>
              </div>

              <div className="upload-step-item">
                <strong>2</strong>
                <div>
                  <h3>영상 업로드</h3>
                  <p>도로, 터널, 화재, 연기 관련 원본 영상을 업로드합니다.</p>
                </div>
              </div>

              <div className="upload-step-item">
                <strong>3</strong>
                <div>
                  <h3>프레임 자동 추출</h3>
                  <p>설정한 간격에 따라 학습 후보 이미지를 생성합니다.</p>
                </div>
              </div>

              <div className="upload-step-item">
                <strong>4</strong>
                <div>
                  <h3>라벨링 진행</h3>
                  <p>추출된 프레임을 확인하고 라벨을 지정합니다.</p>
                </div>
              </div>
            </div>
          </article>

          <article className="upload-side-card compact">
            <span className="eyebrow">선택된 데이터셋</span>
            {selectedDataset ? (
              <>
                <h2>{selectedDataset.name}</h2>
                <p>{selectedDataset.description || '설명이 없습니다.'}</p>
              </>
            ) : (
              <>
                <h2>선택된 데이터셋 없음</h2>
                <p>좌측에서 데이터셋을 선택해주세요.</p>
              </>
            )}
          </article>

          <article className="upload-side-card compact result">
            <span className="eyebrow">업로드 결과</span>
            <h2>{successMessage ? '업로드 완료' : '대기 중'}</h2>
            <p>
              {successMessage ||
                '아직 업로드된 영상이 없습니다. 영상을 업로드해보세요.'}
            </p>
          </article>
        </aside>
      </div>
    </section>
  )
}

export default UploadPage