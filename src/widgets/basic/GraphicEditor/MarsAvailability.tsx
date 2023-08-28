import { MarsCollapse, MarsCollapsePanel, MarsButton, MarsIcon, MarsDatePicker } from "@mars/components/MarsUI"
import { Space } from "antd"
import { Fragment, useCallback, useState, useEffect, useRef } from "react"
import { cloneDeep } from "lodash"
import dayjs, { Dayjs } from "dayjs"
import moment from "moment"
import type { Moment } from "moment"
import * as mars3d from "mars3d"

const Cesium = mars3d.Cesium

interface MarsAttrProps {
  availability: any
  onChange?: (value?: any) => void
}

function PointPosition({ julianObj = { start: null, stop: null }, onChange }) {
  const values = useRef(julianObj)

  useEffect(() => {
    console.log("julianObj", julianObj)
    values.current = julianObj
  }, [julianObj])

  const itemChange = useCallback(
    (v, i) => {
      values.current[i] = v
      console.log("itemChange values.current", values.current)
      console.log("itemChange v", v)
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
              onChange={(date: Moment, dateString: string) => {
                itemChange(date, "start")
              }}
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ format: "YYYY-MM-DD HH:mm:ss" }}
            ></MarsDatePicker>
          </td>
        </tr>
        <tr>
          <td>结束时间</td>
          <td>
            <MarsDatePicker
              defaultValue={julianObj.stop ? moment(julianObj.stop, "YYYY-MM-DD HH:mm:ss") : null}
              onChange={(date: Moment, dateString: string) => {
                console.log("value", date)
                itemChange(date, "stop")
              }}
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ format: "YYYY-MM-DD HH:mm:ss" }}
            ></MarsDatePicker>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

let timeList = []

export default function MarsAvailability({ availability, onChange = () => {} }: MarsAttrProps) {
  const [avaiData, setAvaiData] = useState([])

  useEffect(() => {
    if (!availability) {
      return
    }
    if (!Array.isArray(availability)) {
      availability = availability._intervals
    }

    const data = availability?.map((julianObj) => {
      const timeObj = { start: null, stop: null }

      for (const key in julianObj) {
        const isJulianDate = typeof julianObj[key] !== "string"

        let value = null
        if (Object.keys(timeObj).includes(key)) {
          if (julianObj[key]) {
            value = isJulianDate ? moment(Cesium.JulianDate.toDate(julianObj[key])) : moment(julianObj[key])
          }
          timeObj[key] = value
        }
      }

      return timeObj
    })

    setAvaiData([...data])
    timeList = data

    console.log("timeList", data)
  }, [availability])

  const availabilityChange = (noData: boolean = false) => {
    let time =
      timeList?.map((dayjsDate) => {
        const timeObj = {}
        for (const key in dayjsDate) {
          timeObj[key] = dayjsDate[key] ? dayjs(dayjsDate[key]).format("YYYY-MM-DD HH:mm:ss") : null
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
    timeList.push({ start: null, stop: null })

    setAvaiData([...timeList])
    availabilityChange()
  }
  const addItem = (item: any, index: number) => {
    timeList.splice(index, 0, cloneDeep(item))

    setAvaiData([...timeList])
    availabilityChange()
  }

  const removeAvailability = () => {
    availabilityChange(true)
  }
  const removeItem = (item: any, index: number) => {
    timeList.splice(index, 1)

    setAvaiData([...timeList])
    availabilityChange()
  }

  return (
    <MarsCollapse activeKey={["1"]}>
      <MarsCollapsePanel key="1" showArrow={false} header="时序列表">
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
                <MarsIcon icon="add-one" width="16" onClick={() => addItem(item, i)}></MarsIcon>
                <MarsIcon icon="delete" width="16" onClick={() => removeItem(item, i)}></MarsIcon>
              </Space>
            </div>
            {/* {JSON.stringify(avaiData)} */}
            <PointPosition julianObj={item} onChange={(value) => availabilityChange()}></PointPosition>
          </Fragment>
        ))}
      </MarsCollapsePanel>
    </MarsCollapse>
  )
}
