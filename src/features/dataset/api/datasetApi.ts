import apiClient from '../../../common/api/axios'

import type { ApiResponse } from '../../../types/api'
import type { CreateDatasetRequest, Dataset } from '../../../types/dataset'

export async function getDatasetsApi() {
  const response = await apiClient.get<ApiResponse<Dataset[]>>('/api/datasets')

  return response.data
}

export async function createDatasetApi(payload: CreateDatasetRequest) {
  const response = await apiClient.post<ApiResponse<Dataset>>(
    '/api/datasets',
    payload,
  )

  return response.data
}

export async function getDatasetDetailApi(datasetId: number) {
  const response = await apiClient.get<ApiResponse<Dataset>>(
    `/api/datasets/${datasetId}`,
  )

  return response.data
}

export async function deleteDatasetApi(datasetId: number) {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/api/datasets/${datasetId}`,
  )

  return response.data
}