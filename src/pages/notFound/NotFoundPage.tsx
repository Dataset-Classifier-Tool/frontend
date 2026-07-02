import { Link } from 'react-router-dom'

import { Page } from '../../common/ui'

function NotFoundPage() {
  return (
    <Page className="not-found-page">
      <section className="not-found-hero ui-card">
        <div className="not-found-code">404</div>

        <span className="ui-badge ui-badge-primary">Page Not Found</span>

        <h1>요청한 페이지를 찾을 수 없습니다.</h1>

        <p>
          주소가 잘못되었거나 더 이상 사용하지 않는 화면일 수 있습니다.
          데이터셋 관리 화면으로 이동해 작업을 계속 진행할 수 있습니다.
        </p>

        <div className="not-found-actions">
          <Link to="/dashboard" className="ui-button ui-button-secondary ui-button-lg">
            대시보드로 이동
          </Link>

          <Link to="/datasets" className="ui-button ui-button-primary ui-button-lg">
            데이터셋 관리
          </Link>
        </div>
      </section>
    </Page>
  )
}

export default NotFoundPage