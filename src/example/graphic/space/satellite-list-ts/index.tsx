import { MarsCheckbox, MarsPannel } from "@mars/components/MarsUI"
import { useMemo, useState, useRef } from "react"
import "./index.less"
import * as mapWork from "./map.js"
function UIComponent() {
  const [data, setData] = useState<any[]>([])
  useMemo(() => {
    mapWork.eventTarget.on("loadGraphicLayer", function (event: any) {
      const newData = [
        {
          label: "在线终端",
          checkFlag: true,
          click: (checked) => {
            mapWork.onlineEndLayer.show = checked
          },
          show: () => {
            return mapWork.onlineEndLayer.getGraphics().length > 0
          }
        },
        {
          label: "离线终端",
          checkFlag: true,
          click: (checked) => {
            mapWork.offlineEndLayer.show = checked
          },
          show: () => {
            return mapWork.offlineEndLayer.getGraphics().length > 0
          }
        },
        {
          label: "信关",
          checkFlag: true,
          click: (checked) => {
            mapWork.signalStationLayer.show = checked
          }
        },
        {
          label: "运控中心",
          checkFlag: true,
          click: (checked) => {
            mapWork.controlCenterLayer.show = checked
          }
        },
        {
          label: "近极轨",
          checkFlag: true,
          click: (checked) => {
            mapWork.switchSatellites(checked, "近极轨")
          }
        },
        {
          label: "倾斜轨",
          checkFlag: true,
          click: (checked) => {
            mapWork.switchSatellites(checked, "倾斜轨")
          }
        },
        {
          label: "卫星",
          checkFlag: true,
          click: (checked) => {
            mapWork.satelliteGraphicLayer.show = checked
          }
        }
      ].filter(item => {
        if (item.show) {
          return item.show()
        } else {
          return true
        }
      })
      setData(newData)
    })
  }, [])

  const handleChange = (index: number, checked: boolean) => {
    const newData = [...data]
    newData[index] = { ...newData[index], checkFlag: checked }
    setData(newData)
    newData[index].click(checked)
  }

  const colorArr = [
    { color: "#15c8dd", text: "在线终端", active: true },
    { color: "#ea948d", text: "离线终端", active: true },
    { color: "#ffde25", text: "信关站", active: true },
    { color: "#4c66d7", text: "运控中心", active: true },
    { color: "#FFFFFF", text: "近极轨", active: true },
    { color: "#80B0FE", text: "倾斜轨", active: true },
    { color: "#FFBB70", text: "高轨", active: true }
  ]


  function handleLegendClick(item) {
    // if (item.text === "高轨") {
    //   switchHighSatellites(item.active, "高轨")
    // }
    // if (item.text === "近极轨") {
    //   mapWork.switchSatellites(item.active, "近极轨")
    // } else if (item.text === "倾斜轨") {
    //   mapWork.switchSatellites(item.active, "倾斜轨")
    // } else if (item.text === "先导星") {
    //   mapWork.switchSatellites(item.active, "先导")
    // } else if (item.text === "高轨") {
    //   mapWork.switchHeightSatellite(item.active)
    // } else if (item.text === "在线终端") {
    //   mapWork.switchOnlineLocationPoints(item.active)
    // } else if (item.text === "离线终端") {
    //   mapWork.switchOutlineLocationPoints(item.active)
    // } else if (item.text === "信关站") {
    //   mapWork.switchReceivers(item.active)
    // } else if (item.text === "运控中心") {
    //   mapWork.switchOcCenters(item.active)
    // }
    // items.value = items.value.map((i) => {
    //   if (i.text === item.text) {
    //     return { ...item, ...{ active: !item.active } }
    //   }
    //   return i
    // })
  }
  return (
    <>

      <MarsPannel visible={true} right={10} top={10} height={44}>
        {
          data && data.map((item, index) => (
            <MarsCheckbox
              key={index}
              checked={item.checkFlag}
              onChange={(e) => handleChange(index, e.target.checked)}>
              {item.label}
            </MarsCheckbox>
          ))
        }
      </MarsPannel>

      <div className="legend-container">
          {
            colorArr.map((item, index) => (
              <div className="legend-item cursor-pointer" key={index} onClick={ () => handleLegendClick(item) }>
                <div
                  className="legend-item-color"
                  style={{ backgroundColor: item.active ? item.color : "gray" }}
                ></div>
                <div className="legend-item-text">{item.text}</div>
              </div>

            ))
          }
      </div>
    </>
  )
}

export default UIComponent
