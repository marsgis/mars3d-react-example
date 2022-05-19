import { MarsButton, MarsForm, MarsFormItem, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
const floorModel = ["一楼", "二楼", "三楼", "四楼", "五楼", "六楼", "七楼", "八楼", "九楼", "顶楼"]

function UIComponent() {
  return (
    <MarsPannel visible={true} right={10} top={10} width={300}>
      <MarsForm>
        <MarsFormItem label="整体控制:">
          <Space>
            <MarsButton onClick={() => mapWork.openFloorModel()}>展开</MarsButton>
            <MarsButton onClick={() => mapWork.mergeFloorModel()}>合并</MarsButton>
            <MarsButton onClick={() => mapWork.resetModel()}>还原</MarsButton>
          </Space>
        </MarsFormItem>

        <MarsFormItem label="显示指定:">
          <Space {...{ align: "end", direction: "horizontal", wrap: true }}>
            {floorModel.map((item, index) => (
              <MarsButton onClick={() => mapWork.showFloorModel(index + 1)} key={index}>
                {item}
              </MarsButton>
            ))}
          </Space>
        </MarsFormItem>
      </MarsForm>
    </MarsPannel>
  )
}

export default UIComponent
