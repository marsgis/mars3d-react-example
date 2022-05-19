import { LayerState } from "@mars/components/MarsSample/LayerState.jsx"
import { MarsFormItem, MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { Row, Col, Space } from "antd"

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
  return (
    <MarsPannel visible={true} right="10" top="10" width="420">
      <LayerState></LayerState>

      <Row className="f-mb">
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
    </MarsPannel>
  )
}

export default UIComponent
