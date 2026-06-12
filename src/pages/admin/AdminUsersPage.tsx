import { useEffect, useState } from 'react'
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

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>회원 관리</h1>
          <p>관리자는 회원 등급과 활성화 상태를 변경할 수 있습니다.</p>
        </div>
      </div>

      {errorMessage && <div className="alert error">{errorMessage}</div>}

      {isLoading ? (
        <p>회원 목록을 불러오는 중...</p>
      ) : (
        <div className="table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>닉네임</th>
                <th>이메일</th>
                <th>생년월일</th>
                <th>가입방식</th>
                <th>등급</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.nickname}</td>
                  <td>{user.email}</td>
                  <td>{user.birth_date || '-'}</td>
                  <td>{user.provider}</td>
                  <td>
                    <select
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
                    <span className={user.is_active ? 'status active' : 'status inactive'}>
                      {user.is_active ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="button secondary"
                      onClick={() => handleActiveToggle(user)}
                    >
                      {user.is_active ? '비활성화' : '활성화'}
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={9}>회원이 없습니다.</td>
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