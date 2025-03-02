import { MarsPannel, MarsButton, MarsGui } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useState, useMemo, useEffect } from "react"
import * as mapWork from "./map.js"

function UIComponent() {
  const [floorModel, setFloorModel] = useState([])

  useEffect(() => {
    mapWork.createControl("centerDiv3D")
  }, [])
  useMemo(() => {
    mapWork.eventTarget.on("dataLoaded", (event: any) => {
      const arr = []
      for (let index = event.zValues.length - 1; index >= 0; index--) {
        const element = event.zValues[index]
        arr.push({ label: element, idx: index })
      }
      setFloorModel([...arr])
    })
  }, [])

  return (
    <MarsPannel visible={true} right="10" bottom="10">
      <Space direction="vertical">
        <div>高度：米</div>
        {floorModel.map((item, index) => (
          <MarsButton key={index} onClick={() => mapWork.setActiveHighIdx(item.idx)}>
            {item.label}
          </MarsButton>
        ))}
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
