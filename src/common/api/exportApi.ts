// src/common/api/exportApi.ts

import apiClient from './axios'

export async function downloadDatasetZipApi(datasetId: number) {
  const response = await apiClient.get(
    `/api/datasets/${datasetId}/export/zip`,
    {
      responseType: 'blob',
    },
  )

  const contentDisposition = response.headers['content-disposition']

  let filename = `dataset_${datasetId}_export.zip`

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)

    if (filenameMatch?.[1]) {
      filename = decodeURIComponent(filenameMatch[1])
    }
  }

  const blobUrl = window.URL.createObjectURL(new Blob([response.data]))

  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()

  link.remove()
  window.URL.revokeObjectURL(blobUrl)
}