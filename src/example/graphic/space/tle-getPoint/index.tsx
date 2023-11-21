import { MarsButton, MarsCheckbox, MarsColor, MarsDatePicker, MarsPannel, MarsSlider, MarsTable } from "@mars/components/MarsUI"
import { Space } from "antd"
import moment from "moment"
import { useMemo, useState } from "react"
import * as mapWork from "./map.js"
import "./index.less"

let slideOpacity = 0.4
let slideAngle = 10
function UIComponent() {
  const [startTime, setStartTime] = useState(null) // 开始时间
  const [endTime, setEndTime] = useState(null) // 结束时间

  const [areaColor, setAreaColor] = useState("red") // 颜色

  useMemo(() => {
    mapWork.eventTarget.on("loadStatellite", (event: any) => {
      setStartTime(event.startTime)
      setEndTime(event.endTime)
    })
  }, [])

  // 计算成像区域
  const computerRegion = () => {
    mapWork.btnAdd({
      startTime,
      endTime,
      areaColor,
      slideOpacity,
      slideAngle
    })
  }

  const onChangeStartTime = (time: any) => {
    setStartTime(time)
  }

  const onChangeEndTime = (time: any) => {
    setEndTime(time)
  }

  // 颜色改变
  const onChangeColor = (areaColor) => {
    setAreaColor(areaColor)
    mapWork.changeColorOpacity({
      areaColor,
      slideOpacity
    })
  }

  // 透明度改变
  const onChangeOpacity = (opacity: number) => {
    slideOpacity = opacity
    mapWork.changeColorOpacity({
      areaColor,
      slideOpacity
    })
  }

  // 张角改变
  const onChangeAngle = (angle: number) => {
    slideAngle = angle
    mapWork.changeAngle(angle)
  }

  return (
    <MarsPannel visible={true} top={10} right={10} height={300}>
      <div className="f-mb">
        <Space>
          <span>卫星张角:</span>
          <MarsSlider min={1} max={70} defaultValue={10} onChange={onChangeAngle}></MarsSlider>
        </Space>
      </div>

      <div className="f-mb">
        <Space>
          <span>开始时间:</span>
          <MarsDatePicker
            value={startTime ? moment(startTime, "YYYY-MM-DD HH:mm:ss") : null}
            format="YYYY-MM-DD HH:mm:ss"
            onChange={onChangeStartTime}
          ></MarsDatePicker>
        </Space>
      </div>

      <div className="f-mb">
        <Space>
          <span>结束时间:</span>
          <MarsDatePicker
            value={endTime ? moment(endTime, "YYYY-MM-DD HH:mm:ss") : null}
            format="YYYY-MM-DD HH:mm:ss"
            onChange={onChangeEndTime}
          ></MarsDatePicker>
        </Space>
      </div>

      <div className="f-mb">
        <Space>
          <span>区域颜色:</span>
          <MarsColor value={"#FF1900"} onChange={onChangeColor}></MarsColor>
        </Space>
      </div>

      <div className="f-mb">
        <Space>
          <span>区域透明度:</span>
          <MarsSlider min={0.01} max={1.0} step={0.01} defaultValue={0.4} onChange={onChangeOpacity}></MarsSlider>
        </Space>
      </div>

      <div className="f-tac f-mb">
        <Space>
          <MarsButton onClick={computerRegion}>计算成像区域</MarsButton>
          <MarsButton onClick={() => mapWork.btnRemoveAll()}>清除所有</MarsButton>
        </Space>
      </div>

      <div className="f-tac">
        <Space>
          <MarsCheckbox defaultChecked={true} onChange={(e) => mapWork.changeGuidaoS(e.target.checked)}>
            升轨
          </MarsCheckbox>
          <MarsCheckbox defaultChecked={true} onChange={(e) => mapWork.changeGuidaoJ(e.target.checked)}>
            降轨
          </MarsCheckbox>
        </Space>
      </div>
    </MarsPannel>
  )
}
export default UIComponent
