import { useState } from "react"
import * as mapWork from "./map.js"
import { MarsRadioGroup, MarsFormItem, MarsRadio, MarsPannel } from "@mars/components/MarsUI"
import { LocationTo } from "@mars/components/MarsSample/LocationTo.jsx"

function UIComponent() {
  const [radioValue, setValue] = useState(1)

  return (
    <>
      <MarsPannel visible={true} right="10" top="10">
        <MarsFormItem>
          <MarsRadioGroup
            defaultValue={radioValue}
            onChange={(data) => {
              setValue(data.target.value)
              mapWork.shadingMaterials(data.target.value)
            }}
          >
            <MarsRadio value={1} checked>
              街景操作习惯
            </MarsRadio>
            <MarsRadio value={2}>Cesium操作习惯</MarsRadio>
          </MarsRadioGroup>
        </MarsFormItem>
        <MarsFormItem style={{ display: radioValue === 1 ? "" : "none" }}>
          操作说明：
          <div>
            1、右键拖拽，以相机视角为中心进行旋转。
            <br />
            2、中键拖拽，可以升高或降低相机高度。
            <br />
            3、Ctrl + 中键/右键, 与Cesium原始操作一致。
            <br />
            4、左键双击，飞行定位到该点。
            <br />
            5、右键双击，围绕该点旋转。
          </div>
        </MarsFormItem>
      </MarsPannel>
      <LocationTo />
    </>
  )
}

export default UIComponent
