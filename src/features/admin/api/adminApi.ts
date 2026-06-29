import apiClient from '../../../common/api/axios'
import type { ApiResponse } from '../../../types/api.ts'
import type {
  AdminUser,
  UpdateActiveRequest,
  UpdateMembershipRequest,
} from '../../../types/user.ts'

export async function getAdminUsersApi() {
  const response = await apiClient.get<ApiResponse<AdminUser[]>>('/api/admin/users')
  return response.data
}

export async function updateUserMembershipApi(
  userId: number,
  payload: UpdateMembershipRequest,
) {
  const response = await apiClient.patch<ApiResponse<AdminUser>>(
    `/api/admin/users/${userId}/membership`,
    payload,
  )

  return response.data
}

export async function updateUserActiveApi(
  userId: number,
  payload: UpdateActiveRequest,
) {
  const response = await apiClient.patch<ApiResponse<AdminUser>>(
    `/api/admin/users/${userId}/active`,
    payload,
  )

  return response.data
}