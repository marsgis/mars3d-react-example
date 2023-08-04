import { MarsPannel, MarsButton, MarsColor, MarsInputNumber, MarsFormItem, MarsForm } from "@mars/components/MarsUI"
import { Row, Col } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {

  return (
    <MarsPannel visible={true} top={10} right={10} width={350}>
      <>
        <MarsForm labelCol={{ span: 8 }}>
            <MarsFormItem label="绘制区域：">
                <MarsButton onClick={() => {
                  mapWork.drawArea()
                }}>绘制区域</MarsButton>
            </MarsFormItem>
            <MarsFormItem label="最大摇晃距离：">
                <Row align="middle" justify="end">
                    <Col span={19}>   
                      <MarsInputNumber defaultValue = {5} onChange={(maxDistance: number) => {
                            mapWork.tilesetShake.maxDistance = maxDistance
                          }} />
                      </Col>
                    <Col span={4} offset={1}>
                        米
                    </Col>
                </Row>
            </MarsFormItem>
            <MarsFormItem label="摇晃一次时间：">
                <Row align="middle" justify="end">
                    <Col span={19}>
                        <MarsInputNumber defaultValue = {1000}
                        onChange={(duration: number) => {
                          mapWork.tilesetShake.duration = duration
                        }} />
                    </Col>
                    <Col span={4} offset={1}>
                        毫秒
                    </Col>
                </Row>
            </MarsFormItem>
            <MarsFormItem label="最大高度：">
                <Row align="middle" justify="end">
                    <Col span={19}>
                        <MarsInputNumber defaultValue = {120} onChange={(maxHeight: number) => {
                          mapWork.tilesetShake.maxHeight = maxHeight
                        }} />
                    </Col>
                    <Col span={4} offset={1}>
                        米
                    </Col>
                </Row>
            </MarsFormItem>
            
            <MarsFormItem label="范围内颜色：">  
              <MarsColor
                  value = "red"
                  onChange={(inRangeColor) => {
                    mapWork.tilesetShake.inRangeColor = inRangeColor
                  }} 
                  >
              </MarsColor>
            </MarsFormItem>            
            <MarsFormItem label="范围外颜色：">  
              <MarsColor
                  onChange={(outRangeColor) => {
                    mapWork.tilesetShake.outRangeColor = outRangeColor
                  }} 
                  >
              </MarsColor>
            </MarsFormItem>
        </MarsForm>
        </>
    </MarsPannel>
  )
}

export default UIComponent
