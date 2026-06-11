import apiClient from './axios'
import type { ApiResponse } from '../../types/api'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from '../../types/auth'

export async function registerApi(payload: RegisterRequest) {
  const response = await apiClient.post<ApiResponse<User>>(
    '/api/auth/register',
    payload,
  )

  return response.data
}

export async function loginApi(payload: LoginRequest) {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    '/api/auth/login',
    payload,
  )

  return response.data
}

export async function meApi() {
  const response = await apiClient.get<ApiResponse<User>>('/api/auth/me')

  return response.data
}