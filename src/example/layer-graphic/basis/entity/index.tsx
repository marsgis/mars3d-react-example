import { LayerState } from "@mars/components/MarsSample/LayerState.jsx"
import { MarsButton, MarsPannel, MarsTable, MarsIcon } from "@mars/components/MarsUI"
import { Row, Col, Space } from "antd"
import { useEffect, useState } from "react"
import "./entity.css"
import * as mapWork from "./map.js"

const list = {
  point: [
    { name: "文字", href: "editor-react.html?id=graphic/entity/label" },
    { name: "点", href: "editor-react.html?id=graphic/entity/point" },
    { name: "图标点", href: "editor-react.html?id=graphic/entity/billboard" },
    { name: "平面", href: "editor-react.html?id=graphic/entity/plane" },
    { name: "盒子", href: "editor-react.html?id=graphic/entity/box" },
    { name: "圆", href: "editor-react.html?id=graphic/entity/circle" },
    { name: "圆锥", href: "editor-react.html?id=graphic/entity/cylinder" },
    { name: "球", href: "editor-react.html?id=graphic/entity/ellipsoid" },
    { name: "小模型", href: "editor-react.html?id=graphic/entity/model" }
  ],
  polyline: [
    { name: "线", href: "editor-react.html?id=graphic/entity/polyline" },
    { name: "管道", href: "editor-react.html?id=graphic/entity/polylineVolume" },
    { name: "走廊", href: "editor-react.html?id=graphic/entity/corridor" },
    { name: "墙", href: "editor-react.html?id=graphic/entity/wall" },
    { name: "矩形", href: "editor-react.html?id=graphic/entity/rectangle" },
    { name: "面", href: "editor-react.html?id=graphic/entity/polygon" }
  ]
}

function UIComponent() {
  const [graphics, setGraphics] = useState([]) // 表格数据

  const [row, setRow] = useState([]) // 勾选的row

  // 列表名称
  const graphicColumns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      align: "center"
    },
    {
      title: "操作",
      dataIndex: "caozuo",
      key: "caozuo",
      width: 60,
      align: "center",
      render: (comp: string, record: any) => {
        return (
          <>
            <Space>
              <MarsIcon icon="editor" color="#f2f2f2" onClick={(e) => startEditGraphic(e, record)} />
              <MarsIcon icon="delete" color="#f2f2f2" onClick={(e) => deleteGraphic(e, record)} />
            </Space>
          </>
        )
      }
    }
  ]

  useEffect(() => {
    const graphicLayer: any = getManagerLayer()
    const data = graphicLayer.graphics
    const result = data.map((item: any, index: number) => ({
      key: item.id,
      name: getGraphicName(item)
    }))

    let selectRow = result.map((item) => item.key)

    graphicLayer.on("addGraphic", function (event) {
      const item = event.graphic
      result.push({
        key: item.id,
        name: getGraphicName(item)
      })
      selectRow = result.map((item) => item.key)
    })

    graphicLayer.on("removeGraphic", function (event) {
      const graphicId = event.graphic.id
      const idx = result.findIndex((item) => item.key === graphicId)
      result.splice(idx, 1)
      setGraphics([...result])
    })

    setGraphics([...result])
    setRow(selectRow)
  }, [])

  let graphicIndex = 0
  function getGraphicName(graphic) {
    if (graphic?.style?.label?.text) {
      return `${graphic.type} - ${graphic.style.label.text}`
    }

    if (graphic.name) {
      return `${graphic.type} - ${graphic.name}`
    }
    if (graphic.attr.remark) {
      return `${graphic.type} - ${graphic.attr.remark}`
    }

    return `${graphic.type} - 未命名${++graphicIndex}`
  }

  // 表格行: 开始编辑graphic
  function startEditGraphic(e, record) {
    e.stopPropagation() // 阻止事件冒泡
    const graphicLayer = getManagerLayer()
    const graphic = graphicLayer.getGraphicById(record.key)
    graphicLayer.startEditing(graphic)
  }

  // 表格行: 删除graphic
  const deleteGraphic = (e, record) => {
    e.stopPropagation()

    const graphicLayer = getManagerLayer()
    const graphic = graphicLayer.getGraphicById(record.key)
    graphic && graphic.remove(true)
  }

  // 点击行触发
  const customRow = (record: any) => {
    return {
      onClick: (e) => {
        e.stopPropagation()
        const graphicLayer = getManagerLayer()
        const graphic = graphicLayer.getGraphicById(record.key)
        graphic.flyTo()
      }
    }
  }

  return (
    <MarsPannel visible={true} right="10" top="10" width="420">
      <LayerState direction="horizontal"></LayerState>
      <Row className="f-mb loft-two">
        <Col span={4}>点状:</Col>
        <Col span={19}>
          <Space {...{ align: "end", direction: "horizontal", wrap: true }}>
            {list.point.map((item) => {
              return (
                <MarsButton key={item.name} href={item.href} target="_blank">
                  {item.name}
                </MarsButton>
              )
            })}
          </Space>
        </Col>
      </Row>

      <Row>
        <Col span={4}>线面状:</Col>
        <Col span={19}>
          <Space {...{ align: "end", direction: "horizontal", wrap: true }}>
            {list.polyline.map((item) => {
              return (
                <MarsButton key={item.name} href={item.href} target="_blank">
                  {item.name}
                </MarsButton>
              )
            })}
          </Space>
        </Col>
      </Row>

      <div className="f-pt">
        {/* @ts-ignore */}
        <MarsTable columns={graphicColumns} size="small" pagination={{ pageSize: 5 }} dataSource={graphics} onRow={(recode) => customRow(recode)} />
      </div>
    </MarsPannel>
  )
}

// 获取map.js中定义的需要管理的图层
function getManagerLayer() {
  return mapWork.graphicLayer
}
export default UIComponent
