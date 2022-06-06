import * as mapWork from "./map.js"
import { MarsPannel, MarsCheckbox, MarsForm, MarsFormItem, MarsSlider } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent() {
  return (
    <MarsPannel visible={true} width={380} right={10} top={10}>
      <MarsForm>
        <MarsFormItem>
          <Space>
            <MarsCheckbox defaultChecked={true} onChange={(e) => mapWork.setSnow(e.target.checked)}>
              下雪效果：
            </MarsCheckbox>
            下雪速度
            <MarsSlider onChange={(e) => mapWork.setSpeed(e)} min={1} max={100} defaultValue={20} style={{ width: "160px" }}></MarsSlider>
          </Space>
        </MarsFormItem>
        <MarsFormItem>
          <Space>
            <MarsCheckbox defaultChecked={true} onChange={(e) => mapWork.setCover(e.target.checked)}>
              积雪效果：
            </MarsCheckbox>
            积雪程度
            <MarsSlider onChange={(e) => mapWork.setAlpha(e)} min={0} max={1} defaultValue={0.6} step={0.1} style={{ width: "160px" }}></MarsSlider>
          </Space>
        </MarsFormItem>
      </MarsForm>
    </MarsPannel>
  )
}

export default UIComponent
