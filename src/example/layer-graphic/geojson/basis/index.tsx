import { MarsButton, MarsPannel, MarsSlider } from "@mars/components/MarsUI"
import { LayerState } from "@mars/components/MarsSample/LayerState.jsx"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { updateWidget } from "@mars/widgets/common/store/widget"

function changeGraphicData() {
  setTimeout(() => {
    updateWidget("layers", [])
  }, 500)
}

function setDefuatData() {
  mapWork.eventTarget.fire("defuatData", {
    enabledShowHide: true,
    enabledPopup: true,
    enabledTooltip: false,
    enabledRightMenu: false
  })
}

const list = [
  {
    name: "省界线",
    callback: () => {
      setDefuatData()
      mapWork.showChinaLine()

      changeGraphicData()
    }
  },
  {
    name: "规划面",
    callback: () => {
      setDefuatData()
      mapWork.showPlanningSurface()

      changeGraphicData()
    }
  },
  {
    name: "标绘数据",
    callback: () => {
      setDefuatData()
      mapWork.showDraw(true)

      changeGraphicData()
    }
  },
  {
    name: "单体化面",
    callback: () => {
      setDefuatData()
      mapWork.showMonomer()

      changeGraphicData()
    }
  },
  {
    name: "世界各国",
    callback: () => {
      setDefuatData()
      mapWork.showWorld()

      changeGraphicData()
    }
  },
  {
    name: "体育设施点",
    callback: () => {
      setDefuatData()
      mapWork.showPoint()

      changeGraphicData()
    }
  },
  {
    name: "合肥边界墙",
    callback: () => {
      setDefuatData()
      mapWork.showBoundaryWall()

      changeGraphicData()
    }
  },
  {
    name: "合肥区域面",
    callback: () => {
      setDefuatData()
      mapWork.showRegion()

      changeGraphicData()
    }
  },
  {
    name: "分层分户楼栋",
    callback: () => {
      setDefuatData()
      mapWork.showFloor()

      changeGraphicData()
    }
  }
]

function UIComponent() {
  const onOpacityChange = (val) => {
    mapWork.graphicLayer.opacity = val
  }

  return (
    <MarsPannel visible={true} right="10" top="10" width={130} height={538}>
      <Space {...{ direction: "horizontal", wrap: true }}>
        {list.map((item) => {
          return (
            <MarsButton key={item.name} onClick={item.callback}>
              {item.name}
            </MarsButton>
          )
        })}
      </Space>

      <div className="f-pt">
        <span>透明度</span>
        <MarsSlider defaultValue={1.0} min={0.0} max={1.0} step={0.1} onChange={onOpacityChange}></MarsSlider>
      </div>

      <LayerState label=" " direction="horizontal" wrap={true}></LayerState>
    </MarsPannel>
  )
}

export default UIComponent
