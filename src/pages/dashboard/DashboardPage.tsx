import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  EmptyState,
  Loading,
  Page,
  PageHeader,
  Skeleton,
  StatCard,
  StatsGrid,
  useToast,
} from '../../common/ui'
import {
  getDatasetDetailApi,
  getDatasetsApi,
} from '../../features/dataset/api/datasetApi'
import type { Dataset } from '../../types/dataset'
import type { DatasetFrame } from '../../types/frame'
import type { LabelName } from '../../types/label'

type LabelStats = {
  fire: number
  smoke: number
  carlight: number
  negative: number
  unlabeled: number
}

type DashboardActivity = {
  id: string
  title: string
  description: string
  badge: string
  path: string
}

const INITIAL_LABEL_STATS: LabelStats = {
  fire: 0,
  smoke: 0,
  carlight: 0,
  negative: 0,
  unlabeled: 0,
}

const LABEL_ITEMS = [
  { key: 'fire', label: '화재', icon: '🔥' },
  { key: 'smoke', label: '연기', icon: '🌫️' },
  { key: 'carlight', label: '차량 등화류', icon: '💡' },
  { key: 'negative', label: '일반 / 오탐', icon: '✅' },
  { key: 'unlabeled', label: '미분류', icon: '🏷️' },
] as const

const NEXT_STEPS = [
  '미분류 프레임 라벨링',
  'YOLO Export 검증',
  'Bounding Box 구조 연결',
  'Auto Labeling 준비',
]

const PIPELINE_STEPS = [
  'Dataset 생성',
  '영상 업로드',
  '프레임 추출',
  '라벨링',
  'Bounding Box',
  'Export',
  'AI 학습',
]

function getFrameLabel(frame: DatasetFrame): LabelName | null {
  return frame.labels?.[0]?.label_name ?? null
}

function getLabelStats(datasets: Dataset[]) {
  const stats: LabelStats = { ...INITIAL_LABEL_STATS }

  datasets.forEach((dataset) => {
    dataset.videos?.forEach((video) => {
      video.frames?.forEach((frame) => {
        const label = getFrameLabel(frame)

        if (!label) {
          stats.unlabeled += 1
          return
        }

        if (
          label === 'fire' ||
          label === 'smoke' ||
          label === 'carlight' ||
          label === 'negative'
        ) {
          stats[label] += 1
        } else {
          stats.unlabeled += 1
        }
      })
    })
  })

  return stats
}

function getTotalFrames(datasets: Dataset[]) {
  return datasets.reduce((sum, dataset) => sum + (dataset.frame_count ?? 0), 0)
}

function getTotalVideos(datasets: Dataset[]) {
  return datasets.reduce((sum, dataset) => sum + (dataset.video_count ?? 0), 0)
}

