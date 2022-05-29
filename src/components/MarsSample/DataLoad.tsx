import { MarsButton, MarsInputNumber } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useState } from "react"

const mapWork = window.mapWork

export const DataLoad = (props) => {
  const [num, setNum] = useState(props.num || 1)
  return (
    <Space>
      <span className="mars-pannel-item-label">数据加载:</span>
      <MarsInputNumber
        {...{
          min: props.min || 0,
          max: props.max || 100,
          step: props.step || 0.1,
          defaultValue: props.num || 1,
          title: "请输入不大于" + (props.max || 100) + "的值"
        }}
        onChange={(data: number) => setNum(data)}
      ></MarsInputNumber>
      {props.unit || "条"}
      <MarsButton onClick={() => mapWork.addDemoGraphic(num)}>生成</MarsButton>
      <MarsButton onClick={() => mapWork.graphicLayer.clear()}>清除</MarsButton>
    </Space>
  )
}
