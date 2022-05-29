import { MarsPannel, MarsButton, MarsTable, MarsGui, $message } from "@mars/components/MarsUI"
import { useCallback, useMemo, useState } from "react"
import { Space } from "antd"
import * as mapWork from "./map.js"
import type { GuiItem } from "@mars/components/MarsUI"
import "./index.less"

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

  // 清除数据
  const removeAll = useCallback(() => {
    resultData = []
    setTableData([])
    mapWork.clearAll()
  }, [])

  const [allLength, setAllLength] = useState(0)
  const [allPage, setAllPage] = useState(0)
  const [nowPage, setNowPage] = useState(0)

  useMemo(() => {
    mapWork.eventTarget.on("beforUI", function (event: any) {
      resultData = []
      setTableData([])
      event.list.forEach((item: any, index: number) => {
        resultData.push({ key: index, name: item["项目名称"], type: item["设施类型"], address: item["具体位置"], graphic: item.graphic })
      })
      setTableData(resultData)
    })

    mapWork.eventTarget.on("result", (e: any) => {
      setAllLength(e.result.allCount)
      setAllPage(e.result.allPage)
      setNowPage(e.result.pageIndex)
    })
  }, [])

  const options: GuiItem[] = [
    {
      type: "input",
      field: "keyWords",
      label: "名称",
      value: "请输入查询关键字",
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
    <MarsPannel visible={true} right={10} top={10} width={380}>
      <MarsGui options={options}></MarsGui>
      {tableData.length > 0 ? (
        <div className="table-view">
          {/* @ts-ignore */}
          <MarsTable pagination={false} dataSource={tableData} columns={columns} bordered onRow={customRow} size="small"></MarsTable>
          <div className="querybar-fr">
            <Space>
              <span>找到{allLength}条结果</span>第{nowPage}/{allPage}页<MarsButton onClick={() => mapWork.showFirstPage()}>首页</MarsButton>
              <MarsButton onClick={() => mapWork.showPretPage()}>&lt;</MarsButton>
              <MarsButton onClick={() => mapWork.showNextPage()}>&gt;</MarsButton>
            </Space>
          </div>
        </div>
      ) : (
        ""
      )}
    </MarsPannel>
  )
}
export default UIComponent
