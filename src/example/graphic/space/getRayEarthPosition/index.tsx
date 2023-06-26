import { MarsPannel, MarsButton, MarsGui, MarsCheckbox, $message } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { Space } from "antd"
import type { GuiItem } from "@mars/components/MarsUI"
import { useEffect, useMemo, useState } from "react"
import "./index.less"

let showHideCone = false
function UIComponent() {
  useEffect(() => {
    mapWork.centerPoint(10)
  }, [])

  const options: GuiItem[] = [
    {
      type: "slider",
      field: "pitch",
      label: "前后侧摆:",
      step: 1,
      min: -180,
      max: 180,
      value: 0,
      extra: "当前值{pitch}",
      extraWidth: 90,
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
      extra: "当前值{roll}",
      extraWidth: 90,
      change(roll) {
        mapWork.rollChange(roll)
      }
    },

    {
      type: "slider",
      field: "angle1",
      label: "夹角:",
      step: 0.01,
      min: 1,
      max: 59,
      value: 10,
      extra: "当前值{angle1}",
      extraWidth: 90,
      change(angle) {
        if (!showHideCone) {
          $message("已自动打开视椎体")
          showHideCone = true
          mapWork.chkShowModelMatrix(true)
        }
        mapWork.angle(angle)
      }
    }
  ]

  const [satelliteParams, setSatelliteParams] = useState({
    name: "",
    tle1: "",
    tle2: "",
    time: "",
    td_jd: 0,
    td_wd: 0,
    td_gd: "0公里"
  })

  useMemo(() => {
    mapWork.eventTarget.on("satelliteChange", function (event: any) {
      const nowData = event.weixinData
      setSatelliteParams({ ...nowData, td_gd: nowData.td_gd })
    })
  }, [])

  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <div className="f-mb">
          <Space>
            <span>视椎体状态:</span>
            <MarsCheckbox
              checked={showHideCone}
              onChange={(e) => {
                showHideCone = e.target.checked
                mapWork.chkShowModelMatrix(e.target.checked)
              }}
            >
              显示/隐藏
            </MarsCheckbox>
            <MarsButton onClick={() => mapWork.locate()}>定位至卫星</MarsButton>
          </Space>
        </div>

        <MarsGui options={options} formProps={{ labelCol: { span: 7 } }}></MarsGui>

        <table className="mars-table tb-border">
          <tbody>
            <tr>
              <td className="nametd">名称</td>
              <td id="td_name">{satelliteParams.name}</td>
            </tr>
            <tr>
              <td className="nametd">TLE1</td>
              <td id="td_tle1">{satelliteParams.tle1}</td>
            </tr>
            <tr>
              <td className="nametd">TLE2</td>
              <td id="td_tle2">{satelliteParams.tle2}</td>
            </tr>
            <tr>
              <td className="nametd">时间</td>
              <td id="td_time">{satelliteParams.time}</td>
            </tr>

            <tr>
              <td className="nametd">经度</td>
              <td id="td_jd">{satelliteParams.td_jd}</td>
            </tr>
            <tr>
              <td className="nametd">经度</td>
              <td id="td_wd">{satelliteParams.td_wd}</td>
            </tr>
            <tr>
              <td className="nametd">高程</td>
              <td id="td_gd">{satelliteParams.td_gd}</td>
            </tr>
          </tbody>
        </table>
      </MarsPannel>
    </>
  )
}

export default UIComponent
