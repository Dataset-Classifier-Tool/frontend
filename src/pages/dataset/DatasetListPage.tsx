import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDatasetStore } from '../../stores/datasetStore'

import type { Dataset } from '../../types/dataset'

type DatasetWithStats = Dataset & {
  video_count?: number
  frame_count?: number
}

function DatasetListPage() {
  const navigate = useNavigate()

  const datasets = useDatasetStore((state) => state.datasets) as DatasetWithStats[]
  const isLoading = useDatasetStore((state) => state.isLoading)
  const fetchDatasets = useDatasetStore((state) => state.fetchDatasets)
  const createDataset = useDatasetStore((state) => state.createDataset)
  const deleteDataset = useDatasetStore((state) => state.deleteDataset)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [search, setSearch] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    fetchDatasets().catch(() => {
      setErrorMessage('데이터셋 목록을 불러오지 못했습니다.')
    })
  }, [fetchDatasets])

  const totalVideos = useMemo(() => {
    return datasets.reduce((sum, dataset) => sum + (dataset.video_count ?? 0), 0)
  }, [datasets])

  const totalFrames = useMemo(() => {
    return datasets.reduce((sum, dataset) => sum + (dataset.frame_count ?? 0), 0)
  }, [datasets])

  const filteredDatasets = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) return datasets

    return datasets.filter((dataset) => {
      const name = dataset.name.toLowerCase()
      const description = dataset.description?.toLowerCase() ?? ''

      return name.includes(keyword) || description.includes(keyword)
    })
  }, [datasets, search])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '날짜 정보 없음'

    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString))
  }

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    const trimmedName = name.trim()
    const trimmedDescription = description.trim()

    if (trimmedName.length < 2) {
      setErrorMessage('데이터셋 이름은 2글자 이상 입력해주세요.')
      return
    }

    try {
      await createDataset({
        name: trimmedName,
        description: trimmedDescription,
      })

      setName('')
      setDescription('')
      setIsCreateOpen(false)
    } catch {
      setErrorMessage('데이터셋 생성에 실패했습니다.')
    }
  }

  const handleDelete = async (datasetId: number) => {
    const confirmed = window.confirm('정말 이 데이터셋을 삭제할까요?')

    if (!confirmed) return

    setErrorMessage('')

    try {
      await deleteDataset(datasetId)
    } catch {
      setErrorMessage('데이터셋 삭제에 실패했습니다.')
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <span className="eyebrow">Dataset Dashboard</span>
          <h1>내 데이터셋</h1>
          <p>영상, 프레임, 라벨, Bounding Box를 프로젝트 단위로 관리합니다.</p>
        </div>

        <button
          className="button primary"
          type="button"
          onClick={() => setIsCreateOpen((prev) => !prev)}
        >
          {isCreateOpen ? '닫기' : '새 데이터셋 만들기'}
        </button>
      </div>

      {errorMessage && <div className="alert error">{errorMessage}</div>}

      <div className="dashboard-summary-grid">
        <article className="summary-card">
          <strong>{datasets.length}</strong>
          <span>Datasets</span>
        </article>

        <article className="summary-card">
          <strong>{totalVideos}</strong>
          <span>Videos</span>
        </article>

        <article className="summary-card">
          <strong>{totalFrames}</strong>
          <span>Frames</span>
        </article>
      </div>

      {isCreateOpen && (
        <form className="dataset-create-form" onSubmit={handleCreate}>
          <div>
            <h2>새 데이터셋 생성</h2>
            <p>도로, 터널, 화재, 연기, 차량 등화류 데이터를 프로젝트 단위로 관리하세요.</p>
          </div>

          <label>
            데이터셋 이름
            <input
              type="text"
              placeholder="예: Tunnel Fire Dataset"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
            />
          </label>

          <label>
            설명
            <textarea
              placeholder="예: 터널 내부 화재 및 연기 감지 학습용 데이터셋"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <div className="card-actions">
            <button type="submit" className="button primary" disabled={isLoading}>
              {isLoading ? '생성 중...' : '생성하기'}
            </button>

            <button
              type="button"
              className="button secondary"
              onClick={() => setIsCreateOpen(false)}
            >
              취소
            </button>
          </div>
        </form>
      )}

      <div className="search-box">
        <input
          type="search"
          placeholder="데이터셋 이름 또는 설명으로 검색"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {isLoading && <p className="loading-text">불러오는 중...</p>}

      <div className="grid">
        {filteredDatasets.length === 0 && !isLoading ? (
          <article className="dataset-card empty">
            <h2>
              {datasets.length === 0
                ? '아직 데이터셋이 없습니다'
                : '검색 결과가 없습니다'}
            </h2>

            <p>
              {datasets.length === 0
                ? '새 데이터셋을 만들고 영상을 업로드해보세요.'
                : '검색어를 변경하거나 새 데이터셋을 생성해보세요.'}
            </p>

            <button
              type="button"
              className="button primary"
              onClick={() => setIsCreateOpen(true)}
            >
              데이터셋 만들기
            </button>
          </article>
        ) : (
          filteredDatasets.map((dataset) => (
            <article className="dataset-card" key={dataset.id}>
              <div className="dataset-card-header">
                <span className="badge">Dataset</span>
                <small>{formatDate(dataset.created_at)}</small>
              </div>

              <h2>{dataset.name}</h2>

              <p>{dataset.description || '설명이 없습니다.'}</p>

              <div className="dataset-meta">
                <span>🎥 영상 {dataset.video_count ?? 0}개</span>
                <span>🖼 프레임 {dataset.frame_count ?? 0}장</span>
              </div>

              <div className="card-actions">
                <button
                  type="button"
                  className="button primary"
                  onClick={() => navigate(`/datasets/${dataset.id}`)}
                >
                  상세 보기
                </button>

                <button
                  type="button"
                  className="button secondary"
                  onClick={() => navigate('/upload')}
                >
                  영상 업로드
                </button>

                <button
                  type="button"
                  className="button danger"
                  onClick={() => handleDelete(dataset.id)}
                >
                  삭제
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export default DatasetListPage