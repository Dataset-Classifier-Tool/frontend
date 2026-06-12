import type { Label } from './label'

export interface DatasetFrame {
  id: number
  video_id: number
  frame_number: number
  timestamp: number | null
  file_name: string
  file_path: string
  width: number | null
  height: number | null
  labels: Label[]
  created_at: string | null
  updated_at: string | null
}