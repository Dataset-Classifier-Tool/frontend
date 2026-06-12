import apiClient from './axios'
import type { ApiResponse } from '../../types/api'
import type { DatasetFrame } from '../../types/frame'
import type { DatasetVideo } from '../../types/video'

export interface UploadVideoResponse {
  video: DatasetVideo
  extracted_frame_count: number
  frames: DatasetFrame[]
}

export async function uploadVideoApi(
  datasetId: number,
  file: File,
  frameIntervalSeconds = 3,
) {
  const formData = new FormData()

  formData.append('file', file)
  formData.append('frame_interval_seconds', String(frameIntervalSeconds))

  const response = await apiClient.post<ApiResponse<UploadVideoResponse>>(
    `/api/datasets/${datasetId}/videos/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
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
  return `${import.meta.env.VITE_API_BASE_URL}/api/frames/${frameId}/image`
}