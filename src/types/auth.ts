export type MembershipType = 'free' | 'premium' | 'admin'
export type AuthProvider = 'local' | 'kakao' | 'naver'

export interface User {
  id: number
  name: string
  birth_date: string | null
  nickname: string
  email: string
  membership_type: MembershipType
  provider: AuthProvider
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export interface RegisterRequest {
  name: string
  birth_date: string
  nickname: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}