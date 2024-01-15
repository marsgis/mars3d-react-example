import { MarsCollapse, MarsCollapsePanel, MarsButton, MarsIcon, MarsDatePicker } from "@mars/components/MarsUI"
import { Space } from "antd"
import { Fragment, useCallback, useState, useEffect, useRef } from "react"
import moment from "moment"
import type { Moment } from "moment"
import * as mapWork from "./map"

interface MarsAttrProps {
  availability: any
  showMarsStyle: boolean
  onChange?: (value?: any) => void
}

function PointPosition({ julianObj = { start: null, stop: null }, reqRange, onChange }) {
  const values = useRef(julianObj)

  useEffect(() => {
    values.current = julianObj 
  }, [julianObj])

  const disabledDate = (current: Moment, avaList: any, index: number, key: string) => {
    let startTime: any = null
    let endTime: any = null

    const lastTimeSlot = avaList[index - 1]
    const currentTimeSlot = avaList[index]
    const nextTimeSlot = avaList[index + 1]

    switch (key) {
      case "start":
        if (lastTimeSlot) {
          startTime = moment(lastTimeSlot.stop, "YYYY-MM-DD HH:mm:ss")?.add(1, "second")
        }
        endTime = moment(currentTimeSlot.stop, "YYYY-MM-DD HH:mm:ss")?.subtract(1, "second")
        break
      case "stop":
        startTime = moment(currentTimeSlot.start, "YYYY-MM-DD HH:mm:ss")?.add(1, "second")
        if (nextTimeSlot) {
          endTime = moment(nextTimeSlot.start, "YYYY-MM-DD HH:mm:ss")?.subtract(1, "second")
        }

        break

      default:
        break
    }

    if (endTime && startTime) {
      return current && (current < startTime || current > endTime)
    } else if (startTime) {
      return current && current < startTime
    } else if (endTime) {
      return current && current > endTime
    } else {
      return null
    }
  }

  const itemChange = useCallback(
    (v, i) => {
      values.current[i] = v
      onChange && onChange(values.current)
    },
    [values, onChange]
  )

  return (
    <table className="mars-primary-table">
      <tbody>
        <tr>
          <td width="80">开始时间</td>
          <td>
            <MarsDatePicker
              defaultValue={julianObj.start ? moment(julianObj.start, "YYYY-MM-DD HH:mm:ss") : null}
              disabledDate={(current: Moment) => disabledDate(current, reqRange.list, reqRange.index, "start")}
              format="YYYY-MM-DD HH:mm:ss"
              allowClear={false}
              showNow={false}
              showTime={{ format: "YYYY-MM-DD HH:mm:ss", defaultValue: moment("00:00:00", "HH:mm:ss") }}
              onChange={(date: Moment, dateString: string) => {
                itemChange(date, "start")
              }}
            ></MarsDatePicker>
          </td>
        </tr>
        <tr>
          <td>结束时间</td>
          <td>
            <MarsDatePicker
              defaultValue={julianObj.stop ? moment(julianObj.stop, "YYYY-MM-DD HH:mm:ss") : null}
              disabledDate={(current: Moment) => disabledDate(current, reqRange.list, reqRange.index, "stop")}
              format="YYYY-MM-DD HH:mm:ss"
              allowClear={false}
              showNow={false}
              showTime={{ format: "YYYY-MM-DD HH:mm:ss" }}
              onChange={(date: Moment, dateString: string) => {
                itemChange(date, "stop")
              }}
            ></MarsDatePicker>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

let timeList = []

export default function MarsAvailability({ availability, onChange = () => {}, showMarsStyle }: MarsAttrProps) {
  const [avaiData, setAvaiData] = useState([])

  useEffect(() => {
    // if (!availability) {
    //   return
    // }

    if (availability && availability._intervals && !Array.isArray(availability)) {
      availability = availability._intervals

      const data = Array.isArray(availability)
      ? availability?.map((julianObj) => {
          const timeObj = { start: null, stop: null }

          for (const key in julianObj) {
            const isJulianDate = typeof julianObj[key] !== "string"

            let value = null
            if (Object.keys(timeObj).includes(key)) {
              if (julianObj[key]) {
                value = isJulianDate ? moment(mapWork.julianToDate(julianObj[key])) : moment(julianObj[key])
              }
              timeObj[key] = value
            }
          }

          return timeObj
        }) || []
      : []

      setAvaiData([...data])
      timeList = data
    }

    return () => {
      setAvaiData([])
      timeList = []
    }
  }, [availability])

  const availabilityChange = (noData: boolean = false) => {
    let time =
      timeList?.map((dayjsDate) => {
        const timeObj = {}
        for (const key in dayjsDate) {
          timeObj[key] = dayjsDate[key] ? moment(dayjsDate[key]).format("YYYY-MM-DD HH:mm:ss") : null
        }

        return timeObj
      }) || []

    if (noData) {
      timeList = []
      setAvaiData(timeList)
      time = []
    }

    onChange(time)
  }

  const addAvailability = () => {
    let newTimeSlot = { start: null, stop: null }
    const avaLength = timeList.length
    if (!avaLength) {
      newTimeSlot = mapWork.getMapCurrentTime()
    } else {
      const copiedTime = timeList[avaLength - 1]

      newTimeSlot.start = moment(copiedTime.stop, "YYYY-MM-DD HH:mm:ss").add(5, "second")
      newTimeSlot.stop = moment(newTimeSlot.start, "YYYY-MM-DD HH:mm:ss").add(5, "second")
    }

    timeList.push({ start: moment(newTimeSlot.start), stop: moment(newTimeSlot.stop) })

    setAvaiData([...timeList])
    availabilityChange()
  }
  // const addItem = (item: any, index: number) => {
  //   timeList.splice(index, 0, cloneDeep(item))

  //   setAvaiData([...timeList])
  //   availabilityChange()
  // }

  const removeAvailability = () => {
    availabilityChange(true)
  }
  const removeItem = (item: any, index: number) => {
    timeList.splice(index, 1)

    setAvaiData([...timeList])
    availabilityChange()
  }

  const items = [
    { 
      key: "1",
      label: "时序列表",
      showArrow: false,
      children: <>
        <Space className="f-mb">
          <MarsButton title="添加显示矢量对象的时间段" onClick={() => addAvailability()}>
            添加
          </MarsButton>
          <MarsButton title="矢量对象一直显示" onClick={() => removeAvailability()}>
            清除
          </MarsButton>
        </Space>
        {avaiData?.map((item, i) => (
          <Fragment key={i}>
            <div className="position-title">
              <span>第 {i + 1} 个时间段</span>
              <Space className="position-title__subfix">
                {/* <MarsIcon icon="add-one" width="16" onClick={() => addItem(item, i)}></MarsIcon> */}
                <MarsIcon icon="delete" width="16" onClick={() => removeItem(item, i)}></MarsIcon>
              </Space>
            </div>
            <PointPosition julianObj={item} reqRange={{ list: avaiData, index: i }} onChange={(value) => availabilityChange()}></PointPosition>
          </Fragment>
        ))}
      </>
    }
  ]


  return (
    <div style={{ display: showMarsStyle ? "block" : "none" }}>
      <MarsCollapse activeKey={["1"]} items = { items }>
      </MarsCollapse>
    </div>
  )
}
