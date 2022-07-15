import { SateliteMessage } from "@mars/components/MarsSample/SateliteMessage/index"
import { MarsPannel, MarsButton, MarsGui, MarsCheckbox } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { Space } from "antd"
import type { GuiItem } from "@mars/components/MarsUI"
import { useState } from "react"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "radio",
      field: "type",
      label: "类型:",
      value: "2",
      options: [
        {
          label: "圆锥体",
          value: "1"
        },
        {
          label: "四棱锥体",
          value: "2"
        }
      ],
      change(sensorType) {
        mapWork.chkSensorType(sensorType)
      }
    },
    {
      type: "slider",
      field: "pitch",
      label: "前后侧摆:",
      step: 1,
      min: -180,
      max: 180,
      value: 0,
      extra: "值{pitch}",
      extraWidth: 60,
      change(pitch) {
        mapWork.pitchChange(pitch)
      }
    },
    {
      type: "slider",
      field: "roll",
      label: "左右侧摆:",
      step: 1,
      min: -180,
      max: 180,
      value: 0,
      extra: "值{roll}",
      extraWidth: 60,
      change(roll) {
        mapWork.rollChange(roll)
      }
    },
    {
      type: "slider",
      field: "angle1",
      label: "夹角1:",
      step: 0.001,
      min: 0,
      max: 89,
      value: 30,
      extra: "值{angle1}",
      extraWidth: 60,
      change(angle1) {
        mapWork.angle1(angle1)
      }
    },
    {
      type: "slider",
      field: "angle2",
      label: "夹角2:",
      step: 0.001,
      min: 0,
      max: 89,
      value: 20,
      extra: "值{angle2}",
      extraWidth: 60,
      show(data) {
        return data.type !== "1"
      },
      change(angle2) {
        mapWork.angle2(angle2)
      }
    }
  ]

  const [viewType, setViewType] = useState(false)

  const selPoint = (texShow: boolean) => {
    setViewType(!texShow)
    if (!texShow) {
      mapWork.selPoint()
    }
    mapWork.selPoint()
  }

  return (
    <>
      <MarsPannel visible={true} top={10} right={10} width={290}>
        <div className="f-mb">
          <Space>
            <span className="mars-pannel-item-label">视椎体状态:</span>
            <MarsButton onClick={() => mapWork.locate()}>定位至卫星</MarsButton>
            <MarsButton onClick={() => selPoint(viewType)}> {viewType ? "取消凝视" : "凝视"} </MarsButton>
          </Space>
        </div>
        <MarsGui options={options} formProps={{ labelCol: { span: 7 } }}></MarsGui>

        <div className="f-mb">
          <span className="mars-pannel-item-label">参考系轴:</span>
          <Space>
            <MarsCheckbox defaultChecked={false} onChange={(e) => mapWork.chkShowModelMatrix(e.target.checked)}>
              显示/隐藏
            </MarsCheckbox>
          </Space>
        </div>
      </MarsPannel>
      <SateliteMessage />
    </>
  )
}

export default UIComponent
