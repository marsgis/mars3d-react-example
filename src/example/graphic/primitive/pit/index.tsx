import { MarsForm, MarsPannel, MarsFormItem, MarsInputNumber, MarsButton, MarsCheckbox } from "@mars/components/MarsUI"
import { LayerState } from "@mars/components/MarsSample/LayerState"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} right={10} top={10}>
        <LayerState />
        <MarsForm>
          <MarsFormItem label="井深度:">
          <Space>
            <MarsInputNumber defaultValue={300} {...{ min: -500, max: 999, step: 1 }} onChange={(data: number) => mapWork.onHeightChange(data)}></MarsInputNumber>米
            <MarsCheckbox onChange={(e) => mapWork.onDepthTestChange(e.target.checked)}>深度监测</MarsCheckbox>
          </Space>
        </MarsFormItem>
        </MarsForm>
        <MarsFormItem label="绘制:">
          <Space>
            <MarsButton onClick={() => mapWork.drawExtent()}>绘制矩形</MarsButton>
            <MarsButton onClick={() => mapWork.drawPolygon()}>绘制多边形</MarsButton>
            <MarsButton onClick={() => mapWork.graphicLayer.clear()}>清除</MarsButton>
          </Space>
        </MarsFormItem>
    </MarsPannel>
  )
}

export default UIComponent
