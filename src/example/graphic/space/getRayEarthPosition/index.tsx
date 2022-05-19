import { SateliteMessage } from "@mars/components/MarsSample/SateliteMessage/index"
import { MarsPannel, MarsButton, MarsGui, MarsCheckbox } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { Space } from "antd"
import type { GuiItem } from "@mars/components/MarsUI"
import { useEffect, useMemo } from "react"

function UIComponent() {
  // useMemo(() => {
  //     mapWork.eventTarget.on("satelliteChange", (event: any) => {
  //         mapWork.centerPoint(angleValue.value)
  //       })
  // },[])

  useEffect(() => {
    mapWork.centerPoint(10)
  })

  const options: GuiItem[] = [
    {
      type: "slider",
      field: "pitch",
      label: "前后侧摆:",
      step: 1,
      min: -180,
      max: 180,
      value: 0,
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
      change(roll) {
        mapWork.rollChange(roll)
      }
    },

    {
      type: "slider",
      field: "angle1",
      label: "夹角:",
      step: 0.001,
      min: 1,
      max: 59,
      value: 10,
      change(angle) {
        mapWork.angle(angle)
      }
    }
  ]

  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <div className="f-mb">
          <Space>
            <span>视椎体状态:</span>
            <MarsButton onClick={() => mapWork.locate()}>定位至卫星</MarsButton>
            <MarsCheckbox defaultChecked={false} onChange={(e) => mapWork.chkShowModelMatrix(e.target.checked)}>
              显示/隐藏
            </MarsCheckbox>
          </Space>
        </div>

        <MarsGui options={options} formProps={{ labelCol: { span: 7 } }}></MarsGui>
      </MarsPannel>
      <SateliteMessage />
    </>
  )
}

export default UIComponent
