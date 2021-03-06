import { MarsPannel, MarsGui, MarsButton, MarsIcon, MarsTable } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { useMemo, useState } from "react"
import { nextTick } from "process"

const flyto = (record: any) => {
  mapWork.flyToGraphic(record.key)
}

let seletData = []

function UIComponent() {
  // 清除
  const clearAll = () => {
    mapWork.clearAll()
    setTableData([])
  }

  const options: GuiItem[] = [
    {
      type: "custom",
      label: "限定区域",
      element: (
        <Space>
          <MarsButton onClick={() => mapWork.btnDrawExtent()}>添加矩形</MarsButton>
          <MarsButton onClick={() => mapWork.btnDraw()}>添加多边形</MarsButton>
          <MarsButton onClick={clearAll}>清除</MarsButton>
        </Space>
      )
    },
    {
      type: "switch",
      field: "useBloom",
      label: "等高线",
      value: true,
      change(data) {
        mapWork.showDengGX(data)
      }
    },
    {
      type: "color",
      field: "color",
      label: "颜色",
      value: "#FF0F00",
      change(color) {
        mapWork.changeColor(color)
      }
    },
    {
      type: "slider",
      field: "gapValue",
      label: "间隔(米)",
      step: 1,
      min: 10,
      max: 500,
      value: 80,
      change(data) {
        mapWork.changeSpacing(data)
      }
    },

    {
      type: "slider",
      field: "lineWidth",
      label: "线宽(px)",
      step: 0.1,
      min: 1.0,
      max: 10.0,
      value: 2.3,
      change(data) {
        mapWork.changeWidth(data)
      }
    },
    {
      type: "radio",
      field: "type",
      label: "地表渲染",
      value: "none",
      options: [
        {
          label: "无",
          value: "none"
        },
        {
          label: "高程",
          value: "elevation"
        },
        {
          label: "坡度",
          value: "slope"
        },
        {
          label: "坡向",
          value: "aspect"
        }
      ],
      change(data) {
        mapWork.changeShadingType(data)
      }
    },
    {
      type: "switch",
      field: "control",
      label: "状态控制",
      extra: "显示其它区域",
      extraWidth: 180,
      value: true,
      change(value) {
        mapWork.chkClippingPlanes(value)
      }
    }
  ]

  const columns = [
    {
      title: "开挖区域",
      dataIndex: "name",
      key: "name",
      align: "center"
    },
    {
      title: "操作",
      dataIndex: "caozuo",
      key: "caozuo",
      align: "center",
      width: 100,
      render: (comp: string, record: any) => {
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

  const [tableData, setTableData] = useState([]) // 表格数据
  const [rowKeys, setSelectRow] = useState([]) // 默认选中的项

  useMemo(() => {
    mapWork.eventTabel.on("tableObject", function (event: any) {
      setTableData([...event.tableItem.table])
      // const seletData = event.table.map((item: any) => item.key)

      seletData.push(event.tableItem.key)
      console.log(seletData)
      setSelectRow([...seletData])
    })
  }, [])

  // 表格操作
  const rowSelection = {
    hideSelectAll: true,
    hideDefaultSelections: true,
    selectedRowKeys: rowKeys,
    onChange: (selectedRowKeys: string[]) => {
      // 使得点击之后选项改变
      setSelectRow(selectedRowKeys)
      seletData = selectedRowKeys
    },
    onSelect: (record, selected) => {
      mapWork.showHideArea(record.key, selected)
    }
  }

  // 删除按钮
  const deleted = (record: any) => {
    mapWork.deletedGraphic(record.key)
    const data = tableData.filter((item: any) => item.key !== record.key)
    setTableData(data)
    mapWork.changeTable(data)
  }

  return (
    <MarsPannel visible={true} width={360} right={10} top={10}>
      <MarsGui options={options} formProps={{ labelCol: { span: 5 } }}></MarsGui>
      {/* @ts-ignore */}
      <MarsTable pagination={{ pageSize: 5 }} dataSource={tableData} rowSelection={rowSelection} columns={columns} bordered></MarsTable>
    </MarsPannel>
  )
}
export default UIComponent
