import * as mapWork from "./map.js"
import { MarsRadioGroup, MarsPannel } from "@mars/components/MarsUI"

const options = [
  { label: "背景1", value: "1" },
  { label: "背景2", value: "2" },
  { label: "背景3", value: "3" },
  { label: "背景4", value: "4" },
  { label: "背景5", value: "5" },
  { label: "背景6", value: "6" }
]

const changeBackground = (e) => {
  switch (e) {
    case "1":
      mapWork.show1()
      break
    case "2":
      mapWork.show2()
      break
    case "3":
      mapWork.show3()
      break
    case "4":
      mapWork.show4()
      break
    case "5":
      mapWork.show5()
      break
    case "6":
      mapWork.show6()
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
        defaultValue={"6"}
        onChange={(e) => {
          changeBackground(e.target.value)
        }}
      ></MarsRadioGroup>
    </MarsPannel>
  )
}

export default UIComponent
