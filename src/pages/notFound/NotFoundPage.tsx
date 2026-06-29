import { Link } from 'react-router-dom'

import { EmptyState, Page } from '../../common/ui'

function NotFoundPage() {
  return (
    <Page className="not-found-page">
      <section className="not-found-card ui-card">
        <EmptyState
          icon="🧭"
          title="페이지를 찾을 수 없습니다"
          description="요청한 주소가 존재하지 않거나 이동되었을 수 있습니다."
          action={
            <div className="not-found-actions">
              <Link to="/" className="ui-button ui-button-secondary">
                대시보드로 이동
              </Link>

              <Link to="/datasets" className="ui-button ui-button-primary">
                데이터셋 관리로 이동
              </Link>
            </div>
          }
        />
      </section>
    </Page>
  )
}

export default NotFoundPage