import { FormEvent, useEffect, useState } from 'react'
import { useDatasetStore } from '../../stores/datasetStore'
import { useUploadStore } from '../../stores/uploadStore'

function UploadPage() {
  const datasets = useDatasetStore((state) => state.datasets)
  const fetchDatasets = useDatasetStore((state) => state.fetchDatasets)

  const uploadVideo = useUploadStore((state) => state.uploadVideo)
  const uploadedVideoResult = useUploadStore((state) => state.uploadedVideoResult)
  const isUploading = useUploadStore((state) => state.isUploading)

  const [datasetId, setDatasetId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [frameIntervalSeconds, setFrameIntervalSeconds] = useState(3)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    fetchDatasets().catch(() => {
      setErrorMessage('데이터셋 목록을 불러오지 못했습니다.')
    })
  }, [fetchDatasets])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    if (!datasetId) {
      setErrorMessage('업로드할 데이터셋을 선택해주세요.')
      return
    }

    if (!file) {
      setErrorMessage('업로드할 영상 파일을 선택해주세요.')
      return
    }

    try {
      await uploadVideo(Number(datasetId), file, frameIntervalSeconds)
    } catch {
      setErrorMessage('영상 업로드 또는 프레임 추출에 실패했습니다.')
    }
  }

  return (
    <section className="page-card wide">
      <h1>영상 업로드</h1>
      <p>
        화재, 연기, 차량 등화류 영상 파일을 업로드하면 지정한 간격으로
        프레임을 추출합니다.
      </p>

      {errorMessage && <div className="alert error">{errorMessage}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <label>
          데이터셋 선택
          <select
            value={datasetId}
            onChange={(event) => setDatasetId(event.target.value)}
            required
          >
            <option value="">데이터셋을 선택하세요</option>
            {datasets.map((dataset) => (
              <option key={dataset.id} value={dataset.id}>
                {dataset.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          영상 파일
          <input
            type="file"
            accept="video/mp4,video/avi,video/quicktime,video/x-matroska,video/webm"
            onChange={(event) => {
              const selectedFile = event.target.files?.[0] ?? null
              setFile(selectedFile)
            }}
            required
          />
        </label>

        <label>
          프레임 추출 간격 / 초
          <input
            type="number"
            min={1}
            max={30}
            value={frameIntervalSeconds}
            onChange={(event) =>
              setFrameIntervalSeconds(Number(event.target.value))
            }
          />
        </label>

        <button
          type="submit"
          className="button primary full"
          disabled={isUploading}
        >
          {isUploading ? '업로드 및 프레임 추출 중...' : '영상 업로드'}
        </button>
      </form>

      {uploadedVideoResult && (
        <div className="upload-result">
          <h2>업로드 완료</h2>

          <p>
            <strong>영상 파일:</strong>{' '}
            {uploadedVideoResult.video.file_name}
          </p>

          <p>
            <strong>추출된 프레임:</strong>{' '}
            {uploadedVideoResult.extracted_frame_count}개
          </p>

          <div className="frame-preview-grid">
            {uploadedVideoResult.frames.slice(0, 12).map((frame) => (
              <article className="frame-preview-card" key={frame.id}>
                <div className="frame-placeholder">
                  Frame #{frame.frame_number}
                </div>
                <small>
                  {frame.timestamp !== null
                    ? `${frame.timestamp.toFixed(1)}초`
                    : '시간 정보 없음'}
                </small>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default UploadPage