import { MarsPannel, MarsButton, MarsGui, MarsTable, MarsIcon, $notify } from "@mars/components/MarsUI"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Space } from "antd"
import * as mapWork from "./map.js"
import type { GuiItem } from "@mars/components/MarsUI"

interface TableItem {
  key: number
  name: string
  lineId: string
}

let datasource = []
let dataKeys = []
let chkShowLine = true
function UIComponent() {
  const [tableData, setTableData] = useState([])
  const [rowKeys, setSelectRow] = useState([]) // 默认选中的项

  const removeAll = useCallback(() => {
    mapWork.removeAll()
    // 清除表格
    datasource = []
    dataKeys = []
    setTableData([])
  }, [])

  const options: GuiItem[] = [
    {
      type: "custom",
      label: "开挖区域",
      element: (
        <Space>
          <MarsButton
            onClick={() => {
              setTableData([])
              mapWork.showDytDemo()
            }}
          >
            大雁塔
          </MarsButton>
          <MarsButton
            onClick={() => {
              setTableData([])
              mapWork.showTehDemo()
            }}
          >
            天鹅湖
          </MarsButton>
          <MarsButton onClick={removeAll}>清除</MarsButton>
        </Space>
      )
    },
    {
      type: "custom",
      label: "开挖区域",
      element: (
        <Space>
          <MarsButton
            onClick={() => {
              mapWork.btnDrawExtent(chkShowLine)
            }}
          >
            绘制矩形
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.btnDraw(chkShowLine)
            }}
          >
            绘制多边行
          </MarsButton>
          <MarsButton onClick={removeAll}>清除</MarsButton>
        </Space>
      )
    },
    {
      type: "number",
      field: "flatHeight",
      label: "压平区高度:",
      value: 0.0,
      step: 0.1,
      extra: "(米)",
      change(data) {
        mapWork.changeFlatHeight(data)
      }
    },
    {
      type: "switch",
      field: "enabledBianJieXian",
      label: "显示测试边界线:",
      value: true,
      change(data) {
        mapWork.chkShowLine(data)
        chkShowLine = data
      }
    }
  ]

  const rowSelection = {
    hideSelectAll: true,
    hideDefaultSelections: true,
    selectedRowKeys: rowKeys,
    onChange: (selectedRowKeys: string[]) => {
      // 使得点击之后选项改变
      setSelectRow(selectedRowKeys)
    },
    onSelect: (record: any, selected: boolean) => {
      mapWork.showHideArea(record.key, selected)
    }
  }

  // 表格数据
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
      width: 100,
      render: (comp: string, record: any) => {
        return (
          <>
            <Space>
              <MarsIcon style={{ cursor: "pointer" }} icon="move-one" color="#f2f2f2" onClick={() => mapWork.flyToGraphic(record.key)} />
              <MarsIcon style={{ cursor: "pointer" }} icon="delete" color="#f2f2f2" onClick={() => deleted(record)} />
            </Space>
          </>
        )
      }
    }
  ]

  useMemo(() => {
    mapWork.eventTarget.on("dataLoaded", function (event: any) {
      const data = event.list.map((item: any) => ({ key: item.id, name: "压平区" + item.id }))
      setTableData(data)

      setSelectRow(event.list.map((item: any) => item.id))
      datasource = data
      dataKeys = event.list.map((item: any) => item.id)
    })

    mapWork.eventTarget.on("addItem", function (event: any) {
      const item = event.data.item
      const id = event.data.id

      datasource.push({ key: item.id, name: "压平区" + item.id, lineId: id })
      setTableData([...datasource])

      dataKeys.push(item.id)
      setSelectRow([...dataKeys])
    })
  }, [])

  useEffect(() => {
    $notify(
      "已知问题提示",
      `（1）对3dtiles数据有要求，仅适用于无自带着色器的纹理格式模型。
    （2）目前不支持所有3dtile数据，请替换url进行自测`,
      { duration: null }
    )
  }, [])

  // 移除对应的表格数据
  const deleted = useCallback(
    (record: TableItem) => {
      mapWork.deletedGraphic(record.key, record.lineId)
      const restData = tableData.filter((item: any) => item.key !== record.key)
      datasource = restData
      setTableData(restData)
    },
    [tableData]
  )

  return (
    <MarsPannel visible={true} right={10} top={10} width={380}>
      <MarsGui options={options} formProps={{ labelCol: { span: 8 } }}></MarsGui>

      <div>
        <MarsTable
          rowSelection={rowSelection}
          pagination={{ pageSize: 5 }}
          scroll={{ y: 400 }}
          dataSource={tableData}
          columns={columns}
          bordered
        ></MarsTable>
      </div>
    </MarsPannel>
  )
}
export default UIComponent
