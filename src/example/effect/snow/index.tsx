import * as mapWork from "./map.js"
import { MarsGui, MarsPannel } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "checkbox",
      field: "selectffect",
      label: "呈现效果",
      value: ["snow", "cover"],
      options: [
        {
          label: "下雪效果",
          value: "snow"
        },
        {
          label: "积雪效果",
          value: "cover"
        }
      ],
      change(value) {
        if (value.length === 2) {
          mapWork.setSnow(true)
          mapWork.setCover(true)
        } else if (value.length) {
          value.forEach((item) => {
            if (item === "snow") {
              mapWork.setSnow(true)
              mapWork.setCover(false)
            } else {
              mapWork.setCover(true)
              mapWork.setSnow(false)
            }
          })
        } else {
          mapWork.setCover(false)
          mapWork.setSnow(false)
        }
      }
    },
    {
      type: "slider",
      field: "speed",
      label: "速度",
      value: 20,
      min: 1,
      max: 100,
      change(value) {
        mapWork.setSpeed(value)
      }
    },
    {
      type: "slider",
      field: "alpha",
      label: "积雪程度",
      value: 0.6,
      min: 0,
      max: 1,
      step: 0.1,
      change(value) {
        mapWork.setAlpha(value)
      }
    }
  ]
  return (
    <MarsPannel visible={true} width={280} right={10} top={10}>
      <MarsGui options={options} formProps={{ labelCol: { span: 6 } }}></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
