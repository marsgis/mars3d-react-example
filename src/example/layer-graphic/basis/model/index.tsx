import { LayerState } from "@mars/components/MarsSample/LayerState.jsx"
import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} right={10} top={10} width={440} height={100}>
      <Space>
        <MarsButton onClick={() => mapWork.showFenliDemo()}>风力发电机</MarsButton>
        <MarsButton onClick={() => mapWork.showShanghaiDemo()}>上海浦东</MarsButton>
        <MarsButton onClick={() => mapWork.showDonghuaDemo()}>动画模型</MarsButton>
        <MarsButton onClick={() => mapWork.showGuangfu()}>光伏电场</MarsButton>
        <MarsButton onClick={() => mapWork.removeLayer()}>清除</MarsButton>
      </Space>
      <div className="f-pt">
        <LayerState label="" direction="horizontal"></LayerState>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
