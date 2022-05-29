import { MarsButton, MarsForm, MarsFormItem, MarsPannel, MarsSlider } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { Space } from "antd"

function UIComponent() {
  return (
    <MarsPannel visible={true} right={10} top={10}>
      <MarsForm>
        <MarsFormItem label="演示视角：">
          <Space>
            <MarsButton onClick={() => mapWork.centerAtDX1()}>室内</MarsButton>
            <MarsButton onClick={() => mapWork.centerAtDX2()}>室外</MarsButton>
          </Space>
        </MarsFormItem>
        <MarsFormItem label="平移步长：">
          <MarsSlider onChange={(e) => mapWork.changeSlider(e)} min={0} max={300} step={0.01}></MarsSlider>
        </MarsFormItem>
        <MarsFormItem label="相机平移：">
          <Space>
            <span>W :向前</span>
            <span>S :向后</span>
            <span>D :向右</span>
            <span>A :向左</span>
            <span>Q :升高</span>
            <span>E :降低</span>
          </Space>
        </MarsFormItem>
        <MarsFormItem label="相机本身：">
          <Space>
            <span>↑ :抬头</span>
            <span>↓ :低头</span>
            <span>← :向左旋转</span>
            <span>→ :向右旋转</span>
          </Space>
        </MarsFormItem>
        <MarsFormItem label="屏幕中心点：">
          <Space>
            <span>I :飞近</span>
            <span>K :远离</span>
            <span>U :向上</span>
            <span>O :向下</span>
            <span>J :逆时针</span>
            <span>L :顺时针</span>
          </Space>
        </MarsFormItem>
      </MarsForm>
    </MarsPannel>
  )
}

export default UIComponent
