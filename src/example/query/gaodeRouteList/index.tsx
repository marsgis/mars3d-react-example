import { useState, useEffect, useRef } from "react"
import { setAutoHeight } from "@mars/utils/mars-util"
import * as mapWork from "./map.js"
import { MarsSelect, MarsInput, MarsFormItem, MarsPannel, MarsButton, MarsTable } from "@mars/components/MarsUI"
import { Space } from "antd"

const columns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    width: 35
  },
  {
    title: "名称",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "总距离",
    dataIndex: "length",
    key: "length"
  },
  {
    title: "时间",
    dataIndex: "time",
    key: "time"
  }
]

let tableData = []

// 下拉菜单
const selectWayOptions = [
  {
    // 1-步行路线
    value: "1",
    label: "步行路线查询"
  },
  {
    // 2-行车路线
    value: "3",
    label: "驾车路线查询"
  }
]

function UIComponent() {
  const [startNumber, setStartValue] = useState("")
  const [countNumber, setEndtValue] = useState(0)
  const [seltValue, setselctValue] = useState("1") // 出行方式
  const [dataSource, stateDataSource] = useState([]) // 表格数据

  useEffect(() => {
    mapWork.eventTarget.on("end", (event: any) => {
      setEndtValue(event.count)
    })
    mapWork.eventTarget.on("analyse", (event: any) => {
      tableData.push({
        key: event.i,
        index: event.i + 1,
        name: event.name,
        length: event.distance,
        time: event.time,
        graphic: event.id
      })
      stateDataSource(tableData)
    })
  }, [])

  // 自适应高度
  const tableScrollHeight = useRef(0)
  setAutoHeight((height) => {
    tableScrollHeight.current = height
  }, 350)

  return (
    <MarsPannel visible={true} right="10" width={"295px"} top="10">
      <MarsFormItem label="方式">
        <MarsSelect
          defaultValue={seltValue}
          options={selectWayOptions}
          onChange={(data) => {
            if (startNumber && countNumber !== 0) {
              tableData = []
              stateDataSource([])

              mapWork.btnAnalyse(data)
            }
            setselctValue(data)
          }}
        ></MarsSelect>
      </MarsFormItem>
      <MarsFormItem label="起点">
        <Space>
          <MarsInput value={startNumber} disabled></MarsInput>
          <MarsButton
            onClick={async () => {
              const startPoint: string = await mapWork.stratPoint()
              setStartValue(startPoint)
            }}
          >
            选点
          </MarsButton>
        </Space>
      </MarsFormItem>
      <MarsFormItem label="终点">
        <Space>
          <p className="inputWidth">
            共<span style={{ color: "red" }}>{countNumber}</span>条POI点
          </p>
          <MarsButton onClick={() => mapWork.endPoint()}>选点</MarsButton>
        </Space>
      </MarsFormItem>
      <div className="f-tac">
        <Space>
          <MarsButton
            onClick={() => {
              tableData = []
              stateDataSource([])

              mapWork.btnAnalyse(seltValue, countNumber)
            }}
          >
            开始分析
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.removeAll()

              tableData = []
              stateDataSource([])

              setStartValue("")
              setEndtValue(0)
            }}
          >
            清除
          </MarsButton>
        </Space>
      </div>

      <div style={{ display: dataSource.length ? "block" : "none" }}>
        <MarsTable
          columns={columns}
          dataSource={dataSource}
          {...{ scroll: { y: tableScrollHeight.current }, pagination: false, bordered: true, size: "small" }}
          onRow={(record) => {
            return {
              onClick: () => {
                mapWork.centerAtRoute(record.graphic)
              } // 点击行
            }
          }}
        />
      </div>
    </MarsPannel>
  )
}

export default UIComponent
