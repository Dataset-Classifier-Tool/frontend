import type { MembershipType, User } from './auth'

export type AdminUser = User

export interface UpdateMembershipRequest {
  membership_type: MembershipType
}

export interface UpdateActiveRequest {
  is_active: boolean
}