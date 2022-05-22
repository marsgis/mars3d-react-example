import { MarsCollapse, MarsCollapsePanel, MarsButton, MarsPannel, MarsCheckbox } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} right="10" top="10" width={340}>
      <MarsCollapse defaultActiveKey={["1", "2"]}>
        <MarsCollapsePanel key="1" header="3D Tiles示例">
          <Space wrap>
            <MarsButton
              onClick={() => {
                mapWork.showQxShequDemo()
              }}
            >
              倾斜摄像(某县城)
            </MarsButton>
            <MarsButton
              onClick={() => {
                mapWork.showQxSimiaoDemo()
              }}
            >
              倾斜摄像（某景区）
            </MarsButton>

            <MarsButton
              onClick={() => {
                mapWork.showJzwHefeiDemo()
              }}
            >
              城市白膜（合肥）
            </MarsButton>

            <MarsButton
              onClick={() => {
                mapWork.showPntsGantaDemo()
              }}
            >
              高压线塔杆(点云)
            </MarsButton>
            <MarsButton
              onClick={() => {
                mapWork.showMaxShihuaDemo()
              }}
            >
              人工建模（石化工厂）
            </MarsButton>
            <MarsButton
              onClick={() => {
                mapWork.showBimQiaoliangDemo()
              }}
            >
              BIM（桥梁）
            </MarsButton>
            <MarsButton
              onClick={() => {
                mapWork.showBimDitiezhanDemo()
              }}
            >
              BIM（地铁站）
            </MarsButton>
          </Space>
        </MarsCollapsePanel>
        <MarsCollapsePanel key="2" header="相关控制">
          <MarsCheckbox
            onChange={(e) => {
              mapWork.bindTestTerrain(e.target.checked)
            }}
          >
            深度检测
          </MarsCheckbox>
          <MarsCheckbox
            onChange={(e) => {
              mapWork.bindWireframe(e.target.checked)
            }}
          >
            模型三角网
          </MarsCheckbox>
          <MarsCheckbox
            onChange={(e) => {
              mapWork.bindBoundbox(e.target.checked)
            }}
          >
            模型包围盒
          </MarsCheckbox>
          <MarsCheckbox
            onChange={(e) => {
              mapWork.bindGfirstperson(e.target.checked)
            }}
          >
            键盘漫游
          </MarsCheckbox>
          <span className="mars-pannel-item-label">调试页面:</span>
          <MarsButton href="editor-react.html?id=layer-tileset/manager/edit" target="_blank">
            模型参数调试
          </MarsButton>
        </MarsCollapsePanel>
      </MarsCollapse>
    </MarsPannel>
  )
}

export default UIComponent
