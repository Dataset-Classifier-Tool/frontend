import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'

import {
  ConfirmDialog,
  EmptyState,
  Page,
  PageHeader,
  Skeleton,
  StatCard,
  StatsGrid,
  useToast,
} from '../../common/ui'
import { useDatasetStore } from '../../stores/datasetStore'
import type { Dataset } from '../../types/dataset'

type DatasetFormState = {
  name: string
  description: string
}

type DatasetStatus = {
  text: string
  className: string
  progress: number
  description: string
}

const INITIAL_FORM_STATE: DatasetFormState = {
  name: '',
  description: '',
}

function formatDate(dateText: string | null) {
  if (!dateText) return '날짜 없음'

  const date = new Date(dateText)

  if (Number.isNaN(date.getTime())) return '날짜 없음'

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function getDatasetStatus(dataset: Dataset): DatasetStatus {
  const frameCount = dataset.frame_count ?? 0
  const videoCount = dataset.video_count ?? 0

  if (frameCount > 0) {
    return {
      text: '작업 가능',
      className: 'ui-badge-primary',
      progress: 100,
      description: '프레임 추출 완료',
    }
  }

  if (videoCount > 0) {
    return {
      text: '추출 대기',
      className: 'ui-badge-warning',
      progress: 45,
      description: '영상 업로드 완료',
    }
  }

  return {
    text: '업로드 필요',
    className: 'ui-badge-danger',
    progress: 12,
    description: '원천 데이터 필요',
  }
}

function DatasetListPage() {
  const { showToast } = useToast()

  const datasets = useDatasetStore((state) => state.datasets)
  const isLoading = useDatasetStore((state) => state.isLoading)
  const fetchDatasets = useDatasetStore((state) => state.fetchDatasets)
  const createDataset = useDatasetStore((state) => state.createDataset)
  const deleteDataset = useDatasetStore((state) => state.deleteDataset)

  const [form, setForm] = useState<DatasetFormState>(INITIAL_FORM_STATE)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Dataset | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchDatasets().catch(() => {
      setErrorMessage('데이터셋 목록을 불러오지 못했습니다.')
      showToast('데이터셋 목록을 불러오지 못했습니다.', 'error')
    })
  }, [fetchDatasets, showToast])

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

  const averageProgress = useMemo(() => {
    if (datasets.length === 0) return 0

    const score = datasets.reduce((sum, dataset) => {
      return sum + getDatasetStatus(dataset).progress
    }, 0)

    return Math.round(score / datasets.length)
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
      showToast('데이터셋 이름을 입력해주세요.', 'warning')
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
      showToast('데이터셋이 생성되었습니다.', 'success')
    } catch {
      setErrorMessage('데이터셋 생성에 실패했습니다.')
      showToast('데이터셋 생성에 실패했습니다.', 'error')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteRequest = (dataset: Dataset) => {
    setDeleteTarget(dataset)
  }

  const handleDeleteCancel = () => {
    if (isDeleting) return

    setDeleteTarget(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return

    setErrorMessage('')
    setIsDeleting(true)

    try {
      await deleteDataset(deleteTarget.id)

      showToast('데이터셋이 삭제되었습니다.', 'success')
      setDeleteTarget(null)
    } catch {
      setErrorMessage('데이터셋 삭제에 실패했습니다.')
      showToast('데이터셋 삭제에 실패했습니다.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Page className="dataset-page">
        <PageHeader
          badge="Dataset Studio"
          title="데이터셋 관리"
          description="AI 학습용 프로젝트를 생성하고 영상·프레임·라벨링 상태를 관리합니다."
        />

        <StatsGrid>
          <StatCard label="전체 데이터셋" value={datasets.length} help="생성된 프로젝트" />
          <StatCard label="원천 영상" value={totalVideoCount} help="업로드된 영상" />
          <StatCard label="추출 프레임" value={totalFrameCount} help="학습 후보 이미지" />
          <StatCard
            label="평균 준비율"
            value={`${averageProgress}%`}
            help={`작업 가능 ${readyDatasetCount}개`}
          />
        </StatsGrid>

        {errorMessage && <div className="dataset-alert">{errorMessage}</div>}

        <div className="dataset-workspace">
          <aside className="dataset-create-panel ui-card">
            <div className="dataset-create-hero">
              <span className="ui-badge ui-badge-primary">새 프로젝트</span>

              <h2 className="dataset-panel-title">데이터셋 생성</h2>

              <p className="dataset-panel-description">
                수집 목적, 촬영 환경, 라벨 기준을 정리한 뒤 학습용 데이터셋 제작을 시작합니다.
              </p>
            </div>

            <form className="ui-form" onSubmit={handleCreateDataset}>
              <div className="ui-form-group">
                <label className="ui-label" htmlFor="dataset-name">
                  데이터셋 이름 <span className="ui-required">*</span>
                </label>

                <input
                  id="dataset-name"
                  className="ui-input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="예: 야간 터널 화재 데이터셋"
                />
              </div>

              <div className="ui-form-group">
                <label className="ui-label" htmlFor="dataset-description">
                  설명
                </label>

                <textarea
                  id="dataset-description"
                  className="ui-textarea"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="수집 목적, 촬영 환경, 라벨 기준 등을 적어주세요."
                />
              </div>

              <button
                type="submit"
                className="ui-button ui-button-primary ui-button-lg dataset-create-button"
                disabled={isCreating}
              >
                {isCreating ? '생성 중...' : '데이터셋 생성'}
              </button>
            </form>

            <div className="dataset-create-guide">
              <strong>추천 작성 기준</strong>
              <span>장소 / 시간대 / 목적 / 주요 라벨을 함께 적어두면 나중에 Export와 학습 관리가 쉬워집니다.</span>
            </div>
          </aside>

          <section className="dataset-list-panel ui-card">
            <div className="dataset-list-header">
              <div>
                <span className="ui-badge ui-badge-primary">데이터셋</span>
                <h2 className="dataset-panel-title">내 데이터셋</h2>
                <p className="dataset-panel-description">
                  총 {datasets.length}개 중 {filteredDatasets.length}개 표시 · 작업 가능{' '}
                  {readyDatasetCount}개
                </p>
              </div>

              <div className="ui-search dataset-search">
                <span className="ui-search-icon">⌕</span>

                <input
                  className="ui-input"
                  type="search"
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                  placeholder="데이터셋 검색"
                />
              </div>
            </div>

            {isLoading ? (
              <Skeleton rows={4} />
            ) : filteredDatasets.length === 0 ? (
              <EmptyState
                title="표시할 데이터셋이 없습니다"
                description="새 데이터셋을 만들거나 검색어를 변경해주세요."
              />
            ) : (
              <div className="dataset-card-grid">
                {filteredDatasets.map((dataset) => {
                  const status = getDatasetStatus(dataset)

                  return (
                    <article className="dataset-card ui-card ui-card-hover" key={dataset.id}>
                      <div className="dataset-card-top">
                        <span className={`ui-badge ${status.className}`}>
                          {status.text}
                        </span>

                        <span className="dataset-card-date">
                          {formatDate(dataset.created_at)}
                        </span>
                      </div>

                      <div className="dataset-card-body">
                        <h3>{dataset.name}</h3>
                        <p>{dataset.description || '설명이 없습니다.'}</p>
                      </div>

                      <div className="dataset-mini-stats">
                        <div>
                          <span>영상</span>
                          <strong>{dataset.video_count ?? 0}</strong>
                        </div>

                        <div>
                          <span>프레임</span>
                          <strong>{dataset.frame_count ?? 0}</strong>
                        </div>

                        <div>
                          <span>상태</span>
                          <strong>{status.description}</strong>
                        </div>
                      </div>

                      <div className="dataset-progress-area">
                        <div className="dataset-progress-head">
                          <span>준비율</span>
                          <strong>{status.progress}%</strong>
                        </div>

                        <div className="dataset-progress-line">
                          <i style={{ width: `${status.progress}%` }} />
                        </div>
                      </div>

                      <div className="dataset-card-actions">
                        <Link
                          to={`/datasets/${dataset.id}`}
                          className="ui-button ui-button-primary ui-button-sm"
                        >
                          작업 열기
                        </Link>

                        <button
                          type="button"
                          className="ui-button ui-button-danger ui-button-sm"
                          onClick={() => handleDeleteRequest(dataset)}
                        >
                          삭제
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </Page>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="데이터셋을 삭제할까요?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" 데이터셋을 삭제합니다. 연결된 영상과 프레임도 함께 삭제될 수 있습니다.`
            : ''
        }
        confirmText="삭제"
        cancelText="취소"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  )
}

export default DatasetListPage