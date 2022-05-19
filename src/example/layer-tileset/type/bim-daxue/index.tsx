import * as mapWork from "./map.js"
import { MarsButton, MarsFormItem, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"

const list = {
  center: [
    { name: "教室", callback: () => mapWork.centerAtDX1() },
    { name: "走廊", callback: () => mapWork.centerAtDX2() },
    { name: "楼梯间", callback: () => mapWork.centerAtDX3() }
  ],
  floor: [
    { name: "-1F", callback: () => mapWork.showD1() },
    { name: "1F", callback: () => mapWork.showModel(0.4) },
    { name: "2F", callback: () => mapWork.showModel(3.5) },
    { name: "3F", callback: () => mapWork.showModel(8.4) },
    { name: "4F", callback: () => mapWork.showModel(12.4) },
    { name: "5F", callback: () => mapWork.showModel(16.4) },
    { name: "整体", callback: () => mapWork.showModel(100) }
  ]
}

function UIComponent(props) {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <MarsFormItem label="室内演示视角">
        <Space>
          {list.center.map((item) => {
            return (
              <MarsButton key={item.name} onClick={item.callback}>
                {item.name}
              </MarsButton>
            )
          })}
        </Space>
      </MarsFormItem>

      <Space>
        {list.floor.map((item) => {
          return (
            <MarsButton key={item.name} onClick={item.callback}>
              {item.name}
            </MarsButton>
          )
        })}
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
