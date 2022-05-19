import { LayerState } from "@mars/components/MarsSample/LayerState.jsx"
import { MarsButton, MarsPannel, MarsGui } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { useRef } from "react"

function UIComponent() {
  const marsGuiRef = useRef<any>()

  const options: GuiItem[] = [
    {
      type: "custom",
      label: "",
      element: (
        <Space>
          <MarsButton
            onClick={() => {
              mapWork.addVideo(marsGuiRef.current.getValues())
            }}
          >
            绘制投射视频
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.addThisCamera(marsGuiRef.current.getValues())
            }}
          >
            按当前相机投射视频
          </MarsButton>

          <MarsButton
            onClick={() => {
              mapWork.clear()
            }}
          >
            清除
          </MarsButton>
        </Space>
      )
    },
    {
      type: "custom",
      label: "相机位置:",
      element: (
        <MarsButton
          onClick={() => {
            mapWork.selCamera()
          }}
        >
          鼠标图上点选(相机位置)
        </MarsButton>
      )
    },
    {
      type: "slider",
      field: "cameraAngle",
      label: "水平张角:",
      step: 0.1,
      min: 1,
      max: 60,
      value: 46.3,
      change(data) {
        mapWork.onChangeAngle(data)
      }
    },
    {
      type: "slider",
      field: "cameraAngle2",
      label: "垂直张角:",
      step: 0.1,
      min: 10,
      max: 30,
      value: 15.5,
      change(data) {
        mapWork.onChangeAngle2(data)
      }
    },
    {
      type: "slider",
      field: "distanceValue",
      label: "投射距离:",
      step: 0.1,
      min: 1,
      max: 1000,
      value: 78,
      change(data) {
        mapWork.onChangeDistance(data)
      }
    },
    {
      type: "slider",
      field: "heading",
      label: "四周方向:",
      step: 0.1,
      min: 0,
      max: 360,
      value: 178.5,
      extra: (
        <MarsButton
          onClick={() => {
            mapWork.onClickSelView()
          }}
        >
          图上选点
        </MarsButton>
      ),
      change(data) {
        mapWork.onChangeHeading(data)
      }
    },
    {
      type: "slider",
      field: "pitchValue",
      label: "俯仰角度:",
      step: 0.1,
      min: -180,
      max: 180,
      value: 8.2,
      change(data) {
        mapWork.onChangePitch(data)
      }
    },
    {
      type: "switch",
      field: "ckdFrustum",
      label: "视椎框线",
      value: true,
      change(data) {
        mapWork.showFrustum(data)
      }
    },
    {
      type: "slider",
      field: "opcity",
      label: "视频透明度:",
      step: 0.1,
      min: 0,
      max: 1,
      value: 1,
      change(data) {
        mapWork.onChangeOpacity(data)
      }
    },
    {
      type: "custom",
      label: "",
      element: (
        <Space>
          <MarsButton
            onClick={() => {
              mapWork.playOrpause()
            }}
          >
            播放暂停
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.locate()
            }}
          >
            返回相机视点
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.printParameters()
            }}
          >
            打印参数
          </MarsButton>
        </Space>
      )
    }
  ]

  return (
    <MarsPannel visible={true} right="10" top="10" width="420">
      <LayerState></LayerState>

      <MarsGui options={options} formProps={{ labelCol: { span: 5 } }} ref={marsGuiRef}></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
