export type LabelName =
  | 'fire'
  | 'smoke'
  | 'carlight'
  | 'negative'
  | 'fire_smoke'
  | 'fire_smoke_carlight'

export type LabelSource = 'manual' | 'ai'

export interface Label {
  id: number
  frame_id: number
  label_name: LabelName
  confidence: number | null
  is_verified: boolean
  source: LabelSource
  created_at: string | null
  updated_at: string | null
}