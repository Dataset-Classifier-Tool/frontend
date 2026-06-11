export type MembershipType = 'free' | 'premium' | 'admin'

export interface User {
  id: number
  email: string
  nickname: string
  membership_type: MembershipType
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  nickname: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}