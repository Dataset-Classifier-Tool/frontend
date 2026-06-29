import apiClient from '../../../common/api/axios'

import type { ApiResponse } from '../../../types/api'
import type { Label } from '../../../types/label'

export type LabelName =
  | 'fire'
  | 'smoke'
  | 'carlight'
  | 'negative'
  | 'fire_smoke'
  | 'fire_smoke_carlight'

export type LabelSource = 'manual' | 'ai'

export interface CreateLabelRequest {
  label_name: LabelName
  confidence?: number | null
  source?: LabelSource
  is_verified?: boolean
}

export interface UpdateLabelRequest {
  label_name?: LabelName
  confidence?: number | null
  source?: LabelSource
  is_verified?: boolean
}

export async function createLabelApi(
  frameId: number,
  payload: CreateLabelRequest,
) {
  const response = await apiClient.post<ApiResponse<Label>>(
    `/api/frames/${frameId}/labels`,
    payload,
  )

  return response.data
}

export async function updateLabelApi(
  labelId: number,
  payload: UpdateLabelRequest,
) {
  const response = await apiClient.patch<ApiResponse<Label>>(
    `/api/labels/${labelId}`,
    payload,
  )

  return response.data
}

export async function deleteLabelApi(labelId: number) {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/api/labels/${labelId}`,
  )

  return response.data
}