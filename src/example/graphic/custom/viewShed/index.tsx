import { MarsPannel, MarsGui, MarsButton, MarsDialog } from "@mars/components/MarsUI"
import { GraphicLayerState } from "@mars/components/MarsSample/GraphicLayerState"
import { useMemo, useRef, useState } from "react"
import * as mapWork from "./map.js"

function UIComponent() {
  const guiRef = useRef<any>()

  const [selectedGraphic, setSelected] = useState(false)
  const [graphicName, setGraphicName] = useState()

  useMemo(() => {
    mapWork.eventTarget.on("addViewShedValue", (e) => {
      const data = e.value
      guiRef.current.updateField("cameraAngle", data.cameraAngle)
      guiRef.current.updateField("cameraAngle2", data.cameraAngle2)
      guiRef.current.updateField("distanceValue", data.distanceValue)
      guiRef.current.updateField("pitchValue", data.pitchValue)
      guiRef.current.updateField("opcity", data.opcity)
      guiRef.current.updateField("heading", data.heading)
    })
  }, [])

  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <GraphicLayerState
          defaultCount={10}
          interaction={false}
          customEditor={"viewShed"}
          onStartEditor={(data: any) => {
            const graphic = mapWork.getGraphic(data.graphicId)
            setGraphicName(data.graphicName)
            setSelected(true)

            guiRef.current.updateField("cameraAngle", graphic.angle)
            guiRef.current.updateField("cameraAngle2", graphic.angle2)
            guiRef.current.updateField("distanceValue", graphic.distance)
            guiRef.current.updateField("pitchValue", graphic.pitch)
            guiRef.current.updateField("opcity", graphic.opacity)
            guiRef.current.updateField("heading", graphic.heading)
            guiRef.current.updateField("showFrustum", graphic.showFrustum)
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
        width={300}
        top={10}
        left={10}
      >
        <MarsGui
          ref={guiRef}
          formProps={{
            labelCol: { span: 7 }
          }}
          options={[
            {
              type: "slider",
              field: "cameraAngle",
              label: "水平张角",
              min: 1,
              max: 60,
              step: 0.1,
              value: "",
              change(value) {
                mapWork.onChangeAngle(value)
              }
            },
            {
              type: "slider",
              field: "cameraAngle2",
              label: "垂直张角",
              min: 10,
              max: 30,
              step: 1,
              value: "",
              change(value) {
                mapWork.onChangeAngle2(value)
              }
            },
            {
              type: "slider",
              field: "distanceValue",
              label: "投射距离",
              min: 1,
              max: 1000,
              step: 0.1,
              value: "",
              change(value) {
                mapWork.onChangeDistance(value)
              }
            },
            {
              type: "slider",
              field: "heading",
              label: "四周方向",
              min: 0,
              max: 360,
              step: 0.1,
              value: "",
              extra: <MarsButton onClick={mapWork.onClickSelView}>图上选点</MarsButton>,
              change(value) {
                mapWork.onChangeHeading(value)
              }
            },
            {
              type: "slider",
              field: "pitchValue",
              label: "俯仰角度",
              min: -180,
              max: 180,
              step: 0.1,
              value: "",
              change(value) {
                mapWork.onChangePitch(value)
              }
            },
            {
              type: "switch",
              field: "showFrustum",
              label: "视椎框线",
              value: false,
              change(value) {
                mapWork.showFrustum(value)
              }
            },
            {
              type: "slider",
              field: "opcity",
              label: "视频透明度",
              min: 0,
              max: 1,
              step: 0.1,
              value: "",
              change(value) {
                mapWork.onChangeOpacity(value)
              }
            }
          ]}
        ></MarsGui>
        <div className="f-tac">
          <MarsButton onClick={() => mapWork.selCamera()}>点选相机位置</MarsButton>
        </div>
      </MarsDialog>
    </>
  )
}

export default UIComponent
