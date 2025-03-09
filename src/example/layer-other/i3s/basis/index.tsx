import { MarsButton, MarsPannel, MarsCollapse, MarsIcon } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useCallback } from "react"
import * as mapWork from "./map.js"

const list = [
  { name: "城市白膜(纽约)", callback: () => mapWork.showNewYorkDemo() },
  { name: "倾斜摄影(旧金山)", callback: () => mapWork.showSanFranciscoDemo() },
  { name: "倾斜摄影(法兰克福)", callback: () => mapWork.showFrankfurtDemo() }
]

function UIComponent() {
  const expandIcon = useCallback(() => {
    return <MarsIcon icon="down-c"></MarsIcon>
  }, [])

  return (
    <MarsPannel visible={true} right="10" top="10" width={202}>
      <MarsCollapse
        defaultActiveKey={["1"]}
        expandIcon={expandIcon}
        items={[
          {
            key: "1",
            label: "I3S图层",
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
          }
        ]}
      ></MarsCollapse>
    </MarsPannel>
  )
}

export default UIComponent
