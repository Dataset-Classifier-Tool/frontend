import type { DatasetFrame } from './frame'

export interface DatasetVideo {
  id: number
  dataset_id: number
  file_name: string
  file_path: string
  file_size: number | null
  duration: number | null
  fps: number | null
  frame_count: number
  original_frame_count: number | null
  frames?: DatasetFrame[]
  created_at: string | null
  updated_at: string | null
}