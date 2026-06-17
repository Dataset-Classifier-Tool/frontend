import apiClient from './axios'

import type { ApiResponse } from '../../types/api'
import type {
  BoundingBox,
  CreateBoundingBoxRequest,
  UpdateBoundingBoxRequest,
} from '../../types/boundingBox'

export async function createBoundingBoxApi(payload: CreateBoundingBoxRequest) {
  const response = await apiClient.post<ApiResponse<BoundingBox>>(
    '/api/bounding-boxes',
    payload,
  )

  return response.data
}

export async function getFrameBoundingBoxesApi(frameId: number) {
  const response = await apiClient.get<ApiResponse<BoundingBox[]>>(
    `/api/frames/${frameId}/bounding-boxes`,
  )

  return response.data
}

export async function updateBoundingBoxApi(
  boxId: number,
  payload: UpdateBoundingBoxRequest,
) {
  const response = await apiClient.patch<ApiResponse<BoundingBox>>(
    `/api/bounding-boxes/${boxId}`,
    payload,
  )

  return response.data
}

export async function deleteBoundingBoxApi(boxId: number) {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/api/bounding-boxes/${boxId}`,
  )

  return response.data
}