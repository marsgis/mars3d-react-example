import { MarsButton, MarsPannel, MarsIcon, MarsTable, $notify } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useMemo, useState, useEffect } from "react"
import * as mapWork from "./map.js"

let resultData = []
let select = []

function UIComponent() {
  // 表格数据
  const columns = [
    {
      title: "裁剪区",
      dataIndex: "name",
      key: "name",
      align: "center"
    },
    {
      title: "操作",
      dataIndex: "caozuo",
      key: "caozuo",
      width: 80,
      align: "center",
      render: (comp: string, record: any) => {
        return (
          <>
            <Space>
              <MarsIcon style={{ cursor: "pointer" }} icon="move-one" color="#f2f2f2" onClick={() => flyto(record)} />
              <MarsIcon style={{ cursor: "pointer" }} icon="delete" color="#f2f2f2" onClick={() => deleted(record)} />
            </Space>
          </>
        )
      }
    }
  ]
  const [rowKeys, setSelectRow] = useState([]) // 默认选中的项

  const rowSelection = {
    hideSelectAll: true,
    hideDefaultSelections: true,
    selectedRowKeys: rowKeys,
    onChange: (selectedRowKeys: string[]) => {
      // 使得点击之后选项改变
      setSelectRow(selectedRowKeys)
      select = selectedRowKeys
    },
    onSelect: (record: any, selected: boolean) => {
      mapWork.showHideArea(record.key, selected)
    }
  }

  const [dataSource, setDataSource] = useState([])

  useMemo(() => {
    mapWork.eventTarget.on("addItem", function (event: any) {
      const item = event.area
      resultData.push({ key: item.id, name: "裁剪区" + item.id })
      select.push(item.id)
      setDataSource([])
      setDataSource([...resultData])
      setSelectRow([])
      setSelectRow([...select])
    })
  }, [])

  // 表格的操作
  const flyto = (record: any) => {
    mapWork.flyToGraphic(record.key)
  }

  const deleted = (record: any) => {
    mapWork.deletedGraphic(record.key)

    const data = dataSource.filter((item: any) => item.key !== record.key)
    setDataSource(data)
  }

  const removeAll = () => {
    mapWork.removeAll()
    // 清除表格
    resultData = []
    select = []
    setDataSource([])
  }

  return (
    <MarsPannel visible={true} top={10} right={10} width={280}>
      <div className="f-mb">
        <Space>
          <MarsButton onClick={() => mapWork.btnDrawExtent()}>绘制矩形</MarsButton>
          <MarsButton onClick={() => mapWork.btnDraw()}>绘制剪裁区</MarsButton>
          <MarsButton onClick={removeAll}>清除</MarsButton>
        </Space>
      </div>

      {/* @ts-ignore */}
      <MarsTable pagination={{ pageSize: 5 }} bordered rowSelection={rowSelection} columns={columns} dataSource={dataSource}></MarsTable>
    </MarsPannel>
  )
}

export default UIComponent
