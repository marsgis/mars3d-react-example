import { MarsButton, MarsCheckbox, MarsGui, MarsPannel } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { useEffect } from "react"
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
  useEffect(() => {
    mapWork.addModelGraphic(sensorParams)
  }, [])

  const options: GuiItem[] = [
    {
      type: "number",
      field: "lng",
      label: "经  度:",
      value: 117.169969,
      change(lng, data) {
        mapWork.updatePosition(lng, data.lat, data.alt)
      }
    },
    {
      type: "number",
      field: "lat",
      label: "纬  度:",
      value: 31.840886,
      change(lat, data) {
        mapWork.updatePosition(data.lng, lat, data.alt)
      }
    },
    {
      type: "number",
      field: "alt",
      label: "高  度:",
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
      change(matrixLength) {
        mapWork.lengthChange(matrixLength)
      }
    },

    {
      type: "radio",
      field: "type",
      label: "类 型:",
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
      show(data) {
        return data.type !== "1"
      },
      change(angle2) {
        mapWork.angle1(angle2)
      }
    }
  ]

  return (
    <MarsPannel visible={true} right={10} top={10}>
      <div className="f-mb">
        <Space>
          <span className="mars-pannel-item-label">视椎体:</span>
          <MarsCheckbox defaultChecked={true} onChange={(e) => mapWork.sensorShowHide(e.target.checked)}>
            显示/隐藏
          </MarsCheckbox>
          <MarsButton onClick={() => mapWork.locate()}>定位至卫星</MarsButton>
        </Space>
      </div>
      <MarsGui options={options} formProps={{ labelCol: { span: 7 } }}></MarsGui>

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
      <MarsGui options={options1} formProps={{ labelCol: { span: 7 } }}></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
