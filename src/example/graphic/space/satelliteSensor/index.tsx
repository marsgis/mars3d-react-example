import { MarsGui, MarsPannel, MarsDialog, MarsCheckbox, MarsButton } from "@mars/components/MarsUI"
import { GraphicLayerState } from "@mars/components/MarsSample/GraphicLayerState"
import type { GuiItem } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { useEffect, useState, useRef } from "react"
import "./index.less"

const sensorParams = {
  model_x: 117.169969, // 经度
  model_y: 31.840886, // 纬度
  model_z: 9980000, // 高度
  matrixLength: 30,
  // 角度
  angleValue1: 5, // 夹角1
  angleValue2: 10, // 夹角2
  headingValue: 0, // 轨迹方向
  pitchValue: 9, //  前后侧摆
  rollValue: 0 // 左右侧摆
}

function UIComponent() {
  const guiRef1 = useRef<any>()
  useEffect(() => {
    mapWork.addDemoGraphic1(sensorParams)
  }, [])

  const [selectedGraphic, setSelected] = useState(false)
  const [graphicName, setGraphicName] = useState("")

  const options: GuiItem[] = [
    {
      type: "number",
      field: "lng",
      label: "经度:",
      value: 117.169969,
      change(lng, data) {
        mapWork.updatePosition(lng, data.lat, data.alt)
      }
    },
    {
      type: "number",
      field: "lat",
      label: "纬度:",
      value: 31.840886,
      change(lat, data) {
        mapWork.updatePosition(data.lng, lat, data.alt)
      }
    },
    {
      type: "number",
      field: "alt",
      label: "高度:",
      value: 9980000,
      change(alt, data) {
        mapWork.updatePosition(data.lng, data.lat, alt)
      }
    },
    {
      type: "slider",
      field: "heading",
      label: "轨迹方向:",
      step: 1,
      min: 0,
      max: 360,
      value: 0,
      extra: "当前值{heading}",
      extraWidth: 90,
      change(heading) {
        mapWork.headingChange(heading)
      }
    },
    {
      type: "slider",
      field: "pitch",
      label: "前后侧摆:",
      step: 1,
      min: -180,
      max: 180,
      value: 9,
      extra: "当前值{pitch}",
      extraWidth: 90,
      change(pitch) {
        mapWork.pitchChange(pitch)
      }
    },

    {
      type: "slider",
      field: "roll",
      label: "左右侧摆:",
      step: 1,
      min: -180,
      max: 180,
      value: 0,
      extra: "当前值{roll}",
      extraWidth: 90,
      change(roll) {
        mapWork.rollChange(roll)
      }
    }
  ]

  const options1: GuiItem[] = [
    {
      type: "slider",
      field: "matrixLength",
      label: "轴长度:",
      step: 1,
      min: 1,
      max: 10000,
      value: 30,
      extra: "当前值{matrixLength}",
      extraWidth: 90,
      change(matrixLength) {
        mapWork.lengthChange(matrixLength)
      }
    },

    {
      type: "radio",
      field: "type",
      label: "类型:",
      value: "2",
      options: [
        {
          label: "圆锥体",
          value: "1"
        },
        {
          label: "四棱锥体",
          value: "2"
        }
      ],
      change(sensorType) {
        mapWork.chkSensorType(sensorType)
      }
    },

    {
      type: "slider",
      field: "angle1",
      label: "夹角1:",
      step: 0.001,
      min: 0,
      max: 89,
      value: 5,
      extra: "当前值{angle1}",
      extraWidth: 90,
      change(angle1) {
        mapWork.angle1(angle1)
      }
    },
    {
      type: "slider",
      field: "angle2",
      label: "夹角2:",
      step: 0.001,
      min: 0,
      max: 89,
      value: 10,
      extra: "当前值{angle2}",
      extraWidth: 90,
      show(data) {
        return data.type !== "1"
      },
      change(angle2) {
        mapWork.angle1(angle2)
      }
    },
    {
      type: "custom",
      label: "地面成像区:",
      element: (
        <Space wrap>
          <MarsButton onClick={() => mapWork.getRegion()}>获取区域边界值</MarsButton>
          <MarsButton onClick={() => mapWork.getCenter()}>获取中心点坐标</MarsButton>
          <MarsButton onClick={() => mapWork.clearAll()}>清除</MarsButton>
        </Space>
      )
    }
  ]

  return (
    <>
      <MarsPannel visible={true} right={10} top={10}>
        <GraphicLayerState
          defaultCount={10}
          interaction={false}
          customEditor={"satelliteSensor"}
          onStartEditor={(data: any) => {
            const graphic = mapWork.getGraphic(data.graphicId)

            setGraphicName(data.graphicName)
            setSelected(true)

            guiRef1.current.updateField("angle1", graphic?.angle)
            guiRef1.current.updateField("angle2", graphic?.angle2)
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
        width={420}
        left={10}
        top={10}
      >
        <div className="f-mb">
          <Space>
            <span className="mars-pannel-item-label">视椎体状态:</span>
            <MarsCheckbox defaultChecked={true} onChange={(e) => mapWork.sensorShowHide(e.target.checked)}>
              显示/隐藏
            </MarsCheckbox>
            <MarsButton onClick={() => mapWork.locate()}>定位至卫星</MarsButton>

            <MarsButton href="editor-react.html?id=graphic/space/satelliteSensor-multi" target="_blank">
              双锥体示例
            </MarsButton>
          </Space>
        </div>
        <MarsGui options={options} formProps={{ labelCol: { span: 5 } }}></MarsGui>

        <div className="f-mb">
          <span className="mars-pannel-item-label">参考系轴:</span>
          <Space>
            <MarsCheckbox defaultChecked={true} onChange={(e) => mapWork.chkShowModelMatrix(e.target.checked)}>
              显示/隐藏
            </MarsCheckbox>
            <MarsCheckbox defaultChecked={false} onChange={(e) => mapWork.chkUnderground(e.target.checked)}>
              求交地球
            </MarsCheckbox>
          </Space>
        </div>
        <MarsGui ref={guiRef1} options={options1} formProps={{ labelCol: { span: 5 } }}></MarsGui>
      </MarsDialog>
    </>
  )
}

export default UIComponent
