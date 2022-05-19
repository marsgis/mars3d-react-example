import { MarsGui, MarsPannel, MarsCollapse, MarsCollapsePanel, MarsCheckbox, MarsButton, $notify } from "@mars/components/MarsUI"
import { DataManage } from "@mars/components/MarsSample/DataManage"
import type { GuiItem } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { useEffect } from "react"

const sensorParams = {
  radius: 100000,
  headingValue: 30,
  pitchValue: 0,
  rollValue: 0,
  xValue: 50,
  yValue: 50
}

// 绘制
const startDraw = () => {
  mapWork.startDraw(sensorParams)
}

// 图层显示
const updateLayerShow = (e) => {
  mapWork.graphicLayer.show = e.target.checked
}

// 是否显示扫描面
const chkShowScanPlane = (e) => {
  mapWork.ShowScanPlane(e.target.checked)
}

function UIComponent() {
  useEffect(() => {
    // 初始化加载模型
    $notify("已知问题提示", `（1）该矢量对象不支持拾取`, { duration: null })
    mapWork.addDemoGraphic1(sensorParams)
  }, [])

  const options: GuiItem[] = [
    {
      type: "number",
      field: "radius",
      label: "半径(米)",
      step: 1,
      min: 0,
      max: 999999999,
      value: 100000,
      change(radius) {
        mapWork.radiusChange(radius)
      }
    },
    {
      type: "slider",
      field: "heading",
      label: "方向",
      step: 0.01,
      min: 0,
      max: 360,
      value: 30,
      change(headingValue) {
        mapWork.headingChange(headingValue)
      }
    },
    {
      type: "slider",
      field: "pitch",
      label: "仰角",
      step: 0.01,
      min: 0,
      max: 360,
      value: 0,
      change(pitchValue) {
        mapWork.pitchChange(pitchValue)
      }
    },
    {
      type: "slider",
      field: "roll",
      label: "左右(roll)",
      step: 0.01,
      min: 0,
      max: 360,
      value: 0,
      change(rollValue) {
        mapWork.rollChange(rollValue)
      }
    },
    {
      type: "slider",
      field: "xHalfAngle",
      label: "上下夹角",
      step: 0.01,
      min: 0,
      max: 89,
      value: 50,
      change(xValue) {
        mapWork.xHalfAngle(xValue)
      }
    },
    {
      type: "slider",
      field: "yHalfAngle",
      label: "左右夹角",
      step: 0.01,
      min: 0,
      max: 89,
      value: 50,
      change(yValue) {
        mapWork.yHalfAngle(yValue)
      }
    }
  ]

  return (
    <MarsPannel visible={true} right={10} top={10} width={320}>
      <MarsCollapse defaultActiveKey={["1", "2"]}>
        <MarsCollapsePanel header="数据处理" key="1">
          <div className="f-mb">
            <Space>
              <span className="mars-pannel-item-label">图层状态:</span>
              <MarsCheckbox defaultChecked={true} onChange={updateLayerShow}>
                显示隐藏
              </MarsCheckbox>
            </Space>
          </div>

          <div className="f-mb">
            <Space>
              <span className="mars-pannel-item-label">数据维护:</span>
              <MarsButton onClick={startDraw}>图上标绘</MarsButton>
            </Space>
          </div>
          <DataManage />
        </MarsCollapsePanel>

        <MarsCollapsePanel key="2" header="参数调试">
          <MarsGui options={options} formProps={{ labelCol: { span: 7 } }}></MarsGui>
          <Space>
            <span className="mars-pannel-item-label">扫描面:</span>
            <MarsCheckbox defaultChecked={true} onChange={chkShowScanPlane}>
              显示隐藏
            </MarsCheckbox>
          </Space>
        </MarsCollapsePanel>
      </MarsCollapse>
    </MarsPannel>
  )
}

export default UIComponent
