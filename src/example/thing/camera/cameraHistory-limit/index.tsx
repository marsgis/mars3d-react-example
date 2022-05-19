import { useState, useMemo } from "react"
import * as mapWork from "./map.js"
import { MarsCheckbox, MarsPannel } from "@mars/components/MarsUI"

function UIComponent(props) {
  const [allLength, setAllLength] = useState(0)

  useMemo(() => {
    mapWork.eventTarget.on("changeCamera", (event: any) => {
      setAllLength(event.count)
    })
  }, [])

  return (
    <MarsPannel visible={true} right="10" top="10">
      <MarsCheckbox
        defaultChecked
        onChange={(data) => {
          mapWork.chkUnderground(data.target.checked)
        }}
      >
        显示限定范围
      </MarsCheckbox>
      <p>当前共有{allLength}条视角记录</p>
    </MarsPannel>
  )
}

export default UIComponent
