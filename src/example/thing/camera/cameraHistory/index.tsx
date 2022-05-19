import { useState, useMemo } from "react"
import * as mapWork from "./map.js"
import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent(props) {
  const [allLength, setAllLength] = useState(0)
  const [nowView, setNowView] = useState(0)

  useMemo(() => {
    mapWork.eventTarget.on("changeCameraHistory", (event: any) => {
      const item = event.data

      setAllLength(item.count)
      setNowView(item.index + 1)
    })
  }, [])

  return (
    <MarsPannel visible={true} right="10" top="10">
      <div className="f-mb">
        当前共有{allLength}条视角记录，当前正在{nowView}条视角
      </div>
      <div className="f-mb">
        <MarsButton
          onClick={() => {
            mapWork.lastOneView()
          }}
        >
          回到当前（最后一条）
        </MarsButton>
      </div>

      <Space>
        <MarsButton
          onClick={() => {
            mapWork.lastView()
          }}
        >
          上一个视图
        </MarsButton>
        <MarsButton
          onClick={() => {
            mapWork.nextView()
          }}
        >
          下一个视图
        </MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
