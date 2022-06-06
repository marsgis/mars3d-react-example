import * as mapWork from "./map.js"
import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"

const list = [
  { name: "5F", callback: () => mapWork.show(5) },
  { name: "4F", callback: () => mapWork.show(4) },
  { name: "3F", callback: () => mapWork.show(3) },
  { name: "2F", callback: () => mapWork.show(2) },
  { name: "1F", callback: () => mapWork.show(1) },
  { name: "-1F", callback: () => mapWork.minusOne() },
  { name: "整体", callback: () => mapWork.showAll() }
]

function UIComponent(props) {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <Space>
        {list.map((item) => {
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
