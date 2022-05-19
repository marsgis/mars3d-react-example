import { MarsDatePicker, MarsForm, MarsFormItem, MarsIcon, MarsPannel } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { DatePicker } from "antd"
import dayjs, { Dayjs } from "dayjs"
import { useCallback, useMemo, useState } from "react"
import moment from "moment"

const { RangePicker } = DatePicker
const nowDate = dayjs().format("YYYY-MM-DD HH:mm:ss")

function UIComponent() {
  const [currrentTime, setCurrrentTime] = useState(nowDate)
  const [showPannel, setShowPannel] = useState(false)
  const [nowTimeScope, setNowTimeScope] = useState([nowDate, nowDate])

  useMemo(() => {
    mapWork.eventTarget.on("clickShowClockAnimate", (e: any) => {
      setShowPannel(true)
      setCurrrentTime(nowDate)
      setNowTimeScope([nowDate, nowDate])
    })
  }, [])

  const updateTime = useCallback((dateString) => {
    setNowTimeScope(dateString)
    mapWork.setClockAnimateTime(dateString[0], dateString[1])
  }, [])

  const updateCurrrentTime = useCallback((dateString) => {
    mapWork.setCurrentTime(dateString)
    setCurrrentTime(dateString)
  }, [])

  return (
    <MarsPannel visible={showPannel} left={60} bottom={50}>
      <MarsForm>
        <MarsFormItem>
          <MarsIcon
            icon="close"
            width="24"
            style={{
              position: "absolute",
              right: "0",
              top: "0",
              cursor: "pointer"
            }}
            onClick={() => {
              setShowPannel(false)
            }}
          ></MarsIcon>
        </MarsFormItem>
        <MarsFormItem label="当前时间：">
          <MarsDatePicker
            defaultValue={moment(currrentTime, "YYYY-MM-DD HH:mm:ss")}
            onChange={(value, dateString) => {
              updateCurrrentTime(dateString)
            }}
            format="YYYY-MM-DD HH:mm:ss"
            show-time={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
          ></MarsDatePicker>
        </MarsFormItem>
        <MarsFormItem label="时间范围：">
          <RangePicker
            defaultValue={[moment(nowTimeScope[0], "YYYY-MM-DD HH:mm:ss"), moment(nowTimeScope[1], "YYYY-MM-DD HH:mm:ss")]}
            onChange={(value, dateString) => {
              updateTime(dateString)
            }}
            format="YYYY-MM-DD HH:mm:ss"
          ></RangePicker>
        </MarsFormItem>
      </MarsForm>
    </MarsPannel>
  )
}

export default UIComponent
