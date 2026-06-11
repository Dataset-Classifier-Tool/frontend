export interface Dataset {
  id: number
  user_id: number
  name: string
  description: string | null
  image_count: number
  created_at: string | null
  updated_at: string | null
}

export interface CreateDatasetRequest {
  name: string
  description?: string
}