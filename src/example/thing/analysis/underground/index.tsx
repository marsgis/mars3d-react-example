import { MarsPannel, MarsGui } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "switch",
      field: "state",
      label: "开启地下模式",
      value: true,
      change(value) {
        mapWork.chkUnderground(value)
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
      type: "radio",
      field: "type",
      label: "演示视角",
      value: "1",
      options: [
        {
          label: "俯视视角",
          value: "1"
        },
        {
          label: "地下视角1",
          value: "2"
        },
        {
          label: "地下视角2",
          value: "3"
        }
      ],
      change(val) {
        if (val === "1") {
          mapWork.centerAtDX1()
        }
        if (val === "2") {
          mapWork.centerAtDX2()
        }
        if (val === "3") {
          mapWork.centerAtDX3()
        }
      }
    }
  ]

  return (
    <MarsPannel visible={true} top={10} right={10} width={340}>
      <MarsGui
        options={options}
        formProps={{
          labelCol: { span: 7 },
          wrapperCol: { span: 17 }
        }}
      />
    </MarsPannel>
  )
}

export default UIComponent
