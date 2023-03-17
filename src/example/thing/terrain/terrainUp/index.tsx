import { MarsPannel, MarsButton, MarsCheckbox, MarsInputNumber, MarsTable, MarsIcon } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useCallback, useEffect, useMemo, useState } from "react"
import * as mapWork from "./map.js"

function UIComponent() {
  const [enabledWadi, setEnabledWadi] = useState(true) // 是否挖地

  const [height, setHeight] = useState(50) // 地形抬升深度
  const [upHeight, setUpHeight] = useState(2000) // 地形抬升高度

  const [rowKeys, setSelectRow] = useState([]) // 默认选中的项
  const [tableData, setTableData] = useState([]) // 表格数据

  const columns = [
    {
      title: "抬升区域",
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
    setTimeout(() => {
      mapWork.addTerrainUplift(height)
    }, 2000)
  }, [])

  // 是否挖地
  const chkClippingPlanes = (val: any) => {
    setEnabledWadi(val.target.checked)
    mapWork.chkClippingPlanes(val.target.checked)
  }

  // 改变开挖深度
  const changeClipHeight = useCallback((height: number) => {
    setHeight(height)
    mapWork.changeClipHeight(height)
  }, [])

  // 改变抬升的高度
  const changeUpHeight = useCallback((upHeight: number) => {
    setUpHeight(upHeight)
    mapWork.changeUpHeight(upHeight)
  }, [])

  // 删除按钮
  const deleted = (record: any) => {
    mapWork.deletedGraphic(record.key)
    const data = tableData.filter((item: any) => item.key !== record.key)
    setTableData(data)
    mapWork.changeTable(data)
  }

  // 清除
  const removeAll = () => {
    resetEnabled()
    mapWork.removeAll()
    // 清除表格
    setTableData([])
  }

  // 添加矩形
  const drawExtent = () => {
    resetEnabled()
    mapWork.btnDrawExtent(height)
  }

  // 添加多边形
  const drawPolygon = () => {
    resetEnabled()
    mapWork.btnDraw(height)
  }

  // 重置矢量数据的设置
  function resetEnabled() {
    // 是否挖地
    setEnabledWadi(true)
    mapWork.chkClippingPlanes(true)
  }

  return (
    <MarsPannel visible={true} top={10} right={10}>
      <div className="f-mb">
        <Space>
          <MarsCheckbox checked={enabledWadi} onChange={chkClippingPlanes}>
            是否挖地
          </MarsCheckbox>
        </Space>
      </div>

      <div className="f-mb" title="不能针对单个区域，整体抬升">
        <Space>
          <span>抬升高度</span>
          <MarsInputNumber min={-9999} max={9999} value={upHeight} onChange={changeUpHeight}></MarsInputNumber>（米）
        </Space>
      </div>

      <div className="f-mb">
        <Space>
          抬升区域
          <MarsButton onClick={drawExtent}>添加矩形</MarsButton>
          <MarsButton onClick={drawPolygon}>添加多边行</MarsButton>
          <MarsButton onClick={removeAll}>清除</MarsButton>
        </Space>
      </div>

      <div className="f-mb" title="可针对单个区域不同开挖深度，对修改后添加新区域生效">
        <Space>
          <span>开挖深度</span>
          <MarsInputNumber min={-9999} max={9999} value={height} onChange={changeClipHeight}></MarsInputNumber>（米）
        </Space>
      </div>
      {/* @ts-ignore */}
      <MarsTable dataSource={tableData} rowSelection={rowSelection} columns={columns} bordered pagination={{ pageSize: 5 }}></MarsTable>
    </MarsPannel>
  )
}

const flyto = (record: any) => {
  mapWork.flyToGraphic(record.key)
}

export default UIComponent
