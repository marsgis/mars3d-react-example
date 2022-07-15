import * as mapWork from "./map.js"
import { MarsRadioGroup, MarsPannel } from "@mars/components/MarsUI"

const options = [
  { label: "晴天", value: "1" },
  { label: "晚霞", value: "2" },
  { label: "蓝天", value: "3" },
  { label: "默认", value: "4" }
]

const changeBackground = (e) => {
  switch (e) {
    case "1":
      mapWork.sunny()
      break
    case "2":
      mapWork.sunsetGlow()
      break
    case "3":
      mapWork.blueSky()
      break
    case "4":
      mapWork.defaultSky()
      break
  }
}

function UIComponent(props) {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <MarsRadioGroup
        optionType="button"
        buttonStyle="solid"
        options={options}
        defaultValue={"1"}
        onChange={(e) => {
          changeBackground(e.target.value)
        }}
      />
    </MarsPannel>
  )
}

export default UIComponent
