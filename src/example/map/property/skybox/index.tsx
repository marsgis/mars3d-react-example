import * as mapWork from "./map.js"
import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"

const list = [
  { name: "背景1", callback: () => mapWork.show1() },
  { name: "背景2", callback: () => mapWork.show2() },
  { name: "背景3", callback: () => mapWork.show3() },
  { name: "背景4", callback: () => mapWork.show4() },
  { name: "背景5", callback: () => mapWork.show5() },
  { name: "背景6", callback: () => mapWork.show6() }
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
