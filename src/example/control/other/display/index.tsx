import { MarsPannel, MarsGui } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"

import * as mapWork from "./map.js"
import { activate, disable } from "@mars/widgets/common/store/widget"

// 按钮
const chooseButton = (data) => {
  mapWork.bindPOI(findValue(data, "1"))
  mapWork.bindView(findValue(data, "2"))
  mapWork.bindSceneModePicker(findValue(data, "3"))
  mapWork.bindBaseLayerPicker(findValue(data, "4"))
  mapWork.bindFullScreen(findValue(data, "5"))
  mapWork.bindVR(findValue(data, "6"))
  mapWork.bindHelpButton(findValue(data, "7"))
  mapWork.bindZoom(findValue(data, "8"))
  mapWork.bindLayer(findValue(data, "9"))
}

// 面板
const choosePannel = (data) => {
  mapWork.bindLocation(findValue(data, "1"))
  mapWork.bindClock(findValue(data, "2"))
  mapWork.bindNav(findValue(data, "3"))
  mapWork.bindTimeLine(findValue(data, "4"))
  mapWork.bindLegend(findValue(data, "5"))
}

const findValue = (data, index) => {
  return data.find((item) => {
    return item === index
  })
}

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "checkbox",
      field: "button",
      label: "按钮",
      value: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      change(data) {
        chooseButton(data)
      },
      options: [
        {
          label: "POI搜索",
          value: "1"
        },
        {
          label: "视角复位",
          value: "2"
        },
        {
          label: "二三维切换",
          value: "3"
        },
        {
          label: "地图切换",
          value: "4"
        },
        {
          label: "全屏切换",
          value: "5"
        },
        {
          label: "VR模式",
          value: "6"
        },
        {
          label: "帮助",
          value: "7"
        },
        {
          label: "地图缩放",
          value: "8"
        },
        {
          label: "图层控制",
          value: "9"
        }
      ]
    },
    {
      type: "checkbox",
      field: "pannel",
      label: "面板",
      value: ["1", "2", "3", "4", "5"],
      change(data) {
        choosePannel(data)
      },
      options: [
        {
          label: "位置信息状态栏",
          value: "1"
        },
        {
          label: "时钟面板（左下角）",
          value: "2"
        },
        {
          label: "导航球",
          value: "3"
        },
        {
          label: "时间刻度线",
          value: "4"
        },
        {
          label: "比例尺",
          value: "5"
        }
      ]
    }
  ]

  return (
    <MarsPannel visible={true} top={10} right={10}>
      <MarsGui
        options={options}
        formProps={{
          labelCol: { span: 1 },
          wrapperCol: { span: 23 }
        }}
      ></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
