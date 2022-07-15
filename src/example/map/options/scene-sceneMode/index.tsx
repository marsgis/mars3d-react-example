import * as mapWork from "./map.js"
import { MarsRadioGroup, MarsPannel } from "@mars/components/MarsUI"

const options = [
  { label: "切换为二维视图", value: "1" },
  { label: "切换为三维视图", value: "2" },
  { label: "切换为2.5D维视图", value: "3" }
]

const changeBackground = (e) => {
  switch (e) {
    case "1":
      mapWork.to2d()
      break
    case "2":
      mapWork.to3d()
      break
    case "3":
      mapWork.toGLB()
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
        defaultValue={"2"}
        onChange={(e) => {
          changeBackground(e.target.value)
        }}
      />
    </MarsPannel>
  )
}

export default UIComponent
