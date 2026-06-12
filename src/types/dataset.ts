import type { DatasetVideo } from './video'

export interface Dataset {
  id: number
  user_id: number
  name: string
  description: string | null
  video_count: number
  frame_count: number
  videos?: DatasetVideo[]
  created_at: string | null
  updated_at: string | null
}

export interface CreateDatasetRequest {
  name: string
  description?: string
}