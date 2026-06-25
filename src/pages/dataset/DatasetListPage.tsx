import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { useDatasetStore } from '../../stores/datasetStore'

import type { Dataset } from '../../types/dataset'

type DatasetFormState = {
  name: string
  description: string
}

const INITIAL_FORM_STATE: DatasetFormState = {
  name: '',
  description: '',
}

function formatDate(dateText: string | null) {
  if (!dateText) return '날짜 없음'

  const date = new Date(dateText)

  if (Number.isNaN(date.getTime())) {
    return '날짜 없음'
  }

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function getDatasetStatus(dataset: Dataset) {
  const frameCount = dataset.frame_count ?? 0
  const videoCount = dataset.video_count ?? 0

  if (frameCount > 0) {
    return {
      text: '라벨링 가능',
      className: 'ready',
      description: '추출된 프레임이 있어 바로 작업할 수 있습니다.',
    }
  }

  if (videoCount > 0) {
    return {
      text: '추출 대기',
      className: 'pending',
      description: '영상은 있으나 프레임 정보가 부족합니다.',
    }
  }

  return {
    text: '업로드 필요',
    className: 'empty',
    description: '아직 업로드된 영상이 없습니다.',
  }
}

function DatasetListPage() {
  const datasets = useDatasetStore((state) => state.datasets)
  const isLoading = useDatasetStore((state) => state.isLoading)
  const fetchDatasets = useDatasetStore((state) => state.fetchDatasets)
  const createDataset = useDatasetStore((state) => state.createDataset)
  const deleteDataset = useDatasetStore((state) => state.deleteDataset)

  const [form, setForm] = useState<DatasetFormState>(INITIAL_FORM_STATE)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchDatasets().catch(() => {
      setErrorMessage('데이터셋 목록을 불러오지 못했습니다.')
    })
  }, [fetchDatasets])

  const filteredDatasets = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase()

    if (!keyword) return datasets

    return datasets.filter((dataset) => {
      return (
        dataset.name.toLowerCase().includes(keyword) ||
        dataset.description?.toLowerCase().includes(keyword)
      )
    })
  }, [datasets, searchKeyword])

  const totalFrameCount = useMemo(() => {
    return datasets.reduce((sum, dataset) => sum + (dataset.frame_count ?? 0), 0)
  }, [datasets])

  const totalVideoCount = useMemo(() => {
    return datasets.reduce((sum, dataset) => sum + (dataset.video_count ?? 0), 0)
  }, [datasets])

  const readyDatasetCount = useMemo(() => {
    return datasets.filter((dataset) => (dataset.frame_count ?? 0) > 0).length
  }, [datasets])

  const emptyDatasetCount = useMemo(() => {
    return datasets.filter(
      (dataset) =>
        (dataset.video_count ?? 0) === 0 && (dataset.frame_count ?? 0) === 0,
    ).length
  }, [datasets])

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }))
  }

  const handleCreateDataset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setErrorMessage('데이터셋 이름을 입력해주세요.')
      return
    }

    setErrorMessage('')
    setIsCreating(true)

    try {
      await createDataset({
        name: form.name.trim(),
        description: form.description.trim(),
      })

      setForm(INITIAL_FORM_STATE)
    } catch {
      setErrorMessage('데이터셋 생성에 실패했습니다.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteDataset = async (datasetId: number) => {
    const confirmed = window.confirm(
      '이 데이터셋을 삭제할까요? 연결된 영상과 프레임도 함께 삭제될 수 있습니다.',
    )

    if (!confirmed) return

    setErrorMessage('')

    try {
      await deleteDataset(datasetId)
    } catch {
      setErrorMessage('데이터셋 삭제에 실패했습니다.')
    }
  }

  return (
    <section className="dataset-list-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">데이터셋 작업 공간</span>
          <h1>데이터셋 관리</h1>
          <p>
            영상 업로드, 프레임 추출, 라벨링, 바운딩 박스 작업을 수행할
            데이터셋 프로젝트를 생성하고 관리합니다.
          </p>
        </div>

        <Link to="/upload" className="button primary">
          영상 업로드
        </Link>
      </div>

      <div className="dataset-dashboard-grid">
        <article className="dashboard-metric-card">
          <span>전체 데이터셋</span>
          <strong>{datasets.length}</strong>
          <p>생성된 프로젝트 수</p>
        </article>

        <article className="dashboard-metric-card">
          <span>전체 영상</span>
          <strong>{totalVideoCount}</strong>
          <p>업로드된 원본 영상</p>
        </article>

        <article className="dashboard-metric-card">
          <span>전체 프레임</span>
          <strong>{totalFrameCount}</strong>
          <p>추출된 학습 후보 이미지</p>
        </article>

        <article className="dashboard-metric-card">
          <span>작업 가능</span>
          <strong>{readyDatasetCount}</strong>
          <p>프레임이 준비된 데이터셋</p>
        </article>
      </div>

      {errorMessage && <div className="alert error">{errorMessage}</div>}

      <div className="dataset-workspace-layout">
        <article className="dataset-create-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">새 프로젝트</span>
              <h2>데이터셋 생성</h2>
              <p>
                도로·터널 화재 감지 모델 학습에 사용할 데이터셋 단위를
                생성합니다.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateDataset}>
            <label>
              데이터셋 이름
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="예: 터널 화재 주간 데이터셋"
              />
            </label>

            <label>
              설명
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="데이터셋 목적, 수집 조건, 주의사항 등을 적어주세요."
              />
            </label>

            <div className="dataset-create-guide">
              <strong>추천 작성 방식</strong>
              <p>
                수집 환경, 시간대, 라벨 기준을 함께 적어두면 나중에 학습
                데이터셋을 정리할 때 훨씬 편합니다.
              </p>
            </div>

            <button
              type="submit"
              className="button primary"
              disabled={isCreating}
            >
              {isCreating ? '생성 중...' : '데이터셋 생성'}
            </button>
          </form>
        </article>

        <article className="dataset-list-panel">
          <div className="panel-header dataset-list-toolbar">
            <div>
              <span className="eyebrow">프로젝트 목록</span>
              <h2>내 데이터셋</h2>
              <p>
                총 {datasets.length}개 중 {filteredDatasets.length}개가
                표시됩니다. 업로드가 필요한 데이터셋은 {emptyDatasetCount}개입니다.
              </p>
            </div>

            <input
              className="dataset-search-input"
              type="search"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="데이터셋 이름 또는 설명 검색"
            />
          </div>

          {isLoading ? (
            <div className="dataset-empty-state">
              <h3>데이터셋을 불러오는 중입니다</h3>
              <p>잠시만 기다려주세요.</p>
            </div>
          ) : filteredDatasets.length === 0 ? (
            <div className="dataset-empty-state">
              <h3>표시할 데이터셋이 없습니다</h3>
              <p>새 데이터셋을 생성하거나 검색어를 변경해주세요.</p>
            </div>
          ) : (
            <div className="dataset-list-grid">
              {filteredDatasets.map((dataset) => {
                const status = getDatasetStatus(dataset)

                return (
                  <article className="dataset-card" key={dataset.id}>
                    <div className="dataset-card-header">
                      <div>
                        <span className={`dataset-status ${status.className}`}>
                          {status.text}
                        </span>

                        <h2>{dataset.name}</h2>
                        <p>{dataset.description || '설명이 없습니다.'}</p>
                      </div>
                    </div>

                    <div className="dataset-card-summary">
                      <div>
                        <span>영상</span>
                        <strong>{dataset.video_count ?? 0}개</strong>
                      </div>

                      <div>
                        <span>프레임</span>
                        <strong>{dataset.frame_count ?? 0}장</strong>
                      </div>

                      <div>
                        <span>생성일</span>
                        <strong>{formatDate(dataset.created_at)}</strong>
                      </div>
                    </div>

                    <div className="dataset-progress-box">
                      <span>{status.description}</span>

                      <div className="dataset-progress-bar">
                        <i
                          style={{
                            width:
                              (dataset.frame_count ?? 0) > 0
                                ? '100%'
                                : (dataset.video_count ?? 0) > 0
                                  ? '45%'
                                  : '12%',
                          }}
                        />
                      </div>
                    </div>

                    <div className="dataset-card-actions">
                      <Link
                        to={`/datasets/${dataset.id}`}
                        className="button primary"
                      >
                        작업 열기
                      </Link>

                      <Link
                        to={`/upload?datasetId=${dataset.id}`}
                        className="button secondary"
                      >
                        영상 추가
                      </Link>

                      <button
                        type="button"
                        className="button danger"
                        onClick={() => handleDeleteDataset(dataset.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </article>
      </div>
    </section>
  )
}

export default DatasetListPage