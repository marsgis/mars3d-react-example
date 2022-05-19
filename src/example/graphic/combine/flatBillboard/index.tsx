import { MarsButton, MarsCheckbox, MarsForm, MarsFormItem, MarsInputNumber, MarsPannel } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { Space } from "antd"
import { useState } from "react"
import { LayerState } from "@mars/components/MarsSample/LayerState"

function UIComponent() {
  const [num, setNum] = useState(20)

  return (
    <MarsPannel visible={true} right={10} top={10}>
      <MarsForm>
        <MarsFormItem>
          <LayerState />
        </MarsFormItem>
        <MarsFormItem label="间隔:">
          <Space>
            <MarsInputNumber value={num} onChange={(data: number) => setNum(data)}></MarsInputNumber>
            米插值
            <MarsButton onClick={() => mapWork.showDataPoint(num)}>生成图标</MarsButton>
            <MarsButton onClick={() => mapWork.clearData()}>清除</MarsButton>
            <MarsButton onClick={() => mapWork.loadDemo()}>加载演示数据</MarsButton>
          </Space>
        </MarsFormItem>
      </MarsForm>
    </MarsPannel>
  )
}

export default UIComponent
