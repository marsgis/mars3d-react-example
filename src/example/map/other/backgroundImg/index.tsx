import * as mapWork from "./map.js"
import { MarsPannel, MarsRadioGroup } from "@mars/components/MarsUI"

const options = [
  { label: "无", value: "img0" },
  { label: "背景1", value: "img1" },
  { label: "背景2", value: "img2" },
  { label: "背景3", value: "img3" },
  { label: "颜色", value: "color" },
  { label: "天空盒", value: "skybox" }
]

const changeBackground = (e) => {
  switch (e) {
    case "img0":
      mapWork.showImgNone()
      break
    case "img1":
      mapWork.showImg1()
      break
    case "img2":
      mapWork.showImg2()
      break
    case "img3":
      mapWork.showImg3()
      break
    case "color":
      mapWork.showColor()
      break
    case "skybox":
      mapWork.showSkybox()
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
        defaultValue={"img1"}
        onChange={(e) => {
          changeBackground(e.target.value)
        }}
      />
    </MarsPannel>
  )
}

export default UIComponent
