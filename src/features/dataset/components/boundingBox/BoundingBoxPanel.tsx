import type { BoundingBox } from '../../../../types/boundingBox'
import type { LabelName } from '../../../../types/label'

type BoundingBoxPanelProps = {
  boxes: BoundingBox[]
  activeLabel: LabelName
  selectedBoxId: number | null

  onChangeActiveLabel: (label: LabelName) => void

  onAssignLabelToBox: (
    boxId: number,
    label: LabelName,
  ) => void

  onSelectBox: (boxId: number) => void

  onDeleteSelectedBox: () => void
}

const LABEL_OPTIONS: Array<{
  value: LabelName
  title: string
  desc: string
}> = [
  {
    value: 'fire',
    title: '화재',
    desc: '불꽃, 연소 지점',
  },
  {
    value: 'smoke',
    title: '연기',
    desc: '흰 연기, 검은 연기',
  },
  {
    value: 'carlight',
    title: '등화류',
    desc: '전조등, 후미등, 반사광',
  },
  {
    value: 'negative',
    title: '오탐',
    desc: '화재/연기가 아닌 영역',
  },
]

function getLabelTitle(labelName: LabelName) {
  return (
    LABEL_OPTIONS.find(
      (label) => label.value === labelName,
    )?.title ?? labelName
  )
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

function BoundingBoxPanel({
  boxes,

  activeLabel,

  selectedBoxId,

  onChangeActiveLabel,

  onAssignLabelToBox,

  onSelectBox,

  onDeleteSelectedBox,

}: BoundingBoxPanelProps) {

  const selectedBox =
    boxes.find(

      box =>

        box.id === selectedBoxId,

    )

  return (

    <aside className="bbox-panel">

      <div className="bbox-panel-header">

        <div>

          <span className="bbox-panel-eyebrow">

            BOUNDING BOX

          </span>

          <strong>

            객체 영역 지정

          </strong>

        </div>

        <span className="bbox-count">

          {boxes.length}개

        </span>

      </div>

      <div className="bbox-label-section">

        <strong className="bbox-section-title">

          라벨 선택

        </strong>

        <div className="bbox-label-grid">

          {LABEL_OPTIONS.map(label => (

            <button

              key={label.value}

              type="button"

              className={`bbox-label-button

              ${

                selectedBox

                  ? selectedBox.label_name ===
                    label.value

                  : activeLabel ===
                    label.value

                  ? 'active'

                  : ''

              }

              `}

              onClick={() => {

                onChangeActiveLabel(

                  label.value,

                )

                if (

                  selectedBox

                ) {

                  onAssignLabelToBox(

                    selectedBox.id,

                    label.value,

                  )

                }

              }}

            >

              <strong>

                {label.title}

              </strong>

              <small>

                {label.desc}

              </small>

            </button>

          ))}

        </div>

      </div>

      {selectedBox && (

        <div className="bbox-selected-card">

          <span>

            선택된 박스

          </span>

          <strong>

            {

              getLabelTitle(

                selectedBox.label_name,

              )

            }

          </strong>

          <small>

            x

            {

              formatPercent(

                selectedBox.x,

              )

            }

            {' · '}

            y

            {

              formatPercent(

                selectedBox.y,

              )

            }

          </small>

          <small>

            w

            {

              formatPercent(

                selectedBox.width,

              )

            }

            {' · '}

            h

            {

              formatPercent(

                selectedBox.height,

              )

            }

          </small>

        </div>

      )}

      <div className="bbox-list-section">

        <div className="bbox-list-title-row">

          <strong className="bbox-section-title">

            생성된 박스

          </strong>

          {selectedBox && (

            <button

              type="button"

              className="bbox-delete-button"

              onClick={

                onDeleteSelectedBox

              }

            >

              선택 삭제

            </button>

          )}

        </div>

        {boxes.length === 0 ? (

          <div className="bbox-empty">

            <strong>

              아직 박스가 없습니다.

            </strong>

            <p>

              이미지 위에서 드래그해서

              객체 영역을 지정하세요.

            </p>

          </div>

        ) : (

          <div className="bbox-list">

            {boxes.map(

              (box, index) => (

                <button

                  key={box.id}

                  type="button"

                  className={`bbox-list-item

                  ${

                    selectedBoxId ===

                    box.id

                      ? 'active'

                      : ''

                  }

                  `}

                  onClick={() =>

                    onSelectBox(

                      box.id,

                    )

                  }

                >

                  <div>

                    <strong>

                      #

                      {index + 1}

                      {' '}

                      {

                        getLabelTitle(

                          box.label_name,

                        )

                      }

                    </strong>

                    <small>

                      x

                      {

                        formatPercent(

                          box.x,

                        )

                      }

                      {' · '}

                      y

                      {

                        formatPercent(

                          box.y,

                        )

                      }

                    </small>

                    <small>

                      w

                      {

                        formatPercent(

                          box.width,

                        )

                      }

                      {' · '}

                      h

                      {

                        formatPercent(

                          box.height,

                        )

                      }

                    </small>

                  </div>

                  <span>

                    {

                      box.label_name

                    }

                  </span>

                </button>

              ),

            )}

          </div>

        )}

      </div>

    </aside>

  )

}

export default BoundingBoxPanel