import type { LabelName } from './label'

export type BoundingBoxSource = 'manual' | 'auto' | 'mock'

export interface BoundingBox {
  id: number
  frame_id: number
  label_id: number | null
  label_name: LabelName
  x: number
  y: number
  width: number
  height: number
  source: BoundingBoxSource
  confidence: number | null
  is_verified: boolean
  created_at: string
  updated_at: string
}

export type CreateBoundingBoxRequest = {
  frame_id: number
  label_id: number | null
  label_name: LabelName
  x: number
  y: number
  width: number
  height: number
  source?: BoundingBoxSource
  confidence?: number | null
  is_verified?: boolean
}

export type UpdateBoundingBoxRequest = {
  label_name?: LabelName
  x?: number
  y?: number
  width?: number
  height?: number
  source?: BoundingBoxSource
  confidence?: number | null
  is_verified?: boolean
}