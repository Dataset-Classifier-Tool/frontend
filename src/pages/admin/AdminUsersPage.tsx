import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'

import {
  EmptyState,
  Loading,
  Page,
  PageHeader,
  StatCard,
  StatsGrid,
  useToast,
} from '../../common/ui'
import {
  getAdminUsersApi,
  updateUserActiveApi,
  updateUserMembershipApi,
} from '../../features/admin/api/adminApi'
import type { MembershipType } from '../../types/auth'
import type { AdminUser } from '../../types/user'

type MembershipFilter = 'all' | MembershipType
type StatusFilter = 'all' | 'active' | 'inactive'

const MEMBERSHIP_LABEL: Record<MembershipType, string> = {
  free: 'Free',
  premium: 'Premium',
  admin: '관리자',
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

function AdminUsersPage() {
  const { showToast } = useToast()

  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [membershipFilter, setMembershipFilter] = useState<MembershipFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [errorMessage, setErrorMessage] = useState('')

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setErrorMessage('')

      const response = await getAdminUsersApi()
      setUsers(response.data)
    } catch {
      setErrorMessage('회원 목록을 불러오지 못했습니다.')
      showToast('회원 목록을 불러오지 못했습니다.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase()

    return users.filter((user) => {
      const matchesKeyword =
        !keyword ||
        user.email.toLowerCase().includes(keyword) ||
        user.name?.toLowerCase().includes(keyword) ||
        user.nickname?.toLowerCase().includes(keyword)

      const matchesMembership =
        membershipFilter === 'all' || user.membership_type === membershipFilter

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && user.is_active) ||
        (statusFilter === 'inactive' && !user.is_active)

      return matchesKeyword && matchesMembership && matchesStatus
    })
  }, [users, searchKeyword, membershipFilter, statusFilter])

  const adminCount = users.filter((user) => user.membership_type === 'admin').length
  const premiumCount = users.filter((user) => user.membership_type === 'premium').length
  const activeCount = users.filter((user) => user.is_active).length
  const inactiveCount = users.length - activeCount

  const handleMembershipChange = async (
    userId: number,
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const nextMembership = event.target.value as MembershipType

    try {
      setUpdatingUserId(userId)
      setErrorMessage('')

      await updateUserMembershipApi(userId, {
        membership_type: nextMembership,
      })

      await fetchUsers()
      showToast('회원 등급이 변경되었습니다.', 'success')
    } catch {
      setErrorMessage('회원 등급 변경에 실패했습니다.')
      showToast('회원 등급 변경에 실패했습니다.', 'error')
    } finally {
      setUpdatingUserId(null)
    }
  }

  const handleActiveChange = async (userId: number, nextActive: boolean) => {
    try {
      setUpdatingUserId(userId)
      setErrorMessage('')

      await updateUserActiveApi(userId, {
        is_active: nextActive,
      })

      await fetchUsers()
      showToast('사용자 상태가 변경되었습니다.', 'success')
    } catch {
      setErrorMessage('사용자 상태 변경에 실패했습니다.')
      showToast('사용자 상태 변경에 실패했습니다.', 'error')
    } finally {
      setUpdatingUserId(null)
    }
  }

  if (isLoading) {
    return (
      <Page className="admin-page">
        <Loading
          title="회원 정보를 불러오는 중입니다"
          description="사용자 권한과 상태 정보를 확인하고 있습니다."
        />
      </Page>
    )
  }

  return (
    <Page className="admin-page">
      <PageHeader
        badge="Admin Console"
        title="회원 관리"
        description="사용자 등급, 계정 상태, 서비스 운영 정보를 관리합니다."
      />

      {errorMessage && <div className="admin-alert">{errorMessage}</div>}

      <StatsGrid>
        <StatCard label="전체 회원" value={users.length} help="가입된 사용자" />
        <StatCard label="관리자" value={adminCount} help="관리 권한 보유" />
        <StatCard label="Premium" value={premiumCount} help="유료 등급 사용자" />
        <StatCard label="활성 계정" value={activeCount} help={`비활성 ${inactiveCount}명`} />
      </StatsGrid>

      <section className="admin-hero ui-card">
        <div className="admin-hero-content">
          <span className="ui-badge ui-badge-primary">User Operation</span>

          <h2>
            사용자 등급과
            <br />
            서비스 접근 상태를 관리합니다.
          </h2>

          <p>
            관리자 화면에서는 사용자 목록을 확인하고 회원 등급과 활성 상태를 변경할 수 있습니다.
            추후 사용량 제한, Premium 권한, AI 자동 라벨링 권한까지 이 화면에서 확장할 수 있습니다.
          </p>
        </div>

        <div className="admin-hero-card">
          <strong>{activeCount}</strong>
          <span>활성 사용자</span>
          <p>현재 서비스 접근이 가능한 계정입니다.</p>
        </div>
      </section>

      <section className="admin-users-panel ui-card">
        <div className="admin-users-panel-head">
          <div>
            <span className="ui-badge ui-badge-primary">Users</span>
            <h2>사용자 목록</h2>
            <p>
              총 {users.length}명 중 {filteredUsers.length}명이 표시되고 있습니다.
            </p>
          </div>

          <div className="admin-filter-area">
            <div className="ui-search admin-search">
              <span className="ui-search-icon">⌕</span>

              <input
                className="ui-input"
                type="search"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="이름, 닉네임, 이메일 검색"
              />
            </div>

            <select
              className="ui-select"
              value={membershipFilter}
              onChange={(event) =>
                setMembershipFilter(event.target.value as MembershipFilter)
              }
            >
              <option value="all">전체 등급</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
              <option value="admin">관리자</option>
            </select>

            <select
              className="ui-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            >
              <option value="all">전체 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <EmptyState
            icon="👤"
            title="표시할 사용자가 없습니다"
            description="검색어나 필터 조건을 변경해주세요."
          />
        ) : (
          <div className="admin-user-table-wrap">
            <table className="admin-user-table">
              <thead>
                <tr>
                  <th>사용자</th>
                  <th>회원 등급</th>
                  <th>상태</th>
                  <th>가입일</th>
                  <th>등급 변경</th>
                  <th>상태 변경</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => {
                  const displayName = user.nickname || user.name || '이름 없음'
                  const membershipLabel =
                    MEMBERSHIP_LABEL[user.membership_type] ?? user.membership_type
                  const isUpdating = updatingUserId === user.id

                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-user-avatar">
                            {displayName.slice(0, 1)}
                          </div>

                          <div>
                            <strong>{displayName}</strong>
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`admin-role-badge ${
                            user.membership_type === 'admin' ? 'is-admin' : ''
                          } ${
                            user.membership_type === 'premium' ? 'is-premium' : ''
                          }`}
                        >
                          {membershipLabel}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-status-badge ${
                            user.is_active ? 'is-active' : 'is-inactive'
                          }`}
                        >
                          {user.is_active ? '활성' : '비활성'}
                        </span>
                      </td>

                      <td>{formatDate(user.created_at)}</td>

                      <td>
                        <select
                          className="ui-select admin-role-select"
                          value={user.membership_type}
                          onChange={(event) => handleMembershipChange(user.id, event)}
                          disabled={isUpdating}
                        >
                          <option value="free">Free</option>
                          <option value="premium">Premium</option>
                          <option value="admin">관리자</option>
                        </select>
                      </td>

                      <td>
                        <button
                          type="button"
                          className={`ui-button ui-button-sm ${
                            user.is_active ? 'ui-button-danger' : 'ui-button-primary'
                          }`}
                          onClick={() => handleActiveChange(user.id, !user.is_active)}
                          disabled={isUpdating}
                        >
                          {user.is_active ? '비활성화' : '활성화'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Page>
  )
}

export default AdminUsersPage