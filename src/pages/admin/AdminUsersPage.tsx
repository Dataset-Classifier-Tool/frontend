import { useEffect, useMemo, useState } from 'react'

import {
  getAdminUsersApi,
  updateUserActiveApi,
  updateUserMembershipApi,
} from '../../features/admin'
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
import type { MembershipType } from '../../types/auth'
import type { AdminUser } from '../../types/user'

const MEMBERSHIP_LABEL: Record<MembershipType, string> = {
  free: '무료',
  premium: '프리미엄',
  admin: '관리자',
}

const MEMBERSHIP_BADGE_CLASS: Record<MembershipType, string> = {
  free: '',
  premium: 'ui-badge-primary',
  admin: 'ui-badge-warning',
}

function AdminUsersPage() {
  const { showToast } = useToast()

  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [activeTarget, setActiveTarget] = useState<AdminUser | null>(null)
  const [isUpdatingActive, setIsUpdatingActive] = useState(false)

  const fetchUsers = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await getAdminUsersApi()
      setUsers(response.data)
    } catch (error: any) {
      const message =
        error.response?.data?.message || '회원 목록을 불러오지 못했습니다.'

      setErrorMessage(message)
      showToast(message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase()

    if (!keyword) return users

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(keyword) ||
        user.nickname?.toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword) ||
        user.provider?.toLowerCase().includes(keyword) ||
        user.membership_type?.toLowerCase().includes(keyword)
      )
    })
  }, [users, searchKeyword])

  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.is_active).length
  const inactiveUsers = totalUsers - activeUsers
  const adminUsers = users.filter((user) => user.membership_type === 'admin').length
  const premiumUsers = users.filter(
    (user) => user.membership_type === 'premium',
  ).length

  const handleMembershipChange = async (
    userId: number,
    membershipType: MembershipType,
  ) => {
    try {
      const response = await updateUserMembershipApi(userId, {
        membership_type: membershipType,
      })

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? response.data : user)),
      )

      showToast('회원 등급이 변경되었습니다.', 'success')
    } catch (error: any) {
      showToast(
        error.response?.data?.message || '회원 등급 변경에 실패했습니다.',
        'error',
      )
    }
  }

  const handleActiveRequest = (user: AdminUser) => {
    setActiveTarget(user)
  }

  const handleActiveCancel = () => {
    if (isUpdatingActive) return
    setActiveTarget(null)
  }

  const handleActiveConfirm = async () => {
    if (!activeTarget) return

    setIsUpdatingActive(true)

    try {
      const response = await updateUserActiveApi(activeTarget.id, {
        is_active: !activeTarget.is_active,
      })

      setUsers((prevUsers) =>
        prevUsers.map((item) =>
          item.id === activeTarget.id ? response.data : item,
        ),
      )

      showToast(
        activeTarget.is_active
          ? '회원 계정이 비활성화되었습니다.'
          : '회원 계정이 활성화되었습니다.',
        'success',
      )

      setActiveTarget(null)
    } catch (error: any) {
      showToast(
        error.response?.data?.message || '활성화 상태 변경에 실패했습니다.',
        'error',
      )
    } finally {
      setIsUpdatingActive(false)
    }
  }

  return (
    <>
      <Page className="admin-page">
        <PageHeader
          badge="Admin Console"
          title="회원 관리"
          description="회원 등급, 가입 방식, 활성화 상태를 관리하고 플랫폼 사용 권한을 제어합니다."
          actions={
            <button
              type="button"
              className="ui-button ui-button-secondary"
              onClick={fetchUsers}
              disabled={isLoading}
            >
              {isLoading ? '새로고침 중...' : '회원 목록 새로고침'}
            </button>
          }
        />

        {errorMessage && <div className="dataset-alert">{errorMessage}</div>}

        <StatsGrid>
          <StatCard label="전체 회원" value={totalUsers} help="등록된 계정" />
          <StatCard label="활성 회원" value={activeUsers} help="사용 가능 계정" />
          <StatCard label="비활성 회원" value={inactiveUsers} help="접근 제한 계정" />
          <StatCard
            label="프리미엄 / 관리자"
            value={`${premiumUsers} / ${adminUsers}`}
            help="상위 권한 계정"
          />
        </StatsGrid>

        <section className="admin-panel ui-card">
          <div className="admin-toolbar">
            <div>
              <span className="ui-badge ui-badge-primary">회원 목록</span>
              <h2>플랫폼 회원</h2>
              <p>
                총 {users.length}명 중 {filteredUsers.length}명이 표시됩니다.
              </p>
            </div>

            <div className="ui-search admin-search">
              <span className="ui-search-icon">⌕</span>
              <input
                className="ui-input"
                type="search"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="이름, 닉네임, 이메일, 등급 검색"
              />
            </div>
          </div>

          {isLoading ? (
            <Skeleton rows={4} />
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              title="표시할 회원이 없습니다"
              description="검색어를 변경하거나 회원 목록을 새로고침해보세요."
            />
          ) : (
            <div className="admin-user-grid">
              {filteredUsers.map((user) => (
                <article
                  className="admin-user-card ui-card ui-card-hover"
                  key={user.id}
                >
                  <div className="admin-user-card-top">
                    <div className="admin-user-avatar">
                      {user.name?.charAt(0) || user.email.charAt(0) || 'U'}
                    </div>

                    <div className="admin-user-main">
                      <strong>{user.name || '이름 없음'}</strong>
                      <span>{user.nickname || user.email}</span>
                    </div>

                    <span
                      className={`ui-badge ${
                        user.is_active ? 'ui-badge-primary' : 'ui-badge-danger'
                      }`}
                    >
                      {user.is_active ? '활성' : '비활성'}
                    </span>
                  </div>

                  <div className="admin-user-info">
                    <div>
                      <span>이메일</span>
                      <strong>{user.email}</strong>
                    </div>

                    <div>
                      <span>가입 방식</span>
                      <strong>{user.provider}</strong>
                    </div>

                    <div>
                      <span>생년월일</span>
                      <strong>{user.birth_date || '-'}</strong>
                    </div>

                    <div>
                      <span>현재 등급</span>
                      <strong>
                        <em
                          className={`ui-badge ${
                            MEMBERSHIP_BADGE_CLASS[user.membership_type]
                          }`}
                        >
                          {MEMBERSHIP_LABEL[user.membership_type]}
                        </em>
                      </strong>
                    </div>
                  </div>

                  <div className="admin-user-actions">
                    <select
                      className="ui-select"
                      value={user.membership_type}
                      onChange={(event) =>
                        handleMembershipChange(
                          user.id,
                          event.target.value as MembershipType,
                        )
                      }
                    >
                      <option value="free">무료</option>
                      <option value="premium">프리미엄</option>
                      <option value="admin">관리자</option>
                    </select>

                    <button
                      type="button"
                      className={`ui-button ${
                        user.is_active ? 'ui-button-danger' : 'ui-button-secondary'
                      }`}
                      onClick={() => handleActiveRequest(user)}
                    >
                      {user.is_active ? '비활성화' : '활성화'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </Page>

      <ConfirmDialog
        open={Boolean(activeTarget)}
        title={activeTarget?.is_active ? '계정을 비활성화할까요?' : '계정을 활성화할까요?'}
        description={
          activeTarget
            ? `${activeTarget.email} 계정의 사용 가능 상태를 변경합니다.`
            : ''
        }
        confirmText={activeTarget?.is_active ? '비활성화' : '활성화'}
        cancelText="취소"
        variant={activeTarget?.is_active ? 'danger' : 'primary'}
        isLoading={isUpdatingActive}
        onConfirm={handleActiveConfirm}
        onCancel={handleActiveCancel}
      />
    </>
  )
}

export default AdminUsersPage