import { MarsPannel, MarsButton, MarsCollapse, MarsCollapsePanel } from "@mars/components/MarsUI"
import { Row, Col, Space } from "antd"
import * as mapWork from "./map.js"
import "./index.less"

// 创建地图
const cameraData = [
  {
    name: "获取当前地图视角",
    title: "",
    callback: () => mapWork.mapGetCameraView()
  },
  {
    name: "定位至指定位置",
    title: "",
    callback: () => mapWork.mapSetCameraView()
  },
  {
    name: "飞行至默认视角",
    title: "默认视角一般为config.json中的center参数配置的视角",
    callback: () => mapWork.mapFlyHome()
  },
  {
    name: "定位至矩形区域处",
    title: "",
    callback: () => mapWork.mapFlyToExtent()
  },
  {
    name: "定位至坐标数组处",
    title: "",
    callback: () => mapWork.mapFlyToPositions()
  },
  {
    name: "定位至矢量数据",
    title: "",
    callback: () => mapWork.mapFlyToGraphic()
  },
  {
    name: "定位至目标点",
    title: "",
    callback: () => mapWork.mapFlyToPoint()
  },
  {
    name: "按序播放多个相机位置",
    title: "",
    callback: () => mapWork.mapSetCameraViewList()
  },
  {
    name: "停止视角定位",
    title: "",
    callback: () => mapWork.mapCancelFlyTo()
  }
]
function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10} width={310}>
      <MarsCollapse defaultActiveKey={["1", "2"]}>
        <MarsCollapsePanel key="1" showArrow={false} header="景点视角:">
          <Space>
            <MarsButton onClick={() => mapWork.changeView1()}>故宫</MarsButton>
            <MarsButton onClick={() => mapWork.changeView2()}>珠峰</MarsButton>
            <MarsButton onClick={() => mapWork.changeView3()}>华山</MarsButton>
            <MarsButton onClick={() => mapWork.changeView4()}>大别山</MarsButton>
          </Space>
        </MarsCollapsePanel>
        <MarsCollapsePanel key="2" showArrow={false} header="相机和视角控制演示:">
          <Space wrap>
            {cameraData.map((item, index) => {
              return (
                <MarsButton key={index} onClick={item.callback}>
                  {item.name}
                </MarsButton>
              )
            })}
          </Space>
        </MarsCollapsePanel>
      </MarsCollapse>
    </MarsPannel>
  )
}

export default UIComponent
