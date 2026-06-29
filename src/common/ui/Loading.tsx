type LoadingProps = {
  title?: string
  description?: string
}

function Loading({
  title = '불러오는 중입니다',
  description = '잠시만 기다려주세요.',
}: LoadingProps) {
  return (
    <div className="ui-loading">
      <div className="ui-spinner" />

      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default Loading