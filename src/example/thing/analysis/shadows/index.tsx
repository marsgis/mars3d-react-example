import { MarsButton, MarsDatePicker, MarsFormItem, MarsPannel, MarsSlider } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useEffect, useMemo, useState } from "react"
import * as mapWork from "./map.js"
import type { Moment } from "moment"
import moment from "moment" // antd的时间格式
import dayjs from "dayjs" // 我们处理数据所用的时间格式

function UIComponent() {
  const [timeVal, stateTimeVal] = useState(420) // 时间
  const [currDate, stateCurrDate] = useState(dayjs().format("YYYY-MM-DD")) // 日期
  const [hours, stateHours] = useState(Math.floor(timeVal / 60)) // 小时
  const [minutes, stateMinutes] = useState(Math.floor(timeVal % 60)) // 分钟

  useEffect(() => {
    stateHours(Math.floor(timeVal / 60))
    stateMinutes(Math.floor(timeVal % 60))
  }, [timeVal])

  useEffect(() => {
    mapWork.setShadows(currDate, hours, minutes)
  }, [])

  useMemo(() => {
    mapWork.eventTarget.on("changeShadows", (event: any) => {
      const date = event.shadowTime
      stateTimeVal(date.getHours() * 60 + date.getMinutes())
    })
  }, [])

  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <MarsFormItem label="日期选择">
          <MarsDatePicker
            defaultValue={moment(new Date(), "YYYY-MM-DD")}
            onChange={(date: Moment, dateString: string) => {
              stateCurrDate(dayjs(dateString).format("YYYY-MM-DD")) // 修改所选日期
            }}
          ></MarsDatePicker>
        </MarsFormItem>

        <MarsFormItem label="时间选择">
          <MarsSlider
            {...{ min: 0, max: 1440, step: 1, value: timeVal }}
            onChange={(data) => {
              stateTimeVal(data)

              mapWork.setShadows(currDate, hours, minutes)
            }}
          ></MarsSlider>
        </MarsFormItem>

        <MarsFormItem label="当前时间">
          {currDate} {hours} 时 {minutes}分
        </MarsFormItem>

        <MarsFormItem label="当前时间">
          <Space>
            <MarsButton
              onClick={() => {
                mapWork.startPlay(currDate, hours, minutes)
              }}
            >
              播放
            </MarsButton>
            <MarsButton
              onClick={() => {
                mapWork.stopPlay()
              }}
            >
              暂停
            </MarsButton>
          </Space>
        </MarsFormItem>
      </MarsPannel>
    </>
  )
}

export default UIComponent
