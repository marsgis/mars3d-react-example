import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

const list = [
  { name: "人工建模(鸟巢)", callback: () => mapWork.showMaxNiaochaoDemo() },
  { name: "人工建模(CBD)", callback: () => mapWork.showMaxCBDDemo() },
  { name: "人工建模(地下管网)", callback: () => mapWork.showMaxPipeDemo() },
  { name: "BIM(桥梁)", callback: () => mapWork.showBIMQiaoDemo() },
  { name: "倾斜摄影(哈尔滨索菲亚)", callback: () => mapWork.showQxSuofeiyaDemo() },
  { name: "倾斜摄影(萨尔茨堡)", callback: () => mapWork.showQxSrsbDemo() }
]

function UIComponent() {
  return (
    <MarsPannel visible={true} right="10" top="10" width={202}>
      <p className="mars-pannel-item">超图S3M图层：</p>
      <Space {...{ direction: "horizontal", wrap: true }}>
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
