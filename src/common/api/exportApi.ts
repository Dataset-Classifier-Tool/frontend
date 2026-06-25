import apiClient from './axios'

export async function downloadDatasetZipApi(datasetId: number) {
  const response = await apiClient.get(
    `/api/datasets/${datasetId}/export/zip`,
    {
      responseType: 'blob',
    },
  )

  const blob = new Blob([response.data], {
    type: 'application/zip',
  })

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `dataset_${datasetId}_export.zip`
  document.body.appendChild(link)
  link.click()

  link.remove()
  window.URL.revokeObjectURL(url)
}

export async function downloadDatasetYoloApi(datasetId: number) {
  const response = await apiClient.get(
    `/api/datasets/${datasetId}/export/yolo`,
    {
      responseType: 'blob',
    },
  )

  const blob = new Blob([response.data], {
    type: 'application/zip',
  })

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `dataset_${datasetId}_yolo_export.zip`
  document.body.appendChild(link)
  link.click()

  link.remove()
  window.URL.revokeObjectURL(url)
}

export type YoloExportMeta = {
  available: boolean
  dataset_id: number
  dataset_name: string
  export_frame_count: number
  export_box_count: number
  train_frame_count: number
  val_frame_count: number
  class_map: Record<string, number>
  class_counts: Record<string, number>
}

export async function getYoloExportMetaApi(datasetId: number) {
  const response = await apiClient.get<{
    success: boolean
    message: string
    data: YoloExportMeta
  }>(`/api/datasets/${datasetId}/export/yolo/meta`)

  return response.data
}