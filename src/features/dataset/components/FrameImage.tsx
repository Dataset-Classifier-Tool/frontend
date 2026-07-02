import { useEffect, useState } from 'react'

import { getDatasetFrameImageBlobApi } from '../../upload/api/uploadApi'

type FrameImageProps = {
  datasetId: number
  frameId: number
  alt: string
  className?: string
}

function FrameImage({ datasetId, frameId, alt, className }: FrameImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let objectUrl: string | null = null
    let ignore = false

    async function loadImage() {
      setHasError(false)
      setImageUrl(null)

      try {
        const blob = await getDatasetFrameImageBlobApi(datasetId, frameId)
        objectUrl = URL.createObjectURL(blob)

        if (!ignore) {
          setImageUrl(objectUrl)
        }
      } catch {
        if (!ignore) {
          setHasError(true)
        }
      }
    }

    loadImage()

    return () => {
      ignore = true

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [datasetId, frameId])

  if (hasError) {
    return (
      <div className="dataset-frame-image-error">
        <strong>이미지를 불러오지 못했습니다.</strong>
        <span>백엔드 이미지 API 또는 인증 상태를 확인해주세요.</span>
      </div>
    )
  }

  if (!imageUrl) {
    return (
      <div className="dataset-frame-image-loading">
        이미지 불러오는 중...
      </div>
    )
  }

  return <img src={imageUrl} alt={alt} className={className} draggable={false} />
}

export default FrameImage