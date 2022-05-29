import { MarsPannel, MarsCheckbox, MarsButton, MarsInputNumber, MarsIcon, MarsTable } from "@mars/components/MarsUI"
import { useEffect, useMemo, useState } from "react"
import { Space } from "antd"
import * as mapWork from "./map.js"

let enabled = true // 是否挖地
let clipOutSide = false

function UIComponent() {
  const [rowKeys, setSelectRow] = useState([]) // 默认选中的项
  const [tableData, setTableData] = useState([]) // 表格数据

  // 事件监听
  useMemo(() => {
    mapWork.eventTabel.on("tableObject", function (event: any) {
      setTableData([])
      setTableData([...event.table])
      const seletData = event.table.map((item: any) => item.key)
      setSelectRow(seletData)
    })
  }, [])

  useEffect(() => {
    mapWork.addTerrainClip(50)
  }, [])

  // 表格操作
  const rowSelection = {
    hideSelectAll: true,
    hideDefaultSelections: true,
    selectedRowKeys: rowKeys,
    onChange: (selectedRowKeys: string[]) => {
      // 使得点击之后选项改变
      setSelectRow(selectedRowKeys)
    },
    onSelect: (record, selected) => {
      mapWork.showHideArea(record.key, selected)
    }
  }

  // 清除
  const removeAll = () => {
    mapWork.removeAll()
    // 清除表格
    setTableData([])
  }

  const columns = [
    {
      title: "开挖区域",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "操作",
      dataIndex: "caozuo",
      key: "caozuo",
      width: 80,
      render: (comp: string, record: any, index: number) => {
        return (
          <>
            <Space>
              <MarsIcon icon="move-one" color="#f2f2f2" onClick={() => flyto(record)} />
              <MarsIcon icon="delete" color="#f2f2f2" onClick={() => deleted(record)} />
            </Space>
          </>
        )
      }
    }
  ]

  // 删除按钮
  const deleted = (record: any) => {
    mapWork.deletedGraphic(record.key)
    const data = tableData.filter((item: any) => item.key !== record.key)
    setTableData(data)
    mapWork.changeTable(data)
  }

  return (
    <MarsPannel visible={true} right={10} top={10} width={360}>
      <div className="f-mb">
        <MarsCheckbox defaultChecked={true} onChange={chkClippingPlanes}>
          是否挖地
        </MarsCheckbox>
        <MarsCheckbox defaultChecked={false} onChange={chkUnionClippingRegions}>
          是否外切割
        </MarsCheckbox>
        <MarsCheckbox defaultChecked={true} onChange={chkTestTerrain}>
          深度检测
        </MarsCheckbox>
      </div>

      <div className="f-mb">
        <Space>
          <span>开挖区域:</span>
          <MarsButton onClick={drawExtent}>添加矩形</MarsButton>
          <MarsButton onClick={btnDraw}>添加多边形</MarsButton>
          <MarsButton onClick={removeAll}>清除</MarsButton>
        </Space>
      </div>

      <div className="f-mb">
        <Space>
          <span>开挖深度:</span>
          <MarsInputNumber min={-500} max={999} step={1} defaultValue={50} onChange={changeClipHeight}></MarsInputNumber>
        </Space>
      </div>

      <MarsTable dataSource={tableData} rowSelection={rowSelection} columns={columns} bordered pagination={{ pageSize: 5 }}></MarsTable>
    </MarsPannel>
  )
}

const flyto = (record: any) => {
  mapWork.flyToGraphic(record.key)
}

// 添加矩形
const drawExtent = () => {
  mapWork.btnDrawExtent(enabled)
}

// 添加多边形
const btnDraw = () => {
  mapWork.btnDraw(enabled)
}

// 是否挖地
const chkClippingPlanes = (e: any) => {
  enabled = e.target.checked
  mapWork.chkClippingPlanes(enabled)
}

// 是否外切割
const chkUnionClippingRegions = (e: any) => {
  clipOutSide = e.target.checked
  mapWork.chkUnionClippingRegions(clipOutSide)
}
// 深度检测
const chkTestTerrain = (e: any) => {
  mapWork.chkTestTerrain(e.target.checked)
}

const changeClipHeight = (value: number) => {
  mapWork.changeClipHeight(value)
}
export default UIComponent
