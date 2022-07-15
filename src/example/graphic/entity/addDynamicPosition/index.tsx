import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { LayerState } from "@mars/components/MarsSample/LayerState"
import { LocationTo } from "@mars/components/MarsSample/LocationTo"
import { Space } from "antd"

function UIComponent() {
  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <LayerState direction="horizontal" />

        <div className="f-pt">
          <Space>
            <span>动态贴模型示例:</span>
            <MarsButton href="editor-react.html?id=graphic/entity/addDynamicPosition-tileset" target="_blank">
              动态贴模型示例
            </MarsButton>
          </Space>
        </div>
      </MarsPannel>

      <LocationTo />
    </>
  )
}

export default UIComponent
