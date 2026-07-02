import { useState } from 'react'

type NotificationItem = {
  id: number
  type: 'success' | 'info' | 'warning'
  title: string
  description: string
  time: string
  unread: boolean
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: 'success',
    title: '데이터셋 작업 준비 완료',
    description: '프레임 추출과 라벨링 작업을 계속 진행할 수 있습니다.',
    time: '방금 전',
    unread: true,
  },
  {
    id: 2,
    type: 'info',
    title: 'YOLO Export 준비',
    description: '라벨링이 완료된 데이터셋은 Export 패널에서 다운로드할 수 있습니다.',
    time: '오늘',
    unread: true,
  },
  {
    id: 3,
    type: 'warning',
    title: 'Bounding Box 기능 예정',
    description: '객체 탐지 학습을 위한 박스 편집 기능이 다음 단계로 예정되어 있습니다.',
    time: '예정',
    unread: false,
  },
]

function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  const unreadCount = notifications.filter((notification) => notification.unread).length

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  const handleMarkAllRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        unread: false,
      })),
    )
  }

  return (
    <div className="notification-center">
      <button
        type="button"
        className="notification-trigger"
        onClick={handleToggle}
        aria-label="알림 센터 열기"
      >
        🔔

        {unreadCount > 0 && (
          <span className="notification-count">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-panel">
          <div className="notification-panel-header">
            <div>
              <span className="ui-badge ui-badge-primary">Notifications</span>
              <h2>알림 센터</h2>
            </div>

            <button
              type="button"
              className="ui-button ui-button-secondary ui-button-sm"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
            >
              모두 읽음
            </button>
          </div>

          <div className="notification-list">
            {notifications.map((notification) => (
              <article
                className={`notification-item ${
                  notification.unread ? 'is-unread' : ''
                } notification-${notification.type}`}
                key={notification.id}
              >
                <div className="notification-icon">
                  {notification.type === 'success' && '✓'}
                  {notification.type === 'info' && 'i'}
                  {notification.type === 'warning' && '⚠'}
                </div>

                <div>
                  <strong>{notification.title}</strong>
                  <p>{notification.description}</p>
                  <span>{notification.time}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationCenter