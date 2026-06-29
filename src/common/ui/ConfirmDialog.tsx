type ConfirmDialogVariant = 'danger' | 'primary'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: ConfirmDialogVariant
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({
  open,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="modal-overlay" role="presentation" onClick={onCancel}>
      <section
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="confirm-dialog-icon">
          {variant === 'danger' ? '!' : '✓'}
        </div>

        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <div className="confirm-dialog-actions">
          <button
            type="button"
            className="ui-button ui-button-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={`ui-button ${
              variant === 'danger' ? 'ui-button-danger' : 'ui-button-primary'
            }`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : confirmText}
          </button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmDialog