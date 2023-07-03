import { MarsButton, MarsDialog, MarsPannel, MarsGui } from "@mars/components/MarsUI"
import { GraphicLayerState } from "@mars/components/MarsSample/GraphicLayerState"
import type { GuiItem } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { useRef, useState } from "react"

function UIComponent() {
  const marsGuiRef = useRef<any>()

  const [selectedGraphic, setSelected] = useState(false)
  const [graphicName, setGraphicName] = useState("")

  const options: GuiItem[] = [
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
      type: "slider",
      field: "videoRotate",
      label: "视频角度:",
      step: 1,
      min: 0,
      max: 360,
      value: 1,
      change(data) {
        mapWork.rotateDeg(data)
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
    <>
      <MarsPannel visible={true} right="10" top="10" width="440">
        <GraphicLayerState
          defaultCount={10}
          interaction={true}
          drawLabel2={"按当前相机"}
          customEditor={"video2D"}
          onStartEditor={(data: any) => {
            const graphic = mapWork.getGraphic(data.graphicId)

            setGraphicName(data.graphicName)
            setSelected(true)

            marsGuiRef.current.updateField("cameraAngle", graphic?.angle)
            marsGuiRef.current.updateField("cameraAngle2", graphic?.angle2)
            marsGuiRef.current.updateField("distanceValue", graphic?.distance)
            marsGuiRef.current.updateField("heading", graphic?.heading)
            marsGuiRef.current.updateField("pitchValue", graphic?.pitch)
            marsGuiRef.current.updateField("ckdFrustum", graphic?.showFrustum)
            marsGuiRef.current.updateField("opcity", graphic?.opacity)
          }}
          onStopEditor={() => {
            setSelected(false)
          }}
        />
      </MarsPannel>

      <MarsDialog
        title={graphicName}
        visible={selectedGraphic}
        onClose={() => {
          setSelected(false)
        }}
        left="10"
        top="10"
        width="420"
      >
        <MarsGui options={options} ref={marsGuiRef}></MarsGui>
      </MarsDialog>
    </>
  )
}

export default UIComponent
