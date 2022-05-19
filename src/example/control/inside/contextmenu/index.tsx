import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { Space } from "antd"

function UIComponent() {
  return (
    <MarsPannel visible={true} right={10} top={10} width={170}>
      <Space wrap>
        <MarsButton onClick={() => mapWork.bindMapDefault()}>Map绑定默认菜单</MarsButton>
        <MarsButton onClick={() => mapWork.bindMapDemo()}>Map绑定自定义菜单</MarsButton>
        <MarsButton onClick={() => mapWork.unBindMapDemo()}>Map绑定上解绑</MarsButton>

        <MarsButton onClick={() => mapWork.bindLayerDemo()}>图层上绑定</MarsButton>
        <MarsButton onClick={() => mapWork.unBindLayerDemo()}>图层上解绑</MarsButton>

        <MarsButton onClick={() => mapWork.bindGraphicDemo()}>Graphic上绑定</MarsButton>
        <MarsButton onClick={() => mapWork.unBindGraphicDemo()}>Graphic上解绑</MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
