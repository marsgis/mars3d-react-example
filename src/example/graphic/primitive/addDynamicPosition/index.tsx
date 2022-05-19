import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
import { LayerState } from "@mars/components/MarsSample/LayerState"

function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10}>
      <div className="f-mb">
        <LayerState />
      </div>
      <Space>
        <span>动态贴模型示例</span>
        <MarsButton href="editor-react.html?id=graphic/primitive/addDynamicPosition-tileset" target="_blank">
          动态贴模型示例
        </MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
