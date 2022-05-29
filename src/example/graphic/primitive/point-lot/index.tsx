import { MarsPannel, MarsCheckbox } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { useState } from "react"

function UIComponent() {
  const [dangerSphere, setDangerValue] = useState(true)
  const [warningSphere, setWarningValue] = useState(false)

  const formRedSphereChange = (e: any) => {
    setDangerValue(e.target.checked)
    mapWork.createEllipsoid(e.target.checked, warningSphere)
  }

  const formYellowSphereChange = (e: any) => {
    setWarningValue(e.target.checked)
    mapWork.createEllipsoid(dangerSphere, e.target.checked)
  }

  return (
    <MarsPannel visible={true} top={10} right={10} height={75}>
      <div className="f-mb">
        <MarsCheckbox checked={dangerSphere} onChange={formRedSphereChange}>
          危险圈
        </MarsCheckbox>
      </div>

      <MarsCheckbox checked={warningSphere} onChange={formYellowSphereChange}>
        警告圈
      </MarsCheckbox>
    </MarsPannel>
  )
}

export default UIComponent
