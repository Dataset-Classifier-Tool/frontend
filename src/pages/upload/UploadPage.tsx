import { FormEvent, useEffect, useState } from 'react'

import { getDatasetsApi } from '../../common/api/datasetApi'
import { uploadVideoApi } from '../../common/api/uploadApi'
import type { Dataset } from '../../types/dataset'

const ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'avi', 'mov', 'mkv', 'webm']
const MAX_FILE_SIZE_MB = 500
const MIN_FRAME_INTERVAL = 1
const MAX_FRAME_INTERVAL = 60

function UploadPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [datasetId, setDatasetId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [frameIntervalSeconds, setFrameIntervalSeconds] = useState(3)
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

  const validateFile = (selectedFile: File | null) => {
    if (!selectedFile) {
      return '업로드할 영상 파일을 선택해주세요.'
    }

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

    setIsLoading(true)

    try {
      const response = await uploadVideoApi(Number(datasetId), formData)

      setSuccessMessage(
        `영상 업로드 성공! 추출된 프레임 수: ${response.data.extracted_frame_count}개`,
      )

      setFile(null)
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          '영상 업로드 중 오류가 발생했습니다.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="page-card wide">
      <h1>영상 업로드</h1>
      <p>영상을 업로드하면 일정 간격으로 프레임이 자동 추출됩니다.</p>

      {errorMessage && <div className="alert error">{errorMessage}</div>}
      {successMessage && <div className="alert success">{successMessage}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <label>
          데이터셋 선택
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
          프레임 추출 간격 초
          <input
            type="number"
            min={MIN_FRAME_INTERVAL}
            max={MAX_FRAME_INTERVAL}
            value={frameIntervalSeconds}
            onChange={(event) =>
              setFrameIntervalSeconds(Number(event.target.value))
            }
          />
        </label>

        <label>
          영상 파일
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
        </label>

        {file && (
          <div className="upload-box">
            <strong>{file.name}</strong>
            <span>{(file.size / 1024 / 1024).toFixed(2)}MB</span>
          </div>
        )}

        <button
          type="submit"
          className="button primary full"
          disabled={isLoading || datasets.length === 0}
        >
          {isLoading ? '업로드 및 프레임 추출 중...' : '영상 업로드하기'}
        </button>
      </form>
    </section>
  )
}

export default UploadPage