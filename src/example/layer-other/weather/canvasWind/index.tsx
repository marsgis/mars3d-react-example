import * as mapWork from "./map.js"
import { MarsForm, MarsGui, MarsPannel, MarsFormItem, MarsButton } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "slider",
      field: "count",
      label: "粒子个数:",
      value: 4096,
      min: 1000,
      max: 90000,
      step: 1,
      change(value) {
        mapWork.changeCount(value)
      }
    },
    {
      type: "slider",
      field: "age",
      label: "存活时间:",
      value: 60,
      min: 10,
      max: 500,
      step: 1,
      change(value) {
        mapWork.changeAge(value)
      }
    },
    {
      type: "slider",
      field: "speed",
      label: "移动速率:",
      value: 10,
      min: 1,
      max: 100,
      step: 1,
      change(value) {
        mapWork.changeSpeed(value)
      }
    },
    {
      type: "slider",
      field: "linewidth",
      label: "线宽度:",
      value: 1,
      min: 1,
      max: 10,
      step: 0.1,
      change(value) {
        mapWork.changeLinewidth(value)
      }
    }
    // {
    //   type: "color",
    //   field: "color",
    //   label: "线颜色:",
    //   value: "#4696db",
    //   change(value) {
    //     mapWork.changeColor(value)
    //   }
    // }
  ]
  return (
    <MarsPannel visible={true} right="10" top="10">
      <MarsForm>
        <MarsFormItem label="演示数据:">
          <Space>
            <MarsButton onClick={mapWork.loadHongkongData}>香港</MarsButton>
            <MarsButton onClick={mapWork.loadDongnanData1}>新加坡</MarsButton>
            <MarsButton onClick={mapWork.loadDongnanData2}>洋流</MarsButton>
            <MarsButton onClick={mapWork.loadEarthData}>全球区域</MarsButton>
          </Space>
        </MarsFormItem>
      </MarsForm>
      <MarsGui options={options} formProps={{ labelCol: { span: 7 } }}></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
