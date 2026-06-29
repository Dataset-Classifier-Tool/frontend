import type { DragEvent, RefObject } from 'react'

type UploadDropZoneProps = {
  file: File | null
  fileInputRef: RefObject<HTMLInputElement | null>
  isDragging: boolean
  selectedFileSizeMb: number
  maxFileSizeMb: number
  onFileChange: (file: File | null) => void
  onClearFile: () => void
  onDraggingChange: (isDragging: boolean) => void
}

function UploadDropZone({
  file,
  fileInputRef,
  isDragging,
  selectedFileSizeMb,
  maxFileSizeMb,
  onFileChange,
  onClearFile,
  onDraggingChange,
}: UploadDropZoneProps) {
  return (
    <div
      className={`upload-dropzone ${isDragging ? 'is-dragging' : ''} ${
        file ? 'is-selected' : ''
      }`}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        onDraggingChange(true)
      }}
      onDragLeave={() => onDraggingChange(false)}
      onDrop={(event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        onDraggingChange(false)
        onFileChange(event.dataTransfer.files?.[0] ?? null)
      }}
      role="button"
      tabIndex={0}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        hidden
      />

      <div className="upload-dropzone-icon">🎥</div>

      {file ? (
        <>
          <strong>{file.name}</strong>
          <span>{selectedFileSizeMb.toFixed(2)}MB</span>

          <button
            type="button"
            className="ui-button ui-button-danger ui-button-sm"
            onClick={(event) => {
              event.stopPropagation()
              onClearFile()
            }}
          >
            파일 제거
          </button>
        </>
      ) : (
        <>
          <strong>영상을 드래그하거나 클릭해서 선택하세요</strong>
          <span>MP4, AVI, MOV, MKV, WEBM / 최대 {maxFileSizeMb}MB</span>
        </>
      )}
    </div>
  )
}

export default UploadDropZone