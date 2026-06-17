import apiClient from './axios'

import type { ApiResponse } from '../../types/api'
import type { Label, LabelName } from '../../types/label'

export type LabelCounts = Record<LabelName, number>

export interface AutoLabelResultItem {
  frame_id: number
  frame_number: number
  label?: Label
  prediction?: {
    label_name: LabelName
    confidence: number
    scores: Record<string, number>
  }
  error?: string
}

export interface AutoLabelDatasetResponse {
  dataset_id: number
  total_frames: number
  labeled_frames: number
  failed_frames: number
  label_counts: LabelCounts
  results: AutoLabelResultItem[]
}

export async function autoLabelDatasetApi(datasetId: number) {
  const response = await apiClient.post<ApiResponse<AutoLabelDatasetResponse>>(
    `/api/datasets/${datasetId}/auto-label`,
  )

  return response.data
}