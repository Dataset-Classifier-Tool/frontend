import { create } from 'zustand'

import {
  createLabelApi,
  deleteLabelApi,
  updateLabelApi,
  type CreateLabelRequest,
  type UpdateLabelRequest,
} from '../features/dataset/api/labelApi.ts'

import type { Label } from '../types/label'

interface LabelState {
  isLoading: boolean
  lastCreatedLabel: Label | null
  lastUpdatedLabel: Label | null

  createLabel: (
    frameId: number,
    payload: CreateLabelRequest,
  ) => Promise<Label>

  updateLabel: (
    labelId: number,
    payload: UpdateLabelRequest,
  ) => Promise<Label>

  deleteLabel: (labelId: number) => Promise<void>

  clearLabelState: () => void
}

export const useLabelStore = create<LabelState>((set) => ({
  isLoading: false,
  lastCreatedLabel: null,
  lastUpdatedLabel: null,

  createLabel: async (frameId, payload) => {
    set({ isLoading: true })

    try {
      const response = await createLabelApi(frameId, payload)

      set({
        isLoading: false,
        lastCreatedLabel: response.data,
      })

      return response.data
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  updateLabel: async (labelId, payload) => {
    set({ isLoading: true })

    try {
      const response = await updateLabelApi(labelId, payload)

      set({
        isLoading: false,
        lastUpdatedLabel: response.data,
      })

      return response.data
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  deleteLabel: async (labelId) => {
    set({ isLoading: true })

    try {
      await deleteLabelApi(labelId)

      set({ isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  clearLabelState: () => {
    set({
      lastCreatedLabel: null,
      lastUpdatedLabel: null,
    })
  },
}))