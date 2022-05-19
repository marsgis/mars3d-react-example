import { MarsPannel } from "@mars/components/MarsUI"
import { useMemo, useState } from "react"
import "./index.less"
const mapWork = window.mapWork

// 数据处理
function formatLength(val) {
  if (val == null) {
    return ""
  }
  val = Number(val)

  const valstr = (val * 0.001).toFixed(2) + "公里"

  return valstr
}

export const SateliteMessage = () => {
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
      const height = formatLength(nowData.td_gd)
      setSatelliteParams({ ...nowData, td_gd: height })
    })
  }, [])

  return (
    <MarsPannel visible={true} right={10} bottom={50} width={293}>
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
  )
}
