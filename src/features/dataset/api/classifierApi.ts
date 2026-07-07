import apiClient from '../../../common/api/axios'

import type { ApiResponse } from '../../../types/api'
import type { BoundingBox } from '../../../types/boundingBox'
import type { LabelName } from '../../../types/label'

export type AutoLabelTarget = 'dataset' | 'frame'

export type AutoLabelMode = 'mock' | 'model'

export type AutoLabelRequest = {
  target: AutoLabelTarget
  dataset_id?: number
  frame_id?: number
  mode: AutoLabelMode
  confidence_threshold?: number
}

export type AutoLabelPrediction = {
  frame_id: number
  label_name: LabelName
  confidence: number
  x: number
  y: number
  width: number
  height: number
}

export type AutoLabelDatasetResponse = {
  dataset_id: number
  total_frames?: number
  labeled_frames?: number
  failed_frames?: number
  analyzed_frame_count?: number
  created_box_count: number
  label_counts?: Partial<Record<LabelName, number>>
  predictions?: AutoLabelPrediction[]
  results?: unknown[]
}

export async function runAutoLabelApi(request: AutoLabelRequest) {
  if (!request.dataset_id) {
    throw new Error('dataset_id가 필요합니다.')
  }

  const response = await apiClient.post<ApiResponse<AutoLabelDatasetResponse>>(
    `/api/datasets/${request.dataset_id}/auto-label`,
  )

  return response.data
}

export async function acceptAutoLabelPredictionApi(prediction: AutoLabelPrediction) {
  const response = await apiClient.post<ApiResponse<BoundingBox>>(
    '/api/bounding-boxes',
    {
      frame_id: prediction.frame_id,
      label_id: null,
      label_name: prediction.label_name,
      x: prediction.x,
      y: prediction.y,
      width: prediction.width,
      height: prediction.height,
      source: 'ai',
      confidence: prediction.confidence,
      is_verified: false,
    },
  )

  return response.data
}