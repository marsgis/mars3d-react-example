import { MarsPannel, MarsGui, MarsButton } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { Space } from "antd"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "checkbox",
      field: "state",
      label: "状态",
      value: ["1"],
      options: [
        {
          label: "开启地下模式",
          value: "1"
        }
      ],
      change(value) {
        mapWork.chkUnderground(value[0] === "1")
      }
    },
    {
      type: "slider",
      field: "opcity",
      label: "地表透明度",
      step: 0.1,
      min: 0,
      max: 1,
      value: 0.5,
      change(opcity) {
        mapWork.opacityChange(opcity)
      }
    },
    {
      type: "custom",
      label: "演示视角",
      element: (
        <Space>
          <MarsButton
            onClick={() => {
              mapWork.centerAtDX1()
            }}
          >
            俯视视角
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.centerAtDX2()
            }}
          >
            地下视角1
          </MarsButton>

          <MarsButton
            onClick={() => {
              mapWork.centerAtDX3()
            }}
          >
            地下视角2
          </MarsButton>
        </Space>
      )
    }
  ]

  return (
    <MarsPannel visible={true} top={10} right={10} width={370}>
      <MarsGui
        options={options}
        formProps={{
          labelCol: { span: 6 }
        }}
      />
    </MarsPannel>
  )
}

export default UIComponent
