import { FormEvent, useEffect, useState } from 'react'
import { useDatasetStore } from '../../stores/datasetStore'

function DatasetListPage() {
  const datasets = useDatasetStore((state) => state.datasets)
  const isLoading = useDatasetStore((state) => state.isLoading)
  const fetchDatasets = useDatasetStore((state) => state.fetchDatasets)
  const createDataset = useDatasetStore((state) => state.createDataset)
  const deleteDataset = useDatasetStore((state) => state.deleteDataset)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    fetchDatasets().catch(() => {
      setErrorMessage('데이터셋 목록을 불러오지 못했습니다.')
    })
  }, [fetchDatasets])

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    try {
      await createDataset({
        name,
        description,
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
          <h1>내 데이터셋</h1>
          <p>프로젝트 단위로 이미지와 라벨을 관리합니다.</p>
        </div>

        <button
          className="button primary"
          type="button"
          onClick={() => setIsCreateOpen((prev) => !prev)}
        >
          새 데이터셋 만들기
        </button>
      </div>

      {errorMessage && <div className="alert error">{errorMessage}</div>}

      {isCreateOpen && (
        <form className="dataset-create-form" onSubmit={handleCreate}>
          <label>
            데이터셋 이름
            <input
              type="text"
              placeholder="도로 화재 데이터셋"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
            />
          </label>

          <label>
            설명
            <textarea
              placeholder="도로 및 터널 환경의 화재/연기 이미지 데이터셋"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <button type="submit" className="button primary" disabled={isLoading}>
            {isLoading ? '생성 중...' : '생성하기'}
          </button>
        </form>
      )}

      {isLoading && <p>불러오는 중...</p>}

      <div className="grid">
        {datasets.length === 0 && !isLoading ? (
          <article className="dataset-card empty">
            <h2>아직 데이터셋이 없습니다</h2>
            <p>새 데이터셋을 만들고 이미지를 업로드해보세요.</p>
          </article>
        ) : (
          datasets.map((dataset) => (
            <article className="dataset-card" key={dataset.id}>
              <span className="badge">Dataset</span>
              <h2>{dataset.name}</h2>
              <p>{dataset.description || '설명이 없습니다.'}</p>
              <small>이미지 {dataset.image_count}개</small>

              <div className="card-actions">
                <button type="button" className="button secondary">
                  상세 보기
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