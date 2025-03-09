import { MarsPannel, MarsButton, MarsCollapse, MarsFormItem, MarsInput } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import "./index.less"
import { useState } from "react"

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
  let obj
  const [formObj, setFormObj] = useState({
    lng: 0,
    lat: 0,
    alt: 0,
    heading: 0,
    pitch: 0,
    roll: 0
  })

  setTimeout(() => {
    obj = mapWork.map.getCameraView({ simplify: false })
    setFormObj(obj)
    mapWork.map.on("cameraChanged", function (event) {
      obj = mapWork.map.getCameraView({ simplify: false })
      setFormObj(obj)
    })
  }, 500)

  return (
    <MarsPannel visible={true} top={10} right={10} width={310}>
      <MarsCollapse
        defaultActiveKey={["1", "2"]}
        items={[
          {
            key: "1",
            showArrow: false,
            label: "景点视角:",
            children: (
              <Space>
                <MarsButton onClick={() => mapWork.changeView1()}>故宫</MarsButton>
                <MarsButton onClick={() => mapWork.changeView2()}>珠峰</MarsButton>
                <MarsButton onClick={() => mapWork.changeView3()}>华山</MarsButton>
                <MarsButton onClick={() => mapWork.changeView4()}>大别山</MarsButton>
              </Space>
            )
          },
          {
            key: "2",
            showArrow: false,
            label: "相机和视角控制演示:",
            children: (
              <Space wrap>
                {cameraData.map((item, index) => {
                  return (
                    <MarsButton key={index} onClick={item.callback}>
                      {item.name}
                    </MarsButton>
                  )
                })}
                <MarsFormItem label="经度值">
                  <MarsInput value={formObj.lng}></MarsInput>
                </MarsFormItem>
                <MarsFormItem label="纬度值">
                  <MarsInput value={formObj.lat}></MarsInput>
                </MarsFormItem>
                <MarsFormItem label="高度值">
                  <MarsInput value={formObj.alt}></MarsInput>
                </MarsFormItem>
                <MarsFormItem label="方向角">
                  <MarsInput value={formObj.heading}></MarsInput>
                </MarsFormItem>
                <MarsFormItem label="俯仰角">
                  <MarsInput value={formObj.pitch}></MarsInput>
                </MarsFormItem>
                <MarsFormItem label="翻滚角">
                  <MarsInput value={formObj.roll}></MarsInput>
                </MarsFormItem>
              </Space>
            )
          }
        ]}
      ></MarsCollapse>
    </MarsPannel>
  )
}

export default UIComponent
