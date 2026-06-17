import type { LabelName } from './label'

export interface BoundingBox {
  id: number
  frame_id: number
  label_id: number | null
  label_name: LabelName
  x: number
  y: number
  width: number
  height: number
  source: 'manual' | 'ai'
  is_verified: boolean
  created_at: string | null
  updated_at: string | null
}

export interface CreateBoundingBoxRequest {
  frame_id: number
  label_id?: number | null
  label_name: LabelName
  x: number
  y: number
  width: number
  height: number
}

export interface UpdateBoundingBoxRequest {
  label_name?: LabelName
  x?: number
  y?: number
  width?: number
  height?: number
  is_verified?: boolean
}