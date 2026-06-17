import apiClient from './axios'

import type { ApiResponse } from '../../types/api'
import type { DatasetFrame } from '../../types/frame'
import type { DatasetVideo } from '../../types/video'
import type { AutoLabelDatasetResponse } from './classifierApi'

export interface UploadVideoResponse {
  video: DatasetVideo
  extracted_frame_count: number
  target_width: number | null
  auto_label: boolean
  auto_label_result: AutoLabelDatasetResponse | null
  frames: DatasetFrame[]
}

export async function uploadVideoApi(datasetId: number, formData: FormData) {
  const response = await apiClient.post<ApiResponse<UploadVideoResponse>>(
    `/api/datasets/${datasetId}/videos/upload`,
    formData,
  )

  return response.data
}

export async function getVideoFramesApi(videoId: number) {
  const response = await apiClient.get<ApiResponse<DatasetFrame[]>>(
    `/api/videos/${videoId}/frames`,
  )

  return response.data
}

export function getFrameImageUrl(frameId: number) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  return `${baseUrl}/api/frames/${frameId}/image`
}