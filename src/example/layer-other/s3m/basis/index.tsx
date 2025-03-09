import { MarsButton, MarsPannel, MarsCollapse, MarsIcon } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useCallback } from "react"
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
  const expandIcon = useCallback(() => {
    return <MarsIcon icon="down-c"></MarsIcon>
  }, [])

  return (
    <MarsPannel visible={true} right="10" top="10" width={202}>
      <MarsCollapse
        defaultActiveKey={["1", "2"]}
        expandIcon={expandIcon}
        items={[
          {
            key: "1",
            label: "超图S3M图层",
            children: (
              <Space {...{ direction: "horizontal", wrap: true }}>
                {list.map((item) => {
                  return (
                    <MarsButton key={item.name} onClick={item.callback}>
                      {item.name}
                    </MarsButton>
                  )
                })}
              </Space>
            )
          },
          {
            key: "2",
            label: "开源仓库",
            children: (
              <MarsButton href="https://gitee.com/marsgis/mars3d-link-supermap" target="_blank">
                与超图结合开源仓库
              </MarsButton>
            )
          }
        ]}
      ></MarsCollapse>
    </MarsPannel>
  )
}

export default UIComponent
