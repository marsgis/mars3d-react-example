import * as mapWork from "./map.js"
import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"

const UIComponent = () => {
  return (
    <MarsPannel visible={true} right={10} top={10}>
      <Space>
        <MarsButton onClick={() => { mapWork.createControl() }}>创建控件</MarsButton>
        <MarsButton onClick={() => { mapWork.destroyControl() }}>销毁控件</MarsButton>
      </Space>
    </MarsPannel>
  )
}
export default UIComponent
