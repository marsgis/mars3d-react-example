import * as mapWork from "./map.js"
import { MarsPannel, MarsRadioGroup } from "@mars/components/MarsUI"

const options = [
  { label: "无", value: "1" },
  { label: "背景1", value: "2" },
  { label: "背景2", value: "3" },
  { label: "背景3", value: "4" }
]

const changeBackground = (e) => {
  switch (e) {
    case "1":
      mapWork.show()
      break
    case "2":
      mapWork.show1()
      break
    case "3":
      mapWork.show2()
      break
    case "4":
      mapWork.show3()
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
