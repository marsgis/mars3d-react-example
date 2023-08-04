import { MarsPannel, MarsButton, MarsCheckbox } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { useState } from "react"

const getDataSurfaceHeight = () => {
  mapWork.getDataSurfaceHeight()
}
function UIComponent() {
  const [enabledAggressive, setValue] = useState(true)

  const onChangeState = (e: any) => {
    setValue(e.target.checked)
    mapWork.enabledAggressive(e.target.checked)
  }

  return (
    <MarsPannel visible={true} top={10} right={10}>
      <div className="f-mb">
        <MarsCheckbox checked={enabledAggressive} onChange={onChangeState}>
          是否聚合
        </MarsCheckbox>
        <Space>
          <MarsButton onClick={getDataSurfaceHeight} title="贴地属性性能较低，建议异步计算后将高度值存放数据库内，后期直接加载此高度值">
            演示异步计算贴地高度
          </MarsButton>
        </Space>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
