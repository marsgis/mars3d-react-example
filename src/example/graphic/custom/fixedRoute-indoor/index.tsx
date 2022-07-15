import { MarsGui, MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

const startFly = () => {
  mapWork.startFly()
}

const stopFly = () => {
  mapWork.stopFly()
}

const centerAtDX1 = () => {
  mapWork.centerAtDX1()
}

const centerAtDX2 = () => {
  mapWork.centerAtDX2()
}

const centerAtDX3 = () => {
  mapWork.centerAtDX3()
}

function UIComponent() {
  return (
    <MarsPannel visible={true} right={10} top={10}>
      <div className="f-mb">
        <Space>
          <span>漫游控制:</span>
          <MarsButton onClick={startFly}>开始漫游</MarsButton>
          <MarsButton onClick={stopFly}>停止漫游</MarsButton>
        </Space>
      </div>

      <Space>
        <span>室内视角:</span>
        <MarsButton onClick={centerAtDX1}>教室</MarsButton>
        <MarsButton onClick={centerAtDX2}>走廊</MarsButton>
        <MarsButton onClick={centerAtDX3}>楼梯间</MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
