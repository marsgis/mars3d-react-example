import { MarsButton, MarsDatePicker, MarsPannel, MarsTable } from "@mars/components/MarsUI"
import { Space } from "antd"
import dayjs from "dayjs"
import { useMemo, useState } from "react"
import * as mapWork from "./map.js"
import moment from "moment"

const columns = [
  {
    title: "卫星名称",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "进入时间",
    dataIndex: "inTime",
    key: "inTime"
  },
  {
    title: "飞出时间",
    dataIndex: "outTime",
    key: "outTime"
  },
  {
    title: "飞行时长",
    dataIndex: "often",
    key: "often"
  },
  {
    title: "飞行距离",
    dataIndex: "distance",
    key: "distance"
  }
]
const tableData = []
function UIComponent() {
  const [startTime, setStartTime] = useState(dayjs().format("YYYY-MM-DD HH:mm:ss")) // 开始时间
  const [endTime, setEndTime] = useState(dayjs().add(60, "minute").format("YYYY-MM-DD HH:mm:ss")) // 结束时间
  const [pathData, setPathData] = useState([]) // 路径信息

  //   开始分析
  const startFX = () => {
    const startTimes = dayjs(startTime).valueOf()
    const endTimes = dayjs(endTime).valueOf()
    mapWork.startFX(startTimes, endTimes)
  }

  useMemo(() => {
    mapWork.eventTarget.on("dataList", (e: any) => {
      e.tableList.forEach((item, index) => {
        tableData.push({
          key: index,
          name: item.name,
          inTime: item.inTime,
          outTime: item.outTime,
          often: item.often,
          distance: item.distance
        })
      })

      setPathData(tableData)
    })
  }, [])

  const onChangeStartTime = (time: any) => {
    setStartTime(time)
  }

  const onChangeEndTime = (time: any) => {
    setEndTime(time)
  }

  return (
    <MarsPannel visible={true} top={10} right={10}>
      <div className="f-mb">
        <Space>
          <span>过境区域:</span>
          <MarsButton onClick={() => mapWork.drawRectangle()}>框选</MarsButton>
          <MarsButton onClick={() => mapWork.drawCircle()}>圆形</MarsButton>
          <MarsButton onClick={() => mapWork.drawPolygon()}>多边形</MarsButton>
          <MarsButton onClick={() => mapWork.drawClear()}>清除</MarsButton>
        </Space>
      </div>

      <div className="f-mb">
        <Space>
          <span>开始时间:</span>
          <MarsDatePicker
            defaultValue={moment(startTime, "YYYY-MM-DD HH:mm:ss")}
            format="YYYY-MM-DD HH:mm:ss"
            onChange={onChangeStartTime}
          ></MarsDatePicker>
        </Space>
      </div>

      <div className="f-mb">
        <Space>
          <span>结束时间:</span>
          <MarsDatePicker
            defaultValue={moment(endTime, "YYYY-MM-DD HH:mm:ss")}
            format="YYYY-MM-DD HH:mm:ss"
            onChange={onChangeEndTime}
          ></MarsDatePicker>
        </Space>
      </div>

      <div className="f-tac f-mb">
        <Space>
          <MarsButton onClick={startFX}>开始分析</MarsButton>
          <MarsButton>清除</MarsButton>
        </Space>
      </div>

      <MarsTable pagination={{ pageSize: 5 }} dataSource={pathData} columns={columns}></MarsTable>
    </MarsPannel>
  )
}
export default UIComponent
