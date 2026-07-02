import type { DragEvent, KeyboardEvent, RefObject } from 'react'

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
  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openFilePicker()
    }
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    onDraggingChange(false)
    onFileChange(event.dataTransfer.files?.[0] ?? null)
  }

  return (
    <div
      className={`upload-dropzone ${isDragging ? 'is-dragging' : ''} ${
        file ? 'is-selected' : ''
      }`}
      onClick={openFilePicker}
      onKeyDown={handleKeyDown}
      onDragOver={(event) => {
        event.preventDefault()
        onDraggingChange(true)
      }}
      onDragLeave={() => onDraggingChange(false)}
      onDrop={handleDrop}
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

      <div className="upload-dropzone-orbit">
        <div className="upload-dropzone-icon">{file ? '✅' : '🎥'}</div>
      </div>

      {file ? (
        <div className="upload-file-selected">
          <span className="ui-badge ui-badge-primary">파일 선택 완료</span>
          <strong>{file.name}</strong>
          <p>{selectedFileSizeMb.toFixed(2)}MB · 업로드 준비 완료</p>

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
        </div>
      ) : (
        <div className="upload-file-empty">
          <strong>영상을 드래그하거나 클릭해서 선택하세요</strong>
          <p>MP4, AVI, MOV, MKV, WEBM / 최대 {maxFileSizeMb}MB</p>

          <span className="upload-dropzone-button">파일 선택하기</span>
        </div>
      )}
    </div>
  )
}

export default UploadDropZone