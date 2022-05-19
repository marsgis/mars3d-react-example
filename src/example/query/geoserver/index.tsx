import { MarsPannel, MarsButton, MarsGui, MarsTable, $message } from "@mars/components/MarsUI"
import { useCallback, useMemo, useState } from "react"
import { Space } from "antd"
import * as mapWork from "./map.js"
import type { GuiItem } from "@mars/components/MarsUI"

const columns = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    align: "center"
  },
  {
    title: "类型",
    dataIndex: "type",
    key: "type",
    align: "center"
  },
  {
    title: "住址",
    dataIndex: "address",
    key: "address",
    align: "center"
  }
]

let keyWords: string = ""
let resultData = []

// 查询数据
const query = () => {
  mapWork.query(keyWords)
}

const customRow = (record: any) => {
  return {
    onClick: () => {
      if (record.graphic == null) {
        $message(record.name + " 无经纬度坐标信息！")
        return
      }
      mapWork.flyToGraphic(record.graphic)
    }
  }
}

function UIComponent() {
  const [tableData, setTableData] = useState([])

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  })

  // 清除数据
  const removeAll = useCallback(() => {
    resultData = []
    setTableData([])
    mapWork.clearAll()
  }, [])

  useMemo(() => {
    mapWork.eventTarget.on("befortUI", function (event: any) {
      resultData = []
      setTableData([])
      event.list.forEach((item: any, index: number) => {
        resultData.push({ key: index, name: item["项目名称"], type: item["设施类型"], address: item["具体位置"], graphic: item.graphic })
      })
      setTableData(resultData)
    })
  }, [])

  const handleTableChange = (page) => {
    setPagination(page.pageSize)
  }

  const options: GuiItem[] = [
    {
      type: "input",
      field: "keyWords",
      label: "名称",
      value: "",
      change(data) {
        keyWords = data
      }
    },
    {
      type: "custom",
      label: "范围",
      element: (
        <Space>
          <MarsButton onClick={() => mapWork.drawRectangle()}>框选范围</MarsButton>
          <MarsButton onClick={() => mapWork.drawCircle()}>圆形范围</MarsButton>
          <MarsButton onClick={() => mapWork.drawPolygon()}>多边形范围</MarsButton>
        </Space>
      )
    },
    {
      type: "custom",
      label: "操作",
      element: (
        <Space>
          <MarsButton onClick={query}>查询</MarsButton>
          <MarsButton onClick={removeAll}>清除</MarsButton>
        </Space>
      )
    }
  ]

  return (
    <MarsPannel visible={true} right={10} top={10} width={370}>
      <MarsGui options={options}></MarsGui>
      {tableData.length > 0 ? (
        <div>
          {/* @ts-ignore */}
          <MarsTable
            pagination={pagination}
            scroll={{ y: 400 }}
            size="small"
            dataSource={tableData}
            columns={columns}
            onRow={customRow}
            bordered
            onChange={handleTableChange}
          ></MarsTable>
        </div>
      ) : (
        ""
      )}
    </MarsPannel>
  )
}
export default UIComponent
