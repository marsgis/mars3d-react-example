import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Row, Col } from "antd"
import * as mapWork from "./map.js"
import "./index.less"

// 创建地图
const typeArrPlot = ["rectangle", "polyline", "polygon", "cylinder", "point", "circle", "wall"]

function UIComponent() {
  const onStartDraw = (e: any) => {
    mapWork.startDraw(e)
  }

  const onClickDistance = () => {
    mapWork.distance()
  }

  const onClickArea = () => {
    mapWork.area()
  }

  const onClickHeight = () => {
    mapWork.height()
  }

  const onClickCoordinate = () => {
    mapWork.coordinate()
  }

  const onClickAngle = () => {
    mapWork.angle()
  }

  return (
    <MarsPannel visible={true} top={10} right={10} width={355}>
      <div className="f-mb">Tip: The default language is Chinese中文简体, you can switch to English, etc.</div>

      <div className="language_change">
        <Row>
          <Col span={8}>语言切换:</Col>
          <Col span={16}>
                <MarsButton onClick={() => mapWork.toCustomLang()}>
                  English
                </MarsButton>
                <MarsButton onClick={() => mapWork.toDefaultLange()}>
                  中文简体
                </MarsButton>
          </Col>
        </Row>
      </div>
      <div className="lang-button-contain">
        <Row>
          <Col span={8}>Plot:</Col>
          <Col span={16}>
            {typeArrPlot.map((item, index) => {
              return (
                <MarsButton key={index} onClick={() => onStartDraw(item)}>
                  {item}
                </MarsButton>
              )
            })}
          </Col>
        </Row>
      </div>

      <div className="f-pt lang-button-contain">
        <Row>
          <Col span={8}>Measurement:</Col>
          <Col span={16}>
            <MarsButton onClick={onClickCoordinate}>coordinate</MarsButton>
            <MarsButton onClick={onClickDistance}>distance</MarsButton>
            <MarsButton onClick={onClickHeight}>height</MarsButton>
            <MarsButton onClick={onClickArea}>area</MarsButton>
            <MarsButton onClick={onClickAngle}>angle</MarsButton>{" "}
          </Col>
        </Row>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
