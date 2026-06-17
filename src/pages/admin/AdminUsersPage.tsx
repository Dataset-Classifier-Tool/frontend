import { useEffect, useMemo, useState } from 'react'
import {
  getAdminUsersApi,
  updateUserActiveApi,
  updateUserMembershipApi,
} from '../../common/api/adminApi'
import type { MembershipType } from '../../types/auth'
import type { AdminUser } from '../../types/user'

function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')

  const fetchUsers = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await getAdminUsersApi()
      setUsers(response.data)
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || '회원 목록을 불러오지 못했습니다.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleMembershipChange = async (
    userId: number,
    membershipType: MembershipType,
  ) => {
    try {
      const response = await updateUserMembershipApi(userId, {
        membership_type: membershipType,
      })

      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? response.data : user)),
      )
    } catch (error: any) {
      alert(error.response?.data?.message || '회원 등급 변경 실패')
    }
  }

  const handleActiveToggle = async (user: AdminUser) => {
    const confirmed = window.confirm(
      user.is_active
        ? `${user.email} 계정을 비활성화할까요?`
        : `${user.email} 계정을 활성화할까요?`,
    )

    if (!confirmed) return

    try {
      const response = await updateUserActiveApi(user.id, {
        is_active: !user.is_active,
      })

      setUsers((prev) =>
        prev.map((item) => (item.id === user.id ? response.data : item)),
      )
    } catch (error: any) {
      alert(error.response?.data?.message || '활성화 상태 변경 실패')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase()

    if (!keyword) return users

    return users.filter((user) => {
      const name = user.name?.toLowerCase() ?? ''
      const nickname = user.nickname?.toLowerCase() ?? ''
      const email = user.email?.toLowerCase() ?? ''
      const provider = user.provider?.toLowerCase() ?? ''
      const membership = user.membership_type?.toLowerCase() ?? ''

      return (
        name.includes(keyword) ||
        nickname.includes(keyword) ||
        email.includes(keyword) ||
        provider.includes(keyword) ||
        membership.includes(keyword)
      )
    })
  }, [users, searchKeyword])

  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.is_active).length
  const inactiveUsers = totalUsers - activeUsers
  const adminUsers = users.filter(
    (user) => user.membership_type === 'admin',
  ).length
  const premiumUsers = users.filter(
    (user) => user.membership_type === 'premium',
  ).length

  return (
    <section>
      <div className="page-header admin-page-header">
        <div>
          <span className="eyebrow">Admin Console</span>
          <h1>회원 관리</h1>
          <p>회원 등급, 가입 방식, 활성화 상태를 한 화면에서 관리합니다.</p>
        </div>

        <button
          type="button"
          className="button secondary"
          onClick={fetchUsers}
          disabled={isLoading}
        >
          {isLoading ? '새로고침 중...' : '회원 목록 새로고침'}
        </button>
      </div>

      {errorMessage && <div className="alert error">{errorMessage}</div>}

      <div className="admin-summary-grid">
        <article className="admin-summary-card primary">
          <span>전체 회원</span>
          <strong>{totalUsers}</strong>
          <small>registered users</small>
        </article>

        <article className="admin-summary-card">
          <span>활성 회원</span>
          <strong>{activeUsers}</strong>
          <small>active accounts</small>
        </article>

        <article className="admin-summary-card">
          <span>비활성 회원</span>
          <strong>{inactiveUsers}</strong>
          <small>inactive accounts</small>
        </article>

        <article className="admin-summary-card">
          <span>관리자</span>
          <strong>{adminUsers}</strong>
          <small>admin users</small>
        </article>

        <article className="admin-summary-card">
          <span>프리미엄</span>
          <strong>{premiumUsers}</strong>
          <small>premium users</small>
        </article>
      </div>

      <div className="admin-toolbar">
        <div>
          <h2>회원 목록</h2>
          <p>
            총 {users.length}명 중 {filteredUsers.length}명이 표시됩니다.
          </p>
        </div>

        <div className="admin-search-box">
          <input
            type="search"
            placeholder="이름, 닉네임, 이메일, 등급 검색"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="admin-loading-card">
          <strong>회원 목록을 불러오는 중...</strong>
          <p>잠시만 기다려주세요.</p>
        </div>
      ) : (
        <div className="admin-table-card">
          <table className="admin-table premium-admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>회원 정보</th>
                <th>이메일</th>
                <th>생년월일</th>
                <th>가입방식</th>
                <th>등급</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <span className="admin-id-badge">#{user.id}</span>
                  </td>

                  <td>
                    <div className="admin-user-cell">
                      <div className="admin-user-avatar">
                        {user.name?.charAt(0) || 'U'}
                      </div>

                      <div>
                        <strong>{user.name}</strong>
                        <span>{user.nickname}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="admin-email">{user.email}</span>
                  </td>

                  <td>{user.birth_date || '-'}</td>

                  <td>
                    <span className="provider-chip">{user.provider}</span>
                  </td>

                  <td>
                    <select
                      className="admin-select"
                      value={user.membership_type}
                      onChange={(event) =>
                        handleMembershipChange(
                          user.id,
                          event.target.value as MembershipType,
                        )
                      }
                    >
                      <option value="free">free</option>
                      <option value="premium">premium</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>

                  <td>
                    <span
                      className={
                        user.is_active
                          ? 'admin-status active'
                          : 'admin-status inactive'
                      }
                    >
                      {user.is_active ? '활성' : '비활성'}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className={
                        user.is_active
                          ? 'button danger'
                          : 'button secondary'
                      }
                      onClick={() => handleActiveToggle(user)}
                    >
                      {user.is_active ? '비활성화' : '활성화'}
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="admin-empty-state">
                      <strong>표시할 회원이 없습니다.</strong>
                      <p>검색어를 변경하거나 회원 목록을 새로고침해보세요.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default AdminUsersPage