import { MarsPannel, MarsGui } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"

import * as mapWork from "./map.js"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "slider",
      field: "speed",
      label: "速度",
      step: 1,
      min: 0,
      max: 100,
      value: 10,
      change(data) {
        mapWork.changeSlide(data)
      }
    }
  ]

  return (
    <MarsPannel visible={true} top={10} right={10} width={200}>
      <MarsGui options={options} formProps={{ labelCol: { span: 7 } }}></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
