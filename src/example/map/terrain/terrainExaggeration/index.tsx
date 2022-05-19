import { MarsPannel, MarsGui } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "slider",
      field: "terrain",
      label: "夸张程度",
      value: 10,
      min: 1,
      max: 50,
      change(data) {
        mapWork.changeTerrain(data)
      }
    }
  ]

  return (
    <MarsPannel visible={true} top={10} right={10} width={240}>
      <MarsGui
        options={options}
        formProps={{
          labelCol: { span: 8 },
          wrapperCol: { span: 16 }
        }}
      ></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
