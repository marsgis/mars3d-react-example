import {
  MarsPannel,
  MarsButton,
  MarsSwitch
} from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import "./index.css"


function UIComponent() {
  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <div className="f-mb roleControllerLineHeight">
          提示：通过W/S/A/D和鼠标控制人物移动和视角<br />
        </div>
        <Space>
          <MarsSwitch
            defaultChecked
            onChange={(data) => {
              mapWork.setEnabled(data)
            }}
          ></MarsSwitch>
          <MarsButton onClick={() => mapWork.drawPoint()}>点选修改位置</MarsButton>
        </Space>
      </MarsPannel>
    </>
  )
}

export default UIComponent
