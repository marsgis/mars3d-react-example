import { useEffect, useRef, useState } from "react"
import * as mapWork from "./map.js"
import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent(props) { 
  return (
    <MarsPannel visible={true} right="10" top="10">
      <Space>
        <MarsButton
          onClick={() => {
            mapWork.startRotate()
          }}
        >
          重新播放
        </MarsButton>
        <MarsButton
          onClick={() => {
            mapWork.stopRotate()
          }}
        >
          停止动画
        </MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
