import * as mapWork from "./map.js"
import { MarsPannel, MarsButton, $notify, $message } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useEffect } from "react"

function UIComponent() {
  return (
    <MarsPannel visible={true} right="10" top="10" width={125}>
      <Space wrap>
        <MarsButton
          onClick={() => {
            mapWork.drawExtent()
          }}
        >
          绘制矩形
        </MarsButton>

        <MarsButton
          onClick={() => {
            mapWork.drawExtent2()
          }}
        >
          绘制矩形(外)
        </MarsButton>

        <MarsButton
          onClick={() => {
            $message("提示：因为使用clippingPlanes接口，绘制面时，有些绘制的角度存在效果不对")
            mapWork.drawPoly()
          }}
        >
          绘制面
        </MarsButton>

        <MarsButton
          onClick={() => {
            $message("提示：因为使用clippingPlanes接口，绘制面时，有些绘制的角度存在效果不对")
            mapWork.drawPoly2()
          }}
        >
          绘制面(外)
        </MarsButton>

        <MarsButton
          onClick={() => {
            mapWork.clear()
          }}
        >
          清除
        </MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
