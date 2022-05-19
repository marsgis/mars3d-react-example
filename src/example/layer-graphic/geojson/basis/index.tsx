import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { LayerState } from "@mars/components/MarsSample/LayerState.jsx"
import { Space } from "antd"
import * as mapWork from "./map.js"

function changeGraphicData() {
  setTimeout(() => {
    // updateWidget("manage-layers")
  }, 500)
}

const list = [
  {
    name: "省界线",
    callback: () => {
      mapWork.setDefuatData()
      mapWork.showChinaLine()

      changeGraphicData()
    }
  },
  {
    name: "规划面",
    callback: () => {
      mapWork.setDefuatData()
      mapWork.showPlanningSurface()

      changeGraphicData()
    }
  },
  {
    name: "标绘数据",
    callback: () => {
      mapWork.setDefuatData()
      mapWork.showDraw(true)

      changeGraphicData()
    }
  },
  {
    name: "单体化面",
    callback: () => {
      mapWork.setDefuatData()
      mapWork.showMonomer()

      changeGraphicData()
    }
  },
  {
    name: "世界各国",
    callback: () => {
      mapWork.setDefuatData()
      mapWork.showWorld()

      changeGraphicData()
    }
  },
  {
    name: "体育设施点",
    callback: () => {
      mapWork.setDefuatData()
      mapWork.showPoint()

      changeGraphicData()
    }
  },
  {
    name: "合肥边界墙",
    callback: () => {
      mapWork.setDefuatData()
      mapWork.showBoundaryWall()

      changeGraphicData()
    }
  },
  {
    name: "合肥区域面",
    callback: () => {
      mapWork.setDefuatData()
      mapWork.showRegion()

      changeGraphicData()
    }
  },
  {
    name: "分层分户楼栋",
    callback: () => {
      mapWork.setDefuatData()
      mapWork.showFloor()

      changeGraphicData()
    }
  }
]

function UIComponent() {
  return (
    <MarsPannel visible={true} right="10" top="10" width={130} height={465}>
      <Space {...{ direction: "horizontal", wrap: true }}>
        {list.map((item) => {
          return (
            <MarsButton key={item.name} onClick={item.callback}>
              {item.name}
            </MarsButton>
          )
        })}
      </Space>
      <LayerState label=" "></LayerState>
    </MarsPannel>
  )
}

export default UIComponent
