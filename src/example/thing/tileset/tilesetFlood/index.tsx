import { MarsButton, MarsForm, MarsFormItem, MarsGui, MarsPannel, MarsSlider } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { useCallback, useEffect, useRef, useState } from "react"

function UIComponent(props) {
  const marsGuiRef = useRef<any>()
  const [isShowUi, stateShowUi] = useState(true) // 显示调整参数面板
  const [isStart, stateStart] = useState(true) // 界面显示文字 - 播放
  const [heightSelect, stateHeightSele] = useState({
    min: 26,
    max: 200,
    speed: 10,
    value: 26
  }) // 高度选择滑动条的数据

  const changeHeightSelect = useCallback(
    (data = 0) => {
      stateHeightSele({
        max: marsGuiRef.current.getValues().maxHeight,
        min: marsGuiRef.current.getValues().minHeight,
        speed: marsGuiRef.current.getValues().speed,
        value: data
      })
    },
    [marsGuiRef]
  )

  useEffect(() => {
    mapWork.eventTarget.on("heightChange", (e: any) => {
      changeHeightSelect(Math.ceil(e.height))
    })
  }, [changeHeightSelect])

  const options: GuiItem[] = [
    {
      type: "radio",
      field: "way",
      label: "分析方式",
      value: "2",
      options: [
        {
          label: "整体淹没",
          value: "1"
        },
        {
          label: "局部淹没",
          value: "2"
        }
      ],
      change(data) {
        mapWork.changeFloodType(data)
      }
    },
    {
      type: "custom",
      label: "分析区域",
      element: (
        <Space>
          <MarsButton onClick={() => mapWork.btnDrawExtent()}> 绘制矩形</MarsButton>
          <MarsButton onClick={() => mapWork.btnDraw()}> 绘制多边形</MarsButton>
        </Space>
      ),
      show(data) {
        return data.way === "2"
      }
    },
    {
      type: "number",
      field: "minHeight",
      label: "最低海拔（米）",
      value: 26,
      step: 1,
      change(data) {
        changeHeightSelect()
      }
    },
    {
      type: "number",
      field: "maxHeight",
      label: "最高海拔（米）",
      value: 200,
      step: 1,
      change(data) {
        changeHeightSelect()
      }
    },
    {
      type: "number",
      field: "speed",
      label: "淹没速度（米/秒）",
      value: 10,
      step: 1,
      change(data) {
        changeHeightSelect()
      }
    }
  ]

  return (
    <MarsPannel visible={true} right="10" top="10" width={355}>
      <div style={{ display: isShowUi ? "block" : "none" }}>
        <MarsGui
          ref={marsGuiRef}
          options={options}
          formProps={{
            labelCol: { span: 10 }
          }}
        ></MarsGui>
        <div className="f-tac">
          <MarsButton
            onClick={() => {
              const show = mapWork.begin(marsGuiRef.current.getValues())
              stateShowUi(!show)
            }}
          >
            开始分析
          </MarsButton>
        </div>
      </div>

      <div style={{ display: !isShowUi ? "block" : "none" }}>
        <MarsForm>
          <MarsFormItem label="高度选择">
            <MarsSlider
              {...heightSelect}
              onChange={(data: number) => {
                changeHeightSelect(data)
              }}
            ></MarsSlider>
          </MarsFormItem>

          <MarsFormItem label="当前高度">{heightSelect.value}</MarsFormItem>

          <div className="f-tac">
            <Space>
              <MarsButton
                onClick={() => {
                  if (!isStart) {
                    mapWork.tilesetFlood.start()
                  } else {
                    mapWork.tilesetFlood.stop()
                  }

                  stateStart(!isStart)
                }}
              >
                {isStart ? "暂停" : "播放"}
              </MarsButton>
              <MarsButton
                onClick={() => {
                  mapWork.stop()
                  stateShowUi(true)
                  stateStart(true)
                }}
              >
                返回
              </MarsButton>
            </Space>
          </div>
        </MarsForm>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
