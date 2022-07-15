import { MarsPannel, MarsButton, MarsCheckbox } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { useMemo, useState } from "react"
import { Space } from "antd"
import "./index.less"

function UIComponent() {
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
      <MarsPannel visible={true} top={10} right={10} width={290}>
        <Space>
          <MarsButton onClick={() => mapWork.locate()}>定位至卫星</MarsButton>

          <span>参考系:</span>
          <MarsCheckbox defaultChecked={false} onChange={(e) => mapWork.chkShowModelMatrix(e.target.checked)}>
            显示/隐藏
          </MarsCheckbox>
        </Space>

        <table className="mars-table tb-border" style={{ marginTop: "10px" }}>
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
