import { create } from 'zustand'
import {
  getVideoFramesApi,
  uploadVideoApi,
  type UploadVideoResponse,
} from '../common/api/uploadApi'
import type { DatasetFrame } from '../types/frame'

interface UploadState {
  uploadedVideoResult: UploadVideoResponse | null
  frames: DatasetFrame[]
  isUploading: boolean
  isLoadingFrames: boolean

  uploadVideo: (
    datasetId: number,
    file: File,
    frameIntervalSeconds?: number,
  ) => Promise<void>

  fetchVideoFrames: (videoId: number) => Promise<void>

  clearUploadResult: () => void
}

export const useUploadStore = create<UploadState>((set) => ({
  uploadedVideoResult: null,
  frames: [],
  isUploading: false,
  isLoadingFrames: false,

  uploadVideo: async (
    datasetId: number,
    file: File,
    frameIntervalSeconds = 3,
  ) => {
    set({
      isUploading: true,
      uploadedVideoResult: null,
    })

    try {
      const response = await uploadVideoApi(
        datasetId,
        file,
        frameIntervalSeconds,
      )

      set({
        uploadedVideoResult: response.data,
        frames: response.data.frames,
        isUploading: false,
      })
    } catch (error) {
      set({
        isUploading: false,
      })

      throw error
    }
  },

  fetchVideoFrames: async (videoId: number) => {
    set({
      isLoadingFrames: true,
    })

    try {
      const response = await getVideoFramesApi(videoId)

      set({
        frames: response.data,
        isLoadingFrames: false,
      })
    } catch (error) {
      set({
        isLoadingFrames: false,
      })

      throw error
    }
  },

  clearUploadResult: () => {
    set({
      uploadedVideoResult: null,
      frames: [],
    })
  },
}))