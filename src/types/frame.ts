import type { BoundingBox } from './boundingBox'
import type { Label } from './label'

export interface DatasetFrame {
  id: number
  video_id: number
  frame_number: number
  timestamp: number | null
  file_name: string
  file_path: string
  width: number
  height: number
  labels: Label[]
  bounding_boxes?: BoundingBox[]
  created_at: string
  updated_at: string
}