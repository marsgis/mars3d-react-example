import { MarsPannel, MarsButton, MarsGui } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useState, useMemo } from "react"
import * as mapWork from "./map.js"

function UIComponent() {
  const [radius, setValue] = useState(1)

  useMemo(() => {
    mapWork.radiusChange(radius)
  }, [radius])

  return (
    <MarsPannel visible={true} width={220} top={10} right={10}>
      <MarsGui
        formProps={{
          labelCol: { span: 9 }
        }}
        options={[
          {
            type: "number",
            label: "缓冲半径",
            field: "radius",
            value: radius,
            min: 1,
            max: 999,
            extra: "公里",
            extraWidth: 60,
            change(value) {
              setValue(value)
            }
          },
          {
            type: "custom",
            label: "绘制",
            element: (
              <Space>
                <MarsButton onClick={() => mapWork.drawPoint()}>点</MarsButton>
                <MarsButton onClick={() => mapWork.drawPolyline()}>线</MarsButton>
                <MarsButton onClick={() => mapWork.drawPolygon()}>面</MarsButton>
              </Space>
            )
          }
        ]}
      ></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
