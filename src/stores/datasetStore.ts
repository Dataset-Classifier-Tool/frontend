import { create } from 'zustand'

import {
  createDatasetApi,
  deleteDatasetApi,
  getDatasetsApi,
} from '../features/dataset/api/datasetApi'

import type { CreateDatasetRequest, Dataset } from '../types/dataset'

interface DatasetState {
  datasets: Dataset[]
  isLoading: boolean

  fetchDatasets: () => Promise<void>
  createDataset: (payload: CreateDatasetRequest) => Promise<void>
  deleteDataset: (datasetId: number) => Promise<void>
}

export const useDatasetStore = create<DatasetState>((set, get) => ({
  datasets: [],
  isLoading: false,

  fetchDatasets: async () => {
    set({ isLoading: true })

    try {
      const response = await getDatasetsApi()

      set({
        datasets: response.data,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  createDataset: async (payload) => {
    set({ isLoading: true })

    try {
      const response = await createDatasetApi(payload)

      set({
        datasets: [response.data, ...get().datasets],
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  deleteDataset: async (datasetId) => {
    set({ isLoading: true })

    try {
      await deleteDatasetApi(datasetId)

      set({
        datasets: get().datasets.filter((dataset) => dataset.id !== datasetId),
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
}))