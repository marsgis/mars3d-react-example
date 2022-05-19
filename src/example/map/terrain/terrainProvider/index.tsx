import { MarsPannel, MarsGui } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"

import * as mapWork from "./map.js"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "radio",
      field: "type",
      label: "单选",
      value: "xyz",
      options: [
        {
          label: "无地形",
          value: "none"
        },
        {
          label: "标准服务",
          value: "xyz"
        },
        {
          label: "lon在线服务",
          value: "ion"
        },
        {
          label: "ArcGIS服务",
          value: "arcgis"
        }
      ],
      change(value) {
        mapWork.radioTerrain(value)
      }
    },

    {
      type: "checkbox",
      field: "type2",
      label: "调试",
      value: ["1"],
      options: [
        {
          label: "开启地形",
          value: "1"
        },
        {
          label: "地形三角网",
          value: "2"
        }
      ],
      change(value) {
        mapWork.enabledTerrain(
          value.find((item) => {
            return item === "1"
          })
        )
        mapWork.enabledTerrainSJW(
          value.find((item) => {
            return item === "2"
          })
        )
      }
    }
  ]

  return (
    <MarsPannel visible={true} top={10} right={10}>
      <MarsGui
        options={options}
        formProps={{
          labelCol: { span: 2 },
          wrapperCol: { span: 22 }
        }}
      ></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