function getPercent(value: number, total: number) {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

function DashboardPage() {
  const { showToast } = useToast()

  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [detailedDatasets, setDetailedDatasets] = useState<Dataset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const response = await getDatasetsApi()
        const datasetList = response.data

        setDatasets(datasetList)

        if (datasetList.length === 0) {
          setDetailedDatasets([])
          return
        }

        setIsLoadingDetails(true)

        const detailResponses = await Promise.all(
          datasetList.map((dataset) => getDatasetDetailApi(dataset.id)),
        )

        setDetailedDatasets(detailResponses.map((detail) => detail.data))
      } catch {
        setErrorMessage('대시보드 정보를 불러오지 못했습니다.')
        showToast('대시보드 정보를 불러오지 못했습니다.', 'error')
      } finally {
        setIsLoading(false)
        setIsLoadingDetails(false)
      }
    }

    fetchDashboard()
  }, [showToast])

  const totalDatasetCount = datasets.length
  const totalVideoCount = useMemo(() => getTotalVideos(datasets), [datasets])
  const totalFrameCount = useMemo(() => getTotalFrames(datasets), [datasets])

  const readyDatasetCount = useMemo(() => {
    return datasets.filter((dataset) => (dataset.frame_count ?? 0) > 0).length
  }, [datasets])

  const labelStats = useMemo(() => getLabelStats(detailedDatasets), [detailedDatasets])

  const labeledCount =
    labelStats.fire + labelStats.smoke + labelStats.carlight + labelStats.negative

  const labelingProgress = getPercent(labeledCount, totalFrameCount)

  const recentDatasets = useMemo(() => {
    return [...datasets]
      .sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0

        return bTime - aTime
      })
      .slice(0, 5)
  }, [datasets])

  const activities = useMemo<DashboardActivity[]>(() => {
    return recentDatasets.map((dataset) => ({
      id: String(dataset.id),
      title: dataset.name,
      description:
        dataset.description ||
        `${dataset.video_count ?? 0}개 영상 · ${dataset.frame_count ?? 0}개 프레임`,
      badge: (dataset.frame_count ?? 0) > 0 ? '작업 가능' : '업로드 필요',
      path: `/datasets/${dataset.id}`,
    }))
  }, [recentDatasets])

  if (isLoading) {
    return (
      <Page className="dashboard-page">
        <Loading
          title="대시보드를 불러오는 중입니다"
          description="데이터셋, 영상, 프레임 현황을 집계하고 있습니다."
        />
      </Page>
    )
  }

  return (
    <Page className="dashboard-page">
      <PageHeader
        badge="Dashboard"
        title="작업 현황"
        description="데이터셋 제작 흐름, 라벨링 진행률, 최근 작업을 한눈에 확인합니다."
        actions={
          <>
            <Link to="/datasets" className="ui-button ui-button-secondary">
              데이터셋 관리
            </Link>

            <Link to="/upload" className="ui-button ui-button-primary">
              영상 업로드
            </Link>
          </>
        }
      />

      {errorMessage && <div className="dataset-alert">{errorMessage}</div>}

      <StatsGrid>
        <StatCard label="전체 데이터셋" value={totalDatasetCount} help="생성된 프로젝트" />
        <StatCard label="원천 영상" value={totalVideoCount} help="업로드된 영상" />
        <StatCard label="추출 프레임" value={totalFrameCount} help="학습 후보 이미지" />
        <StatCard
          label="라벨링 진행률"
          value={`${labelingProgress}%`}
          help={`라벨 완료 ${labeledCount}개`}
        />
      </StatsGrid>

      <section className="dashboard-hero ui-card">
        <div className="dashboard-hero-content">
          <span className="ui-badge ui-badge-primary">Dataset Build Status</span>

          <h2>
            현재 데이터셋 제작 흐름은
            <br />
            <span>{labelingProgress}%</span> 진행 중입니다.
          </h2>

          <p>
            전체 {totalDatasetCount}개 데이터셋 중 {readyDatasetCount}개가 프레임 추출까지
            완료되었습니다. 다음 단계는 라벨링 검수, Export, Bounding Box 연결입니다.
          </p>

          <div className="dashboard-hero-actions">
            <Link to="/datasets" className="ui-button ui-button-primary ui-button-lg">
              라벨링 계속하기
            </Link>

            <Link to="/upload" className="ui-button ui-button-secondary ui-button-lg">
              영상 추가하기
            </Link>
          </div>
        </div>

        <div className="dashboard-progress-card">
          <div
            className="dashboard-progress-ring"
            style={{
              background: `conic-gradient(var(--primary-color) ${labelingProgress * 3.6}deg, rgba(255, 255, 255, 0.08) 0deg)`,
            }}
          >
            <div>
              <strong>{labelingProgress}%</strong>
              <span>Labeling</span>
            </div>
          </div>

          <div className="dashboard-progress-meta">
            <div>
              <span>라벨 완료</span>
              <strong>{labeledCount}</strong>
            </div>

            <div>
              <span>미분류</span>
              <strong>{labelStats.unlabeled}</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="dashboard-layout">
        <section className="dashboard-main">
          <article className="dashboard-panel ui-card">
            <div className="dashboard-panel-header">
              <div>
                <span className="ui-badge ui-badge-primary">Label Distribution</span>
                <h2>라벨 분포</h2>
                <p>현재까지 저장된 프레임 라벨 현황입니다.</p>
              </div>
            </div>

            {isLoadingDetails ? (
              <Skeleton rows={3} />
            ) : totalFrameCount === 0 ? (
              <EmptyState
                icon="🏷️"
                title="아직 라벨링된 프레임이 없습니다"
                description="영상을 업로드하고 프레임에 라벨을 지정하면 이곳에 통계가 표시됩니다."
              />
            ) : (
              <div className="dashboard-label-grid">
                {LABEL_ITEMS.map((item) => {
                  const value = labelStats[item.key]
                  const percent = getPercent(value, totalFrameCount)

                  return (
                    <div className="dashboard-label-card" key={item.key}>
                      <div className="dashboard-label-icon">{item.icon}</div>

                      <div>
                        <span>{item.label}</span>
                        <strong>{value}</strong>
                      </div>

                      <em>{percent}%</em>

                      <i style={{ width: `${percent}%` }} />
                    </div>
                  )
                })}
              </div>
            )}
          </article>

          <article className="dashboard-panel ui-card">
            <div className="dashboard-panel-header">
              <div>
                <span className="ui-badge ui-badge-primary">Recent Dataset</span>
                <h2>최근 데이터셋</h2>
                <p>최근 생성된 데이터셋과 작업 가능 상태입니다.</p>
              </div>

              <Link to="/datasets" className="ui-button ui-button-secondary ui-button-sm">
                전체 보기
              </Link>
            </div>

            {activities.length === 0 ? (
              <EmptyState
                icon="📁"
                title="생성된 데이터셋이 없습니다"
                description="첫 번째 데이터셋을 생성하고 영상 업로드를 시작해보세요."
                action={
                  <Link to="/datasets" className="ui-button ui-button-primary">
                    데이터셋 생성하기
                  </Link>
                }
              />
            ) : (
              <div className="dashboard-activity-list">
                {activities.map((activity) => (
                  <Link
                    key={activity.id}
                    to={activity.path}
                    className="dashboard-activity-item"
                  >
                    <div>
                      <strong>{activity.title}</strong>
                      <span>{activity.description}</span>
                    </div>

                    <em className="ui-badge ui-badge-primary">{activity.badge}</em>
                  </Link>
                ))}
              </div>
            )}
          </article>
        </section>

        <aside className="dashboard-side">
          <article className="dashboard-panel ui-card">
            <span className="ui-badge ui-badge-primary">Next Step</span>

            <h2>다음 작업</h2>

            <div className="dashboard-next-list">
              {NEXT_STEPS.map((step, index) => (
                <div key={step}>
                  <strong>{String(index + 1).padStart(2, '0')}</strong>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-panel ui-card">
            <span className="ui-badge ui-badge-primary">Pipeline</span>

            <h2>제작 파이프라인</h2>

            <div className="dashboard-pipeline">
              {PIPELINE_STEPS.map((step, index) => {
                const isDone =
                  index <= 2 ||
                  (step === '라벨링' && labeledCount > 0) ||
                  (step === 'Export' && labeledCount > 0)

                return (
                  <div className={isDone ? 'is-done' : ''} key={step}>
                    {step}
                  </div>
                )
              })}
            </div>
          </article>
        </aside>
      </div>
    </Page>
  )
}

export default DashboardPage