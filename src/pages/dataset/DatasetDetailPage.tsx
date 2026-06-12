import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getDatasetDetailApi } from '../../common/api/datasetApi'
import { getFrameImageUrl } from '../../common/api/uploadApi'
import { useLabelStore } from '../../stores/labelStore'
import type { Dataset } from '../../types/dataset'
import type { LabelName } from '../../types/label'

const LABEL_OPTIONS: LabelName[] = [
  'fire',
  'smoke',
  'carlight',
  'negative',
  'fire_smoke',
  'fire_smoke_carlight',
]

function DatasetDetailPage() {
  const navigate = useNavigate()
  const { datasetId } = useParams()

  const createLabel = useLabelStore((state) => state.createLabel)
  const deleteLabel = useLabelStore((state) => state.deleteLabel)
  const isLabelLoading = useLabelStore((state) => state.isLoading)

  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchDatasetDetail = async () => {
      if (!datasetId) return

      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await getDatasetDetailApi(Number(datasetId))
        setDataset(response.data)
      } catch {
        setErrorMessage('데이터셋 상세 정보를 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDatasetDetail()
  }, [datasetId])

  const handleCreateLabel = async (frameId: number, labelName: LabelName) => {
    setErrorMessage('')

    try {
      const createdLabel = await createLabel(frameId, {
        label_name: labelName,
        source: 'manual',
        is_verified: true,
      })

      setDataset((prevDataset) => {
        if (!prevDataset || !prevDataset.videos) return prevDataset

        return {
          ...prevDataset,
          videos: prevDataset.videos.map((video) => ({
            ...video,
            frames: video.frames?.map((frame) => {
              if (frame.id !== frameId) return frame

              return {
                ...frame,
                labels: [createdLabel],
              }
            }),
          })),
        }
      })
    } catch {
      setErrorMessage('라벨 저장에 실패했습니다.')
    }
  }

  const handleDeleteLabel = async (frameId: number, labelId: number) => {
    setErrorMessage('')

    try {
      await deleteLabel(labelId)

      setDataset((prevDataset) => {
        if (!prevDataset || !prevDataset.videos) return prevDataset

        return {
          ...prevDataset,
          videos: prevDataset.videos.map((video) => ({
            ...video,
            frames: video.frames?.map((frame) => {
              if (frame.id !== frameId) return frame

              return {
                ...frame,
                labels: frame.labels.filter((label) => label.id !== labelId),
              }
            }),
          })),
        }
      })
    } catch {
      setErrorMessage('라벨 삭제에 실패했습니다.')
    }
  }

  if (isLoading) {
    return <p>불러오는 중...</p>
  }

  if (errorMessage) {
    return <div className="alert error">{errorMessage}</div>
  }

  if (!dataset) {
    return <p>데이터셋 정보가 없습니다.</p>
  }

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
      </div>

      {!dataset.videos || dataset.videos.length === 0 ? (
        <article className="dataset-card empty">
          <h2>아직 업로드된 영상이 없습니다</h2>
          <p>영상을 업로드하면 프레임이 자동으로 추출됩니다.</p>
        </article>
      ) : (
        <div className="video-list">
          {dataset.videos.map((video) => (
            <article className="video-card" key={video.id}>
              <div className="video-card-header">
                <div>
                  <h2>{video.file_name}</h2>
                  <p>
                    FPS {video.fps?.toFixed(2) ?? '-'} · 원본 프레임{' '}
                    {video.original_frame_count ?? 0}개 · 추출 프레임{' '}
                    {video.frame_count}개
                  </p>
                </div>
              </div>

              {!video.frames || video.frames.length === 0 ? (
                <p>추출된 프레임이 없습니다.</p>
              ) : (
                <div className="frame-preview-grid">
                  {video.frames.slice(0, 24).map((frame) => (
                    <article className="frame-preview-card" key={frame.id}>
                      <img
                        className="frame-image"
                        src={getFrameImageUrl(frame.id)}
                        alt={`Frame ${frame.frame_number}`}
                      />

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
                            <span
                              className="label-chip removable"
                              key={label.id}
                            >
                              {label.label_name}
                              <button
                                type="button"
                                className="label-remove-button"
                                onClick={() =>
                                  handleDeleteLabel(frame.id, label.id)
                                }
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
                            onClick={() =>
                              handleCreateLabel(frame.id, labelName)
                            }
                          >
                            {labelName}
                          </button>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default DatasetDetailPage